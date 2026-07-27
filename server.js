const https = require('https');
const http = require('http');

const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const UW_API_KEY = process.env.UW_API_KEY || ''; // Add this in Railway env vars when you subscribe

// ── UNUSUAL WHALES FETCHER ──
// All UW endpoints we use. Key stays server-side, never exposed to browser.
function fetchUW(path, callback) {
  if (!UW_API_KEY) {
    callback(null, { error: 'UW_API_KEY not configured', configured: false });
    return;
  }

  const options = {
    hostname: 'api.unusualwhales.com',
    path: path,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${UW_API_KEY}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        callback(null, JSON.parse(data));
      } catch(e) {
        callback(null, { error: 'Failed to parse UW response', raw: data.slice(0, 200) });
      }
    });
  });

  req.on('error', (err) => callback(err, null));
  req.on('timeout', () => {
    req.destroy();
    callback(new Error('UW request timed out'), null);
  });

  req.end();
}

// ── FETCH ALL UW DATA FOR A TICKER ──
// Parallel fetch of flow alerts, dark pool, and market tide
function fetchUWForTicker(ticker, callback) {
  const results = {
    ticker: ticker.toUpperCase(),
    configured: !!UW_API_KEY,
    flow: null,
    darkPool: null,
    marketTide: null,
    greekFlow: null,
    errors: []
  };

  if (!UW_API_KEY) {
    callback(results);
    return;
  }

  let pending = 4;
  const done = () => { if (--pending === 0) callback(results); };

  // 1. Options flow alerts for this ticker
  fetchUW(`/api/stock/${ticker}/flow`, (err, data) => {
    if (err) results.errors.push('flow: ' + err.message);
    else results.flow = data;
    done();
  });

  // 2. Dark pool prints — where institutional accumulation shows up
  fetchUW(`/api/stock/${ticker}/dark-pool`, (err, data) => {
    if (err) results.errors.push('darkPool: ' + err.message);
    else results.darkPool = data;
    done();
  });

  // 3. Market tide — overall options sentiment for the whole market
  fetchUW(`/api/market/market-tide`, (err, data) => {
    if (err) results.errors.push('marketTide: ' + err.message);
    else results.marketTide = data;
    done();
  });

  // 4. Greek flow — delta/gamma exposure showing expected move direction
  fetchUW(`/api/stock/${ticker}/greek-flow`, (err, data) => {
    if (err) results.errors.push('greekFlow: ' + err.message);
    else results.greekFlow = data;
    done();
  });
}

// ── FETCH GLOBAL FLOW ALERTS (no ticker) ──
// Used in Options Flow tab — latest unusual activity across all stocks
function fetchUWAlerts(callback) {
  const results = {
    configured: !!UW_API_KEY,
    alerts: null,
    marketTide: null,
    errors: []
  };

  if (!UW_API_KEY) {
    callback(results);
    return;
  }

  let pending = 2;
  const done = () => { if (--pending === 0) callback(results); };

  // Live flow alerts — the main unusual whales signal feed
  fetchUW(`/api/option-trades/flow-alerts`, (err, data) => {
    if (err) results.errors.push('alerts: ' + err.message);
    else results.alerts = data;
    done();
  });

  // Market tide alongside alerts for context
  fetchUW(`/api/market/market-tide`, (err, data) => {
    if (err) results.errors.push('marketTide: ' + err.message);
    else results.marketTide = data;
    done();
  });
}

// ── HTTP SERVER ──
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // ── ROUTE: GET /uw/ticker/:ticker ──
  // Fetch all UW data for a specific stock
  const uwTickerMatch = req.url.match(/^\/uw\/ticker\/([A-Za-z]{1,10})$/i);
  if (req.method === 'GET' && uwTickerMatch) {
    const ticker = uwTickerMatch[1].toUpperCase();
    fetchUWForTicker(ticker, (data) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    });
    return;
  }

  // ── ROUTE: GET /uw/alerts ──
  // Fetch latest global flow alerts
  if (req.method === 'GET' && req.url === '/uw/alerts') {
    fetchUWAlerts((data) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    });
    return;
  }

  // ── ROUTE: GET /uw/status ──
  // Check if UW is configured — used by app on load
  if (req.method === 'GET' && req.url === '/uw/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      configured: !!UW_API_KEY,
      message: UW_API_KEY
        ? 'Unusual Whales API connected and ready'
        : 'UW_API_KEY not set. Add it in Railway environment variables.'
    }));
    return;
  }

  // ── ROUTE: POST / ──
  // Anthropic API proxy (existing behaviour)
  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end('Method not allowed');
    return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch(e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: 'Invalid JSON in request' } }));
      return;
    }

    // Force best model
    parsed.model = 'claude-sonnet-5';
    parsed.max_tokens = parsed.max_tokens || 8000;

    // Web search enabled by default unless caller already set tools
    if (!parsed.tools) {
      parsed.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
    }

    const payload = JSON.stringify(parsed);

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05',
      },
      timeout: 300000,
    };

    const apiReq = https.request(options, (apiRes) => {
      let data = '';
      apiRes.on('data', chunk => data += chunk);
      apiRes.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      });
    });

    apiReq.on('error', (err) => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: err.message } }));
    });

    apiReq.on('timeout', () => {
      apiReq.destroy();
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: 'Request timed out' } }));
    });

    apiReq.write(payload);
    apiReq.end();
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Unusual Whales: ${UW_API_KEY ? 'CONNECTED' : 'NOT CONFIGURED (add UW_API_KEY to Railway env)'}`);
});
