const https = require('https');
const http = require('http');

const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const UW_API_KEY = process.env.UW_API_KEY || '';
const FMP_API_KEY = process.env.FMP_API_KEY || '';

// ── FMP FETCHER ──
function fetchFMP(path, callback) {
  const sep = path.includes('?') ? '&' : '?';
  const fullPath = `/stable${path}${sep}apikey=${FMP_API_KEY}`;

  const options = {
    hostname: 'financialmodelingprep.com',
    path: fullPath,
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    timeout: 15000,
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try { callback(null, JSON.parse(data)); }
      catch(e) { callback(null, { error: 'Failed to parse FMP response', raw: data.slice(0, 200) }); }
    });
  });

  req.on('error', (err) => callback(err, null));
  req.on('timeout', () => { req.destroy(); callback(new Error('FMP request timed out'), null); });
  req.end();
}

// ── FMP MARKET CONDITIONS ──
// Single quote endpoint covers everything — priceAvg50 and priceAvg200 are built in
function fetchFMPMarketConditions(callback) {
  if (!FMP_API_KEY) {
    callback({ error: 'FMP_API_KEY not configured' });
    return;
  }

  const result = {};
  let pending = 4;
  const done = () => { if (--pending === 0) {
    console.log('FMP result:', JSON.stringify(result).slice(0, 500));
    callback(result);
  }};

  const parseQuote = (data, sym) => {
    const arr = Array.isArray(data) ? data : (data ? [data] : []);
    return arr.find(q => (q.symbol || q.ticker) === sym) || arr[0] || null;
  };

  // SPY — includes priceAvg50 and priceAvg200
  fetchFMP('/quote?symbol=SPY', (err, data) => {
    if (err) { result.spyError = err.message; }
    else {
      console.log('SPY raw:', JSON.stringify(data).slice(0,200));
      const q = parseQuote(data, 'SPY');
      if (q) {
        result.spy = { price: q.price, change5d: q.changesPercentage || q.changePercentage || 0, priceAvg50: q.priceAvg50, priceAvg200: q.priceAvg200 };
        const p = q.price, s50 = q.priceAvg50, s200 = q.priceAvg200;
        if (p && s50 && s200) {
          if (p > s50 && p > s200) result.spyRegime = 'Above both MAs';
          else if (p > s200 && p <= s50) result.spyRegime = 'Below 50MA';
          else result.spyRegime = 'Below both MAs';
        }
      } else { result.spyError = JSON.stringify(data).slice(0,200); }
    }
    done();
  });

  // QQQ
  fetchFMP('/quote?symbol=QQQ', (err, data) => {
    if (err) { result.qqqError = err.message; }
    else {
      console.log('QQQ raw:', JSON.stringify(data).slice(0,300));
      const q = parseQuote(data, 'QQQ');
      if (q) result.qqq = { price: q.price, change5d: q.changesPercentage || q.changePercentage || q.change || 0 };
    }
    done();
  });

  // IWM
  fetchFMP('/quote?symbol=IWM', (err, data) => {
    if (err) { result.iwmError = err.message; }
    else {
      console.log('IWM raw:', JSON.stringify(data).slice(0,300));
      const q = parseQuote(data, 'IWM');
      if (q) result.iwm = { price: q.price, change5d: q.changesPercentage || q.changePercentage || q.change || 0 };
    }
    done();
  });

  // VIX — uses caret symbol, same /stable/quote endpoint
  fetchFMP('/quote?symbol=^VIX', (err, data) => {
    if (err) { result.vixError = err.message; }
    else {
      console.log('VIX raw:', JSON.stringify(data).slice(0,200));
      const arr = Array.isArray(data) ? data : (data ? [data] : []);
      if (arr[0]) result.vix = arr[0].price || arr[0].last;
      else result.vixError = JSON.stringify(data).slice(0,200);
    }
    done();
  });
}

// ── UNUSUAL WHALES FETCHER ──
function fetchUW(path, callback) {
  if (!UW_API_KEY) { callback(null, { error: 'UW_API_KEY not configured', configured: false }); return; }
  const options = {
    hostname: 'api.unusualwhales.com', path,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${UW_API_KEY}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
    timeout: 15000,
  };
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => { try { callback(null, JSON.parse(data)); } catch(e) { callback(null, { error: 'Parse error', raw: data.slice(0, 200) }); } });
  });
  req.on('error', (err) => callback(err, null));
  req.on('timeout', () => { req.destroy(); callback(new Error('UW timed out'), null); });
  req.end();
}

