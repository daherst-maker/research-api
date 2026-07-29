const https = require('https');
const http = require('http');

const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const UW_API_KEY = process.env.UW_API_KEY || '';
const FMP_API_KEY = process.env.FMP_API_KEY || '';

// ════════════════════════════════════════════════════════════════
// DATA PROVIDER ABSTRACTION LAYER
// ────────────────────────────────────────────────────────────────
// To switch providers: only edit the PROVIDER IMPLEMENTATION
// section below. The rest of the server never changes.
//
// Standard output shape (always returned regardless of provider):
//
// marketConditions() → {
//   spy: { price, change5d, priceAvg50, priceAvg200 },
//   qqq: { price, change5d },
//   iwm: { price, change5d },
//   vix: number,
//   spyRegime: 'Above both MAs' | 'Below 50MA' | 'Below both MAs',
//   sectorSnapshot: [{ sector, change }]  // optional
// }
//
// stockData(ticker) → {
//   quote: { price, change, changePercent, volume, avgVolume,
//            high52, low52, marketCap, priceAvg50, priceAvg200 },
//   priceChange: { 1D, 5D, 1M, 3M, 6M, 1Y },
//   incomeStatements: [...],   // last 8 quarters
//   keyMetrics: [...],         // last 4 quarters (ROE, margins)
//   weeklyCandles: [...]       // last 52 trading days
// }
// ════════════════════════════════════════════════════════════════


// ── ACTIVE PROVIDER ──
// Change this to 'polygon' or 'yahoo' when switching providers
const ACTIVE_PROVIDER = 'fmp';


// ════════════════════════════════════════════════════════════════
// PROVIDER IMPLEMENTATION: FMP
// ════════════════════════════════════════════════════════════════

function fetchFMP(path, callback) {
  if (!FMP_API_KEY) { callback(new Error('FMP_API_KEY not configured'), null); return; }
  const sep = path.includes('?') ? '&' : '?';
  const fullPath = `/stable${path}${sep}apikey=${FMP_API_KEY}`;
  const options = {
    hostname: 'financialmodelingprep.com',
    path: fullPath, method: 'GET',
    headers: { 'Accept': 'application/json' },
    timeout: 15000,
  };
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try { callback(null, JSON.parse(data)); }
      catch(e) { callback(null, { error: 'Parse error', raw: data.slice(0, 200) }); }
    });
  });
  req.on('error', err => callback(err, null));
  req.on('timeout', () => { req.destroy(); callback(new Error('FMP timed out'), null); });
  req.end();
}

function fmpMarketConditions(callback) {
  const result = {};
  let pending = 4;
  const done = () => { if (--pending === 0) {
    // Compute regime algorithmically — never trust provider's label
    if (result.spy) {
      const p = result.spy.price, s50 = result.spy.priceAvg50, s200 = result.spy.priceAvg200;
      if (p && s50 && s200) {
        if (p > s50 && p > s200) result.spyRegime = 'Above both MAs';
        else if (p > s200 && p <= s50) result.spyRegime = 'Below 50MA';
        else result.spyRegime = 'Below both MAs';
      }
    }
    console.log('Market conditions:', JSON.stringify(result).slice(0, 400));
    callback(result);
  }};

  // SPY quote — has priceAvg50, priceAvg200 built in
  fetchFMP('/quote?symbol=SPY', (err, data) => {
    if (err) { result.spyError = err.message; }
    else {
      const q = Array.isArray(data) ? data[0] : data;
      if (q && q.price) result.spy = { price: q.price, priceAvg50: q.priceAvg50, priceAvg200: q.priceAvg200 };
      else result.spyError = JSON.stringify(data).slice(0, 150);
    }
    done();
  });

  // 5-day price changes for SPY, QQQ, IWM
  fetchFMP('/stock-price-change?symbol=SPY,QQQ,IWM', (err, data) => {
    if (err) { result.changeError = err.message; }
    else {
      const arr = Array.isArray(data) ? data : [data];
      arr.forEach(q => {
        const c = q['5D'] || 0;
        if (q.symbol === 'SPY') { result.spy = Object.assign(result.spy || {}, { change5d: c }); }
        if (q.symbol === 'QQQ') result.qqq = { change5d: c };
        if (q.symbol === 'IWM') result.iwm = { change5d: c };
      });
    }
    done();
  });

  // VIX
  fetchFMP('/quote?symbol=^VIX', (err, data) => {
    if (err) { result.vixError = err.message; }
    else {
      const q = Array.isArray(data) ? data[0] : data;
      if (q && q.price) result.vix = q.price;
      else result.vixError = JSON.stringify(data).slice(0, 150);
    }
    done();
  });

  // Sector performance snapshot
  fetchFMP('/sector-performance-snapshot', (err, data) => {
    if (!err && Array.isArray(data)) result.sectorSnapshot = data;
    done();
  });
}

function fmpStockData(ticker, callback) {
  const result = { ticker };
  let pending = 5;
  const done = () => { if (--pending === 0) callback(result); };

  fetchFMP(`/quote?symbol=${ticker}`, (err, data) => {
    if (err) result.quoteError = err.message;
    else { const arr = Array.isArray(data) ? data : [data]; result.quote = arr[0] || null; }
    done();
  });

  fetchFMP(`/stock-price-change?symbol=${ticker}`, (err, data) => {
    if (err) result.changeError = err.message;
    else { const arr = Array.isArray(data) ? data : [data]; result.priceChange = arr[0] || null; }
    done();
  });

  fetchFMP(`/income-statement?symbol=${ticker}&period=quarter&limit=8`, (err, data) => {
    if (err) result.incomeError = err.message;
    else result.incomeStatements = Array.isArray(data) ? data.slice(0, 8) : null;
    done();
  });

  fetchFMP(`/key-metrics?symbol=${ticker}&period=quarter&limit=4`, (err, data) => {
    if (err) result.metricsError = err.message;
    else result.keyMetrics = Array.isArray(data) ? data.slice(0, 4) : null;
    done();
  });

  fetchFMP(`/historical-price-eod/full?symbol=${ticker}`, (err, data) => {
    if (err) result.historyError = err.message;
    else {
      const arr = Array.isArray(data) ? data : (data && data.historical ? data.historical : []);
      result.weeklyCandles = arr.slice(0, 52);
    }
    done();
  });
}


