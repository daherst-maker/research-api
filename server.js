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
//   spy: { price, priceAvg50, priceAvg150, priceAvg200, aboveMA50/150/200, ma150AboveMA200, ma200Slope },
//   qqq: { price, priceAvg50, priceAvg150, priceAvg200, aboveMA50/150/200, ma150AboveMA200, ma200Slope },
//   spyRegime, qqqRegime: 'Above both MAs' | 'Below 50MA' | 'Below both MAs',
//   spy200slope, qqq200slope: 'Rising' | 'Flat' | 'Falling'
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

// Retries a fetchFMP call with backoff — used by batch operations (sector screening, RS
// universe, breadth) that run many requests with limited concurrency. A single failed call
// under load is very often a transient rate-limit rejection, not genuinely missing data;
// retrying after a short, randomized delay recovers most of these instead of writing the
// ticker off as "data unavailable" when the data was actually fine.
function fetchFMPWithRetry(path, callback, retriesLeft) {
  if (retriesLeft === undefined) retriesLeft = 2;
  fetchFMP(path, (err, data) => {
    if (err && retriesLeft > 0) {
      const delay = 600 + Math.random() * 600 + (2 - retriesLeft) * 400; // back off more on later retries
      setTimeout(() => fetchFMPWithRetry(path, callback, retriesLeft - 1), delay);
    } else {
      callback(err, data);
    }
  });
}