function fetchUWForTicker(ticker, callback) {
  const results = { ticker: ticker.toUpperCase(), configured: !!UW_API_KEY, flow: null, darkPool: null, marketTide: null, greekFlow: null, errors: [] };
  if (!UW_API_KEY) { callback(results); return; }
  let pending = 4;
  const done = () => { if (--pending === 0) callback(results); };
  fetchUW(`/api/stock/${ticker}/flow`, (err, data) => { if (err) results.errors.push('flow: ' + err.message); else results.flow = data; done(); });
  fetchUW(`/api/stock/${ticker}/dark-pool`, (err, data) => { if (err) results.errors.push('darkPool: ' + err.message); else results.darkPool = data; done(); });
  fetchUW(`/api/market/market-tide`, (err, data) => { if (err) results.errors.push('marketTide: ' + err.message); else results.marketTide = data; done(); });
  fetchUW(`/api/stock/${ticker}/greek-flow`, (err, data) => { if (err) results.errors.push('greekFlow: ' + err.message); else results.greekFlow = data; done(); });
}

function fetchUWAlerts(callback) {
  const results = { configured: !!UW_API_KEY, alerts: null, marketTide: null, errors: [] };
  if (!UW_API_KEY) { callback(results); return; }
  let pending = 2;
  const done = () => { if (--pending === 0) callback(results); };
  fetchUW(`/api/option-trades/flow-alerts`, (err, data) => { if (err) results.errors.push('alerts: ' + err.message); else results.alerts = data; done(); });
  fetchUW(`/api/market/market-tide`, (err, data) => { if (err) results.errors.push('marketTide: ' + err.message); else results.marketTide = data; done(); });
}

// ── HTTP SERVER ──
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  // ── ROUTE: GET /fmp/market-conditions ──
  if (req.method === 'GET' && req.url === '/fmp/market-conditions') {
    fetchFMPMarketConditions((data) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    });
    return;
  }

  // ── ROUTE: GET /fmp/status ──
  if (req.method === 'GET' && req.url === '/fmp/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ configured: !!FMP_API_KEY, message: FMP_API_KEY ? 'FMP connected' : 'FMP_API_KEY not set' }));
    return;
  }

  // ── ROUTE: GET /uw/ticker/:ticker ──
  const uwTickerMatch = req.url.match(/^\/uw\/ticker\/([A-Za-z]{1,10})$/i);
  if (req.method === 'GET' && uwTickerMatch) {
    const ticker = uwTickerMatch[1].toUpperCase();
    fetchUWForTicker(ticker, (data) => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)); });
    return;
  }

  // ── ROUTE: GET /uw/alerts ──
  if (req.method === 'GET' && req.url === '/uw/alerts') {
    fetchUWAlerts((data) => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)); });
    return;
  }

  // ── ROUTE: GET /uw/status ──
  if (req.method === 'GET' && req.url === '/uw/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ configured: !!UW_API_KEY, message: UW_API_KEY ? 'Unusual Whales API connected' : 'UW_API_KEY not set' }));
    return;
  }

  // ── ROUTE: POST / — Anthropic proxy ──
  if (req.method !== 'POST') { res.writeHead(405); res.end('Method not allowed'); return; }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    let parsed;
    try { parsed = JSON.parse(body); }
    catch(e) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: { message: 'Invalid JSON' } })); return; }

    parsed.model = 'claude-sonnet-5';
    parsed.max_tokens = parsed.max_tokens || 8000;
    if (!parsed.tools) { parsed.tools = [{ type: 'web_search_20250305', name: 'web_search' }]; }

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

    apiReq.on('error', (err) => { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: { message: err.message } })); });
    apiReq.on('timeout', () => { apiReq.destroy(); res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: { message: 'Request timed out' } })); });

    apiReq.write(payload);
    apiReq.end();
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`FMP: ${FMP_API_KEY ? 'CONNECTED' : 'NOT CONFIGURED'}`);
  console.log(`Unusual Whales: ${UW_API_KEY ? 'CONNECTED' : 'NOT CONFIGURED'}`);
});