// ════════════════════════════════════════════════════════════════
// PROVIDER ROUTER
// Add new providers here — app code never changes
// ════════════════════════════════════════════════════════════════

function getMarketConditions(callback) {
  if (ACTIVE_PROVIDER === 'fmp') return fmpMarketConditions(callback);
  // if (ACTIVE_PROVIDER === 'polygon') return polygonMarketConditions(callback);
  callback({ error: `Unknown provider: ${ACTIVE_PROVIDER}` });
}

function getStockData(ticker, callback) {
  if (ACTIVE_PROVIDER === 'fmp') return fmpStockData(ticker, callback);
  // if (ACTIVE_PROVIDER === 'polygon') return polygonStockData(ticker, callback);
  callback({ error: `Unknown provider: ${ACTIVE_PROVIDER}` });
}


// ════════════════════════════════════════════════════════════════
// UNUSUAL WHALES (options flow — separate from market data)
// ════════════════════════════════════════════════════════════════

function fetchUW(path, callback) {
  if (!UW_API_KEY) { callback(null, { error: 'UW_API_KEY not configured', configured: false }); return; }
  const options = {
    hostname: 'api.unusualwhales.com', path,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${UW_API_KEY}`, 'Accept': 'application/json' },
    timeout: 15000,
  };
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => { try { callback(null, JSON.parse(data)); } catch(e) { callback(null, { error: 'Parse error' }); } });
  });
  req.on('error', err => callback(err, null));
  req.on('timeout', () => { req.destroy(); callback(new Error('UW timed out'), null); });
  req.end();
}


// ════════════════════════════════════════════════════════════════
// HTTP SERVER
// ════════════════════════════════════════════════════════════════

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  const json = (data) => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)); };

  // ── GET /fmp/status ──
  if (req.method === 'GET' && req.url === '/fmp/status') {
    json({ configured: !!FMP_API_KEY, provider: ACTIVE_PROVIDER, message: FMP_API_KEY ? 'FMP connected' : 'FMP_API_KEY not set' });
    return;
  }

  // ── GET /fmp/market-conditions ──
  if (req.method === 'GET' && req.url === '/fmp/market-conditions') {
    getMarketConditions(json);
    return;
  }

  // ── GET /fmp/stock/:ticker ──
  const stockMatch = req.url.match(/^\/fmp\/stock\/([A-Za-z]{1,10})$/i);
  if (req.method === 'GET' && stockMatch) {
    getStockData(stockMatch[1].toUpperCase(), json);
    return;
  }

  // ── GET /uw/status ──
  if (req.method === 'GET' && req.url === '/uw/status') {
    json({ configured: !!UW_API_KEY, message: UW_API_KEY ? 'Unusual Whales connected' : 'UW_API_KEY not set' });
    return;
  }

  // ── GET /uw/ticker/:ticker ──
  const uwMatch = req.url.match(/^\/uw\/ticker\/([A-Za-z]{1,10})$/i);
  if (req.method === 'GET' && uwMatch) {
    const ticker = uwMatch[1].toUpperCase();
    const results = { ticker, configured: !!UW_API_KEY, flow: null, darkPool: null, errors: [] };
    let pending = 2;
    const done = () => { if (--pending === 0) json(results); };
    fetchUW(`/api/stock/${ticker}/flow`, (err, data) => { if (err) results.errors.push(err.message); else results.flow = data; done(); });
    fetchUW(`/api/stock/${ticker}/dark-pool`, (err, data) => { if (err) results.errors.push(err.message); else results.darkPool = data; done(); });
    return;
  }

  // ── GET /uw/alerts ──
  if (req.method === 'GET' && req.url === '/uw/alerts') {
    fetchUW('/api/option-trades/flow-alerts', (err, data) => json(err ? { error: err.message } : data));
    return;
  }

  // ── POST / — Anthropic proxy ──
  if (req.method !== 'POST') { res.writeHead(405); res.end('Method not allowed'); return; }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    let parsed;
    try { parsed = JSON.parse(body); }
    catch(e) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: { message: 'Invalid JSON' } })); return; }

    parsed.model = 'claude-sonnet-5';
    parsed.max_tokens = parsed.max_tokens || 8000;
    if (!parsed.tools) parsed.tools = [{ type: 'web_search_20250305', name: 'web_search' }];

    const payload = JSON.stringify(parsed);
    const options = {
      hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST',
      headers: {
        'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload),
        'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05',
      },
      timeout: 300000,
    };

    const apiReq = https.request(options, (apiRes) => {
      let data = '';
      apiRes.on('data', chunk => data += chunk);
      apiRes.on('end', () => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(data); });
    });
    apiReq.on('error', err => { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: { message: err.message } })); });
    apiReq.on('timeout', () => { apiReq.destroy(); res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: { message: 'Request timed out' } })); });
    apiReq.write(payload);
    apiReq.end();
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Provider: ${ACTIVE_PROVIDER}`);
  console.log(`FMP: ${FMP_API_KEY ? 'CONNECTED' : 'NOT CONFIGURED'}`);
  console.log(`Unusual Whales: ${UW_API_KEY ? 'CONNECTED' : 'NOT CONFIGURED'}`);
});