function fmpMarketConditions(callback) {
  const result = {};
  let pending = 6;
  const done = () => { if (--pending === 0) {
    // ── ALGORITHMIC STAGE CALCULATION — SPY ──
    if (result.spy) {
      const p = result.spy.price;
      const s50 = result.spy.priceAvg50;
      const s200 = result.spy.priceAvg200;
      const s150 = result.spy150sma || null;

      result.spy.aboveMA200 = s200 ? p > s200 : null;
      result.spy.aboveMA150 = s150 ? p > s150 : null;
      result.spy.aboveMA50 = s50 ? p > s50 : null;
      result.spy.ma150AboveMA200 = (s150 && s200) ? s150 > s200 : null;
      result.spy.ma200Slope = result.spy200slope || null;

      if (s50 && s200) {
        if (p > s50 && p > s200) result.spyRegime = 'Above both MAs';
        else if (p > s200 && p <= s50) result.spyRegime = 'Below 50MA';
        else result.spyRegime = 'Below both MAs';
      }
    }

    // ── ALGORITHMIC STAGE CALCULATION — QQQ ──
    // Minervini treats Nasdaq with equal weight to SPY, and growth leaders often transition
    // to Stage 2 weeks before the broader index reflects it. Same full MA treatment as SPY,
    // not just a lagging 5-day % change.
    if (result.qqq) {
      const p = result.qqq.price;
      const s50 = result.qqq.priceAvg50;
      const s200 = result.qqq.priceAvg200;
      const s150 = result.qqq150sma || null;

      result.qqq.aboveMA200 = s200 ? p > s200 : null;
      result.qqq.aboveMA150 = s150 ? p > s150 : null;
      result.qqq.aboveMA50 = s50 ? p > s50 : null;
      result.qqq.ma150AboveMA200 = (s150 && s200) ? s150 > s200 : null;
      result.qqq.ma200Slope = result.qqq200slope || null;
      if (s150) result.qqq.priceAvg150 = s150;

      if (s50 && s200) {
        if (p > s50 && p > s200) result.qqqRegime = 'Above both MAs';
        else if (p > s200 && p <= s50) result.qqqRegime = 'Below 50MA';
        else result.qqqRegime = 'Below both MAs';
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

  // QQQ quote — price, priceAvg50, priceAvg200 (same treatment as SPY, not just 5-day change)
  fetchFMP('/quote?symbol=QQQ', (err, data) => {
    if (err) { result.qqqError = err.message; }
    else {
      const q = Array.isArray(data) ? data[0] : data;
      if (q && q.price) result.qqq = { price: q.price, priceAvg50: q.priceAvg50, priceAvg200: q.priceAvg200 };
      else result.qqqError = JSON.stringify(data).slice(0, 150);
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

  // 150-day SMA for QQQ — same treatment as SPY
  fetchFMP('/technical-indicators/sma?symbol=QQQ&periodLength=150&timeframe=1day', (err, data) => {
    if (err) { result.qqqSma150Error = err.message; }
    else {
      const arr = Array.isArray(data) ? data : [];
      if (arr[0] && arr[0].sma) { result.qqq150sma = arr[0].sma; }
    }
    done();
  });

  // 200-day SMA history for SPY — last 25 days to calculate slope
  fetchFMP('/technical-indicators/sma?symbol=SPY&periodLength=200&timeframe=1day', (err, data) => {
    if (err) { result.smaHistError = err.message; }
    else {
      const arr = Array.isArray(data) ? data : [];
      if (arr.length >= 2) {
        const latest = arr[0].sma;
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

  // 200-day SMA history for QQQ — same slope treatment as SPY
  fetchFMP('/technical-indicators/sma?symbol=QQQ&periodLength=200&timeframe=1day', (err, data) => {
    if (err) { result.qqqSmaHistError = err.message; }
    else {
      const arr = Array.isArray(data) ? data : [];
      if (arr.length >= 2) {
        const latest = arr[0].sma;
        const older = arr[Math.min(19, arr.length-1)].sma;
        const slopePct = ((latest - older) / older) * 100;
        result.qqq200slope = slopePct > 0.1 ? 'Rising' : slopePct < -0.1 ? 'Falling' : 'Flat';
        result.qqq200slopeValue = slopePct.toFixed(3);
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
  let pending = 8;
  const done = () => { if (--pending === 0) callback(result); };

  fetchFMP(`/quote?symbol=${ticker}`, (err, data) => {
    if (err) result.quoteError = err.message;
    else { const arr = Array.isArray(data) ? data : [data]; result.quote = arr[0] || null; }
    done();
  });

  // Official sector/industry classification — needed to check sector leadership deterministically
  // rather than asking the model to guess which sector a ticker belongs to.
  fetchFMP(`/profile?symbol=${ticker}`, (err, data) => {
    if (err) result.profileError = err.message;
    else {
      const arr = Array.isArray(data) ? data : [data];
      const p = arr[0] || null;
      if (p) { result.sector = p.sector || null; result.industry = p.industry || null; }
    }
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

  // The stock's OWN 200-day MA slope — Minervini Trend Template criterion #3 requires the
  // stock's own 200MA to be trending up for at least a month (he prefers 4-5 months), not
  // just the market's. Also tracks HOW LONG it's been rising, not just the current direction.
  fetchFMP(`/technical-indicators/sma?symbol=${ticker}&periodLength=200&timeframe=1day`, (err, data) => {
    if (err) result.sma200SlopeError = err.message;
    else {
      const arr = Array.isArray(data) ? data : [];
      if (arr.length >= 2) {
        const latest = arr[0].sma;
        const older = arr[Math.min(19, arr.length - 1)].sma;
        if (latest && older) {
          const slopePct = ((latest - older) / older) * 100;
          result.sma200Slope = slopePct > 0.1 ? 'Rising' : slopePct < -0.1 ? 'Falling' : 'Flat';
          result.sma200SlopeValue = slopePct.toFixed(3);
        }
        // Walk backward in ~21-trading-day (1 month) increments, counting consecutive
        // months where the 200MA was higher than it was one month before that point.
        // Stops at the first non-rising month, capped at 6 (Minervini only cares up to ~4-5).
        let monthsRising = 0;
        for (let m = 1; m <= 6; m++) {
          const idxRecent = (m - 1) * 21;
          const idxPast = m * 21;
          if (idxPast >= arr.length) break;
          const recentVal = arr[idxRecent] && arr[idxRecent].sma;
          const pastVal = arr[idxPast] && arr[idxPast].sma;
          if (recentVal && pastVal && recentVal > pastVal) monthsRising++;
          else break;
        }
        result.sma200TrendMonths = monthsRising;
      }
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
      // IBD-style RS raw score, computed from the same daily history already fetched above —
      // no extra API call needed for the target ticker.
      result.rsRawScore = computeIBDStyleScore(daily.map(d => d.close));
    }
    done();
  });
}

// ── IBD-STYLE RELATIVE STRENGTH ──
// Documented formula (matches IBD's own described methodology, verified against multiple
// independent sources): raw score = 2*(C0/C63) + 1*(C0/C126) + 1*(C0/C189) + 1*(C0/C252),
// where C_N is the close N trading days ago. This is the real IBD formula, not an
// approximation. Used to score both an individual stock and SPY itself; RS is then expressed
// as a direct ratio (Stock_Score / SPY_Score) rather than a percentile rank against a
// separate stock universe — see fmpBenchmarkScore below.
function computeIBDStyleScore(dailyClosesNewestFirst) {
  if (!Array.isArray(dailyClosesNewestFirst) || dailyClosesNewestFirst.length < 253) return null;
  const c0 = dailyClosesNewestFirst[0];
  const c63 = dailyClosesNewestFirst[63];
  const c126 = dailyClosesNewestFirst[126];
  const c189 = dailyClosesNewestFirst[189];
  const c252 = dailyClosesNewestFirst[252];
  if (!c0 || !c63 || !c126 || !c189 || !c252) return null;
  if (c63 <= 0 || c126 <= 0 || c189 <= 0 || c252 <= 0) return null;
  return 2 * (c0 / c63) + (c0 / c126) + (c0 / c189) + (c0 / c252);
}

// ── BENCHMARK PERFORMANCE RATIO — replaces the old 390-stock percentile universe ──
// Ranking a stock against a small (~390), necessarily biased universe distorts the result —
// a stock's percentile depends on which other names happened to be in the comparison set.
// This instead computes SPY's own weighted momentum score with the exact same IBD-style
// formula, and expresses RS as a direct ratio: Stock_Score / SPY_Score. Ratio > 1.0 means
// beating the index; the Trend Template requires 1.15+ (beating the market by 15%+) to pass.
// One extra fetch total (SPY's own history), not ~390 — dramatically cheaper and removes the
// small-sample distortion entirely, at the honest cost of measuring "beats SPY by how much"
// rather than IBD's literal "percentile rank against every stock in the market" — a related
// but not identical question. See conversation notes for that tradeoff.
function fmpBenchmarkScore(callback) {
  fetchFMPWithRetry('/historical-price-eod/full?symbol=SPY', (err, data) => {
    if (err) { callback({ error: err.message }); return; }
    const arr = Array.isArray(data) ? data : (data && data.historical ? data.historical : []);
    const closes = arr.slice(0, 300).map(d => d.close);
    const score = computeIBDStyleScore(closes);
    if (score === null) { callback({ error: 'Could not compute SPY benchmark score from returned data' }); return; }
    callback({ score, computedAt: new Date().toISOString() });
  });
}

// ── SECTOR → STOCK SCREENER + BROAD TREND TEMPLATE CHECK ──
// Bridges the manual sector-ranking step to an automated, tokenless broad screen: given up
// to 3 sector names, pulls all liquid stocks in those sectors from FMP's real screener, then
// runs the same deterministic Trend Template math already used elsewhere in this app against
// every one of them — no LLM calls anywhere in this pipeline.

// Canonicalizes free-text sector names (e.g. from a Finviz paste) to FMP's own sector filter
// values — same keyword-matching approach already used client-side for sector-gate checks.
const SECTOR_TO_FMP = {
  'financial': 'Financial Services',
  'technology': 'Technology',
  'healthcare': 'Healthcare',
  'consumer cyclical': 'Consumer Cyclical',
  'consumer defensive': 'Consumer Defensive',
  'industrials': 'Industrials',
  'energy': 'Energy',
  'basic materials': 'Basic Materials',
  'real estate': 'Real Estate',
  'utilities': 'Utilities',
  'communication services': 'Communication Services'
};
const SECTOR_KEYWORDS_SERVER = {
  'financial': ['financial'], 'technology': ['technology', 'tech'], 'healthcare': ['health'],
  'consumer cyclical': ['consumer cyclical', 'consumer discretionary'],
  'consumer defensive': ['consumer defensive', 'consumer staples'],
  'industrials': ['industrial'], 'energy': ['energy'], 'basic materials': ['materials'],
  'real estate': ['real estate'], 'utilities': ['utilit'], 'communication services': ['communication']
};
function sectorNameToFmpFilter(name) {
  if (!name) return null;
  const n = name.toLowerCase().trim();
  for (const key in SECTOR_KEYWORDS_SERVER) {
    const kws = SECTOR_KEYWORDS_SERVER[key];
    for (const kw of kws) { if (n.includes(kw)) return SECTOR_TO_FMP[key]; }
  }
  return null; // unrecognized — caller should skip rather than guess
}

// Fetches all liquid stocks (>$500M market cap, actively trading) across up to 3 sectors from
// FMP's real company screener, deduped. This is the "broad universe" step — pure data fetch,
// no LLM involved.
function fmpSectorScreener(sectorNames, callback) {
  const fmpSectors = (sectorNames || []).map(sectorNameToFmpFilter).filter(Boolean).slice(0, 3);
  if (!fmpSectors.length) { callback({ tickers: [], unrecognizedSectors: sectorNames || [] }); return; }

  const allResults = [];
  let pending = fmpSectors.length;
  const errors = [];

  fmpSectors.forEach(sector => {
    const path = `/company-screener?sector=${encodeURIComponent(sector)}&marketCapMoreThan=500000000&volumeMoreThan=100000&isActivelyTrading=true&isEtf=false&isFund=false&country=US&limit=400`;
    fetchFMP(path, (err, data) => {
      if (err) {
        errors.push(`${sector}: ${err.message}`);
      } else {
        const arr = Array.isArray(data) ? data : [];
        arr.forEach(r => {
          if (r && r.symbol) allResults.push({ symbol: r.symbol, companyName: r.companyName || r.name || '', marketCap: r.marketCap || null, industry: r.industry || '', sector });
        });
      }
      if (--pending === 0) {
        // Dedupe by symbol (a stock could theoretically appear if sector classification overlaps)
        const seen = {};
        const deduped = allResults.filter(r => { if (seen[r.symbol]) return false; seen[r.symbol] = true; return true; });
        callback({ tickers: deduped, errorCount: errors.length, errors, unrecognizedSectors: (sectorNames || []).filter(s => !sectorNameToFmpFilter(s)) });
      }
    });
  });
}

// The exact same Minervini Trend Template check already used throughout this app (price above
// 50/150/200MA, 50MA>150MA>200MA aligned, the stock's own 200MA rising, within 25% of the
// 52-week high, at least 25% above the 52-week low) — applied broadly, in pure code, with zero
// LLM/token cost. Mirrors indexStage2Status()'s logic but standalone for server-side reuse.
function passesTrendTemplate(price, ma50, ma150, ma200, sma200Slope, yearHigh, yearLow) {
  if (!ma50 || !ma150 || !ma200 || !yearHigh || !yearLow) return { pass: false, reason: 'insufficient data' };
  const above50 = price > ma50, above150 = price > ma150, above200 = price > ma200;
  const aligned = ma50 > ma150 && ma150 > ma200;
  const pctOffHigh = ((yearHigh - price) / yearHigh) * 100;
  const pctAboveLow = ((price - yearLow) / yearLow) * 100;
  if (!(above50 && above150 && above200)) return { pass: false, reason: 'price not above all three MAs' };
  if (!aligned) return { pass: false, reason: '50/150/200MA not aligned in bullish order' };
  if (sma200Slope !== 'Rising') return { pass: false, reason: `200MA not rising (${sma200Slope || 'unknown'})` };
  if (pctOffHigh > 25) return { pass: false, reason: `${pctOffHigh.toFixed(1)}% off 52-week high, exceeds 25%` };
  if (pctAboveLow < 25) return { pass: false, reason: `only ${pctAboveLow.toFixed(1)}% above 52-week low, needs 25%+` };
  return { pass: true, reason: 'full Trend Template confirmed', pctOffHigh: +pctOffHigh.toFixed(1), pctAboveLow: +pctAboveLow.toFixed(1) };
}

// Runs the broad Trend Template check across every screened ticker — controlled concurrency,
// lightweight per-ticker fetch (quote + 150SMA + 200MA slope only, no full candle history needed
// for this pass). Pure computation throughout; zero LLM calls.
function fmpBroadTrendTemplateScreen(tickers, callback) {
  const results = [];
  const errors = [];
  let idx = 0;
  // Was 20 (= up to 60 raw concurrent requests, 3 calls/ticker) — this was overwhelming FMP's
  // rate limit and causing most tickers to fail as "data unavailable" when the data was fine.
  // Reduced to a safer level, and every call now retries on failure before giving up.
  const concurrency = 4;
  let active = 0;
  let done = false;

  function finish() {
    if (done) return;
    done = true;
    const passed = results.filter(r => r.pass);
    callback({ results, passed, total: tickers.length, passedCount: passed.length, errorCount: errors.length });
  }

  function next() {
    if (idx >= tickers.length) { if (active === 0) finish(); return; }
    const t = tickers[idx++];
    active++;
    let quote = null, sma150 = null, sma200Slope = null;
    let pendingFetches = 3;
    const doneOne = () => {
      if (--pendingFetches > 0) return;
      active--;
      if (!quote || !quote.price) {
        errors.push(t.symbol);
      } else {
        const check = passesTrendTemplate(quote.price, quote.priceAvg50, sma150, quote.priceAvg200, sma200Slope, quote.yearHigh, quote.yearLow);
        results.push({ symbol: t.symbol, companyName: t.companyName, marketCap: t.marketCap, industry: t.industry, sector: t.sector,
          price: quote.price, ma50: quote.priceAvg50, ma150: sma150, ma200: quote.priceAvg200,
          pass: check.pass, reason: check.reason, pctOffHigh: check.pctOffHigh, pctAboveLow: check.pctAboveLow });
      }
      next();
    };
    fetchFMPWithRetry(`/quote?symbol=${t.symbol}`, (err, data) => {
      if (!err) { const q = Array.isArray(data) ? data[0] : data; if (q && q.price) quote = q; }
      doneOne();
    });
    fetchFMPWithRetry(`/technical-indicators/sma?symbol=${t.symbol}&periodLength=150&timeframe=1day`, (err, data) => {
      if (!err) { const arr = Array.isArray(data) ? data : []; if (arr[0] && arr[0].sma) sma150 = arr[0].sma; }
      doneOne();
    });
    fetchFMPWithRetry(`/technical-indicators/sma?symbol=${t.symbol}&periodLength=200&timeframe=1day`, (err, data) => {
      if (!err) {
        const arr = Array.isArray(data) ? data : [];
        if (arr.length >= 2) {
          const latest = arr[0].sma, older = arr[Math.min(19, arr.length - 1)].sma;
          if (latest && older) {
            const slopePct = ((latest - older) / older) * 100;
            sma200Slope = slopePct > 0.1 ? 'Rising' : slopePct < -0.1 ? 'Falling' : 'Flat';
          }
        }
      }
      doneOne();
    });
  }

  if (!tickers.length) { callback({ results: [], passed: [], total: 0, passedCount: 0, errorCount: 0 }); return; }
  const starters = Math.min(concurrency, tickers.length);
  for (let i = 0; i < starters; i++) next();
}

// Fetches one ticker's daily history and computes its IBD-style raw score — the per-stock
// half of the Benchmark Performance Ratio (paired with fmpBenchmarkScore for SPY's side).
function fmpStockScore(ticker, callback) {
  fetchFMPWithRetry(`/historical-price-eod/full?symbol=${ticker}`, (err, data) => {
    if (err) { callback({ error: err.message }); return; }
    const arr = Array.isArray(data) ? data : (data && data.historical ? data.historical : []);
    const closes = arr.slice(0, 300).map(d => d.close);
    const score = computeIBDStyleScore(closes);
    callback({ score });
  });
}

// ── FULL AUTOMATED PIPELINE: sector screener -> Gate 1 (Trend Template) -> Gate 2 (RS
// Benchmark Ratio) -> categorized output, all in one request. No manual step between gates,
// no intermediate results saved — Gate 2 only ever runs on Gate 1 survivors (typically a
// small fraction of the ~600 screened, so the RS pass is cheap even though it needs full
// price history per ticker). Entirely tokenless.
function fmpFullSectorScreen(sectorNames, callback) {
  fmpSectorScreener(sectorNames, (screenerResult) => {
    if (!screenerResult.tickers || !screenerResult.tickers.length) {
      callback({ error: 'No tickers found for the given sectors', screenerResult });
      return;
    }
    fmpBroadTrendTemplateScreen(screenerResult.tickers, (trendResult) => {
      const gate1Survivors = trendResult.passed;
      const baseResult = {
        sectorsRequested: sectorNames,
        unrecognizedSectors: screenerResult.unrecognizedSectors,
        universeSize: screenerResult.tickers.length,
        screenerErrorCount: screenerResult.errorCount || 0,
        gate1Total: trendResult.total,
        gate1PassedCount: gate1Survivors.length,
        gate1ErrorCount: trendResult.errorCount || 0,
      };

      if (!gate1Survivors.length) {
        callback({ ...baseResult, passed: [], watchlist: [], discardedCount: 0 });
        return;
      }

      // Gate 2 needs SPY's benchmark score once, then each survivor's own score.
      fmpBenchmarkScore((spyResult) => {
        if (spyResult.error || !spyResult.score) {
          // Can't compute ratios without SPY's score — surface Gate 1 survivors unclassified
          // rather than silently discarding everything.
          callback({ ...baseResult, passed: [], watchlist: [], discardedCount: 0,
            unclassified: gate1Survivors, spyError: spyResult.error || 'SPY score unavailable' });
          return;
        }
        const spyScore = spyResult.score;
        const passed = [], watchlist = [];
        let discarded = 0, rsErrors = 0;
        let idx = 0, active = 0, done = false;
        const concurrency = 4;

        function finish() {
          if (done) return;
          done = true;
          callback({ ...baseResult, passed, watchlist, discardedCount: discarded, rsErrorCount: rsErrors, spyScore });
        }

        function next() {
          if (idx >= gate1Survivors.length) { if (active === 0) finish(); return; }
          const stock = gate1Survivors[idx++];
          active++;
          fmpStockScore(stock.symbol, (scoreResult) => {
            active--;
            if (!scoreResult.score) {
              rsErrors++;
            } else {
              const ratio = +(scoreResult.score / spyScore).toFixed(3);
              const enriched = Object.assign({}, stock, { rsRatio: ratio });
              if (ratio >= 1.15) passed.push(enriched);
              else if (ratio >= 1.10) watchlist.push(enriched);
              else discarded++;
            }
            next();
          });
        }

        const starters = Math.min(concurrency, gate1Survivors.length);
        for (let i = 0; i < starters; i++) next();
      });
    });
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

// ── MARKET BREADTH — Method 2: Volume-Weighted Batch Quote Check ──
// A curated high-liquidity, high-quality growth universe (Nasdaq-100-style). This measures
// how many individual leading stocks are actually participating in a move today — a
// complementary signal to the SPY/QQQ moving-average Dual-Engine matrix, not a replacement
// for it. Static list — needs occasional review as index composition drifts.
const BREADTH_UNIVERSE = [
  'AAPL','MSFT','NVDA','AVGO','GOOGL','GOOG','AMZN','META','TSLA','COST',
  'NFLX','AMD','PEP','ADBE','LIN','CSCO','TMUS','QCOM','INTU','TXN',
  'AMGN','CMCSA','HON','AMAT','BKNG','ISRG','VRTX','PANW','ADP','GILD',
  'SBUX','MU','ADI','LRCX','MDLZ','REGN','KLAC','PYPL','SNPS','CDNS',
  'MELI','CRWD','CTAS','MAR','ORLY','ABNB','PCAR','CSX','ROP','NXPI',
  'FTNT','WDAY','DASH','MNST','AEP','PAYX','ROST','ODFL','KDP','CPRT',
  'EA','FAST','VRSK','DDOG','TTD','XEL','GEHC','EXC','BKR','CTSH',
  'IDXX','CCEP','DXCM','ANSS','ON','MCHP','ZS','FANG','TEAM','CSGP',
  'BIIB','GFS','WBD','ILMN','DLTR','MRVL','LULU','SIRI','WBA','ARM',
  'APP','MDB','PLTR','SMCI','AXON','CDW','GEN','TTWO','PDD','KHC'
].filter((t, i, arr) => arr.indexOf(t) === i); // dedupe

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

function fmpBreadthCheck(callback) {
  const chunks = chunkArray(BREADTH_UNIVERSE, 50); // chunked well under FMP's batch limits
  if (!chunks.length) { callback({ advances: 0, declines: 0, total: 0, advanceRatio: null }); return; }

  let pending = chunks.length;
  let advances = 0, declines = 0, total = 0;
  const errors = [];

  chunks.forEach(chunk => {
    fetchFMP(`/quote-short?symbol=${chunk.join(',')}`, (err, data) => {
      if (err) {
        errors.push(err.message);
      } else {
        const arr = Array.isArray(data) ? data : (data ? [data] : []);
        arr.forEach(q => {
          if (q && typeof q.change === 'number') {
            total++;
            if (q.change > 0) advances++;
            else declines++;
          }
        });
      }
      if (--pending === 0) {
        const advanceRatio = total > 0 ? +((advances / total) * 100).toFixed(1) : null;
        callback({ advances, declines, total, advanceRatio, errorCount: errors.length, universeSize: BREADTH_UNIVERSE.length });
      }
    });
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

  // ── GET /fmp/benchmark-score — SPY's own IBD-style weighted momentum score, one fetch.
  // Cheap enough to call whenever the client's cached value is stale — no manual "build" step. ──
  if (req.method === 'GET' && req.url === '/fmp/benchmark-score') {
    fmpBenchmarkScore(json);
    return;
  }

  // ── GET /fmp/breadth-check — Method 2: Volume-Weighted Batch Quote Check. Lightweight
  // (quote-short only, ~2 chunked calls for 100 tickers) — safe to run on every market
  // conditions fetch, unlike the heavy RS universe build. ──
  if (req.method === 'GET' && req.url === '/fmp/breadth-check') {
    fmpBreadthCheck(json);
    return;
  }

  // ── GET /fmp/sector-screen?sectors=Technology,Financial Services,Healthcare ──
  // Fully automated, tokenless pipeline: FMP screener -> Gate 1 (Trend Template) -> Gate 2
  // (RS Benchmark Ratio, applied only to Gate 1 survivors) -> categorized output, all in one
  // request. No manual step between gates.
  if (req.method === 'GET' && req.url.startsWith('/fmp/sector-screen')) {
    const qs = new URLSearchParams(req.url.split('?')[1] || '');
    const sectors = (qs.get('sectors') || '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 3);
    if (!sectors.length) { json({ error: 'sectors query param required, e.g. ?sectors=Technology,Healthcare' }); return; }
    fmpFullSectorScreen(sectors, json);
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
// The RS universe build fetches ~390 tickers and can take a while — give it room rather than
// have Node's default socket timeout cut it off mid-build.
server.timeout = 300000;
server.headersTimeout = 305000;
