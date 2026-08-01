const https = require('https');
const http = require('http');

const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
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
//   quote: { price, change, changePercentage, volume, avgVolume,
//            yearHigh, yearLow, marketCap, priceAvg50, priceAvg200,
//            earningsAnnouncement, eps, pe }
//   priceChange: { 1D, 5D, 1M, 3M, 6M, 1Y }
//   incomeStatements: [...],   // last 8 quarters, newest first
//   keyMetrics: [...],         // last 4 quarters (roe, margins)
//   sma150: number,            // 150-day SMA — needed for full Stage 2 confirmation
//   dailyCandles: [...],       // last 60 trading days, newest first
//   weeklyCandles: [...]       // aggregated weekly OHLCV, ~last 60 weeks, newest first
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
  let pending = 5;
  const done = () => { if (--pending === 0) {
    // ── ALGORITHMIC STAGE CALCULATION ──
    if (result.spy) {
      const p = result.spy.price;
      const s50 = result.spy.priceAvg50;
      const s200 = result.spy.priceAvg200;
      // Calculate 150MA approximation from 50MA and 200MA
      // True 150MA not in quote — use SMA endpoint result if available
      const s150 = result.spy150sma || null;

      result.spy.aboveMA200 = s200 ? p > s200 : null;
      result.spy.aboveMA150 = s150 ? p > s150 : null;
      result.spy.aboveMA50 = s50 ? p > s50 : null;
      result.spy.ma150AboveMA200 = (s150 && s200) ? s150 > s200 : null;
      result.spy.ma200Slope = result.spy200slope || null; // rising/flat/falling

      // SPY regime
      if (s50 && s200) {
        if (p > s50 && p > s200) result.spyRegime = 'Above both MAs';
        else if (p > s200 && p <= s50) result.spyRegime = 'Below 50MA';
        else result.spyRegime = 'Below both MAs';
      }
    }
    console.log('Market conditions:', JSON.stringify(result).slice(0, 500));
    callback(result);
  }};

  // SPY quote — price, priceAvg50, priceAvg200
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

  // 150-day SMA for SPY — needed for Stage 2 confirmation
  fetchFMP('/technical-indicators/sma?symbol=SPY&periodLength=150&timeframe=1day', (err, data) => {
    if (err) { result.sma150Error = err.message; }
    else {
      const arr = Array.isArray(data) ? data : [];
      if (arr[0] && arr[0].sma) { if (!result.spy) result.spy = {}; result.spy.priceAvg150 = arr[0].sma; result.spy150sma = arr[0].sma; }
    }
    done();
  });

  // 200-day SMA history — last 25 days to calculate slope
  fetchFMP('/technical-indicators/sma?symbol=SPY&periodLength=200&timeframe=1day', (err, data) => {
    if (err) { result.smaHistError = err.message; }
    else {
      const arr = Array.isArray(data) ? data : [];
      if (arr.length >= 2) {
        const latest = arr[0].sma;
        // Compare to 20 trading days ago
        const older = arr[Math.min(19, arr.length-1)].sma;
        const slopePct = ((latest - older) / older) * 100;
        result.spy200slope = slopePct > 0.1 ? 'Rising' : slopePct < -0.1 ? 'Falling' : 'Flat';
        result.spy200slopeValue = slopePct.toFixed(3);
        if (!result.spy) result.spy = {};
        result.spy.ma200Slope = result.spy200slope;
      }
    }
    done();
  });
}

function aggregateWeeklyCandles(daily) {
  // daily assumed newest-first (FMP default). Returns weekly OHLCV, newest-first.
  if (!Array.isArray(daily) || daily.length === 0) return [];
  const sorted = daily.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  const weeks = [];
  let current = null;
  let currentWeekKey = null;
  for (const d of sorted) {
    if (!d || !d.date) continue;
    const dt = new Date(d.date);
    const day = dt.getUTCDay(); // 0=Sun..6=Sat
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(dt);
    monday.setUTCDate(dt.getUTCDate() + diffToMonday);
    const weekKey = monday.toISOString().slice(0, 10);
    if (weekKey !== currentWeekKey) {
      if (current) weeks.push(current);
      current = { weekStart: weekKey, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume || 0 };
      currentWeekKey = weekKey;
    } else {
      current.high = Math.max(current.high, d.high);
      current.low = Math.min(current.low, d.low);
      current.open = d.open; // overwritten each older day seen — ends on oldest day's open (correct)
      current.volume += (d.volume || 0);
    }
  }
  if (current) weeks.push(current);
  return weeks;
}

function fmpStockData(ticker, callback) {
  const result = { ticker };
  let pending = 6;
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

  // 150-day SMA — not in the quote endpoint, needed for full Stage 2 confirmation
  fetchFMP(`/technical-indicators/sma?symbol=${ticker}&periodLength=150&timeframe=1day`, (err, data) => {
    if (err) result.sma150Error = err.message;
    else {
      const arr = Array.isArray(data) ? data : [];
      if (arr[0] && arr[0].sma) result.sma150 = arr[0].sma;
    }
    done();
  });

  // Enough daily history for 52-week high/low, 200MA confirmation, and ~a year of weekly VCP context
  fetchFMP(`/historical-price-eod/full?symbol=${ticker}`, (err, data) => {
    if (err) result.historyError = err.message;
    else {
      const arr = Array.isArray(data) ? data : (data && data.historical ? data.historical : []);
      const daily = arr.slice(0, 400);
      result.dailyCandles = daily.slice(0, 60); // recent daily detail for pivot dial-in
      result.weeklyCandles = aggregateWeeklyCandles(daily).slice(0, 60); // ~a year of weekly OHLCV
    }
    done();
  });
}

// Real earnings calendar — replaces web-search guessing with an authoritative date/ticker list.
// No LLM interpretation needed to know who reports when.
function fmpEarningsCalendar(from, to, callback) {
  fetchFMP(`/earnings-calendar?from=${from}&to=${to}`, (err, data) => {
    if (err) { callback({ error: err.message }); return; }
    callback({ earnings: Array.isArray(data) ? data : [] });
  });
}

// Batch quotes for multiple tickers in one call — used to refresh position prices
// with real numbers instead of relying on whatever was last manually saved.
function fmpBatchQuote(tickers, callback) {
  if (!tickers || !tickers.length) { callback({ quotes: [] }); return; }
  fetchFMP(`/quote?symbol=${tickers.join(',')}`, (err, data) => {
    if (err) { callback({ error: err.message }); return; }
    callback({ quotes: Array.isArray(data) ? data : (data ? [data] : []) });
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

  // ── GET /fmp/earnings-calendar?from=YYYY-MM-DD&to=YYYY-MM-DD ──
  if (req.method === 'GET' && req.url.startsWith('/fmp/earnings-calendar')) {
    const qs = new URLSearchParams(req.url.split('?')[1] || '');
    const from = qs.get('from');
    const to = qs.get('to');
    if (!from || !to) { json({ error: 'from and to query params required (YYYY-MM-DD)' }); return; }
    fmpEarningsCalendar(from, to, json);
    return;
  }

  // ── GET /fmp/quote?tickers=AAPL,MSFT,VOYG ──
  if (req.method === 'GET' && req.url.startsWith('/fmp/quote')) {
    const qs = new URLSearchParams(req.url.split('?')[1] || '');
    const tickers = (qs.get('tickers') || '').split(',').map(t => t.trim().toUpperCase()).filter(Boolean).slice(0, 20);
    fmpBatchQuote(tickers, json);
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
});
