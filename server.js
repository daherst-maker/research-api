<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Trading Desk</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#F5F5F7;--surface:#FFFFFF;--sidebar:#FFFFFF;
  --t1:#1D1D1F;--t2:#6E6E73;--t3:#AEAEB2;--t4:#D1D1D6;
  --green:#34C759;--green-bg:#F0FBF3;--green-mid:#34C75930;
  --red:#FF3B30;--red-bg:#FFF0F0;--red-mid:#FF3B3028;
  --amber:#FF9500;--amber-bg:#FFF8F0;--amber-mid:#FF950028;
  --blue:#007AFF;--blue-bg:#F0F6FF;--blue-mid:#007AFF28;
  --purple:#AF52DE;--purple-bg:#F8F0FF;
  --border:rgba(0,0,0,.07);--border2:rgba(0,0,0,.11);
  --shadow:0 2px 12px rgba(0,0,0,.07),0 0 0 1px rgba(0,0,0,.04);
  --shadow-sm:0 1px 4px rgba(0,0,0,.06);
  --r:18px;--r2:13px;--r3:10px;--r4:7px;
  --sans:-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',sans-serif;
}
html,body{height:100%;background:var(--bg);color:var(--t1);font-family:var(--sans);font-size:15px;-webkit-font-smoothing:antialiased;overflow:hidden}
.app{display:flex;height:100vh}

/* ── SIDEBAR ── */
.sidebar{width:230px;flex-shrink:0;background:var(--sidebar);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow-y:auto}
.sidebar::-webkit-scrollbar{width:0}
.logo-row{padding:20px 18px 12px;display:flex;align-items:center;gap:10px}
.logo-icon{width:32px;height:32px;background:var(--t1);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.logo-icon svg{width:17px;height:17px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.logo-text{font-size:16px;font-weight:700;letter-spacing:-.4px}
.nav-label{font-size:11px;font-weight:600;color:var(--t3);letter-spacing:.5px;text-transform:uppercase;padding:12px 18px 4px}
.nav-item{display:flex;align-items:center;gap:9px;padding:8px 10px;margin:1px 8px;border-radius:10px;font-size:14px;font-weight:500;color:var(--t2);cursor:pointer;transition:all .14s;position:relative}
.nav-item:hover{background:var(--bg);color:var(--t1)}
.nav-item.active{background:var(--bg);color:var(--t1);font-weight:600}
.nav-item svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;opacity:.7}
.nav-item.active svg{opacity:1}
.nav-badge{background:var(--blue);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px;margin-left:auto}
.nav-badge.green{background:var(--green)}
.nav-badge.amber{background:var(--amber)}
.sidebar-footer{margin-top:auto;padding:14px;border-top:1px solid var(--border)}
.research-btn{display:flex;align-items:center;gap:8px;padding:9px 12px;background:var(--bg);border-radius:10px;cursor:pointer;transition:background .14s;border:none;width:100%;font-family:var(--sans)}
.research-btn:hover{background:#E8E8ED}
.research-btn-text{font-size:13px;font-weight:500;color:var(--t2);flex:1;text-align:left}
.research-btn svg{width:14px;height:14px;stroke:var(--t3);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}

/* ── MAIN ── */
.main{flex:1;overflow:hidden;display:flex;flex-direction:column;min-width:0}
.topbar{height:54px;background:rgba(245,245,247,.9);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 22px;gap:10px;flex-shrink:0;z-index:10}
.topbar-title{font-size:17px;font-weight:700;letter-spacing:-.4px;flex:1}
.topbar-clock{font-size:13px;color:var(--t3);font-variant-numeric:tabular-nums;letter-spacing:.2px}
.warren-bar{padding:9px 22px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;flex-shrink:0;min-height:44px}
.warren-av{width:25px;height:25px;border-radius:50%;background:var(--t1);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0;letter-spacing:-.3px}
.warren-msg{font-size:13px;color:var(--t2);line-height:1.45;flex:1}
.warren-msg b{font-weight:600;color:var(--t1)}
.content{flex:1;overflow-y:auto;padding:22px}
.content::-webkit-scrollbar{width:6px}
.content::-webkit-scrollbar-track{background:transparent}
.content::-webkit-scrollbar-thumb{background:var(--t4);border-radius:3px}

/* ── PAGES ── */
.page{display:none}.page.active{display:block;animation:up .18s ease}
@keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* ── LAYOUT HELPERS ── */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.four-col{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.row{display:flex;align-items:center;gap:8px}
.row-between{display:flex;align-items:center;justify-content:space-between}

/* ── CARDS ── */
.card{background:var(--surface);border-radius:var(--r);box-shadow:var(--shadow);padding:20px;margin-bottom:14px}
.card-sm{background:var(--surface);border-radius:var(--r2);box-shadow:var(--shadow-sm);padding:14px}
.card-title{font-size:12px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:14px}
.inset{background:var(--bg);border-radius:var(--r3);padding:14px}
.divider{height:1px;background:var(--border);margin:14px 0}

/* ── TAGS ── */
.tag{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:12px;font-weight:600;letter-spacing:.1px}
.tag.g{background:var(--green-bg);color:var(--green)}
.tag.r{background:var(--red-bg);color:var(--red)}
.tag.a{background:var(--amber-bg);color:var(--amber)}
.tag.b{background:var(--blue-bg);color:var(--blue)}
.tag.p{background:var(--purple-bg);color:var(--purple)}

/* ── BUTTONS ── */
.btn{padding:9px 17px;border-radius:var(--r3);border:none;font-size:14px;font-weight:500;cursor:pointer;font-family:var(--sans);transition:all .12s;display:inline-flex;align-items:center;gap:6px;letter-spacing:-.1px}
.btn-blue{background:var(--blue);color:#fff}.btn-blue:hover{background:#0066d6}
.btn-green{background:var(--green);color:#fff}.btn-green:hover{filter:brightness(.9)}
.btn-ghost{background:var(--bg);color:var(--t1);border:1px solid var(--border2)}.btn-ghost:hover{background:#E8E8ED}
.btn-danger{background:var(--red-bg);color:var(--red)}.btn-danger:hover{background:var(--red-mid)}
.btn-sm{padding:6px 13px;font-size:13px;border-radius:8px}
.btn-row{display:flex;gap:8px;margin-top:14px}

/* ── FORMS ── */
.fl{font-size:12px;font-weight:600;color:var(--t2);margin-bottom:5px;display:block;letter-spacing:.1px}
.fi{width:100%;background:var(--bg);border:1.5px solid transparent;border-radius:var(--r3);padding:10px 12px;font-size:14px;color:var(--t1);font-family:var(--sans);outline:none;transition:border-color .12s;font-variant-numeric:tabular-nums;-webkit-appearance:none}
.fi:focus{border-color:var(--blue);background:#fff}
.fi::placeholder{color:var(--t3)}
.fi-sel{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%23AEAEB2' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 11px center;padding-right:30px;cursor:pointer}
.fi-ta{resize:vertical;min-height:70px;line-height:1.6}
.fg{margin-bottom:12px}

/* ── EMPTY STATES ── */
.empty{text-align:center;padding:52px 20px}
.empty-icon{font-size:38px;margin-bottom:12px;display:block;opacity:.8}
.empty-title{font-size:17px;font-weight:600;letter-spacing:-.3px;margin-bottom:6px}
.empty-sub{font-size:14px;color:var(--t3);line-height:1.55;max-width:260px;margin:0 auto 18px}

/* ── SECTION TABS ── */
.seg-control{display:inline-flex;background:var(--bg);border-radius:10px;padding:3px;gap:2px;margin-bottom:16px}
.seg-btn{padding:6px 16px;border-radius:8px;border:none;font-size:13px;font-weight:500;color:var(--t2);cursor:pointer;font-family:var(--sans);transition:all .14s;background:transparent}
.seg-btn.active{background:var(--surface);color:var(--t1);font-weight:600;box-shadow:var(--shadow-sm)}

/* ── POSITION CARD ── */
.pos-card{background:var(--surface);border-radius:var(--r);box-shadow:var(--shadow);overflow:hidden;margin-bottom:12px;transition:box-shadow .14s}
.pos-card:hover{box-shadow:0 4px 20px rgba(0,0,0,.1),0 0 0 1px rgba(0,0,0,.04)}
.pos-top{padding:16px 18px 12px}
.pos-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:2px}
.pos-ticker{font-size:20px;font-weight:700;letter-spacing:-.4px}
.pos-pnl{font-size:19px;font-weight:600;font-variant-numeric:tabular-nums;text-align:right}
.pos-sub{font-size:13px;color:var(--t3)}
.pos-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border)}
.pos-stat{background:var(--surface);padding:11px 14px}
.pos-stat-label{font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px}
.pos-stat-val{font-size:14px;font-weight:600;font-variant-numeric:tabular-nums;color:var(--t1)}
.pos-track-wrap{padding:12px 18px;background:var(--bg)}
.ref-link{font-size:11px;font-weight:600;color:var(--blue);text-decoration:none;padding:3px 9px;border:1px solid var(--blue-mid);border-radius:6px;background:var(--blue-bg);white-space:nowrap}
.pos-track-labels{display:flex;justify-content:space-between;font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.3px;margin-bottom:7px;font-variant-numeric:tabular-nums}
.pos-track{position:relative;height:5px;background:var(--t4);border-radius:3px}
.pos-fill{position:absolute;left:0;top:0;height:100%;border-radius:3px;transition:width .5s cubic-bezier(.4,0,.2,1)}
.pos-dot{position:absolute;top:50%;width:13px;height:13px;border-radius:50%;border:2.5px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.22);transform:translate(-50%,-50%);transition:left .5s cubic-bezier(.4,0,.2,1)}
.pos-marker{position:absolute;top:50%;width:9px;height:9px;border-radius:50%;transform:translate(-50%,-50%);border:2px solid #fff}
.pos-warren{padding:11px 18px;border-top:1px solid var(--border);font-size:13px;color:var(--t2);line-height:1.55}
.pos-warren b{color:var(--t1);font-weight:600}
.pos-actions{padding:10px 18px;border-top:1px solid var(--border);display:flex;gap:7px}

/* ── WATCHLIST ITEM ── */
.watch-item{background:var(--surface);border-radius:var(--r2);box-shadow:var(--shadow-sm);padding:14px 16px;margin-bottom:8px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:box-shadow .14s}
.watch-item:hover{box-shadow:var(--shadow)}
.watch-ticker-block{min-width:60px}
.watch-ticker{font-size:16px;font-weight:700;letter-spacing:-.3px}
.watch-name{font-size:11px;color:var(--t3);margin-top:1px}
.watch-thesis{font-size:13px;color:var(--t2);flex:1;line-height:1.4}
.watch-entry{text-align:right;flex-shrink:0}
.watch-entry-label{font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.3px}
.watch-entry-price{font-size:15px;font-weight:600;font-variant-numeric:tabular-nums;color:var(--blue)}

/* ── PORTFOLIO ── */
.port-num{font-size:42px;font-weight:700;letter-spacing:-.8px;font-variant-numeric:tabular-nums}
.stock-row{display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--border)}
.stock-row:last-child{border-bottom:none}

/* ── TOOL SECTIONS ── */
.flow-hint{display:flex;align-items:flex-start;gap:10px;padding:11px;background:var(--bg);border-radius:var(--r4);margin-bottom:7px}
.rr-big{font-size:34px;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-.5px}
.rr-track{height:5px;background:linear-gradient(90deg,var(--red),var(--amber) 45%,var(--green));border-radius:3px;margin:14px 0 5px;position:relative}
.rr-dot{position:absolute;top:50%;width:13px;height:13px;background:#fff;border:3px solid var(--t1);border-radius:50%;transform:translate(-50%,-50%);box-shadow:var(--shadow-sm);transition:left .4s}
.warren-box{background:var(--blue-bg);border-radius:var(--r3);padding:13px;margin-top:12px;border-left:3px solid var(--blue)}
.warren-box-title{font-size:11px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}
.warren-box-text{font-size:14px;color:var(--t1);line-height:1.65}
.pulse-head{font-size:12px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;margin:14px 0 7px}
.pulse-head:first-child{margin-top:0}
.pulse-p{font-size:14px;color:var(--t2);line-height:1.65;margin-bottom:8px}

/* ── LOADER ── */
.loader{display:inline-flex;gap:5px;align-items:center;padding:4px 0}
.ldot{width:6px;height:6px;border-radius:50%;background:var(--blue);animation:ldot 1.2s ease-in-out infinite}
.ldot:nth-child(2){animation-delay:.18s}.ldot:nth-child(3){animation-delay:.36s}
@keyframes ldot{0%,100%{opacity:.2;transform:scale(.75)}50%{opacity:1;transform:scale(1)}}

/* ── MODAL ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.3);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);z-index:300;display:flex;align-items:flex-end;justify-content:center;opacity:0;pointer-events:none;transition:opacity .2s}
.overlay.open{opacity:1;pointer-events:all}
.sheet{background:var(--surface);border-radius:22px 22px 0 0;padding:0 22px 36px;width:100%;max-width:620px;max-height:92vh;overflow-y:auto;transform:translateY(100%);transition:transform .3s cubic-bezier(.4,0,.2,1)}
.overlay.open .sheet{transform:translateY(0)}
.sheet-handle{width:36px;height:4px;background:var(--t4);border-radius:2px;margin:14px auto 18px}
.sheet-title{font-size:20px;font-weight:700;letter-spacing:-.4px;margin-bottom:18px}
</style>
</head>
<body>
<div class="app">

<!-- SIDEBAR -->
<div class="sidebar">
  <div class="logo-row">
    <div class="logo-icon"><svg viewBox="0 0 24 24"><path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M3 14h7v7H3z"/><path d="M17.5 14v7M14 17.5h7"/></svg></div>
    <div class="logo-text">Trading Desk</div>
  </div>

  <div class="nav-label">Active Trading</div>
  <div class="nav-item active" data-page="positions" onclick="nav(this)">
    <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
    Position Trades
    <span class="nav-badge green" id="badge-pos" style="display:none">0</span>
  </div>

  <div class="nav-label">Tools</div>
  <div class="nav-item" data-page="builder" onclick="nav(this)">
    <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    Trade Builder
  </div>
  <div class="nav-item" data-page="pulse" onclick="nav(this)">
    <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/></svg>
    Morning Pulse
  </div>

  <div class="nav-label">Summary</div>
  <div class="nav-item" data-page="discovery" onclick="nav(this)">
    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
    Discovery
  </div>
  <div class="nav-item" data-page="watchlist" onclick="nav(this)">
    <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
    This Week
    <span id="watchlistBadge" style="margin-left:auto;background:var(--blue);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px;display:none">0</span>
  </div>
  <div class="nav-item" data-page="portfolio" onclick="nav(this)">
    <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
    Portfolio
  </div>

  <div class="sidebar-footer">
    <button class="research-btn" onclick="window.open('company-research-v4.html','_blank')">
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <span class="research-btn-text">Open Research tool</span>
    </button>
  </div>
</div>

<!-- MAIN -->
<div class="main">
  <div class="topbar">
    <div class="topbar-title" id="pageTitle">Position Trades</div>
    <div class="topbar-clock" id="clock"></div>
    <button class="btn btn-blue btn-sm" id="topBtn" onclick="topAction()">Ask Warren about a stock</button>
  </div>
  <div class="warren-bar">
    <div class="warren-av">W</div>
    <div class="warren-msg" id="warrenMsg">Add your first position and I'll start watching it for you.</div>
  </div>
  <div id="regimeBanner" style="display:none;align-items:center;padding:6px 22px;flex-shrink:0;gap:12px;flex-wrap:wrap"></div>
  <div class="content">

    <!-- S&P 500 -->
    <!-- POSITION TRADES -->
    <div class="page active" id="page-positions">
      <div class="seg-control">
        <button class="seg-btn active" onclick="showSeg(this,'seg-open')">Open positions</button>
        <button class="seg-btn" onclick="showSeg(this,'seg-watch')">Watchlist</button>
      </div>
      <div id="seg-open"><div id="posList"></div></div>
      <div id="seg-watch" style="display:none"><div id="watchList"></div></div>
    </div>

    <!-- TRADE BUILDER -->
    <div class="page" id="page-builder">
      <div style="max-width:540px">
        <div class="card">
          <div class="card-title">Define the trade before you place it</div>
          <div class="two-col" style="margin-bottom:12px">
            <div class="fg"><label class="fl">Ticker</label><input class="fi" id="tb-ticker" placeholder="e.g. VOYG" oninput="this.value=this.value.toUpperCase()"></div>
            <div class="fg"><label class="fl">Direction</label><select class="fi fi-sel" id="tb-dir"><option value="long">Long — buying</option><option value="short">Short — selling</option></select></div>
          </div>
          <div class="three-col" style="margin-bottom:12px">
            <div class="fg"><label class="fl">Entry ($)</label><input class="fi" id="tb-entry" placeholder="24.50" type="number"></div>
            <div class="fg"><label class="fl">Stop loss ($)</label><input class="fi" id="tb-stop" placeholder="20.00" type="number"></div>
            <div class="fg"><label class="fl">Target ($)</label><input class="fi" id="tb-target" placeholder="38.00" type="number"></div>
          </div>
          <div class="two-col" style="margin-bottom:12px">
            <div class="fg"><label class="fl">Portfolio size ($)</label><input class="fi" id="tb-port" placeholder="100,000" type="number"></div>
            <div class="fg">
              <label class="fl">Conviction tier <span style="color:var(--t3);font-size:10px">— Warren sets this from your data</span></label>
              <div style="display:flex;gap:6px;margin-top:4px" id="tb-tier-btns">
                <button onclick="setTier('standard')" id="tier-standard" class="tier-btn active-tier" style="flex:1;padding:7px 6px;border-radius:8px;border:1.5px solid var(--blue);background:var(--blue-bg);font-size:12px;font-weight:600;color:var(--blue);cursor:pointer;font-family:var(--sans)">Standard<br><span style="font-size:10px;font-weight:400">2% risk</span></button>
                <button onclick="setTier('high')" id="tier-high" class="tier-btn" style="flex:1;padding:7px 6px;border-radius:8px;border:1.5px solid var(--border2);background:var(--surface);font-size:12px;font-weight:600;color:var(--t3);cursor:pointer;font-family:var(--sans)">High<br><span style="font-size:10px;font-weight:400">3–4% risk</span></button>
                <button onclick="setTier('max')" id="tier-max" class="tier-btn" style="flex:1;padding:7px 6px;border-radius:8px;border:1.5px solid var(--border2);background:var(--surface);font-size:12px;font-weight:600;color:var(--t3);cursor:pointer;font-family:var(--sans)">Max<br><span style="font-size:10px;font-weight:400">5% risk</span></button>
              </div>
              <input type="hidden" id="tb-risk" value="2">
            </div>
          </div>
          <div id="tierCriteriaBox" style="display:none;background:var(--bg);border-radius:var(--r3);padding:10px 13px;margin-bottom:12px;border:1px solid var(--border2);font-size:12px;color:var(--t2);line-height:1.6"></div>
          <!-- Volume check section -->
          <div style="background:var(--bg);border-radius:var(--r3);padding:12px 14px;margin-bottom:12px;border:1px solid var(--border2)">
            <div style="font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Volume check — is this entry confirmed?</div>
            <div class="three-col">
              <div class="fg" style="margin-bottom:0"><label class="fl">Current rel. volume</label><input class="fi" id="tb-relvol" placeholder="e.g. 1.8" type="number" step="0.1" oninput="checkVolume()"></div>
              <div class="fg" style="margin-bottom:0"><label class="fl">Today's volume</label><input class="fi" id="tb-vol-today" placeholder="e.g. 1.2M" oninput="checkVolume()"></div>
              <div class="fg" style="margin-bottom:0"><label class="fl">Avg daily volume</label><input class="fi" id="tb-vol-avg" placeholder="e.g. 800K" oninput="checkVolume()"></div>
            </div>
            <div id="volCheckResult" style="margin-top:10px;display:none"></div>
            <div style="font-size:11px;color:var(--t3);margin-top:8px">Find on Finviz (Rel Volume) or Yahoo Finance quote page. Leave blank to skip.</div>
          </div>
          <div class="fg"><label class="fl">Why this trade?</label><textarea class="fi fi-ta" id="tb-thesis" placeholder="Catalyst, setup, why now, what would make you wrong"></textarea></div>
          <div class="btn-row">
            <button class="btn btn-blue" onclick="calcRR()">Calculate risk / reward</button>
            <button class="btn btn-ghost" onclick="clearRR()">Clear</button>
          </div>
        </div>
        <div id="rrResult" style="display:none"></div>
      </div>
    </div>

    <!-- MORNING PULSE -->
    <div class="page" id="page-pulse">
      <div>

        <!-- STEP 1: Daily breadth — paste before running -->
        <div class="card" style="border:1px solid var(--amber);margin-bottom:12px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <div>
              <div style="font-size:12px;font-weight:700;color:var(--amber);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Step 1 — Before you run (5 seconds)</div>
              <div style="font-size:14px;font-weight:600;color:var(--t1)">Today's Market Breadth</div>
            </div>
            <a href="https://www.barchart.com/stocks/market-overview/market-breadth" target="_blank" class="btn btn-sm" style="background:var(--amber);color:#fff;border:none;text-decoration:none;white-space:nowrap">Open Barchart ↗</a>
          </div>
          <div style="font-size:13px;color:var(--t2);line-height:1.6;margin-bottom:10px">Paste today's NYSE new highs and new lows. Warren tracks a rolling 5-day store, calculates the average ratio, trend direction, and breadth score — and updates Gate 6 automatically.</div>
          <textarea class="fi fi-ta" id="breadthDailyIn" style="min-height:50px;font-family:monospace;font-size:13px" placeholder="New Highs: 132&#10;New Lows: 28"></textarea>
          <div class="btn-row" style="margin-top:8px">
            <button class="btn btn-blue btn-sm" onclick="saveDailyBreadth()">Save breadth</button>
            <div id="breadthSaveStatus" style="font-size:12px;color:var(--t3);align-self:center"></div>
          </div>
          <div id="breadthRollingDisplay" style="margin-top:10px"></div>
        </div>

        <!-- STEP 2: AUTO BRIEFING -->
        <div class="card" style="border:1.5px solid var(--blue)">
          <div style="font-size:12px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Step 2 — Run the briefing</div>
          <div class="row-between" style="margin-bottom:6px">
            <div>
              <div style="font-size:15px;font-weight:700;letter-spacing:-.3px;margin-bottom:3px">Run morning briefing</div>
              <div style="font-size:13px;color:var(--t3)">Warren fetches futures, overnight news, and earnings — then tells you what to do with each position today.</div>
            </div>
            <button class="btn btn-blue" id="autoPulseBtn" onclick="runAutoPulse()" style="flex-shrink:0;padding:10px 20px;font-size:14px;font-weight:600">▶ Run now</button>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
            <span class="tag b" style="font-size:11px">SPY & Nasdaq futures</span>
            <span class="tag b" style="font-size:11px">Overnight news on your positions</span>
            <span class="tag b" style="font-size:11px">Today's earnings</span>
          </div>
        </div>

        <div id="autoPulseOut" style="display:none"></div>

        <!-- STEP 3: MANUAL NOTES -->
        <div style="display:flex;align-items:center;gap:12px;margin:16px 0">
          <div style="flex:1;height:1px;background:var(--border)"></div>
          <div style="font-size:12px;color:var(--t3)">Step 3 — add anything else</div>
          <div style="flex:1;height:1px;background:var(--border)"></div>
        </div>

        <div class="card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <div>
              <div class="card-title" style="margin-bottom:2px">Add context Warren can't fetch</div>
              <div style="font-size:13px;color:var(--t3)">Anything from X, news you spotted, anything relevant to your positions</div>
            </div>
          </div>
          <textarea class="fi fi-ta" id="pulseIn" placeholder="Anything from X or news you spotted overnight..."></textarea>
          <div class="btn-row">
            <button class="btn btn-ghost" onclick="runPulse()">Warren reads this too</button>
            <button class="btn btn-ghost" onclick="clearPulse()">Clear</button>
          </div>
        </div>
        <div id="pulseOut" style="display:none" class="card"></div>
      </div>
    </div>

    <!-- DISCOVERY -->
    <div class="page" id="page-discovery">
      <div>

        <!-- Market & Sector Overview -->
        <div class="card">
          <div class="card-title" style="margin-bottom:2px">Market & Sector Overview</div>
          <div style="font-size:13px;color:var(--t3);margin-bottom:14px">Market conditions and sector rankings — run weekly before trading</div>

          <!-- SECTION A: Warren auto-fetches -->
          <div style="background:var(--blue-bg);border-radius:var(--r3);padding:12px 14px;margin-bottom:12px;border:1px solid var(--blue-mid)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <div>
                <div style="font-size:11px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.4px;margin-bottom:2px">Market Conditions — Warren fetches automatically</div>
                <div style="font-size:12px;color:var(--t2)">SPY (market stage) · QQQ (Nasdaq leadership) · IWM (breadth) · VIX (context) — Minervini market timing signals</div>
              </div>
              <button class="btn btn-blue btn-sm" id="sectorBtn" onclick="runSectorRotation()">Fetch now</button>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              <a href="https://finance.yahoo.com/quote/SPY" target="_blank" class="ref-link">SPY ↗</a>
              <a href="https://finance.yahoo.com/quote/QQQ" target="_blank" class="ref-link">QQQ ↗</a>
              <a href="https://finance.yahoo.com/quote/IWM" target="_blank" class="ref-link">IWM ↗</a>
              <a href="https://finance.yahoo.com/quote/%5EVIX" target="_blank" class="ref-link">VIX ↗</a>
              <a href="https://finance.yahoo.com/markets/stocks/52-week-highs/" target="_blank" class="ref-link">52-wk Highs ↗</a>
              <a href="https://finance.yahoo.com/markets/stocks/52-week-lows/" target="_blank" class="ref-link">52-wk Lows ↗</a>
              <a href="https://stockcharts.com/freecharts/candleglance.php?ids=$NYHL" target="_blank" class="ref-link" title="NYSE new highs minus new lows — Minervini's breadth indicator">Breadth ($NYHL) ↗</a>
            </div>
          </div>

          <!-- Step 1 auto-fetch results render here — persists when Step 2 runs -->
          <div id="sectorIndicatorResult"></div>
        </div>

          <!-- RS BENCHMARK: real IBD-style score, expressed as a ratio vs SPY — no build step -->
          <div style="background:var(--purple-bg,#f5f0ff);border-radius:var(--r3);padding:12px 14px;margin-bottom:12px;border:1px solid var(--purple,#8b5cf6)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;gap:10px">
              <div>
                <div style="font-size:11px;font-weight:700;color:var(--purple,#8b5cf6);text-transform:uppercase;letter-spacing:.4px;margin-bottom:2px">RS Ratio — computed, not fetched</div>
                <div style="font-size:12px;color:var(--t2)">Finviz has no RS Rating field (only RSI, a different metric). This computes IBD's real weighted-momentum formula for a stock and for SPY, then expresses RS as a direct ratio: Stock ÷ SPY. 1.15+ means beating the market by 15%+. One lightweight fetch, refreshed automatically — no manual build step.</div>
              </div>
              <button class="btn btn-sm" style="background:var(--purple,#8b5cf6);color:#fff;flex-shrink:0" id="rsBenchmarkBtn" onclick="runRefreshBenchmark()">Refresh now</button>
            </div>
            <div id="rsBenchmarkStatus" style="font-size:12px;color:var(--t3)"></div>
          </div>

          <!-- SECTION B: Sector Rankings paste -->
          <div style="background:var(--bg);border-radius:var(--r3);padding:12px 14px;margin-bottom:12px;border:1px solid var(--border2)">
            <div style="font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px">Sector Rankings — you paste (takes 60 seconds)</div>
            <div style="font-size:12px;color:var(--t2);line-height:1.6;margin-bottom:10px">3-month performance is the baseline — proof of sustained institutional accumulation over a full quarter. 1-month performance is the acceleration trigger — is buying pace stepping up right now? Paste both so Warren can find the sectors actually accelerating, not just historically strong.</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
              <div style="font-size:12px;color:var(--t2);line-height:1.7">
                <a href="https://finviz.com/groups.ashx?g=sector&sg=sector&o=perf4w" target="_blank" class="ref-link" style="display:inline-block;margin-bottom:4px">Sectors 1M ↗</a><br>
                Select all rows → copy → paste below
              </div>
              <div style="font-size:12px;color:var(--t2);line-height:1.7">
                <a href="https://finviz.com/groups.ashx?g=sector&sg=sector&o=perf13w" target="_blank" class="ref-link" style="display:inline-block;margin-bottom:4px">Sectors 3M ↗</a><br>
                Copy → paste below the 1M data
              </div>
            </div>
            <textarea class="fi fi-ta" id="sectorPasteIn" style="min-height:80px;font-family:monospace;font-size:12px" placeholder="SECTOR 1M:&#10;Basic Materials: +3.15%&#10;Healthcare: +2.60%&#10;Financial: +1.43%&#10;Technology: -1.20%&#10;...&#10;&#10;SECTOR 3M:&#10;Energy: +8.36%&#10;Healthcare: +3.97%&#10;Financial: +5.19%&#10;Technology: -3.60%&#10;..."></textarea>
            <div class="btn-row" style="margin-top:8px">
              <button class="btn btn-blue btn-sm" onclick="runSectorFromPaste()">Warren reads this</button>
              <button class="btn btn-ghost btn-sm" onclick="document.getElementById('sectorPasteIn').value=''">Clear</button>
            </div>
          </div>

          <!-- Sector dashboard renders here after paste -->
          <div id="sectorResult"></div>
        </div>

        <!-- AUTOMATED SECTOR SCREENER — bridges Top 3 sectors to a full tokenless broad screen -->
        <div class="card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;gap:10px">
            <div>
              <div class="card-title" style="margin-bottom:2px">Screen These Sectors</div>
              <div style="font-size:13px;color:var(--t3)">Automated, tokenless: pulls every liquid stock (&gt;$500M cap) in your Top 3 sectors from FMP, filters through the Trend Template, then automatically runs the RS Benchmark Ratio on survivors — one continuous pipeline, no manual steps in between, no LLM calls.</div>
            </div>
            <button class="btn btn-blue btn-sm" id="sectorScreenBtn" onclick="runSectorScreen()" style="flex-shrink:0">Screen now</button>
          </div>
          <div id="sectorScreenStatus" style="font-size:12px;color:var(--t3);margin-top:8px"></div>
          <div id="sectorScreenResult" style="margin-top:10px"></div>
        </div>

        <!-- Catalyst Radar -->
        <div class="card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
            <div>
              <div class="card-title" style="margin-bottom:2px">Catalyst Radar</div>
              <div style="font-size:13px;color:var(--t3)">Earnings setups &middot; 52-week highs in leading sectors &middot; SEPA watchlist candidates</div>
            </div>
            <button class="btn btn-blue btn-sm" id="catalystBtn" onclick="runCatalystRadar()">Check now</button>
          </div>
          <div id="catalystResult" style="margin-top:14px"></div>
        </div>

        <!-- Your Own Research -->
        <div class="card">
          <div class="card-title" style="margin-bottom:4px">Your own research</div>
          <div style="font-size:13px;color:var(--t3);margin-bottom:14px">Things Warren can't find — do these after running Catalyst Radar, paste what you find below</div>

          <div style="display:grid;gap:8px;margin-bottom:14px">

            <!-- Finviz -->
            <div style="background:var(--bg);border-radius:var(--r3);padding:11px 13px;border:1px solid var(--border2)">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
                <div style="font-size:12px;font-weight:700;color:var(--t1)">🔍 Finviz Screener — 10 min</div>
                <a href="https://finviz.com/screener.ashx?v=111&f=fa_epsqoq_pos,ta_sma50_pa,ta_sma200_pa,ta_relativevolume_o1.5,ta_perf_1wup&o=-relativevolume" target="_blank" class="ref-link">Open with filters ↗</a>
              </div>
              <div style="font-size:12px;color:var(--t2);line-height:1.6">Link opens with filters pre-set: above 50-day MA, above 200-day MA, relative volume above 1.5x, positive week. Sort by Relative Volume — top results have unusual activity. Cross-reference with your leading sectors. Paste tickers into Warren for full analysis.</div>
            </div>

            <!-- IBD 50 -->
            <div style="background:var(--bg);border-radius:var(--r3);padding:11px 13px;border:1px solid var(--border2)">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
                <div style="font-size:12px;font-weight:700;color:var(--t1)">📊 IBD 50 — 2 min</div>
                <a href="https://www.investors.com/ibd-data-tables/" target="_blank" class="ref-link">Open IBD 50 ↗</a>
              </div>
              <div style="font-size:12px;color:var(--t2);line-height:1.6">William O'Neil's weekly list of the 50 stocks with the best combination of earnings growth and technical setup — across all sectors, no bias. This is the closest thing to a pre-screened Minervini list that exists publicly. Browse it and paste anything interesting into Warren.</div>
            </div>

            <!-- X/Twitter -->
            <div style="background:var(--bg);border-radius:var(--r3);padding:11px 13px;border:1px solid var(--border2)">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
                <div style="font-size:12px;font-weight:700;color:var(--t1)">𝕏 X/Twitter — 5 min</div>
                <div style="display:flex;gap:5px">
                  <a href="https://twitter.com/StockMKTNewz" target="_blank" class="ref-link">@StockMKTNewz ↗</a>
                </div>
              </div>
              <div style="font-size:12px;color:var(--t2);line-height:1.6">Search your position tickers. Look for breaking news and anything from founders, executives, or industry insiders that wouldn't show up on a calendar — these are the signals Warren can't find.</div>
            </div>

          </div>

          <!-- Paste box -->
          <div style="margin-top:12px">
          <div style="font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px">Paste what you found — Warren adds it to his analysis</div>
          <textarea class="fi fi-ta" id="ownResearchIn" style="min-height:80px" placeholder="e.g. Saw on X that VOYG CEO bought $2M of shares last week&#10;IBD 50 has AXON — healthcare tech, not on my radar&#10;Finviz: SMCI showing relative volume 4.2x, breaking above $800 resistance"></textarea>
          <div class="btn-row" style="margin-top:8px">
            <button class="btn btn-blue btn-sm" onclick="runOwnResearch()">Warren reads this</button>
            <button class="btn btn-ghost btn-sm" onclick="document.getElementById('ownResearchIn').value=''">Clear</button>
          </div>
          <div id="ownResearchOut" style="margin-top:12px"></div>
        </div>

      </div>
    </div>

    <!-- THIS WEEK — SEPA Candidates -->
    <div class="page" id="page-watchlist">
      <div id="watchlistContainer" style="background:rgba(255,0,0,0.05)"></div>
      <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);display:flex;gap:8px;align-items:center">
        <input id="watchlistInput" class="fi" type="text" placeholder="Add ticker — e.g. JPM, V, COST" style="flex:1;text-transform:uppercase;font-size:14px;letter-spacing:.5px" onkeydown="if(event.key==='Enter')addToWatchlist(document.getElementById('watchlistInput').value,'Manual')">
        <button class="btn btn-blue" onclick="addToWatchlist(document.getElementById('watchlistInput').value,'Manual')">Add</button>
        <button class="btn btn-ghost btn-sm" onclick="clearWatchlist()" style="white-space:nowrap;color:var(--t3)">Clear all</button>
      </div>
    </div>

    <!-- PORTFOLIO -->
    <div class="page" id="page-portfolio">
      <div id="portContent"></div>
    </div>

  </div>
</div>
</div>

<!-- MODALS -->
<div class="overlay" id="overlay" onclick="if(event.target===this)closeSheet()">
  <div class="sheet">
    <div class="sheet-handle"></div>
    <div class="sheet-title" id="sheetTitle">Add position</div>
    <div id="sheetBody"></div>
  </div>
</div>

<script>
const RAILWAY='https://research-api-production-c785.up.railway.app';
const DB={
  get:function(k){try{var v=localStorage.getItem('td3_'+k);return v?JSON.parse(v):null}catch(e){return null}},
  set:function(k,v){try{localStorage.setItem('td3_'+k,JSON.stringify(v))}catch(e){}}
};

var positions=DB.get('positions')||[];
var watchlist=DB.get('watchlist')||[];
var editIdx=-1;
var currentSheet='';

// ── CLOCK ──
function tick(){document.getElementById('clock').textContent=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'});}
setInterval(tick,1000);tick();

// ── NAV ──
var titles={positions:'Position Trades',builder:'Trade Builder',pulse:'Morning Pulse',discovery:'Discovery',watchlist:'This Week — SEPA Candidates',portfolio:'Portfolio'};
var topBtns={positions:{label:'Ask Warren about a stock',fn:'openSheet("warren-pos")'},builder:null,pulse:null,discovery:null,portfolio:null};
function topAction(){var page=document.querySelector('.nav-item.active');var id=page?page.dataset.page:'positions';var tb=topBtns[id];if(tb)eval(tb.fn);}
function nav(el){
  var id=el.dataset.page;
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active');});
  document.getElementById('page-'+id).classList.add('active');
  el.classList.add('active');
  document.getElementById('pageTitle').textContent=titles[id]||'';
  var tb=topBtns[id];
  var btn=document.getElementById('topBtn');
  if(tb){btn.textContent=tb.label;btn.style.display='';btn.onclick=function(){eval(tb.fn);}}
  else btn.style.display='none';
  if(id==='portfolio')renderPortfolio();
  if(id==='watchlist')renderWatchlist();
  updateWarren(id);
}

// ── SEGMENTS ──
function showSeg(btn,id){
  document.querySelectorAll('.seg-btn').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
  ['seg-open','seg-watch'].forEach(function(s){document.getElementById(s).style.display=s===id?'':'none';});
}

// ── WARREN BAR ──
function updateWarren(page){
  var msg='';
  if(page==='positions'){
    if(!positions.length)msg='Add your first position trade and I\'ll start watching your levels.';
    else{
      var atRisk=positions.filter(function(p){return p.stopLoss&&(p.currentPrice-p.stopLoss)/p.currentPrice*100<4;});
      var pnl=positions.reduce(function(a,p){return a+p.shares*(p.currentPrice-p.avgCost);},0);
      if(atRisk.length)msg='<b>'+esc(atRisk[0].ticker)+'</b> is within 4% of your stop. Do not move it lower — decide now if the thesis still holds.';
      else msg=(pnl>=0?'Position book up <b>$'+Math.round(pnl).toLocaleString()+'</b>. Watch your levels — profit is not a reason to hold, a live thesis is.':'Down <b>$'+Math.abs(Math.round(pnl)).toLocaleString()+'</b> on positions. Check every stop. A loss you let run is the most expensive mistake.');
    }
  }
  else if(page==='builder')msg='Risk first, reward second. If you cannot define where you are wrong, you are not ready to trade it.';
  else if(page==='pulse'){
    msg='Tap <strong>Run now</strong> — Warren fetches futures, overnight news, and earnings automatically. Done in 90 seconds.';
  }
  else if(page==='discovery')msg='Run Market Conditions first, then paste Sector Rankings. Then check catalysts for the week ahead.';
  else if(page==='watchlist'){
    var wl=getWatchlist();
    msg=wl.length?'<b>'+wl.length+'</b> candidate'+(wl.length>1?'s':'')+' this week. Run SEPA analysis on each one before deciding whether to trade.':'Add candidates from Catalyst Radar, your Finviz screener, or type a ticker above. Warren runs a full 7-gate SEPA check on each one.';
  }
  else if(page==='portfolio')msg='Watching your position book. Make sure no single name is carrying too much of your risk.';
  document.getElementById('warrenMsg').innerHTML=msg;
}

// ── BADGES ──
function updateBadges(){
  var pb=document.getElementById('badge-pos');
  if(positions.length){pb.textContent=positions.length;pb.style.display='';}else pb.style.display='none';
}

// ── ESC ──
function esc(s){if(!s)return'';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

// ── POSITIONS ──
function renderPositions(){
  var el=document.getElementById('posList');
  updateBadges();
  if(!positions.length){
    el.innerHTML='<div class="empty"><span class="empty-icon">📈</span><div class="empty-title">No open positions</div><div class="empty-sub">Positions you hold for weeks to months go here.</div><button class="btn btn-blue" onclick="openSheet(\'warren-pos\')">Ask Warren about a stock</button></div>';
    return;
  }
  var totalVal=positions.reduce(function(a,p){return a+p.shares*p.currentPrice;},0);
  // Header row with Refresh All
  var headerHtml='<div class="row-between" style="margin-bottom:12px">'+
    '<div style="font-size:13px;color:var(--t3)">'+positions.length+' position'+(positions.length!==1?'s':'')+'</div>'+
    '<button class="btn btn-ghost btn-sm" id="refreshAllBtn" onclick="refreshAllPrices()">↻ Refresh all prices</button>'+
  '</div>';
  el.innerHTML=headerHtml+positions.map(function(pos,idx){
    var pnl=pos.shares*(pos.currentPrice-pos.avgCost);
    var pnlPct=(pos.currentPrice-pos.avgCost)/pos.avgCost*100;
    var isGain=pnl>=0;
    var mkt=pos.shares*pos.currentPrice;
    var portPct=totalVal>0?Math.round(mkt/totalVal*100):0;
    var stop=pos.stopLoss||pos.avgCost*.85;
    var target=pos.target||pos.avgCost*1.35;
    var add=pos.addLevel||null;
    var breakoutLevel=pos.breakoutLevel||null;
    var pivotPoint=pos.pivotPoint||null;
    var range=target-stop;
    var fillPct=range>0?Math.max(2,Math.min(97,(pos.currentPrice-stop)/range*100)):50;
    var addPct=add&&range>0?Math.max(2,Math.min(97,(add-stop)/range*100)):null;
    var boPct=breakoutLevel&&range>0?Math.max(2,Math.min(97,(breakoutLevel-stop)/range*100)):null;
    var pvPct=pivotPoint&&range>0?Math.max(2,Math.min(97,(pivotPoint-stop)/range*100)):null;
    var fillColor=fillPct>65?'var(--green)':fillPct>30?'var(--amber)':'var(--red)';

    // Volume badge
    var volBadge='';
    if(pos.lastVolMultiple){
      var vm=parseFloat(pos.lastVolMultiple);
      var vColor=vm>=2?'var(--green)':vm>=1.5?'var(--amber)':'var(--t3)';
      var vBg=vm>=2?'var(--green-bg)':vm>=1.5?'var(--amber-bg)':'var(--bg)';
      var vLabel=vm>=2?'High volume ('+vm.toFixed(1)+'x)':vm>=1.5?'Above avg ('+vm.toFixed(1)+'x)':'Low volume ('+vm.toFixed(1)+'x)';
      volBadge='<span class="tag" style="background:'+vBg+';color:'+vColor+';font-size:10px">'+vLabel+'</span>';
    }

    return'<div class="pos-card">'+
      '<div class="pos-top">'+
        '<div class="pos-header">'+
          '<div>'+
            '<div class="row" style="gap:7px;margin-bottom:2px">'+
              '<span class="pos-ticker">'+esc(pos.ticker)+'</span>'+
              '<span class="tag '+(isGain?'g':'r')+'">'+(isGain?'+':'')+pnlPct.toFixed(1)+'%</span>'+
              '<span class="tag b" style="font-size:11px">'+portPct+'% of port</span>'+
              volBadge+
            '</div>'+
            '<div class="pos-sub">'+esc(pos.name||pos.ticker)+(pos.sector?' · '+esc(pos.sector):'')+'</div>'+
          '</div>'+
          '<div style="text-align:right">'+
            '<div class="pos-pnl '+(isGain?'green':'red')+'">'+(isGain?'+':'−')+'$'+Math.abs(Math.round(pnl)).toLocaleString()+'</div>'+
            '<div class="pos-sub">$'+Math.round(mkt).toLocaleString()+'</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="pos-stats-grid">'+
        '<div class="pos-stat"><div class="pos-stat-label">Shares</div><div class="pos-stat-val">'+Number(pos.shares).toLocaleString()+'</div></div>'+
        '<div class="pos-stat"><div class="pos-stat-label">Avg cost</div><div class="pos-stat-val">$'+Number(pos.avgCost).toFixed(2)+'</div></div>'+
        '<div class="pos-stat"><div class="pos-stat-label">Current</div><div class="pos-stat-val">$'+Number(pos.currentPrice).toFixed(2)+'</div></div>'+
        '<div class="pos-stat"><div class="pos-stat-label">P&L</div><div class="pos-stat-val '+(isGain?'green':'red')+'">'+(isGain?'+':'')+pnlPct.toFixed(1)+'%</div></div>'+
      '</div>'+
      '<div class="pos-track-wrap">'+
        '<div class="pos-track-labels">'+
          '<span>Stop $'+Number(stop).toFixed(2)+'</span>'+
          (pivotPoint?'<span style="color:var(--purple)">Pivot $'+Number(pivotPoint).toFixed(2)+'</span>':
            breakoutLevel?'<span style="color:var(--blue)">BO $'+Number(breakoutLevel).toFixed(2)+'</span>':
            add?'<span>Add $'+Number(add).toFixed(2)+'</span>':'<span></span>')+
          '<span>Target $'+Number(target).toFixed(2)+'</span>'+
        '</div>'+
        '<div class="pos-track">'+
          '<div class="pos-fill" style="width:'+fillPct+'%;background:'+fillColor+'"></div>'+
          (addPct&&!pvPct&&!boPct?'<div class="pos-marker" style="left:'+addPct+'%;background:var(--amber)" title="Add level $'+Number(add).toFixed(2)+'"></div>':'')+
          (pvPct?'<div class="pos-marker" style="left:'+pvPct+'%;background:var(--purple)" title="Pivot point $'+Number(pivotPoint).toFixed(2)+' — optimal early entry"></div>':'')+
          (boPct?'<div class="pos-marker" style="left:'+boPct+'%;background:var(--blue)" title="Breakout level $'+Number(breakoutLevel).toFixed(2)+'"></div>':'')+
          '<div class="pos-dot" style="left:'+fillPct+'%;background:'+fillColor+'"></div>'+
        '</div>'+
      (pivotPoint||breakoutLevel?
        '<div style="display:flex;gap:12px;margin-top:6px;flex-wrap:wrap">'+
          (pvPct?'<div style="font-size:10px;color:var(--purple)">● Pivot $'+Number(pivotPoint).toFixed(2)+' — early entry, half size</div>':'')+
          (boPct?'<div style="font-size:10px;color:var(--blue)">● Breakout $'+Number(breakoutLevel).toFixed(2)+' — full confirmation, full size</div>':'')+
        '</div>':'')+
    '</div>'+
    // Earnings checklist — shown when earnings are within 7 days
    (pos.earningsDate&&daysUntilEarnings(pos.earningsDate)<=7&&daysUntilEarnings(pos.earningsDate)>=0?
      buildEarningsChecklist(pos,idx):'') +
    '<div class="pos-warren" id="pos-warren-'+idx+'">'+posWarren(pos)+'</div>'+
    '<div class="pos-actions">'+
      '<button class="btn btn-blue btn-sm" id="pos-refresh-'+idx+'" onclick="refreshPosPrice('+idx+')">↻ Refresh price</button>'+
      '<button class="btn btn-ghost btn-sm" onclick="editPos('+idx+')">Edit</button>'+
      '<button class="btn btn-danger btn-sm" onclick="closePos('+idx+')">Close position</button>'+
    '</div>'+
  '</div>';
  }).join('');
}

function daysUntilEarnings(dateStr){
  if(!dateStr)return999;
  try{var d=new Date(dateStr);return isNaN(d)?999:Math.round((d.getTime()-Date.now())/86400000);}
  catch(e){return999;}
}

function buildEarningsChecklist(pos,idx){
  var days=daysUntilEarnings(pos.earningsDate);
  var isUrgent=days<=2;
  var bg=isUrgent?'var(--red-bg)':'var(--amber-bg)';
  var border=isUrgent?'var(--red)':'var(--amber)';
  var color=isUrgent?'var(--red)':'var(--amber)';
  var label=isUrgent?'🚨 Earnings in '+days+' day'+(days===1?'':'s')+' — Warren\'s verdict below':'⚠ Earnings in '+days+' days — Warren\'s pre-earnings plan';
  var verdict=pos.earningsVerdict||null;

  return'<div style="background:'+bg+';border-top:1px solid '+border+';border-bottom:1px solid '+border+';padding:14px 18px" id="earnings-checklist-'+idx+'">'+
    '<div style="font-size:11px;font-weight:700;color:'+color+';text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">'+label+'</div>'+
    (verdict?
      // Warren has already analysed — show verdict
      '<div style="display:grid;gap:10px">'+
        // Decision
        '<div style="background:#fff;border-radius:var(--r3);padding:12px 14px;border-left:3px solid '+color+'">'+
          '<div style="font-size:10px;font-weight:700;color:'+color+';text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">Warren\'s decision</div>'+
          '<div style="font-size:16px;font-weight:700;color:var(--t1);margin-bottom:4px">'+esc(verdict.decision||'—')+'</div>'+
          '<div style="font-size:13px;color:var(--t2);line-height:1.6">'+esc(verdict.reason||'')+'</div>'+
        '</div>'+
        // Post-earnings stop
        (verdict.postStop?
          '<div style="background:var(--red-bg);border-radius:var(--r3);padding:10px 14px;border-left:3px solid var(--red)">'+
            '<div style="font-size:10px;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">Stop loss morning after earnings</div>'+
            '<div style="font-size:18px;font-weight:700;color:var(--red);font-variant-numeric:tabular-nums">'+esc(verdict.postStop)+'</div>'+
            '<div style="font-size:12px;color:var(--t2);margin-top:3px">Set this in IBKR the morning after earnings regardless of outcome</div>'+
          '</div>':'') +
        // Scenario cards
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">'+
          '<div style="background:var(--green-bg);border-radius:var(--r4);padding:9px 11px">'+
            '<div style="font-size:9px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">If beat</div>'+
            '<div style="font-size:12px;color:var(--t1);line-height:1.5">'+esc(verdict.beat||'—')+'</div>'+
          '</div>'+
          '<div style="background:var(--bg);border-radius:var(--r4);padding:9px 11px;border:1px solid var(--border2)">'+
            '<div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">If meet</div>'+
            '<div style="font-size:12px;color:var(--t1);line-height:1.5">'+esc(verdict.meet||'—')+'</div>'+
          '</div>'+
          '<div style="background:var(--red-bg);border-radius:var(--r4);padding:9px 11px">'+
            '<div style="font-size:9px;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">If miss</div>'+
            '<div style="font-size:12px;color:var(--t1);line-height:1.5">'+esc(verdict.miss||'—')+'</div>'+
          '</div>'+
        '</div>'+
        // Refresh button
        '<button class="btn btn-ghost btn-sm" onclick="getEarningsVerdict('+idx+')" id="ev-btn-'+idx+'">↻ Ask Warren again</button>'+
      '</div>':
      // Warren hasn't analysed yet — show ask button
      '<div>'+
        '<div style="font-size:13px;color:var(--t2);margin-bottom:10px;line-height:1.55">Warren will look at your current P&L, how many days until earnings, the implied move from options, and your position size — then tell you exactly what to do.</div>'+
        '<button class="btn btn-sm" style="background:'+color+';color:#fff;border:none" onclick="getEarningsVerdict('+idx+')" id="ev-btn-'+idx+'">Ask Warren — what should I do?</button>'+
      '</div>'
    )+
  '</div>';
}

async function getEarningsVerdict(idx){
  var pos=positions[idx];
  var btn=document.getElementById('ev-btn-'+idx);
  var el=document.getElementById('earnings-checklist-'+idx);
  if(btn){btn.textContent='Warren is thinking...';btn.disabled=true;}

  var pnlPct=((pos.currentPrice-pos.avgCost)/pos.avgCost*100).toFixed(1);
  var days=daysUntilEarnings(pos.earningsDate);
  var prompt='You are Warren. $50M own money, 30%+ compounder. No disclaimers. No hedging. Tell me exactly what to do.\n\n'+
    'Position: '+pos.ticker+(pos.name?' ('+pos.name+')':'')+'\n'+
    'Current price: $'+pos.currentPrice+'\n'+
    'Avg cost: $'+pos.avgCost+'\n'+
    'P&L: '+pnlPct+'% ('+(pnlPct>0?'in profit':'at a loss')+')\n'+
    'Shares: '+pos.shares+'\n'+
    (pos.stopLoss?'Current stop: $'+pos.stopLoss+'\n':'')+
    (pos.target?'Target: $'+pos.target+'\n':'')+
    'Days until earnings: '+days+'\n\n'+
    'Fetch https://finance.yahoo.com/quote/'+pos.ticker+'/options to find the implied move for the earnings event — the at-the-money straddle price divided by stock price.\n'+
    'Also check https://stockanalysis.com/stocks/'+pos.ticker.toLowerCase()+'/ for earnings date confirmation and last 2 EPS results (did they beat or miss previously?).\n\n'+
    'Based on this data, give me your verdict on what to do before earnings. Structure exactly like this:\n\n'+
    'DECISION: [Sell half before earnings / Hold full position through / Exit completely before earnings]\n'+
    'REASON: 2-3 sentences explaining exactly why — reference the P&L, implied move, prior earnings history, and your methodology. Be specific. No hedging.\n'+
    'POST_STOP: The specific stop price to set in IBKR the morning after earnings, whatever happens — this is the level that says the trade is broken post-earnings. $XX.XX\n'+
    'BEAT: Exactly what to do if earnings beat — specific action with prices. One sentence.\n'+
    'MEET: Exactly what to do if earnings meet expectations. One sentence.\n'+
    'MISS: Exactly what to do if earnings miss. One sentence. (Hint: the answer is almost always "exit at market open immediately")\n\n'+
    'Apply this STRICT decision tree in order — do not deviate from it:\n'+
    '1. If P&L is negative or less than 5%: EXIT completely before earnings. Never hold through earnings without a profit cushion.\n'+
    '2. If P&L is 5-15% AND implied move is larger than remaining upside to target: EXIT completely. The risk outweighs the reward.\n'+
    '3. If P&L is 5-15% AND implied move is smaller than remaining upside: SELL HALF. Protect partial profit, keep exposure.\n'+
    '4. If P&L is 15-25%: SELL HALF always. No exceptions. Lock in gains on half regardless of implied move.\n'+
    '5. If P&L is above 25% AND stock has beaten earnings 3+ consecutive quarters AND implied move is less than 50% of P&L cushion: HOLD FULL. High conviction, strong cushion, proven earnings history.\n'+
    '6. If P&L is above 25% but fewer than 3 prior beats OR implied move exceeds 50% of cushion: SELL HALF.\n'+
    'Apply rule 1 through 6 in order. Stop at the first rule that applies. Output which rule number fired and why.\n'+
    'Apply rule 1 through 6 in order. Stop at the first rule that applies. Output which rule number fired and why.';
  try{
    var resp=await fetch(RAILWAY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      model:'claude-sonnet-5',max_tokens:2000,
      messages:[{role:'user',content:prompt}],
      tools:[{type:'web_search_20250305',name:'web_search'}]
    })});
    var data=await resp.json();
    var blocks=(data.content||[]).filter(function(b){return b.type==='text';});
    var text=blocks[blocks.length-1]&&blocks[blocks.length-1].text||'';

    // Parse verdict
    var verdict={};
    text.split('\n').forEach(function(line){
      var l=line.trim();
      if(/^DECISION:/i.test(l))verdict.decision=l.replace(/^DECISION:\s*/i,'');
      else if(/^REASON:/i.test(l))verdict.reason=l.replace(/^REASON:\s*/i,'');
      else if(/^POST_STOP:/i.test(l))verdict.postStop=l.replace(/^POST_STOP:\s*/i,'');
      else if(/^BEAT:/i.test(l))verdict.beat=l.replace(/^BEAT:\s*/i,'');
      else if(/^MEET:/i.test(l))verdict.meet=l.replace(/^MEET:\s*/i,'');
      else if(/^MISS:/i.test(l))verdict.miss=l.replace(/^MISS:\s*/i,'');
    });
    if(!verdict.decision)verdict.reason=text; // fallback

    positions[idx].earningsVerdict=verdict;
    DB.set('positions',positions);

    // Re-render checklist
    if(el){
      var tmp=document.createElement('div');
      tmp.innerHTML=buildEarningsChecklist(positions[idx],idx);
      el.parentNode.replaceChild(tmp.firstChild,el);
    }
  }catch(e){
    if(btn){btn.textContent='Could not connect — try again';btn.disabled=false;}
  }
}


function posWarren(pos){
  var pnlPct=(pos.currentPrice-pos.avgCost)/pos.avgCost*100;
  var stop=pos.stopLoss||pos.avgCost*.85;
  var target=pos.target||pos.avgCost*1.35;
  var add=pos.addLevel;
  var distStop=(pos.currentPrice-stop)/pos.currentPrice*100;
  var distTarget=(target-pos.currentPrice)/pos.currentPrice*100;
  if(pos.currentPrice<=stop)return'<b>Stop hit.</b> This is not a decision — it\'s a rule. Sell now.';
  if(distStop<3)return'<b>'+distStop.toFixed(1)+'% from stop.</b> Do not move it lower. The thesis either holds or it doesn\'t — decide now.';
  if(pnlPct>50&&distTarget<8)return'Up <b>'+pnlPct.toFixed(0)+'%</b> and near target. Take at least half off. You cannot go broke taking profits.';
  if(pnlPct>30)return'Up <b>'+pnlPct.toFixed(0)+'%.</b> Raise your stop to protect at least '+Math.round(pnlPct*.6)+'% of the gain. Never let a winner turn into a loser.';
  if(add&&Math.abs(pos.currentPrice-add)/add<.02)return'At your add level of <b>$'+Number(add).toFixed(2)+'.</b> Is the thesis still intact? If yes, add. If anything changed, do not.';
  if(pnlPct<-15)return'Down <b>'+Math.abs(pnlPct).toFixed(0)+'%.</b> Has the thesis changed? If not, hold to the stop. If yes, exit now — don\'t wait.';
  return'<b>$'+Number(pos.currentPrice).toFixed(2)+'</b> — '+distTarget.toFixed(0)+'% to target. No action unless the thesis changes.';
}

function renderPosWatchlist(){
  var el=document.getElementById('watchList');
  if(!watchlist.length){
    el.innerHTML='<div class="empty"><span class="empty-icon">👀</span><div class="empty-title">Watchlist is empty</div><div class="empty-sub">Stocks you\'re tracking but haven\'t entered yet. Add them here with your planned entry and why.</div><button class="btn btn-blue" onclick="openSheet(\'watch-add\')">+ Add to watchlist</button></div>';
    return;
  }
  el.innerHTML='<div style="margin-bottom:10px;display:flex;justify-content:flex-end"><button class="btn btn-ghost btn-sm" onclick="openSheet(\'watch-add\')">+ Add to watchlist</button></div>'+
    watchlist.map(function(w,idx){
      return'<div class="watch-item">'+
        '<div class="watch-ticker-block"><div class="watch-ticker">'+esc(w.ticker)+'</div><div class="watch-name">'+esc(w.name||'')+'</div></div>'+
        '<div class="watch-thesis">'+esc(w.thesis||'No thesis added')+'</div>'+
        '<div class="watch-entry">'+
          (w.entryPrice?'<div class="watch-entry-label">Entry at</div><div class="watch-entry-price">$'+Number(w.entryPrice).toFixed(2)+'</div>':'<div style="font-size:12px;color:var(--t3)">No entry set</div>')+
        '</div>'+
        '<div style="display:flex;gap:6px;flex-shrink:0">'+
          '<button class="btn btn-blue btn-sm" onclick="moveToPosition('+idx+')" title="Add as position">Buy →</button>'+
          '<button class="btn btn-ghost btn-sm" onclick="removeWatch('+idx+')" title="Remove">✕</button>'+
        '</div>'+
      '</div>';
    }).join('');
}

async function refreshPosPrice(idx){
  var pos=positions[idx];
  var btn=document.getElementById('pos-refresh-'+idx);
  var warrenEl=document.getElementById('pos-warren-'+idx);
  if(btn){btn.textContent='Fetching...';btn.disabled=true;}
  try{
    var pricePrompt='Fetch https://finance.yahoo.com/quote/'+pos.ticker+' and return ONLY a JSON object with no other text:\n{"price":123.45,"change_pct":"+1.23%","volume":"12.4M","avg_volume":"9.8M","vol_multiple":1.27}\nvol_multiple = today volume divided by 50-day average volume as a decimal.\nUse actual real-time data. JSON only, nothing else.';
    var resp=await fetch(RAILWAY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-5',max_tokens:400,messages:[{role:'user',content:pricePrompt}],"tools":[{"type":"web_search_20250305","name":"web_search"}]})});
    var data=await resp.json();
    var blocks=(data.content||[]).filter(function(b){return b.type==='text';});
    var text=blocks[blocks.length-1]&&blocks[blocks.length-1].text||'';
    var priceData={};
    try{var m=text.match(/\{[\s\S]*?\}/);if(m)priceData=JSON.parse(m[0]);}catch(e){}
    var newPrice=priceData.price;
    if(!newPrice){var m2=text.match(/\$?([\d,]+\.[\d]{2})/);if(m2)newPrice=parseFloat(m2[1].replace(',',''));}
    if(newPrice&&!isNaN(newPrice)&&newPrice>0){
      positions[idx].currentPrice=newPrice;
      positions[idx].lastRefreshed=new Date().toISOString();
      if(priceData.vol_multiple)positions[idx].lastVolMultiple=priceData.vol_multiple;
      DB.set('positions',positions);
      var pnlPct=((newPrice-pos.avgCost)/pos.avgCost*100).toFixed(1);
      var stop=pos.stopLoss||pos.avgCost*.85;
      var distStop=((newPrice-stop)/newPrice*100).toFixed(1);
      var volMultiple=priceData.vol_multiple||null;
      var volContext=volMultiple
        ?(volMultiple>=2?'Volume is '+volMultiple.toFixed(1)+'x average — high volume, significant move. '
          :volMultiple>=1.5?'Volume is '+volMultiple.toFixed(1)+'x average — above average, worth watching. '
          :volMultiple<=0.5?'Volume is '+volMultiple.toFixed(1)+'x average — very light, no conviction behind this move. '
          :'Volume is '+volMultiple.toFixed(1)+'x average — roughly normal. ')
        :'';
      var warrenPrompt='You are Warren. $50M own money, no disclaimers.\n\nPosition: '+pos.ticker+(pos.name?' ('+pos.name+')':'')+'\nCurrent: $'+newPrice+(priceData.change_pct?' ('+priceData.change_pct+' today)':'')+' | P&L: '+pnlPct+'%\nAvg cost: $'+pos.avgCost+(pos.stopLoss?' | Stop: $'+pos.stopLoss+' ('+distStop+'% away)':'')+' | '+(pos.target?'Target: $'+pos.target:'no target set')+'\n'+volContext+(pos.breakoutLevel?'Breakout level to watch: $'+pos.breakoutLevel+'. Has price closed above this on high volume?\n':'')+buildRegimeContext()+'\nIn ONE sentence: what should I do right now? Hold / add / take profit / raise stop / sell. Reference the price and volume. If within 3% of stop say URGENT.';
      var wr=await fetch(RAILWAY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-5',max_tokens:250,messages:[{role:'user',content:warrenPrompt}]})});
      var wd=await wr.json();
      var wblocks=(wd.content||[]).filter(function(b){return b.type==='text';});
      var warrenText=wblocks[wblocks.length-1]&&wblocks[wblocks.length-1].text||posWarren(positions[idx]);
      if(warrenEl)warrenEl.innerHTML='<div style="font-size:10px;color:var(--t3);margin-bottom:4px">Refreshed '+new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})+(priceData.change_pct?' · '+priceData.change_pct+' today':'')+'</div>'+warrenText;
      renderPositions();
    } else {
      if(warrenEl)warrenEl.innerHTML='<span style="color:var(--red);font-size:13px">Could not fetch price — try again in a moment.</span>';
      if(btn){btn.textContent='↻ Refresh price';btn.disabled=false;}
    }
  }catch(e){
    if(warrenEl)warrenEl.innerHTML='<span style="color:var(--red);font-size:13px">Could not connect.</span>';
    if(btn){btn.textContent='↻ Refresh price';btn.disabled=false;}
  }
}

async function refreshAllPrices(){
  var btn=document.getElementById('refreshAllBtn');
  if(btn){btn.textContent='Refreshing all...';btn.disabled=true;}
  for(var i=0;i<positions.length;i++){
    await refreshPosPrice(i);
    if(i<positions.length-1)await new Promise(function(r){setTimeout(r,2000);});
  }
  if(btn){btn.textContent='↻ Refresh all prices';btn.disabled=false;}
  updateWarren('positions');
}

function editPos(idx){editIdx=idx;var p=positions[idx];openSheet('pos-add',p);}
function closePos(idx){if(confirm('Close position in '+positions[idx].ticker+'? This removes it from tracking.')){positions.splice(idx,1);DB.set('positions',positions);renderPositions();updateBadges();updateWarren('positions');}}
function removeWatch(idx){watchlist.splice(idx,1);DB.set('watchlist',watchlist);renderPosWatchlist();}
function moveToPosition(idx){var w=watchlist[idx];openSheet('pos-manual',{ticker:w.ticker,name:w.name,avgCost:w.entryPrice,thesis:w.thesis});}

// ── PORTFOLIO ──
function renderPortfolio(){
  var el=document.getElementById('portContent');
  var posVal=positions.reduce(function(a,p){return a+p.shares*p.currentPrice;},0);
  var posCost=positions.reduce(function(a,p){return a+p.shares*p.avgCost;},0);
  var pnl=posVal-posCost;
  var isGain=pnl>=0;
  el.innerHTML=
    '<div class="port-num">'+(posVal>0?'$'+Math.round(posVal).toLocaleString():'$0')+'</div>'+
    '<div style="font-size:15px;font-weight:500;'+(isGain?'color:var(--green)':'color:var(--red)')+';margin-bottom:20px;font-variant-numeric:tabular-nums">'+(posVal>0?(isGain?'+':'')+'$'+Math.abs(Math.round(pnl)).toLocaleString()+' total P&L':'Add positions to see your total')+'</div>'+
    (positions.length?
      '<div class="card"><div class="card-title">Position trades</div>'+
        positions.map(function(p){
          var pnlPct=(p.currentPrice-p.avgCost)/p.avgCost*100;
          var isG=pnlPct>=0;
          return'<div class="stock-row"><div><div style="font-weight:600">'+esc(p.ticker)+'</div><div style="font-size:12px;color:var(--t3)">Stop: $'+(p.stopLoss?Number(p.stopLoss).toFixed(2):'not set')+' · Target: $'+(p.target?Number(p.target).toFixed(2):'not set')+'</div></div><div style="text-align:right"><div style="font-weight:600;'+(isG?'color:var(--green)':'color:var(--red)')+';font-variant-numeric:tabular-nums">'+(isG?'+':'')+pnlPct.toFixed(1)+'%</div><div style="font-size:12px;color:var(--t3);">$'+Math.round(p.shares*p.currentPrice).toLocaleString()+'</div></div></div>';
        }).join('')+
      '</div>':'');
}

// ── TRADE BUILDER ──
function checkVolume(){
  var relVol=parseFloat(document.getElementById('tb-relvol').value)||null;
  var out=document.getElementById('volCheckResult');
  if(!relVol){out.style.display='none';return;}
  out.style.display='block';
  var isStrong=relVol>=2;
  var isGood=relVol>=1.5;
  var isWeak=relVol<1;
  var isVeryWeak=relVol<0.7;
  var color=isStrong?'var(--green)':isGood?'var(--amber)':isWeak?'var(--red)':'var(--t2)';
  var bg=isStrong?'var(--green-bg)':isGood?'var(--amber-bg)':isWeak?'var(--red-bg)':'var(--bg)';
  var border=isStrong?'var(--green)':isGood?'var(--amber)':isWeak?'var(--red)':'var(--border2)';
  var label=isStrong?'Strong volume confirmation — enter'
    :isGood?'Acceptable volume — entry possible, watch for acceleration'
    :isVeryWeak?'Very low volume — do not enter at pivot. Wait for breakout or higher volume day.'
    :'Below average volume — caution. Drift entry is risky. Wait for volume to pick up.';
  var detail=isStrong?'2x+ average volume means institutional participation. This is exactly what you want to see at a pivot entry. High conviction.'
    :isGood?'Volume is above average but not exceptional. The move has some backing. Acceptable for a pivot entry if price action is clean, but be ready to exit fast if it fades.'
    :isVeryWeak?'Under 0.7x average. Someone is drifting the price up on almost no activity. This is the trap — price reaches your level but nobody is actually buying. Skip this entry and wait for the breakout at resistance on real volume instead.'
    :'Volume is below average. A pivot entry here is lower probability. The move lacks institutional conviction. Either wait for volume to build today, or wait for the full breakout.';
  out.innerHTML='<div style="background:'+bg+';border-radius:var(--r3);padding:10px 12px;border-left:3px solid '+border+'">'+
    '<div style="font-size:12px;font-weight:700;color:'+color+';margin-bottom:4px">'+relVol.toFixed(1)+'x relative volume — '+label+'</div>'+
    '<div style="font-size:12px;color:var(--t2);line-height:1.55">'+detail+'</div>'+
  '</div>';
}

var TIER_CRITERIA={
  standard:{
    pct:2,
    label:'Standard — 2% risk',
    color:'var(--blue)',
    bg:'var(--blue-bg)',
    border:'var(--blue)',
    description:'Default for all trades. Good setup, thesis confirmed, volume acceptable.',
    criteria:[
      'Stage 2 or 3 setup',
      'Market regime not in confirmed downtrend',
      'Volume at or above average at entry',
      'R/R at least 2:1',
      'Position in a sector that is neutral or leading'
    ]
  },
  high:{
    pct:3.5,
    label:'High conviction — 3.5% risk',
    color:'var(--green)',
    bg:'var(--green-bg)',
    border:'var(--green)',
    description:'Reserved for setups where every major factor aligns simultaneously.',
    criteria:[
      'Stage 3 setup — base is mature and tight',
      'Market regime is confirmed uptrend (SPY above 50-day and 200-day MA)',
      'Stock is in the single best performing sector this week',
      'Volume confirmed at 2x+ average at entry (not just 1.5x)',
      'Warren verdict is Strong Buy',
      'R/R at least 3:1',
      'Earnings are more than 4 weeks away (no binary risk near entry)'
    ]
  },
  max:{
    pct:5,
    label:'Maximum conviction — 5% risk',
    color:'var(--purple)',
    bg:'#f5f0ff',
    border:'var(--purple)',
    description:'Rare — used only when every criterion below is met. Minervini uses this tier 3-4 times per year maximum.',
    criteria:[
      'All High conviction criteria met',
      'Insider buying confirmed on OpenInsider in last 30 days',
      'Multiple analyst upgrades or raised price targets in last 2 weeks',
      'Stock has beaten earnings 3+ consecutive quarters',
      'Sector is the single best performer over both 1 week and 1 month',
      'VIX below 18 — market is calm and risk-on'
    ]
  }
};

function setTier(tier){
  var t=TIER_CRITERIA[tier];
  if(!t)return;
  // Update hidden input
  document.getElementById('tb-risk').value=t.pct;
  // Update button styles
  ['standard','high','max'].forEach(function(k){
    var btn=document.getElementById('tier-'+k);
    var isActive=k===tier;
    var tc=TIER_CRITERIA[k];
    btn.style.border='1.5px solid '+(isActive?tc.color:'var(--border2)');
    btn.style.background=isActive?tc.bg:'var(--surface)';
    btn.style.color=isActive?tc.color:'var(--t3)';
  });
  // Show criteria
  var box=document.getElementById('tierCriteriaBox');
  box.style.display='block';
  box.style.borderColor=t.border;
  box.innerHTML=
    '<div style="font-size:11px;font-weight:700;color:'+t.color+';text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">'+t.label+'</div>'+
    '<div style="font-size:12px;color:var(--t2);margin-bottom:7px">'+t.description+'</div>'+
    '<div style="font-size:11px;font-weight:600;color:var(--t3);margin-bottom:4px;text-transform:uppercase;letter-spacing:.3px">All of these must be true:</div>'+
    t.criteria.map(function(c){
      return'<div style="display:flex;gap:6px;align-items:flex-start;margin-bottom:3px"><span style="color:'+t.color+';flex-shrink:0">✓</span><span>'+c+'</span></div>';
    }).join('');
}

async function calcRR(){
  var ticker=document.getElementById('tb-ticker').value.trim();
  var dir=document.getElementById('tb-dir').value;
  var entry=parseFloat(document.getElementById('tb-entry').value);
  var stop=parseFloat(document.getElementById('tb-stop').value);
  var target=parseFloat(document.getElementById('tb-target').value);
  var port=parseFloat(document.getElementById('tb-port').value);
  var riskPct=parseFloat(document.getElementById('tb-risk').value)||2;
  var thesis=document.getElementById('tb-thesis').value.trim();
  var relVol=parseFloat(document.getElementById('tb-relvol').value)||null;
  var volContext=relVol?('Current relative volume: '+relVol.toFixed(1)+'x average. '+(relVol>=2?'Strong institutional volume — confirms entry.':relVol>=1.5?'Above average — acceptable entry volume.':relVol<0.7?'Very low volume — pivot entry is risky here, lean toward waiting for the breakout.':'Below average — caution on pivot entry.')):'No volume data provided.';
  if(!entry||!stop||!target){alert('Entry, stop, and target are required.');return;}
  var riskPS=Math.abs(entry-stop);
  var rewardPS=Math.abs(target-entry);
  var rr=rewardPS/riskPS;
  var maxRisk=port?port*(riskPct/100):null;
  var maxShares=maxRisk?Math.floor(maxRisk/riskPS):null;
  var posSize=maxShares?maxShares*entry:null;
  var posPct=port&&posSize?posSize/port*100:null;
  var rrMinimum=2.0;var rrIdeal=3.0;var good=rr>=2;
  var rrColor=rr>=3?'var(--green)':rr>=2?'var(--amber)':'var(--red)';
  var trkPct=Math.min(92,Math.max(5,(entry-Math.min(stop,target))/Math.abs(target-stop)*100));
  // Build IBKR order instructions
  var ibkrOrders='';
  if(ticker&&entry&&stop&&maxShares){
    var pivotShares=Math.floor(maxShares/2);
    var breakoutShares=maxShares-pivotShares;
    ibkrOrders=
      '<div style="background:var(--bg);border-radius:var(--r3);padding:14px;margin-top:14px;border:1px solid var(--border2)">'+
        '<div style="font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">IBKR order instructions</div>'+
        '<div style="font-size:12px;color:var(--t3);margin-bottom:10px">Copy these into IBKR exactly. Place them in this order.</div>'+
        // Order 1 — pivot entry
        '<div style="background:var(--blue-bg);border-radius:var(--r4);padding:10px 12px;margin-bottom:8px">'+
          '<div style="font-size:10px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Order 1 — Pivot entry (half size, on volume confirmation)</div>'+
          '<div class="ibkr-order" style="font-family:var(--mono,monospace);font-size:13px;color:var(--t1);background:#fff;border-radius:var(--r4);padding:8px 10px;border:1px solid var(--border2);line-height:2;position:relative">'+
            'BUY '+pivotShares.toLocaleString()+' shares '+esc(ticker.toUpperCase())+'<br>'+
            'Order type: LIMIT<br>'+
            'Limit price: $'+entry.toFixed(2)+'<br>'+
            'Time in force: DAY<br>'+
            '<span style="color:var(--t3);font-size:11px">Only place this if relative volume is 1.5x+ when price hits your pivot level</span>'+
            '<button onclick="copyIBKR(this)" style="position:absolute;top:8px;right:8px;padding:4px 10px;background:var(--blue);color:#fff;border:none;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;font-family:var(--sans)">Copy</button>'+
          '</div>'+
        '</div>'+
        // Order 2 — stop loss
        '<div style="background:var(--red-bg);border-radius:var(--r4);padding:10px 12px;margin-bottom:8px">'+
          '<div style="font-size:10px;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Order 2 — Stop loss (place immediately after your buy fills)</div>'+
          '<div class="ibkr-order" style="font-family:var(--mono,monospace);font-size:13px;color:var(--t1);background:#fff;border-radius:var(--r4);padding:8px 10px;border:1px solid var(--border2);line-height:2;position:relative">'+
            'SELL '+pivotShares.toLocaleString()+' shares '+esc(ticker.toUpperCase())+'<br>'+
            'Order type: STOP<br>'+
            'Stop price: $'+stop.toFixed(2)+'<br>'+
            'Time in force: GTC (Good Till Cancelled)<br>'+
            '<span style="color:var(--t3);font-size:11px">GTC means it stays active until triggered or you cancel it — you do not need to re-enter it daily</span>'+
            '<button onclick="copyIBKR(this)" style="position:absolute;top:8px;right:8px;padding:4px 10px;background:var(--red);color:#fff;border:none;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;font-family:var(--sans)">Copy</button>'+
          '</div>'+
        '</div>'+
        // Order 3 — add at breakout
        (breakoutShares>0?
          '<div style="background:var(--green-bg);border-radius:var(--r4);padding:10px 12px;margin-bottom:8px">'+
            '<div style="font-size:10px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Order 3 — Add at breakout (remaining half, on high volume)</div>'+
            '<div class="ibkr-order" style="font-family:var(--mono,monospace);font-size:13px;color:var(--t1);background:#fff;border-radius:var(--r4);padding:8px 10px;border:1px solid var(--border2);line-height:2;position:relative">'+
              'BUY '+breakoutShares.toLocaleString()+' shares '+esc(ticker.toUpperCase())+'<br>'+
              'Order type: STOP LIMIT<br>'+
              'Stop trigger: $'+target.toFixed(2)+'<br>'+
              'Limit price: $'+(target+riskPS*0.3).toFixed(2)+'<br>'+
              'Time in force: DAY<br>'+
              '<span style="color:var(--t3);font-size:11px">Replace the stop trigger with your actual breakout level once Warren identifies it. Only add here if volume is 1.5x+</span>'+
              '<button onclick="copyIBKR(this)" style="position:absolute;top:8px;right:8px;padding:4px 10px;background:var(--green);color:#fff;border:none;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;font-family:var(--sans)">Copy</button>'+
            '</div>'+
          '</div>':'')+ 
        '<div style="font-size:11px;color:var(--t3);line-height:1.6;margin-top:8px">In IBKR: tap the stock → Buy → set the above details. The stop order (Order 2) is the most critical — always place it within seconds of your buy filling.</div>'+
      '</div>';
  }

  el.style.display='block';
  el.innerHTML=
    '<div class="card">'+
      '<div class="row-between" style="margin-bottom:14px">'+
        '<div><div class="rr-big" style="color:'+rrColor+'">'+rr.toFixed(1)+'x</div><div style="font-size:13px;color:var(--t3)">risk / reward ratio</div></div>'+
        '<span class="tag '+(rr>=3?'g':rr>=2?'a':'r')+'" style="font-size:13px">'+(rr>=3?'Strong — 3:1+ (Minervini ideal)':rr>=2?'Acceptable — 2:1 (minimum)':'Skip — below 2:1')+'</span>'+
      '</div>'+
      '<div class="four-col" style="margin-bottom:14px">'+
        '<div class="card-sm"><div style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Risk/share</div><div style="font-size:17px;font-weight:700;color:var(--red);font-variant-numeric:tabular-nums">$'+riskPS.toFixed(2)+'</div></div>'+
        '<div class="card-sm"><div style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Reward/share</div><div style="font-size:17px;font-weight:700;color:var(--green);font-variant-numeric:tabular-nums">$'+rewardPS.toFixed(2)+'</div></div>'+
        (maxShares?'<div class="card-sm"><div style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Max shares</div><div style="font-size:17px;font-weight:700;font-variant-numeric:tabular-nums">'+maxShares.toLocaleString()+'</div></div>':'<div class="card-sm"><div style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Stop</div><div style="font-size:17px;font-weight:700;font-variant-numeric:tabular-nums">$'+stop.toFixed(2)+'</div></div>')+
        (posPct?'<div class="card-sm"><div style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Portfolio</div><div style="font-size:17px;font-weight:700;font-variant-numeric:tabular-nums">'+posPct.toFixed(1)+'%</div></div>':'<div class="card-sm"><div style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Target</div><div style="font-size:17px;font-weight:700;font-variant-numeric:tabular-nums">$'+target.toFixed(2)+'</div></div>')+
      '</div>'+
      '<div class="rr-track"><div class="rr-dot" style="left:'+trkPct+'%"></div></div>'+
      '<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--t3);font-variant-numeric:tabular-nums;margin-bottom:14px"><span>Stop $'+stop.toFixed(2)+'</span><span>Entry $'+entry.toFixed(2)+'</span><span>Target $'+target.toFixed(2)+'</span></div>'+
      ibkrOrders+
      '<div class="warren-box" style="margin-top:14px"><div class="warren-box-title">Warren\'s verdict</div><div class="warren-box-text" id="warrenRR"><div class="loader"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div></div></div>'+
    '</div>';
  try{
    var tierPct=parseFloat(document.getElementById('tb-risk').value)||2;
    var tierKey=tierPct>=5?'max':tierPct>=3?'high':'standard';
    var tierData=TIER_CRITERIA[tierKey];
    var p='You are Warren. $50M own money, 30%+ compounder. Minervini methodology. No disclaimers. Zero hedging. This is about following the right process, not about being safe.\n\n'+
      'Trade: '+(ticker||'?')+' '+(dir==='long'?'long':'short')+' entry $'+entry+' stop $'+stop+' target $'+target+' R/R '+rr.toFixed(1)+'x'+(maxShares?' | max '+maxShares+' shares':'')+'.\n'+(thesis?'Thesis: '+thesis+'\n':'')+(relVol?volContext+'\n':'')+
      '\nInvestor has selected conviction tier: '+tierData.label+' ('+tierPct+'% portfolio risk).\n'+
      'Criteria for this tier:\n'+tierData.criteria.map(function(c){return'- '+c;}).join('\n')+'\n\n'+
      buildRegimeContext()+
      '\nYour job: assess whether the investor has correctly identified the conviction tier based on the actual setup quality. Do not be conservative for the sake of it. The methodology says to size up on exceptional setups and that is what should happen.\n\n'+
      'VERDICT: [Worth taking / Skip]\'\n'+
      'TIER_ASSESSMENT: Does the setup genuinely meet the criteria for '+tierData.label+'? Go through the criteria one by one based on what you know about this setup. Verdict: [Correctly sized / Should be lower tier — Standard 2% / Should be higher tier — consider High conviction]. Be direct. If all criteria are met, confirm the tier. If they are not, say exactly which criteria are missing.\n'+
      'STOP: Is the stop placement correct? One sentence.\n'+
      'ENTRY: Pivot or breakout — which is correct right now? One sentence.\n'+
      'WARREN SAYS: One gut-honest sentence on this trade.\n\n'+
      'No padding. Speak like someone who has $50M of their own money at stake.';
    var r=await fetch(RAILWAY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-5',max_tokens:1000,messages:[{role:'user',content:p}]})});
    var d=await r.json();var tb=d.content&&d.content.find(function(b){return b.type==='text';});
    document.getElementById('warrenRR').textContent=tb?tb.text:'Could not reach Warren.';
  }catch(e){document.getElementById('warrenRR').textContent='Could not connect.';}
}
function clearRR(){
  ['tb-ticker','tb-entry','tb-stop','tb-target','tb-port','tb-thesis','tb-relvol','tb-vol-today','tb-vol-avg'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
  document.getElementById('tb-risk').value='2';
  document.getElementById('rrResult').style.display='none';
  document.getElementById('volCheckResult').style.display='none';
  document.getElementById('tierCriteriaBox').style.display='none';
  setTier('standard');
}

// ── MORNING PULSE ──
async function runAutoPulse(){
  var btn=document.getElementById('autoPulseBtn');
  var out=document.getElementById('autoPulseOut');
  btn.textContent='Fetching...';btn.disabled=true;
  out.style.display='block';
  out.innerHTML=
    '<div class="card">'+
      '<div class="card-title" style="margin-bottom:10px">Fetching your morning briefing...</div>'+
      '<div style="display:grid;gap:8px" id="fetchProgress">'+
        '<div id="fp-prices" style="font-size:13px;color:var(--t3);display:flex;align-items:center;gap:8px"><div class="loader" style="transform:scale(.7)"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div> Refreshing live prices on your positions</div>'+
        '<div id="fp-futures" style="font-size:13px;color:var(--t3);display:flex;align-items:center;gap:8px"><div class="loader" style="transform:scale(.7)"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div> SPY & Nasdaq futures</div>'+
        '<div id="fp-news" style="font-size:13px;color:var(--t3);display:flex;align-items:center;gap:8px"><div class="loader" style="transform:scale(.7)"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div> Overnight news on your positions</div>'+
        '<div id="fp-earnings" style="font-size:13px;color:var(--t3);display:flex;align-items:center;gap:8px"><div class="loader" style="transform:scale(.7)"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div> Today\'s earnings calendar</div>'+
      '</div>'+
    '</div>';

  var today=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  var dayName=new Date().toLocaleDateString('en-GB',{weekday:'long'});
  var todayISO=new Date().toISOString().slice(0,10);
  var mem=getMarketMemory()||{};
  var context={futures:'',news:'',earnings:''};

  // Helper to mark a fetch step done
  function markDone(id,text,ok){
    var el=document.getElementById(id);
    if(el)el.innerHTML=(ok?'<span style="color:var(--green)">✓</span>':'<span style="color:var(--red)">✗</span>')+' <span style="color:var(--t1)">'+text+'</span>';
  }

  // ── PARALLEL FETCHES ──
  var positionTickers=positions.map(function(p){return p.ticker;}).concat(
    watchlist.map(function(w){return w.ticker;})
  ).filter(function(t,i,a){return a.indexOf(t)===i;}).slice(0,8);

  // 0. Refresh live prices on every open position via real FMP quotes — never advise
  // off a stale, manually-entered price when real money and stops are on the line.
  var priceRefreshPromise=(async function(){
    if(!positions.length){markDone('fp-prices','No positions to refresh',true);return;}
    try{
      var tickers=positions.map(function(p){return p.ticker;});
      var r=await fetch(RAILWAY+'/fmp/quote?tickers='+tickers.join(','));
      var d=await r.json();
      var quotes=d.quotes||[];
      var updated=0;
      positions.forEach(function(p){
        var q=quotes.find(function(x){return (x.symbol||'').toUpperCase()===p.ticker.toUpperCase();});
        if(q&&q.price){
          p.currentPrice=q.price;
          p.lastRefreshed=new Date().toISOString();
          p.todayChangePct=(q.changePercentage!==undefined&&q.changePercentage!==null)?q.changePercentage:null;
          updated++;
        }
      });
      if(updated>0)DB.set('positions',positions);
      markDone('fp-prices',updated+' of '+positions.length+' live — '+(positions.length-updated)+' stale',updated===positions.length);
    }catch(e){markDone('fp-prices','Could not refresh live prices — using last saved values',false);}
  })();

  // 1. Futures via Warren web search — no FMP futures data available, so this stays
  // search-based, but is instructed to say "not available" rather than estimate.
  var futuresPromise=fetch(RAILWAY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
    model:'claude-sonnet-5',max_tokens:600,
    messages:[{role:'user',content:'Fetch https://finance.yahoo.com/quote/ES=F and https://finance.yahoo.com/quote/NQ=F and https://finance.yahoo.com/quote/SPY to get premarket/futures data right now. Return ONLY: "S&P futures: [+/-X.X%] at [price]. Nasdaq futures: [+/-X.X%] at [price]. SPY premarket: [+/-X.X%]. Market mood: [Risk-on / Risk-off / Neutral]." If any figure cannot be confirmed from the fetched pages, write "not confirmed" for that figure instead of estimating. Nothing else. Today is '+today+'.'}],
    tools:[{type:'web_search_20250305',name:'web_search'}]
  })}).then(function(r){return r.json();}).then(function(d){
    var blocks=(d.content||[]).filter(function(b){return b.type==='text';});
    var text=blocks[blocks.length-1]&&blocks[blocks.length-1].text||'Futures data unavailable';
    context.futures=text;
    markDone('fp-futures',text,true);
  }).catch(function(){markDone('fp-futures','Could not fetch futures',false);});

  // 2. Overnight news on positions — fetch specific URLs per ticker
  var newsUrls=positionTickers.map(function(t){return'https://finance.yahoo.com/quote/'+t+'/news/';}).join(' and ');
  var newsPromise=positionTickers.length>0?fetch(RAILWAY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
    model:'claude-sonnet-5',max_tokens:1500,
    messages:[{role:'user',content:'Today is '+today+'. Fetch each of these Yahoo Finance news pages and find any news from the last 24 hours:\n'+positionTickers.map(function(t){return'https://finance.yahoo.com/quote/'+t+'/news/';}).join('\n')+'\n\nReturn ONLY one line per ticker: "TICKER: [key news in one sentence, or No significant news overnight]." Be specific about price moves, earnings, contracts, analyst changes. Only state something happened if you can see it on the fetched page — do not infer or guess at news.'}],
    tools:[{type:'web_search_20250305',name:'web_search'}]
  })}).then(function(r){return r.json();}).then(function(d){
    var blocks=(d.content||[]).filter(function(b){return b.type==='text';});
    var text=blocks[blocks.length-1]&&blocks[blocks.length-1].text||'';
    context.news=text;
    markDone('fp-news','News checked for '+positionTickers.length+' stocks',!!text);
  }).catch(function(){markDone('fp-news','Could not fetch news',false);}):
  Promise.resolve(markDone('fp-news','No positions to check',true));

  // 3. Today's earnings — real FMP earnings calendar, zero LLM interpretation needed.
  // This replaces the old web-search guess with an authoritative ticker/date list.
  var earningsPromise=(async function(){
    try{
      var r=await fetch(RAILWAY+'/fmp/earnings-calendar?from='+todayISO+'&to='+todayISO);
      var d=await r.json();
      var list=(d.earnings||[]).filter(function(e){return e.date===todayISO;});
      if(!list.length){
        context.earnings='No major earnings today.';
        markDone('fp-earnings','No earnings today (FMP calendar)',true);
        return;
      }
      var text='Earnings today: '+list.slice(0,10).map(function(e){
        return (e.symbol||'?')+(e.time?' ('+e.time+')':'');
      }).join(', ');
      context.earnings=text;
      markDone('fp-earnings',list.length+' companies reporting today (FMP calendar)',true);
    }catch(e){
      context.earnings='';
      markDone('fp-earnings','Could not fetch earnings calendar',false);
    }
  })();

  // Wait for all fetches
  await Promise.all([priceRefreshPromise,futuresPromise,newsPromise,earningsPromise]);

  // ── WARREN'S BRIEFING ──
  var posCtx=positions.length?'My open positions — live prices refreshed this morning:\n'+positions.map(function(p){
    var pnl=((p.currentPrice-p.avgCost)/p.avgCost*100).toFixed(1);
    var distStop=(p.stopLoss&&p.currentPrice)?(((p.currentPrice-p.stopLoss)/p.currentPrice)*100).toFixed(1):null;
    var todayChange=(p.todayChangePct!==undefined&&p.todayChangePct!==null)?(p.todayChangePct>=0?'+':'')+Number(p.todayChangePct).toFixed(2)+'% today':'today change not confirmed';
    return'- '+p.ticker+': $'+Number(p.currentPrice).toFixed(2)+' ('+todayChange+'), P&L '+(pnl>0?'+':'')+pnl+'%'+
      (p.stopLoss?', stop $'+Number(p.stopLoss).toFixed(2)+(distStop!==null?' ('+distStop+'% away'+(parseFloat(distStop)<4?' — CLOSE':'')+')':''):', no stop set')+
      (p.target?', target $'+Number(p.target).toFixed(2):'');
  }).join('\n'):'No open positions.';

  var extraNotes=document.getElementById('pulseIn').value.trim();

  var briefingPrompt='You are Warren. $50M own money, no disclaimers. Today is '+today+' ('+dayName+'). Speak like money is on the line.\n\n'+
    posCtx+'\n\n'+
    'DATA FETCHED THIS MORNING:\n'+
    'FUTURES: '+( context.futures||'not available')+'\n'+
    'OVERNIGHT NEWS: '+(context.news||'none fetched')+'\n'+
    'EARNINGS TODAY: '+(context.earnings||'none')+'\n'+
    (extraNotes?'ADDITIONAL NOTES FROM INVESTOR: '+extraNotes+'\n':'')+
    '\nGive me my morning briefing in three sections. Use the exact live prices and stop distances given above — do not re-derive, round, or estimate them.\n\n'+
    'MARKET TODAY: Futures direction and what it means for today. Reference the saved market regime (\''+(mem.regime||'not yet assessed — run Market Conditions on Discovery first')+'\') — do not re-assess the regime, just apply it. If regime is Transitioning or Downtrend, say explicitly that new position entries should be sized conservatively or avoided. If futures are down more than 1%, flag it clearly.\n\n'+
    'MY POSITIONS: Go through each position I hold. For each one — given the overnight news and earnings — what should I do today? Hold / adjust stop / take profit / exit / add. Be specific with prices, using the exact live price and stop distance given above. If a position is within 4% of its stop, flag it as urgent regardless of other news. If nothing has changed, say "no action."\n\n'+
    'WATCH TODAY: The one specific thing to monitor today. A price level, a news event, a catalyst. One sentence.\n\n'+
    'Be direct. No padding. Talk like you are advising someone with real money at stake right now.';

  var briefingResp=await fetch(RAILWAY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
    model:'claude-sonnet-5',max_tokens:1500,
    messages:[{role:'user',content:briefingPrompt}]
  })});
  var bd=await briefingResp.json();
  var bblocks=(bd.content||[]).filter(function(b){return b.type==='text';});
  var briefingText=bblocks[bblocks.length-1]&&bblocks[bblocks.length-1].text||'Could not generate briefing.';

  // ── RENDER ──
  out.innerHTML=
    '<div class="card">'+
      '<div class="row-between" style="margin-bottom:14px">'+
        '<div style="font-size:15px;font-weight:700;letter-spacing:-.3px">Morning briefing — '+dayName+'</div>'+
        '<div style="font-size:12px;color:var(--t3)">'+new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})+'</div>'+
      '</div>'+
      // Context cards — compact summary of what was fetched
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">'+
        (context.futures?'<div class="inset"><div style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Futures</div><div style="font-size:12px;color:var(--t1)">'+esc(context.futures)+'</div></div>':'')+
        (context.earnings?'<div class="inset"><div style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Earnings today</div><div style="font-size:12px;color:var(--t1)">'+esc(context.earnings)+'</div></div>':'')+
      '</div>'+
      // Warren's briefing
      briefingText.split(/\n\n(?=[A-Z]{2,}[\s:])/m).filter(Boolean).map(function(section){
        var isMarket=/^MARKET TODAY/i.test(section.trim());
        var isPositions=/^MY POSITIONS/i.test(section.trim());
        var isWatch=/^WATCH TODAY/i.test(section.trim());
        var bg=isMarket?'var(--blue-bg)':isPositions?'var(--bg)':isWatch?'var(--amber-bg)':'var(--bg)';
        var border=isMarket?'var(--blue)':isPositions?'var(--border2)':isWatch?'var(--amber)':'var(--border2)';
        var parts=section.split('\n').filter(Boolean);
        return'<div style="background:'+bg+';border-radius:var(--r3);padding:12px 14px;margin-bottom:8px;border-left:3px solid '+border+'">'+
          parts.map(function(p,i){
            return'<div style="font-size:'+(i===0?'11px':'13px')+';font-weight:'+(i===0?'700':'400')+';color:'+(i===0?'var(--t3)':'var(--t1)')+';'+(i===0?'text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;':'')+' line-height:1.65">'+esc(p)+'</div>';
          }).join('')+
        '</div>';
      }).join('')+
    '</div>';

  btn.textContent='▶ Run now';btn.disabled=false;
}

async function runPulse(){
  var raw=document.getElementById('pulseIn').value.trim();
  if(!raw){alert('Paste what happened overnight first.');return;}
  var out=document.getElementById('pulseOut');out.style.display='block';
  out.innerHTML='<div class="loader"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div>';
  var posCtx=[
    positions.length?'Position trades: '+positions.map(function(p){return p.ticker+' ('+(((p.currentPrice-p.avgCost)/p.avgCost*100)>0?'+':'')+((p.currentPrice-p.avgCost)/p.avgCost*100).toFixed(1)+'%, stop $'+(p.stopLoss?Number(p.stopLoss).toFixed(2):'none')+')';}).join('; '):''
  ].filter(Boolean).join('\n')||'No current positions.';
  try{
    var p='You are Warren. $50M own money, no disclaimers. Money is on the line.\n\n'+posCtx+'\n\nOvernight:\n'+raw+'\n\nThree sections:\nWHAT MATTERS: one or two things that actually move the needle.\nMY POSITIONS: each one — do nothing / adjust stop / take profit / add / exit.\nTODAY: one specific thing to watch.\nDirect, plain prose, no padding.';
    var r=await fetch(RAILWAY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-5',max_tokens:1200,messages:[{role:'user',content:p}]})});
    var d=await r.json();var tb=d.content&&d.content.find(function(b){return b.type==='text';});
    var text=tb?tb.text:'';
    out.innerHTML=text.split('\n\n').filter(Boolean).map(function(para){
      var head=/^(WHAT MATTERS|MY POSITIONS|TODAY)/i.test(para.trim());
      return head?'<div class="pulse-head">'+esc(para)+'</div>':'<p class="pulse-p">'+esc(para)+'</p>';
    }).join('');
  }catch(e){out.innerHTML='<p class="pulse-p" style="color:var(--red)">Could not connect.</p>';}
}
function clearPulse(){document.getElementById('pulseIn').value='';document.getElementById('pulseOut').innerHTML='';document.getElementById('pulseOut').style.display='none';}

// ── SHEET SYSTEM ──

// ── WARREN-FIRST ANALYSIS SHEETS ──

// Warren analyses a stock for position trading (weeks-months)
var sheetForms={
  'warren-pos':function(){
    document.getElementById('sheetTitle').textContent='Ask Warren — Position Trade';
    return'<div class="inset" style="margin-bottom:14px;font-size:13px;color:var(--t2);line-height:1.55">Warren will research this stock, tell you if it\'s worth a position trade, and give you specific buy levels, stop, and target. You decide whether to take it.</div>'+
      '<div class="fg"><label class="fl">Stock name or ticker</label><input class="fi" id="f-ticker" placeholder="e.g. VOYG, SpaceX, Apple, Nvidia..." style="font-size:16px;padding:12px 14px" oninput="this.value=this.value.toUpperCase()"></div>'+
      '<div class="fg"><label class="fl">Anything specific you want Warren to focus on? (optional)</label><textarea class="fi fi-ta" id="f-context" placeholder="e.g. I saw they just won a big defense contract. Is that a reason to buy?\nOr: I\'ve been watching this for a while, do you think now is a good time?\nOr just leave blank — Warren will figure it out."></textarea></div>'+
      '<div class="btn-row"><button class="btn btn-blue" id="warren-pos-btn" onclick="runWarrenPos()" style="flex:1;padding:12px">Ask Warren</button><button class="btn btn-ghost" onclick="closeSheet()">Cancel</button></div>'+
      '<div id="warren-pos-result" style="margin-top:14px"></div>';
  },
  'pos-manual':function(prefill){
    document.getElementById('sheetTitle').textContent='Add position manually';
    var p=prefill||{};
    return'<div class="three-col" style="margin-bottom:12px">'+
      '<div class="fg"><label class="fl">Ticker</label><input class="fi" id="f-ticker" placeholder="VOYG" oninput="this.value=this.value.toUpperCase()" value="'+esc(p.ticker||'')+'"></div>'+
      '<div class="fg"><label class="fl">Shares</label><input class="fi" id="f-shares" placeholder="500" type="number" value="'+esc(p.shares||'')+'"></div>'+
      '<div class="fg"><label class="fl">Avg cost ($)</label><input class="fi" id="f-cost" placeholder="22.50" type="number" value="'+esc(p.avgCost||'')+'"></div></div>'+
      '<div class="three-col" style="margin-bottom:12px">'+
      '<div class="fg"><label class="fl">Current price ($)</label><input class="fi" id="f-price" placeholder="25.40" type="number" value="'+esc(p.currentPrice||'')+'"></div>'+
      '<div class="fg"><label class="fl">Stop loss ($)</label><input class="fi" id="f-stop" placeholder="19.00" type="number" value="'+esc(p.stopLoss||'')+'"></div>'+
      '<div class="fg"><label class="fl">Target ($)</label><input class="fi" id="f-target" placeholder="38.00" type="number" value="'+esc(p.target||'')+'"></div></div>'+
      '<div class="two-col" style="margin-bottom:12px">'+
      '<div class="fg"><label class="fl">Pivot point ($) <span style="color:var(--blue);font-size:10px">— optimal early entry level</span></label><input class="fi" id="f-pivot" placeholder="e.g. 25.20" type="number" value="'+esc(p.pivotPoint||'')+'"></div>'+
      '<div class="fg"><label class="fl">Breakout level ($) <span style="color:var(--t3);font-size:10px">— resistance to break above</span></label><input class="fi" id="f-breakout" placeholder="e.g. 26.50" type="number" value="'+esc(p.breakoutLevel||'')+'"></div></div>'+
      '<div class="two-col" style="margin-bottom:12px">'+
      '<div class="fg"><label class="fl">Next earnings date <span style="color:var(--amber);font-size:10px">— activates pre-earnings checklist within 7 days</span></label><input class="fi" id="f-earnings-date" type="date" value="'+esc(p.earningsDate||'')+'"></div>'+
      '<div class="fg"><label class="fl">Add more at ($)</label><input class="fi" id="f-add" placeholder="21.00" type="number" value="'+esc(p.addLevel||'')+'"></div></div>'+
      '<div class="two-col" style="margin-bottom:12px">'+
      '<div class="fg"><label class="fl">Next earnings date <span style="color:var(--amber);font-size:10px">— triggers pre-earnings checklist</span></label><input class="fi" id="f-earnings-date" type="date" value="'+esc(p.earningsDate||'')+'"></div>'+
      '<div class="fg"><label class="fl">Add more at ($)</label><input class="fi" id="f-add" placeholder="21.00" type="number" value="'+esc(p.addLevel||'')+'"></div></div>'+
      '<div class="fg"><label class="fl">Company name</label><input class="fi" id="f-name" placeholder="Voyager Technologies" value="'+esc(p.name||'')+'"></div>'+
      '<div class="fg"><label class="fl">Sector</label><select class="fi fi-sel" id="f-sector"><option>Technology</option><option>Space</option><option>Defense</option><option>Energy</option><option>Healthcare</option><option>Finance</option><option>Consumer</option><option>Industrial</option><option>Other</option></select></div>'+
      '<div class="fg"><label class="fl">Your thesis</label><textarea class="fi fi-ta" id="f-thesis" placeholder="Why did you buy this?">'+esc(p.thesis||'')+'</textarea></div>'+
      '<div class="btn-row"><button class="btn btn-blue" onclick="savePos()" style="flex:1">Save</button><button class="btn btn-ghost" onclick="closeSheet()">Cancel</button></div>';
  },
  'wl-detail':function(candidate){
    var c=candidate||{};
    document.getElementById('sheetTitle').textContent=esc(c.ticker||'')+' — SEPA Gate Analysis';
    var parsed=parseGateAnalysis(c.analysis||'');
    var vc=verdictColor(c.verdict);
    var vbg=/GO/i.test(c.verdict||'')?'var(--green-bg)':/CAUTION|WAIT/i.test(c.verdict||'')?'var(--amber-bg)':/SKIP|STOP/i.test(c.verdict||'')?'var(--red-bg)':'var(--bg)';
    return(c.verdict?
        '<div style="background:'+vbg+';border-radius:var(--r2);padding:14px 16px;margin-bottom:14px;border:1.5px solid '+vc+'">'+
          '<div style="font-size:11px;font-weight:700;color:'+vc+';text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Gate verdict</div>'+
          '<div style="font-size:20px;font-weight:800;color:'+vc+';margin-bottom:'+(parsed.summary?'6px':'0')+'">'+esc(c.verdict)+'</div>'+
          (parsed.summary?'<div style="font-size:13px;color:var(--t1);line-height:1.6">'+esc(parsed.summary)+'</div>':'')+
        '</div>':'')+
      gateBoxesHtml(parsed)+
      (c.analysedAt?'<div style="font-size:11px;color:var(--t3);margin:10px 0 4px">Analysed '+esc(c.analysedAt)+'</div>':'')+
      '<div class="btn-row" style="margin-top:10px">'+
        '<button class="btn btn-blue" onclick="closeSheet();runWatchlistAnalysis(\''+c.ticker+'\')" style="flex:1">Re-analyse</button>'+
        '<button class="btn btn-ghost" onclick="clearWatchlistAnalysis(\''+c.ticker+'\');closeSheet();">Clear</button>'+
        '<button class="btn btn-ghost" onclick="closeSheet()">Close</button>'+
      '</div>';
  }
};

// ── FMP STOCK DATA — feeds real numbers into Warren's SEPA analysis ──
// Replaces ad-hoc web-fetch-and-hope-the-LLM-does-arithmetic with actual
// FMP data, computed deterministically here in JS.

async function fetchFmpStock(ticker){
  try{
    var r=await fetch(RAILWAY+'/fmp/stock/'+ticker.toUpperCase());
    var d=await r.json();
    if(!d||!d.quote||!d.quote.price)return null; // no usable data — caller falls back to web-fetch prompt
    return d;
  }catch(e){return null;}
}

function num(v){var n=parseFloat(v);return isFinite(n)?n:null;}

function pctChange(now,then){
  if(now===null||then===null||!then)return null;
  return ((now-then)/Math.abs(then))*100;
}

// Turn raw FMP quarterly income statements + key metrics into the specific
// numbers Minervini SEPA Gate 4 needs: EPS/sales YoY growth, acceleration, ROE, margin trend.
function computeFmpFundamentals(incomeStatements,keyMetrics){
  var out={epsRecent:null,epsYoyPct:null,revRecent:null,revYoyPct:null,epsTrend:null,epsAccelerating:null,gmRecent:null,gmPrior:null,gmTrend:null,roePct:null};
  if(Array.isArray(incomeStatements)&&incomeStatements.length>0){
    var qs=incomeStatements; // newest first
    var epsOf=function(q){return num(q.eps)!==null?num(q.eps):num(q.epsdiluted);};
    var revOf=function(q){return num(q.revenue);};
    var gmOf=function(q){
      var gpr=num(q.grossProfitRatio);
      if(gpr!==null)return gpr*100;
      var gp=num(q.grossProfit),rev=revOf(q);
      return (gp!==null&&rev)?(gp/rev)*100:null;
    };
    out.epsRecent=epsOf(qs[0]);
    out.epsYoyPct=qs.length>4?pctChange(epsOf(qs[0]),epsOf(qs[4])):null;
    out.revRecent=revOf(qs[0]);
    out.revYoyPct=qs.length>4?pctChange(revOf(qs[0]),revOf(qs[4])):null;
    out.epsTrend=qs.slice(0,4).map(epsOf).reverse(); // oldest→newest of last 4Q
    out.epsAccelerating=out.epsTrend.length===4&&out.epsTrend.every(function(v,i){return i===0||(v!==null&&out.epsTrend[i-1]!==null&&v>=out.epsTrend[i-1]);});
    out.gmRecent=gmOf(qs[0]);
    out.gmPrior=qs.length>1?gmOf(qs[1]):null;
    out.gmTrend=(out.gmRecent!==null&&out.gmPrior!==null)?(out.gmRecent>=out.gmPrior?'Expanding':'Contracting'):null;
    out.nextEarningsFromIncome=qs[0].date||null;
  }
  if(Array.isArray(keyMetrics)&&keyMetrics.length>0){
    var km=keyMetrics[0];
    var roe=num(km.roe);
    out.roePct=roe!==null?(Math.abs(roe)<=2?roe*100:roe):null; // handle ratio vs already-percent
  }
  return out;
}

// Build the weekly/daily candle text blocks Warren uses for VCP base analysis
function formatCandleTable(candles,label,maxRows){
  if(!Array.isArray(candles)||!candles.length)return'';
  var rows=candles.slice(0,maxRows||16);
  var lines=rows.map(function(c){
    var range=(num(c.high)!==null&&num(c.low)!==null)?(c.high-c.low):null;
    var rangePct=(range!==null&&c.close)?(range/c.close*100):null;
    return (c.weekStart||c.date||'?')+': O '+fmtN(c.open)+' H '+fmtN(c.high)+' L '+fmtN(c.low)+' C '+fmtN(c.close)+
      (range!==null?' | range $'+range.toFixed(2)+' ('+rangePct.toFixed(1)+'%)':'')+
      ' | vol '+(c.volume?Math.round(c.volume).toLocaleString():'?');
  });
  return label+' (newest first):\n'+lines.join('\n');
}
function fmtN(v){var n=num(v);return n===null?'?':'$'+n.toFixed(2);}

function daysUntil(dateStr){
  if(!dateStr)return null;
  var d=new Date(dateStr);
  if(isNaN(d.getTime()))return null;
  return Math.round((d.getTime()-Date.now())/86400000);
}

// Assemble the full data block injected into Warren's prompt in place of
// web-fetch instructions for price/volume/MAs/fundamentals/candles.

// ── SWING DETECTION ──
// weekly = array of {weekStart, open, high, low, close, volume}, newest-first (index 0 = current week)
function findSwingPoints(weekly, order){
  order = order || 1;
  var chron = weekly.slice().reverse(); // oldest -> newest
  var swings = [];
  for (var i = order; i < chron.length - order; i++){
    var isHigh = true, isLow = true;
    for (var k = 1; k <= order; k++){
      if (chron[i].high <= chron[i-k].high || chron[i].high <= chron[i+k].high) isHigh = false;
      if (chron[i].low >= chron[i-k].low || chron[i].low >= chron[i+k].low) isLow = false;
    }
    if (isHigh) swings.push({idx:i, type:'high', price:chron[i].high, volume:chron[i].volume||0, weekStart:chron[i].weekStart});
    if (isLow) swings.push({idx:i, type:'low', price:chron[i].low, volume:chron[i].volume||0, weekStart:chron[i].weekStart});
  }
  return {swings:swings, chron:chron};
}

// ── VCP ANALYSIS ──
function analyzeVCP(weekly, currentPrice, yearHigh){
  if (!weekly || weekly.length < 8){
    return {verdict:'insufficient data', reason:'Fewer than 8 weeks of candle history — not enough to analyze a base.'};
  }
  var found = findSwingPoints(weekly, 1);
  var swings = found.swings, chron = found.chron;

  if (swings.length < 2){
    return {verdict:'no base', reason:'No clear swing structure detected in the available history.'};
  }

  var lookbackWeeks = Math.min(30, chron.length);
  var recentStart = chron.length - lookbackWeeks;
  var highSwingsInWindow = swings.filter(function(s){ return s.type==='high' && s.idx>=recentStart && s.idx<=chron.length-3; });

  if (!highSwingsInWindow.length){
    return {verdict:'no base', reason:'No swing high found in the lookback window to anchor a base.'};
  }

  highSwingsInWindow.sort(function(a,b){ return b.price - a.price; });
  var baseStart = highSwingsInWindow[0];

  var priorWindow = 8;
  var priorIdx = Math.max(0, baseStart.idx - priorWindow);
  var priorPrice = chron[priorIdx].close;
  var priorUptrend = baseStart.price > priorPrice * 1.15;

  var baseSwings = swings.filter(function(s){ return s.idx >= baseStart.idx; }).sort(function(a,b){ return a.idx - b.idx; });

  var legs = [];
  for (var i=0; i<baseSwings.length-1; i++){
    if (baseSwings[i].type==='high' && baseSwings[i+1].type==='low'){
      var declinePct = (baseSwings[i].price - baseSwings[i+1].price) / baseSwings[i].price * 100;
      legs.push({highIdx:baseSwings[i].idx, lowIdx:baseSwings[i+1].idx, highPrice:baseSwings[i].price, lowPrice:baseSwings[i+1].price, declinePct:declinePct, weekStart:baseSwings[i].weekStart});
    }
  }

  var lastSwing = baseSwings[baseSwings.length-1];
  if (lastSwing && lastSwing.type==='high'){
    var currentDeclinePct = (lastSwing.price - currentPrice) / lastSwing.price * 100;
    if (currentDeclinePct > 0.5){
      legs.push({highIdx:lastSwing.idx, lowIdx:chron.length-1, highPrice:lastSwing.price, lowPrice:currentPrice, declinePct:currentDeclinePct, weekStart:lastSwing.weekStart, current:true});
    }
  }

  if (legs.length < 2){
    return {verdict:'no base', reason:'Fewer than 2 contraction legs detected since the last major swing high.', baseStartWeek:baseStart.weekStart, priorUptrend:priorUptrend};
  }

  var decreasingCount = 0;
  for (var j=1; j<legs.length; j++){
    if (legs[j].declinePct < legs[j-1].declinePct) decreasingCount++;
  }
  var contractionsOk = decreasingCount >= legs.length - 2;

  var firstLeg = legs[0], lastLeg = legs[legs.length-1];
  var minerviniRatio = firstLeg.declinePct > 0 ? (lastLeg.declinePct / firstLeg.declinePct) : null;

  function avgVolumeInRange(startIdx, endIdx){
    var vols = [];
    for (var k=startIdx; k<=endIdx; k++){ if (chron[k]) vols.push(chron[k].volume||0); }
    return vols.length ? vols.reduce(function(a,b){return a+b;},0)/vols.length : null;
  }
  var firstLegVol = avgVolumeInRange(firstLeg.highIdx, firstLeg.lowIdx);
  var lastLegVol = avgVolumeInRange(lastLeg.highIdx, lastLeg.lowIdx);
  var volumeDryingUp = (firstLegVol && lastLegVol) ? (lastLegVol < firstLegVol) : null;

  var pivot = lastLeg.highPrice;
  var pctOffHigh = yearHigh ? ((yearHigh - currentPrice) / yearHigh * 100) : null;

  var isExtended = pctOffHigh !== null && pctOffHigh < 3 && legs.length < 2;
  var isTight = priorUptrend && contractionsOk && minerviniRatio !== null && minerviniRatio < 0.5 && legs.length >= 2;

  var verdict, reason;
  if (isExtended){
    verdict = 'extended';
    reason = 'Price is within 3% of the 52-week high with no measurable contraction — extended, not a base.';
  } else if (!priorUptrend){
    verdict = 'no base';
    reason = 'No meaningful prior uptrend detected into this base (Minervini requires an advance before the base).';
  } else if (isTight){
    verdict = 'tight VCP';
    reason = legs.length+' contractions, tightening from '+firstLeg.declinePct.toFixed(1)+'% to '+lastLeg.declinePct.toFixed(1)+'% (ratio '+minerviniRatio.toFixed(2)+'), '+(volumeDryingUp?'volume drying up in the tight zone':'volume not confirmed drying up')+'.';
  } else {
    verdict = 'forming — not yet tight';
    reason = 'Base developing but ratio '+(minerviniRatio!==null?minerviniRatio.toFixed(2):'?')+' does not yet meet the < 0.50 requirement, or contractions are not consistently tightening.';
  }

  return {
    verdict:verdict, reason:reason, baseStartWeek:baseStart.weekStart, priorUptrend:priorUptrend,
    legs:legs.map(function(l){return {week:l.weekStart, declinePct:+l.declinePct.toFixed(1)};}),
    minerviniRatio: minerviniRatio!==null ? +minerviniRatio.toFixed(2) : null,
    volumeDryingUp:volumeDryingUp, pivot:+pivot.toFixed(2),
    pctOffHigh: pctOffHigh!==null ? +pctOffHigh.toFixed(1) : null
  };
}

// ── STAGE ANALYSIS ──
function classifyStage(price, ma50, ma150, ma200, sma200Slope, pctChange6m){
  if (price===null || ma150===null || ma200===null){
    return {stage:null, label:'Unknown', reason:'Insufficient MA data to classify stage.'};
  }
  var aboveAll = price>ma50 && price>ma150 && price>ma200;
  var belowAll = price<ma150 && price<ma200;
  var rising = sma200Slope==='Rising';
  var falling = sma200Slope==='Falling';

  if (aboveAll && rising && ma150>ma200){
    return {stage:2, label:'Stage 2 — Advancing', reason:'Price above all key MAs, 200MA rising, 150MA above 200MA.'};
  }
  if (belowAll && falling){
    return {stage:4, label:'Stage 4 — Declining', reason:'Price below key MAs with the 200MA falling.'};
  }
  if (!rising && !falling){
    if (pctChange6m!==null && pctChange6m>25){
      return {stage:3, label:'Stage 3 — Topping', reason:'Strong prior advance ('+pctChange6m.toFixed(0)+'% over 6mo) now flattening — possible topping.'};
    }
    if (pctChange6m!==null && pctChange6m<-10){
      return {stage:1, label:'Stage 1 — Basing', reason:'Prior decline ('+pctChange6m.toFixed(0)+'% over 6mo) now flattening — possible basing.'};
    }
    return {stage:null, label:'Transitional', reason:'200MA flat with no clear prior trend to classify.'};
  }
  return {stage:null, label:'Mixed signals', reason:'MA slope and price position do not cleanly match one stage.'};
}


function buildFmpDataBlock(fmp){
  if(!fmp||!fmp.quote)return null;
  var q=fmp.quote;
  var price=num(q.price);
  var ma50=num(q.priceAvg50);
  var ma150=num(fmp.sma150);
  var ma200=num(q.priceAvg200);
  var yearHigh=num(q.yearHigh);
  var yearLow=num(q.yearLow);
  var pctOffHigh=(price!==null&&yearHigh)?((yearHigh-price)/yearHigh*100):null;
  var pctAboveLow=(price!==null&&yearLow)?((price-yearLow)/yearLow*100):null;
  var pc=fmp.priceChange||{};
  var fund=computeFmpFundamentals(fmp.incomeStatements,fmp.keyMetrics);
  var earningsDate=q.earningsAnnouncement||null;
  var daysToEarnings=daysUntil(earningsDate);

  // Algorithmic VCP and Stage analysis, computed once here and cached on the fmp object
  // so the deterministic gate-enforcement functions can reuse the same result rather
  // than recomputing (and potentially disagreeing with what was shown to the model).
  var vcpAnalysis=analyzeVCP(fmp.weeklyCandles,price,yearHigh);
  var pctChange6m=num(pc['6M']);
  var stageAnalysis=classifyStage(price,ma50,ma150,ma200,fmp.sma200Slope,pctChange6m);
  fmp._vcpAnalysis=vcpAnalysis;
  fmp._stageAnalysis=stageAnalysis;

  var lines=[];
  lines.push('=== FMP DATA (fetched live moments ago — use these exact numbers, do not re-fetch or estimate these) ===');
  lines.push('QUOTE: Price '+fmtN(price)+' | Day change '+(num(q.changePercentage)!==null?num(q.changePercentage).toFixed(2)+'%':'?')+
    ' | Volume '+(q.volume?Math.round(q.volume).toLocaleString():'?')+' (avg '+(q.avgVolume?Math.round(q.avgVolume).toLocaleString():'?')+
    (q.volume&&q.avgVolume?', relvol '+(q.volume/q.avgVolume).toFixed(2)+'x':'')+') | Market cap '+(q.marketCap?'$'+Math.round(q.marketCap).toLocaleString():'?'));
  lines.push('52-WEEK RANGE: '+fmtN(yearLow)+' – '+fmtN(yearHigh)+
    (pctOffHigh!==null?' | '+pctOffHigh.toFixed(1)+'% off the 52-week high (Minervini requires within 25%): '+(pctOffHigh<=25?'YES':'NO'):'')+
    (pctAboveLow!==null?' | '+pctAboveLow.toFixed(1)+'% above the 52-week low (Minervini requires 25%+): '+(pctAboveLow>=25?'YES':'NO'):''));
  lines.push('MOVING AVERAGES: 50MA '+fmtN(ma50)+' | 150MA '+fmtN(ma150)+' | 200MA '+fmtN(ma200)+(fmp.sma200Slope?' | Stock\'s own 200MA slope: '+fmp.sma200Slope+(fmp.sma200TrendMonths!==null&&fmp.sma200TrendMonths!==undefined?' (rising for '+fmp.sma200TrendMonths+(fmp.sma200TrendMonths>=6?'+':'')+' month(s) — Minervini needs 1+, prefers 4-5)':'')+' (Minervini requires this trending up, not just the market\'s 200MA)':' | Stock\'s own 200MA slope: unavailable — verify manually'));
  lines.push('STAGE 2 CHECK (computed — full Minervini Trend Template criteria 1,2,4,5): Price>50MA: '+(price!==null&&ma50!==null?(price>ma50?'YES':'NO'):'?')+
    ' | Price>150MA: '+(price!==null&&ma150!==null?(price>ma150?'YES':'NO'):'? (150MA unavailable — verify manually)')+
    ' | Price>200MA: '+(price!==null&&ma200!==null?(price>ma200?'YES':'NO'):'?')+
    ' | 150MA>200MA: '+(ma150!==null&&ma200!==null?(ma150>ma200?'YES':'NO'):'?')+
    ' | 50MA>150MA: '+(ma50!==null&&ma150!==null?(ma50>ma150?'YES':'NO'):'?')+
    ' | 50MA>200MA: '+(ma50!==null&&ma200!==null?(ma50>ma200?'YES':'NO'):'?')+
    ' | Full Stage 2 structure (all MA ordering correct): '+((price!==null&&ma50!==null&&ma150!==null&&ma200!==null)?((price>ma50&&price>ma150&&price>ma200&&ma150>ma200&&ma50>ma150&&ma50>ma200)?'YES':'NO'):'?'));
  lines.push('STAGE ANALYSIS (computed algorithmically from price/MA structure — use this exact classification, do not re-derive): '+stageAnalysis.label+' — '+stageAnalysis.reason);
  lines.push('VCP ANALYSIS (computed algorithmically from actual weekly candle swings — use this exact verdict and pivot, do not re-derive from scratch): '+vcpAnalysis.verdict.toUpperCase()+
    (vcpAnalysis.pivot?' | Pivot: $'+vcpAnalysis.pivot:'')+
    (vcpAnalysis.minerviniRatio!==null?' | Minervini ratio: '+vcpAnalysis.minerviniRatio:'')+
    ' | '+vcpAnalysis.reason+
    (vcpAnalysis.legs&&vcpAnalysis.legs.length?' | Contraction legs (oldest to newest): '+vcpAnalysis.legs.map(function(l){return l.declinePct+'%';}).join(' → '):''));
  lines.push('PRICE CHANGE: 1M '+(pc['1M']!==undefined?pc['1M']+'%':'?')+' | 3M '+(pc['3M']!==undefined?pc['3M']+'%':'?')+' | 6M '+(pc['6M']!==undefined?pc['6M']+'%':'?')+' | 1Y '+(pc['1Y']!==undefined?pc['1Y']+'%':'?'));
  lines.push('EARNINGS: Next report '+(earningsDate||'unknown — verify manually')+(daysToEarnings!==null?', '+daysToEarnings+' days away':''));
  lines.push('FUNDAMENTALS (from last 8 reported quarters):');
  lines.push('  EPS most recent quarter: '+(fund.epsRecent!==null?'$'+fund.epsRecent.toFixed(2):'?')+' | YoY growth: '+(fund.epsYoyPct!==null?fund.epsYoyPct.toFixed(1)+'%':'unavailable — need 8 quarters'));
  lines.push('  EPS last 4 quarters (oldest→newest): '+(fund.epsTrend?fund.epsTrend.map(function(v){return v!==null?'$'+v.toFixed(2):'?';}).join(' → '):'?')+' | Accelerating: '+(fund.epsAccelerating===true?'YES':fund.epsAccelerating===false?'NO':'?'));
  lines.push('  Revenue most recent quarter: '+(fund.revRecent!==null?'$'+Math.round(fund.revRecent).toLocaleString():'?')+' | YoY growth: '+(fund.revYoyPct!==null?fund.revYoyPct.toFixed(1)+'%':'unavailable'));
  lines.push('  ROE (most recent quarter): '+(fund.roePct!==null?fund.roePct.toFixed(1)+'%':'?'));
  lines.push('  Gross margin: '+(fund.gmRecent!==null?fund.gmRecent.toFixed(1)+'%':'?')+' vs prior quarter '+(fund.gmPrior!==null?fund.gmPrior.toFixed(1)+'%':'?')+' — '+(fund.gmTrend||'?'));
  var weeklyTable=formatCandleTable(fmp.weeklyCandles,'WEEKLY CANDLES — use this for VCP base analysis, do not fetch elsewhere',16);
  if(weeklyTable)lines.push(weeklyTable);
  var dailyTable=formatCandleTable(fmp.dailyCandles,'DAILY CANDLES — use for pivot dial-in and volume confirmation',15);
  if(dailyTable)lines.push(dailyTable);
  lines.push('=== END FMP DATA ===');
  return lines.join('\n');
}

async function runWarrenPos(){
  var ticker=document.getElementById('f-ticker').value.trim().toUpperCase();
  var context=document.getElementById('f-context').value.trim();
  if(!ticker){alert('Enter a stock name or ticker.');return;}
  var btn=document.getElementById('warren-pos-btn');
  var out=document.getElementById('warren-pos-result');
  btn.textContent='Warren is researching...';btn.disabled=true;
  out.innerHTML='<div style="text-align:center;padding:20px 0"><div class="loader"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div><div style="font-size:13px;color:var(--t3);margin-top:10px">Fetching live data on '+esc(ticker)+' from FMP...</div></div>';
  var posCtx=positions.length?'Already holding: '+positions.map(function(p){return p.ticker;}).join(', ')+'.':'No current positions.';
  var mem=getMarketMemory()||{};
  var fmpStock=await fetchFmpStock(ticker);
  var fmpBlock=buildFmpDataBlock(fmpStock);
  var computedRS=getComputedRSRating(fmpStock);
  if(out.innerHTML.indexOf('Fetching live data')!==-1){
    out.innerHTML='<div style="text-align:center;padding:20px 0"><div class="loader"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div><div style="font-size:13px;color:var(--t3);margin-top:10px">'+(fmpBlock?'Got FMP data. Warren is analysing '+esc(ticker)+'...':'FMP data unavailable — Warren is researching '+esc(ticker)+' via web search...')+'</div></div>';
  }
  try{
    var today=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
    var ticker_lower=ticker.toLowerCase();
    var contextHint=(context||'')+' '+ticker;
    var sectorEtfEntry=getSectorEtf(contextHint);
    var sectorEtfLine=sectorEtfEntry
      ?'Fetch https://finance.yahoo.com/quote/'+sectorEtfEntry.etf+' ('+sectorEtfEntry.name+') — get its 5-day and 1-month performance. Compare this stock directly against '+sectorEtfEntry.etf+'. Is the stock outperforming or underperforming its own sector ETF? Outperforming the sector ETF is a stronger signal than outperforming SPY alone.\n'
      :'Fetch https://finance.yahoo.com/quote/SPY — compare this stock\'s performance against SPY over 1 month and 1 week. Is the stock outperforming or underperforming the broad market?\n';
    var priceVolumeStep=fmpBlock
      ?'STEP 1 — Price, volume, and market position:\n'+fmpBlock+'\n'+
       'Fetch https://finance.yahoo.com/quote/'+ticker+'/options — get implied volatility and implied move from nearest expiry at-the-money straddle.\n\n'
      :'STEP 1 — Price, volume, and market position:\n'+
       'Fetch https://finance.yahoo.com/quote/'+ticker+' — get: current price, today change %, 52-week high/low, average daily volume, today volume, market cap. Calculate: is current price within 25% of 52-week high? (Minervini requirement)\n'+
       'Fetch https://finance.yahoo.com/quote/'+ticker+'/options — get implied volatility and implied move from nearest expiry at-the-money straddle.\n\n'+
       'STEP 2 — Minervini SEPA fundamentals (required):\n'+
       'Fetch https://stockanalysis.com/stocks/'+ticker_lower+'/ — get: next earnings date, EPS growth YoY last 4 quarters, revenue/sales growth YoY, P/E ratio.\n'+
       'Fetch https://stockanalysis.com/stocks/'+ticker_lower+'/financials/?p=quarterly — get: last 4 quarters EPS (is it accelerating quarter over quarter?), revenue growth each quarter, gross margin trend (expanding or contracting?), return on equity.\n'+
       'You need these specific numbers: EPS growth % YoY, Sales growth % YoY, ROE %, whether EPS is accelerating (each quarter higher than the last). These are Minervini SEPA fundamental requirements.\n\n';
    var vcpCandleStep=fmpBlock
      ?(fmpStock&&fmpStock._vcpAnalysis
        ?'The VCP ANALYSIS line in the FMP DATA above was computed algorithmically from the actual weekly candle swings — use that exact verdict, ratio, and pivot. Do not recalculate it from the raw candles.\n\n'
        :'The weekly and daily candles you need are already in the FMP DATA block above — use those, do not fetch a price history page. From the weekly candles: (a) note weekly range each week (already calculated), (b) is range contracting week over week — Minervini VCP tightening signal, (c) is volume declining in the tight zone to the lowest levels of the base, (d) Minervini ratio = tightest week range / week 1 of base range (must be below 0.50 to qualify as VCP), (e) the pivot point = high of the tightest 2-3 week zone. From the daily candles: confirm volume drying up in the tightest part of the base and find the daily pivot (highest high of the last tight 5-10 days).\n\n')
      :'Fetch https://finance.yahoo.com/quote/'+ticker+'/history/?interval=1wk — get last 12 weekly candles. For each week note high, low, and volume. Calculate: (a) weekly range each week (high minus low), (b) is range contracting week over week — Minervini VCP tightening signal, (c) is volume declining in the tight zone to lowest levels of the base, (d) Minervini ratio = tightest week range / week 1 of base range (must be below 0.50 to qualify as VCP), (e) the pivot point = high of the tightest 2-3 week zone.\n'+
       'Fetch https://finance.yahoo.com/quote/'+ticker+'/history/?interval=1d — get last 20 daily candles. Confirm volume drying up in the tightest part of the base. Find the daily pivot (highest high of the last tight 5-10 days).\n\n';
    var prompt='You are Warren. $50M own money, 30%+ compounder, principal not advisor. Zero disclaimers. Today is '+today+'.\n\n'+
      posCtx+'\n\n'+
      buildRegimeContext()+
      (fmpStock&&fmpStock.sector?'SECTOR (FMP, verified): '+fmpStock.sector+(fmpStock.industry?' / '+fmpStock.industry:'')+'\n\n':'')+
      'Fetch these pages IN ORDER before answering. Extract specific numbers from each.\n\n'+
      priceVolumeStep+
      'STEP 3 — Stage 2 and VCP technical setup:\n'+
      'Fetch https://finviz.com/quote.ashx?t='+ticker+' — get: RSI, relative volume, 1-month performance vs S&P 500. Note: Finviz does NOT have an RS Rating field — do not report its RSI value as RS Rating, they are different, unrelated metrics.'+(fmpBlock?' (moving averages already provided above — do not re-fetch them)':' Also get 50-day MA price, 150-day MA price (SMA150), 200-day MA price, 52-week high and low.')+'\n'+
      'RS RATING: '+(computedRS!==null?formatRSRatioValue(computedRS)+' — use this exact number, not Finviz/RSI':rsRatioUnavailableNote())+'\n'+
      sectorEtfLine+
      (fmpBlock?'':'From the MA prices: confirm Stage 2 criteria — price above 50MA, above 150MA, above 200MA, 150MA above 200MA. Is the 200MA trending upward?\n')+
      vcpCandleStep+
      'STEP 4 — Insider buying (Minervini watches this as a confirming signal):\n'+
      'Fetch https://openinsider.com/?s='+ticker+' — any insider buying in the last 90 days? Cluster buys (multiple insiders buying around the same time) are a strong confirming signal for Minervini.\n\n'+
      'MINERVINI SEPA ANALYSIS FRAMEWORK:\n'+
      '1. MARKET STAGE: Is SPY above 50-day AND 200-day MA? Are small caps and Nasdaq participating? Minervini only deploys full capital in a confirmed Stage 2 market.\n'+
      '2. STOCK STAGE 2: Confirm all five Stage 2 criteria (price vs 50MA, 150MA, 200MA; 150MA vs 200MA; 200MA trending up). This is non-negotiable.\n'+
      '3. FUNDAMENTAL QUALITY: State EPS growth %, sales growth %, ROE %, margin trend. Does this meet Minervini SEPA thresholds (EPS 25%+, Sales 25%+, ROE 17%+)?\n'+
      '4. RELATIVE STRENGTH: State the RS Rating given above (computed, not from Finviz). Is it 80+? Is the stock outperforming SPY and its sector ETF over 1 month and 3 months?\n'+
      '5. VCP SETUP: Calculate the Minervini ratio. State the exact pivot price. Is volume at the lowest point of the base during the tight zone?\n'+
      '6. EARNINGS RISK: Days until next earnings. Minervini pre-earnings breakout window is 3-5 weeks before the report.\n'+
      '   - 2-3 WEEKS AWAY: Earnings risk is real. Use half normal position size going in.\n'+
      '   - WITHIN 2 WEEKS: High binary risk. Recommend exiting before earnings or taking very small position.\n'+
      '   - TOMORROW OR SAME DAY: Do not enter a new position. Wait for the reaction.\n\n'+
      '5. TECHNICAL POSITION: Price above both 50-day and 200-day MA?\n'+
      '6. BASE ANALYSIS: Using weekly candles — is it consolidating? How many weeks? Are ranges contracting? Is volume declining? Where is resistance?\n'+
      '7. PIVOT POINT CALCULATION: The pivot point is the high of the tightest 2-3 week period of the base — the point where a move above it on rising volume signals the base is ending and the breakout is beginning. It is NOT the same as resistance (which is the old high). The pivot is lower — it is inside the base, at the top of the tight contraction zone. A buy at the pivot gives a smaller stop and better risk/reward than waiting for the full resistance breakout. Calculate it from the daily and weekly candles you fetched. Example: if the last 3 weeks traded between $23.80 and $25.20 and the 3 weeks before that traded between $22.00 and $26.50, the pivot is $25.20 — the high of the tight zone.\n\n'+
      (context?'Investor context: '+context+'\n\n':'\n')+
      'MINERVINI SEPA GATE CHECK — apply in order, stop at first failure\n'+
      'Minervini is extremely selective. He passes on 95% of setups. He waits for the perfect convergence of all factors. Do not compromise on any gate.\n\n'+

      'GATE 1 — MARKET STAGE (Minervini only trades in a confirmed Stage 2 market uptrend)\n'+
      'Check market regime from context. Minervini defines market stages using SPY vs its 50-day and 200-day MAs.\n'+
      'PASS: Market is in confirmed uptrend — SPY above both 50-day and 200-day MA, with small caps and Nasdaq participating. This is the only environment where Minervini deploys full capital.\n'+
      'CAUTION: Market is transitioning — SPY above 200MA but below 50MA, or internals are diverging. Minervini reduces size to 50% and only takes A+ setups.\n'+
      'STOP: Market is in a downtrend — SPY below 200-day MA. Minervini goes to cash. No new long positions regardless of how good the individual setup looks.\n'+
      'GATE_1: [PASS/CAUTION/STOP] — state the exact SPY vs MA situation from market context.\n\n'+

      'GATE 2 — SECTOR LEADERSHIP (Minervini trades the strongest stocks in the strongest sectors)\n'+
      'Is this stock in a sector showing leadership on both 1-week AND 1-month from market context?\n'+
      'If a "SECTOR (FMP)" reference is given below, that is the stock\'s real, verified sector classification — match it against the leading/avoid sector lists in market context above rather than guessing the sector from general knowledge.\n'+
      'PASS: Sector is in the top sectors list, leading on both 1W and 1M. Strong tailwind.\n'+
      'STOP: Sector is neutral, in the avoid list, or only leading on 1W (short-term bounce, not confirmed trend). Minervini would find a better candidate in a confirmed leading sector.\n'+
      'GATE_2: [PASS/STOP] — name the sector and whether it leads on both or just one timeframe.\n\n'+

      'GATE 3 — STOCK STAGE 2 UPTREND (Minervini only buys stocks in Stage 2 — the advancing phase)\n'+
      'A Stage 2 stock has these specific characteristics — this is Minervini\'s full 8-point Trend Template, points 1-6:\n'+
      '— Current price above 50-day MA\n'+
      '— Current price above 150-day MA\n'+
      '— Current price above 200-day MA\n'+
      '— 200-day MA has been trending upward for at least 1 month (the stock\'s OWN 200MA, not the market\'s — check the "Stock\'s own 200MA slope" line in the FMP data if provided)\n'+
      '— 150-day MA is above 200-day MA\n'+
      '— 50-day MA is above BOTH the 150-day MA and the 200-day MA (this is commonly missed — a stock can trade above all three MAs while its own 50MA hasn\'t caught up above the 150/200MA yet, which is not a clean Stage 2 structure)\n'+
      '— Price is within 25% of its 52-week high\n'+
      '— Price is at least 25% above its 52-week low\n'+
      'If a "STAGE 2 CHECK (computed)" line was provided in the FMP data above, use those exact YES/NO values — do not recompute or override them. If a "STAGE ANALYSIS (computed)" line was provided, use that exact stage classification in your answer.\n'+
      'PASS: All Stage 2 criteria confirmed from fetched data.\n'+
      'STOP: Any Stage 2 criterion fails. Minervini will not buy a stock that is not in a Stage 2 uptrend.\n'+
      'GATE_3: [PASS/STOP] — itemize every criterion explicitly with actual numbers: price vs 50MA, price vs 150MA, price vs 200MA, 50MA vs 150MA, 150MA vs 200MA, how many months the 200MA has been trending up, % above 52-week low, % off 52-week high. Do not compress this into a single vague sentence.\n\n'+

      'GATE 4 — FUNDAMENTAL QUALITY (Minervini requires strong earnings and sales growth — SEPA fundamentals)\n'+
      'From StockAnalysis data fetched above, check:\n'+
      '— EPS (earnings per share) growth: ideally 25%+ year over year, accelerating in recent quarters\n'+
      '— Sales/revenue growth: 25%+ year over year\n'+
      '— Return on equity (ROE): 17%+ preferred\n'+
      '— Profit margins: expanding, not contracting\n'+
      '— Recent quarter EPS better than the prior quarter (acceleration)\n'+
      'PASS: EPS growth 25%+, sales growth 25%+, ROE above 17%, margins expanding or stable, earnings accelerating.\n'+
      'CAUTION: EPS growth positive but below 25%, or one metric is weak. Minervini might still take this if the setup is exceptional but notes the fundamental weakness.\n'+
      'STOP: EPS declining, sales declining, or ROE below 10%. Minervini does not buy fundamentally weak stocks regardless of the technical setup.\n'+
      'GATE_4: [PASS/CAUTION/STOP] — state the actual EPS growth %, sales growth %, and ROE from fetched data.\n\n'+

      'GATE 5 — RELATIVE STRENGTH (Minervini only buys stocks outperforming the market)\n'+
      'Minervini uses IBD Relative Strength Rating. Use the RS RATING value given above — it is a Benchmark Performance Ratio (Stock_Score / SPY_Score, both computed with IBD\'s actual documented formula), not fetched from Finviz (Finviz has no RS Rating field, only the unrelated RSI momentum oscillator):\n'+
      '— RS Rating as given above (a ratio vs SPY, not a 1-99 scale)\n'+
      '— Stock must be outperforming SPY on a 1-month and 3-month basis\n'+
      '— Stock must be outperforming its sector ETF by more than 1% over the last month\n'+
      'PASS: RS Ratio 1.15+ (beating SPY by 15%+) AND outperforming both SPY and sector ETF by more than 1%.\n'+
      'CAUTION: RS Ratio 1.10-1.14 (beating SPY, but not by Minervini\'s required margin). Below ideal but potentially acceptable in a very strong sector.\n'+
      'STOP: RS Ratio below 1.10 (Minervini requires real outperformance — merely matching or barely beating the market is not enough for a Position Trade), or stock underperforming SPY or sector ETF. Leaders lead. This one is not leading.\n'+
      'GATE_5: [PASS/CAUTION/STOP] — state the RS Rating and 1-month performance vs SPY and sector ETF.\n\n'+

      'GATE 6 — VCP SETUP (the Volatility Contraction Pattern — Minervini core entry technique)\n'+
      'If a "VCP ANALYSIS (computed)" line was provided in the FMP data above, it was computed algorithmically from the actual weekly candle swings — real detected contractions, real Minervini ratio, real pivot. Use that exact verdict and pivot price. Do not recalculate or contradict it.\n'+
      'If that line is not available, analyze the weekly candle data fetched above yourself. A valid VCP requires ALL of these:\n'+
      '— Prior uptrend before the base (stock was advancing before it started consolidating)\n'+
      '— Multiple contractions: each swing within the base is smaller than the last (e.g. 25% → 15% → 8% → 4%)\n'+
      '— Minervini ratio: the range of the tightest week(s) must be less than 50% of the range of week 1 of the base\n'+
      '— Volume must dry up during the tightest weeks to the lowest levels of the entire base\n'+
      '— A clear pivot point exists: the high of the tightest 2-3 week zone\n'+
      '— Stock is within 5-15% of its 52-week high\n'+
      'PASS: All VCP criteria confirmed. This is a Stage 3 setup ready for entry. Name the pivot price.\n'+
      'STOP: VCP not complete. Either contractions not measurable, volume not drying up, or ratio above 0.50. State specifically what is missing.\n'+
      'GATE_6: [PASS/STOP] — calculate Minervini ratio, state pivot price, confirm volume at base lows.\n\n'+

      'GATE 7 — ENTRY RISK (Minervini never risks more than 1-2% of portfolio on any single trade)\n'+
      'Calculate: (entry price - stop price) / entry price = risk %.\n'+
      'The stop goes just below the lowest point of the tightest zone in the VCP.\n'+
      'PASS: Risk from entry to stop is 7% or less. R/R to target is 3:1 or better.\n'+
      'CAUTION: Risk from entry to stop is 7-8%. Acceptable at the edge of Minervini limits. Use pivot entry not breakout entry to tighten it.\n'+
      'STOP: Risk from entry to stop exceeds 8%. This trade cannot be taken because the risk is too wide to stay within Minervini 1-2% portfolio risk rule.\n'+
      'GATE_7: [PASS/CAUTION/STOP] — state stop price, entry price, risk %, R/R ratio.\n\n'+

      'GATE VERDICT RULES (Minervini — no compromises):\n'+
      '— All PASS → GATE_VERDICT: GO. This is a high conviction Minervini setup. Rare.\n'+
      '— Gate 1 CAUTION, all others PASS → GATE_VERDICT: CAUTION. Half size. Market is not fully confirmed.\n'+
      '— Gate 4 CAUTION or Gate 5 CAUTION, all critical gates pass → GATE_VERDICT: CAUTION. Reduce size. Note the weak fundamental or RS.\n'+
      '— Gate 7 CAUTION only → GATE_VERDICT: CAUTION. Use pivot entry to tighten stop.\n'+
      '— Any STOP on Gates 1, 2, 3, 6 → GATE_VERDICT: WAIT or SKIP. Do not trade. State what has to change.\n'+
      '— Gate 4 STOP → GATE_VERDICT: SKIP. Fundamentals disqualify this stock from Minervini methodology.\n'+
      '— Gate 5 STOP → GATE_VERDICT: WAIT. Find the leading stock in this sector instead.\n'+
      '— Two or more CAUTIONS → GATE_VERDICT: WAIT. Too many compromises. Find a cleaner setup.\n\n'+

      'GATE_VERDICT: [GO / CAUTION / WAIT / SKIP]\n'+
      'GATE_SUMMARY: One sentence. Exactly what to do right now per Minervini methodology.\n'+
      'MINERVINI_NOTE: One sentence. Is this the type of setup Minervini would trade? He looks for superperformance stocks — companies with accelerating earnings, strong RS, clean VCP base. Is this one of those?\n\n'+
      'If GATE_VERDICT is SKIP or WAIT — state the gates section only. Do not write entry prices or targets for a trade that fails Minervini criteria.\n'+
      'If GATE_VERDICT is GO or CAUTION — continue with the full analysis below.\n'+

      'Give a structured verdict:\n'+
      'VERDICT: [Strong Buy / Buy / Watch — wait for better entry / Pass]\n'+
      'WHY: 2-3 sentences referencing the actual data.\n'+
      'MARKET REGIME: One sentence on SPY trend and impact on this trade.\n'+
      'SETUP STATUS: Use Minervini VCP (Volatility Contraction Pattern) criteria. Classify into exactly one stage:\n'+
      'Stage 1 — Watch only: Stock consolidating but weekly ranges NOT yet contracting consistently. Volume not declining. No measurable tight zone yet. ACTION: Add to watchlist, no alert.\n'+
      'Stage 2 — Set alert: At least 2 consecutive weeks of weekly range contraction (each week range < prior week range). Volume declining vs the first half of the base. A resistance level is identifiable. ACTION: Set IBKR alert at pivot $XX.XX.\n'+
      'Stage 3 — Ready to act: At least 3 consecutive tight weeks where the weekly range is less than 50% of the range in week 1 of the base (Minervini ratio). Volume in the tight zone is the lowest of the entire consolidation. Stock within 5-15% of 52-week high. Clear pivot identifiable. ACTION: Set alert at pivot $XX.XX — enter on 1.5x+ volume.\n'+
      'Breaking out now: Price is closing above resistance today on volume that is already 1.5x+ the 50-day average before close. ACTION: Buy at market, full planned size, stop below the base.\n'+
      'Extended — wait: Stock broke out and has run more than 15% from the base. Risk/reward no longer favourable. ACTION: Do not chase. Wait for new base.\n'+
      'Breaking down — avoid: Price falling through the base or below 50-day MA on above-average volume. ACTION: Do not buy. Check stop if holding.\n'+
      'Format: [STAGE NAME]. ACTION: [specific instruction with actual prices]. One sentence on which measurable criteria you used.\n'+
      'Format your SETUP STATUS answer as: [STAGE NAME]. Then ACTION: [specific instruction with actual prices from your data].\n'+
      'BASE TIGHTENING: Minervini ratio — calculate: (range of most recent tight week) / (range of week 1 of base). If this ratio is below 0.5 (i.e. the tight zone range is less than 50% of the initial range) the base qualifies as VCP-tight. Give the actual numbers: Week 1 range $X.XX, Most recent tight week range $X.XX, Ratio: X.XX. Is volume in the tight zone below the volume average of the first half of the base? Confirm or deny.\n'+
      'RESISTANCE LEVEL: The old high the stock keeps failing at. The ceiling. $XX.XX\n'+
      'PIVOT POINT: The high of the tightest 2-3 week zone within the base. Must be a specific price: $XX.XX. Then on the next line give the VOLUME CONFIRMATION SIGNAL — tell me exactly what volume needs to look like to confirm this entry is real: (a) the minimum relative volume (e.g. 1.5x average) that must be present when the price hits the pivot, (b) the approximate shares-per-hour pace that would confirm institutional buying at this level given the stock\'s average daily volume, (c) what a volume-less drift to this level looks like and why it is a trap to avoid. Example format: "Pivot: $25.20. Volume signal: enter only if relative volume is above 1.5x at time of entry. At 10am this means at least 120,000 shares traded if average daily volume is 800,000 (15% of daily volume in first hour is normal pace — you want above that). If price drifts to $25.20 on under 0.7x relative volume with no acceleration, do not enter — wait for the breakout at $26.50 instead."\n'+
      'ENTRY: Give TWO entries — (1) Pivot entry: $XX.XX — buy here if volume is rising and this is the tightest part of the base. Smaller stop, better risk/reward. (2) Breakout entry: $XX.XX — buy here if price closes above resistance on 1.5x+ volume. More conservative, full confirmation.\n'+
      'STOP: Minervini rule — stop goes just below the lowest point of the tightest 2-3 week zone in the base. Never more than 7-8% below the entry price. If the base low would require a stop more than 8% below entry, the setup is too risky and you should flag this. $XX.XX.\n'+
      'TARGET: Specific price target with timeframe.\n'+
      'EARNINGS NOTE: Structure this exactly as follows:\n'+
      'Days until earnings: [number]. Earnings date: [date in YYYY-MM-DD format].\n'+
      'Pattern: [Pre-earnings breakout — 3-5 weeks / High earnings risk — within 3 weeks / Earnings imminent — exit or avoid / Low earnings risk — 5+ weeks away]\n'+
      'Implied move: [X%] — what the options market expects the stock to move on earnings day.\n'+
      'Scenarios:\n'+
      'BEAT: If earnings beat and stock gaps up — [specific action: raise stop to $XX, add shares at $XX, or hold and trail stop].\n'+
      'MEET: If earnings meet expectations and stock is flat — [specific action].\n'+
      'MISS: If earnings miss and stock gaps down — exit at market open. Gap risk means the stop may not protect you at exactly $XX — the stock could open below it. Accept this and exit immediately.\n'+
      'Sizing recommendation: [specific % of normal position size to hold going into earnings and why. If pre-earnings breakout pattern, say half size going in and add after the report].\n'+
      'MINERVINI SEPA SCORING (only runs if gate verdict is GO or CAUTION):\n'+
      'Score each criterion. Do not interpret — score the actual data.\n'+
      'SCORE_SETUP: [0 or 20] — 20 if VCP complete (Minervini ratio below 0.50, volume at base lows, clear pivot), 0 if VCP not complete\n'+
      'SCORE_FUNDAMENTALS: [0 or 20] — 20 if EPS growth 25%+, sales 25%+, ROE 17%+, margins expanding and accelerating. 10 if 2 of 4 criteria met. 0 if EPS declining or sales declining.\n'+
      'SCORE_RS: [0 or 20] — 20 if RS Ratio 1.15+, outperforms SPY and sector ETF by more than 1%. 10 if RS Ratio 1.0-1.14 or outperforms one benchmark. 0 if RS Ratio below 1.0 or underperforming.\n'+
      'SCORE_MARKET: [0 or 15] — 15 if confirmed market uptrend (SPY above both MAs, small caps participating). 8 if transitioning. 0 if downtrend.\n'+
      'SCORE_SECTOR: [0 or 10] — 10 if sector leads on BOTH 1W and 1M. 0 if only 1W or neither. Minervini is strict — both timeframes or it does not count.\n'+
      'SCORE_VOLUME: [0 or 10] — 10 if volume drying up correctly in base (lowest of entire consolidation) and/or breakout volume 1.5x+. 5 if partial. 0 if volume pattern is wrong.\n'+
      'SCORE_EARNINGS: [0 or 5] — 5 if earnings 5+ weeks away (no binary risk). 3 if 3-5 weeks (pre-earnings breakout window). 0 if within 3 weeks.\n'+
      'SCORE_INSIDER: [0 or 5] — 5 if insider buying confirmed in last 90 days (cluster buys especially meaningful). 0 if no recent insider buying or insider selling.\n'+
      'SCORE_TOTAL: [sum, max 105]\n'+
      'SIZE_TIER: [Starter 1% if total 0-49 / Standard 2% if 50-74 / High Conviction 4% if 75-89 / Maximum 5% if 90+]\n'+
      'SIZE_REASON: One sentence — the 2-3 criteria that most determined this tier.\n\n'+
      'ENTRY PLAN (two-part Minervini entry):\n'+
      'PIVOT ENTRY: $XX.XX — the high of the tightest 2-3 week zone. Buy half position here if volume is confirming (rising, at least 1.5x average).\n'+
      'BREAKOUT ENTRY: $XX.XX — the resistance level (prior high). Buy remaining half if stock closes above this on 1.5x+ volume. More conservative confirmation.\n'+
      'STOP: $XX.XX — just below the lowest point of the tightest zone. Risk from pivot entry: X%. This must be 7% or less.\n'+
      'TARGET: $XX.XX — based on the measured move from the base depth, or the next area of major resistance.\n'+
      'R/R: X:1 from pivot entry. X:1 from breakout entry.\n\n'+
      'MINERVINI SELLING RULES (output these for every analysis — Minervini is as disciplined about exits as entries):\n'+
      'STOP HIT: If price closes below $XX.XX (stop) — exit immediately. No exceptions. No averaging down. No hoping.\n'+
      'PROFIT LOCK: If stock climbs 20-25% quickly from entry ($XX.XX to $XX.XX) — sell at least partial position into strength. Do not wait for the top.\n'+
      'STALL EXIT: If stock breaks out but fails to follow through within 3-5 days (price stalls and volume dries up above the breakout) — exit. The breakout failed.\n'+
      'EARNINGS RULE: With less than 15% cushion going into earnings — reduce to half position before the report.\n'+
      'DISTRIBUTION: If the stock shows 3+ distribution days (high volume selling) after the breakout — exit before the move reverses.\n'+
      '50-DAY BREACH: If price closes below the 50-day MA on above-average volume after a breakout — exit. This is a serious warning.\n\n'+
      'EARNINGS DATE: [YYYY-MM-DD]\n'+
      'EARNINGS NOTE: Days until earnings: [X]. Pattern: [pre-earnings breakout 3-5 weeks / earnings risk within 3 weeks / safe 5+ weeks]. Implied move: [X%]. If holding through earnings: BEAT scenario: [action]. MISS scenario: exit at market open.\n'+
      'INSIDER ACTIVITY: [what OpenInsider shows — any cluster buys in last 90 days?]\n'+
      'MINERVINI SAYS: One gut-honest sentence. Would he trade this right now?\n\n'+
      'Every number from fetched data. No estimates. No opinions not supported by data.';
    var resp=await fetch(RAILWAY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-5',max_tokens:8000,messages:[{role:'user',content:prompt}],"tools":[{"type":"web_search_20250305","name":"web_search"}]})});
    var data=await resp.json();
    var textBlocks=(data.content||[]).filter(function(b){return b.type==='text';});
    var tb=textBlocks[textBlocks.length-1];
    var text=tb&&tb.text||'Could not generate analysis.';
    var text=tb?tb.text:'Could not generate analysis.';

    // Parse structured response
    var parsed=parseWarrenAnalysis(text);
    enforceGateConsistencyPos(parsed,mem,fmpStock);

    // Gate verdict colour
    var gv=(parsed.gateVerdict||'').toUpperCase();
    var gvIsSkip=gv.includes('SKIP');
    var gvIsWait=gv.includes('WAIT');
    var gvIsCaution=gv.includes('CAUTION');
    var gvColor=gvIsSkip?'var(--red)':gvIsWait?'var(--amber)':gvIsCaution?'var(--amber)':'var(--green)';
    var gvBg=gvIsSkip?'var(--red-bg)':gvIsWait?'var(--amber-bg)':gvIsCaution?'var(--amber-bg)':'var(--green-bg)';

    var isPass=parsed.verdict&&(parsed.verdict.toLowerCase().includes('pass')||parsed.verdict.toLowerCase().includes('avoid'));
    var isWatch=parsed.verdict&&parsed.verdict.toLowerCase().includes('watch');
    var verdictColor=isPass?'var(--red)':isWatch?'var(--amber)':'var(--green)';
    var verdictBg=isPass?'var(--red-bg)':isWatch?'var(--amber-bg)':'var(--green-bg)';

    // Gate rows helper
    function gateRow(label,val){
      if(!val)return'';
      var isStop=val.toUpperCase().includes('STOP');
      var isCaut=val.toUpperCase().includes('CAUTION');
      var col=isStop?'var(--red)':isCaut?'var(--amber)':'var(--green)';
      var status=isStop?'✗ STOP':isCaut?'⚠ CAUTION':'✓ PASS';
      var reason=val.replace(/^(PASS|CAUTION|STOP)\s*[—-]?\s*/i,'');
      return'<div style="display:flex;align-items:flex-start;gap:10px;padding:5px 0;border-bottom:1px solid var(--border)">'+
        '<div style="font-size:11px;font-weight:700;color:var(--t3);min-width:60px;padding-top:1px">'+esc(label)+'</div>'+
        '<div style="font-size:11px;font-weight:700;color:'+col+';min-width:80px;padding-top:1px">'+status+'</div>'+
        '<div style="font-size:12px;color:var(--t2);line-height:1.5;flex:1">'+esc(reason)+'</div>'+
      '</div>';
    }

    out.innerHTML=
      // ── GATE VERDICT — primary card ──
      (parsed.gateVerdict?
        '<div style="background:'+gvBg+';border-radius:var(--r2);padding:14px 16px;margin-bottom:12px;border:1.5px solid '+gvColor+'">'+
          '<div style="font-size:11px;font-weight:700;color:'+gvColor+';text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Minervini SEPA Gate Check — '+esc(ticker)+'</div>'+
          '<div style="font-size:20px;font-weight:800;color:'+gvColor+';margin-bottom:6px">'+esc(parsed.gateVerdict)+'</div>'+
          (parsed.gateSummary?'<div style="font-size:14px;color:var(--t1);line-height:1.65;margin-bottom:10px">'+esc(parsed.gateSummary)+'</div>':'')+
          '<div style="background:var(--surface);border-radius:var(--r3);padding:8px 12px">'+
            gateRow('Market Stage',parsed.gate1)+
            gateRow('Sector Lead',parsed.gate2)+
            gateRow('Stock Stage 2',parsed.gate3)+
            gateRow('Fundamentals',parsed.gate4)+
            gateRow('Rel Strength',parsed.gate5)+
            gateRow('VCP Setup',parsed.gate6)+
            gateRow('Entry Risk',parsed.gate7)+
          '</div>'+
          (parsed.minerviniNote?'<div style="font-size:12px;color:var(--t2);margin-top:8px;padding-top:8px;border-top:1px solid var(--border)"><span style="font-weight:700;color:var(--t1)">Minervini would say: </span>'+esc(parsed.minerviniNote)+'</div>':'')+
        '</div>':'')+
      ((!gvIsSkip&&!gvIsWait)?
        '<div style="background:'+verdictBg+';border-radius:var(--r2);padding:14px 16px;margin-bottom:12px">'+
          '<div style="font-size:11px;font-weight:700;color:'+verdictColor+';text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">SEPA verdict</div>'+
          '<div style="font-size:18px;font-weight:700;color:'+verdictColor+';margin-bottom:8px">'+esc(parsed.verdict||'See analysis below')+'</div>'+
          (parsed.why?'<div style="font-size:14px;color:var(--t1);line-height:1.65">'+esc(parsed.why)+'</div>':'')+
      // Market regime + relative strength — two key context signals
      ((parsed.marketRegime||parsed.relativeStrength||parsed.institutional)?
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">'+
          (parsed.marketRegime?'<div class="card-sm" style="border-left:3px solid var(--blue)"><div style="font-size:10px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">Market regime</div><div style="font-size:13px;color:var(--t1);line-height:1.5">'+esc(parsed.marketRegime)+'</div></div>':'')+
          (parsed.relativeStrength?'<div class="card-sm" style="border-left:3px solid var(--purple)"><div style="font-size:10px;font-weight:700;color:var(--purple);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">Relative strength vs SPY</div><div style="font-size:13px;color:var(--t1);line-height:1.5">'+esc(parsed.relativeStrength)+'</div></div>':'')+
          (parsed.institutional?'<div class="card-sm" style="grid-column:1/-1;border-left:3px solid var(--green)"><div style="font-size:10px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">Institutional ownership</div><div style="font-size:13px;color:var(--t1);line-height:1.5">'+esc(parsed.institutional)+'</div></div>':'')+
        '</div>':'') +
      // Setup status + base tightening + resistance
      ((parsed.setupStatus||parsed.baseTightening||parsed.resistanceLevel)?
        '<div style="margin-bottom:12px">'+
          setupStatusCard(parsed.setupStatus)+
          (parsed.baseTightening?'<div style="background:var(--bg);border-radius:var(--r3);padding:11px 13px;margin-top:8px;border:1px solid var(--border2)">'+
            '<div style="font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">Base tightening</div>'+
            '<div style="font-size:13px;color:var(--t1);line-height:1.6">'+esc(parsed.baseTightening)+'</div>'+
          '</div>':'')+
          (parsed.resistanceLevel?'<div style="background:var(--bg);border-radius:var(--r3);padding:10px 13px;margin-top:8px;border:1px solid var(--border2);display:flex;align-items:center;justify-content:space-between">'+
            '<div style="font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.4px">Resistance level</div>'+
            '<div style="font-size:16px;font-weight:700;color:var(--t1);font-variant-numeric:tabular-nums">'+esc(parsed.resistanceLevel)+'</div>'+
          '</div>':'')+
        '</div>':'')+
      // Pivot point — most prominent entry card
      // Size tier card — Minervini SEPA conviction scoring
      // Tiers: Starter 1% (0-49) / Standard 2% (50-74) / High Conviction 4% (75-89) / Maximum 5% (90+)
        (function(){
          var st=parsed.sizeTier.toLowerCase();
          var isMax=st.includes('maximum')||st.includes('5%');
          var isHigh=st.includes('high')||st.includes('4%')||st.includes('high conviction');
          var isStarter=st.includes('starter')||st.includes('1%');
          var pct=isMax?'5%':isHigh?'4%':isStarter?'1%':'2%';
          var col=isMax?'var(--green)':isHigh?'var(--blue)':isStarter?'var(--amber)':'var(--t2)';
          var bg=isMax?'var(--green-bg)':isHigh?'var(--blue-bg)':isStarter?'var(--amber-bg)':'var(--bg)';
          var tierName=isMax?'Maximum conviction':isHigh?'High conviction':isStarter?'Starter position':'Standard';
          var tierLabel=parts[0].trim();
          var tierReason=parts.length>1?parts[1].trim():'';
          return'<div style="background:'+bg+';border-radius:var(--r2);padding:13px 15px;margin-bottom:12px;border:1.5px solid '+col+'">'+
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">'+
              '<div>'+
                '<div style="font-size:10px;font-weight:700;color:'+col+';text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">Conviction score</div>'+
                '<div style="font-size:15px;font-weight:700;color:'+col+'">'+esc(tierName)+' — '+pct+' risk</div>'+
                (parsed.scoreTotal?'<div style="font-size:12px;color:var(--t2);margin-top:2px">SEPA Score: '+esc(parsed.scoreTotal)+'/105 · '+(parseInt(parsed.scoreTotal)>=90?'90+ = Maximum (5%)':parseInt(parsed.scoreTotal)>=75?'75-89 = High Conviction (4%)':parseInt(parsed.scoreTotal)>=50?'50-74 = Standard (2%)':'0-49 = Starter (1%)')+'</div>':'')+
              '</div>'+
              '<div style="font-size:36px;font-weight:800;color:'+col+';font-variant-numeric:tabular-nums">'+pct+'</div>'+
            '</div>'+
            (parsed.sizeReason?'<div style="font-size:12px;color:var(--t2);line-height:1.55;margin-bottom:6px">'+esc(parsed.sizeReason)+'</div>':
             tierReason?'<div style="font-size:12px;color:var(--t2);line-height:1.55;margin-bottom:6px">'+esc(tierReason)+'</div>':'')+
            '<div style="font-size:11px;color:'+col+';line-height:1.5">Enter this % as risk in Trade Builder. '+(isMax?'Rare setup — all major criteria met.':isHigh?'Strong setup — size up from standard.':'Follow the 2% rule — key criteria not yet met.')+'</div>'+
          '</div>';
        })():'')+ 
      (parsed.pivotPoint?
        '<div style="background:var(--blue-bg);border-radius:var(--r2);padding:14px 16px;margin-bottom:12px;border:1.5px solid var(--blue)">'+
          '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px">'+
            '<div style="flex:1">'+
              '<div style="font-size:10px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">Pivot point — best entry</div>'+
              '<div style="font-size:11px;color:var(--t2)">High of the tightest zone. Enter on volume confirmation only — not on a low-volume drift to this level.</div>'+
            '</div>'+
            '<div style="font-size:28px;font-weight:700;color:var(--blue);font-variant-numeric:tabular-nums;flex-shrink:0;margin-left:12px">'+esc((parsed.pivotPoint.match(/\$?[\d,.]+/)||['\u2014'])[0])+'</div>'+
          '</div>'+
          '<div style="background:#fff;border-radius:var(--r3);padding:10px 12px;border-left:3px solid var(--amber);margin-bottom:10px">'+
            '<div style="font-size:10px;font-weight:700;color:var(--amber);text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px">⚡ Volume confirmation required before entering</div>'+
            '<div style="font-size:13px;color:var(--t1);line-height:1.65">'+esc(parsed.pivotPoint)+'</div>'+
          '</div>'+
          '<div style="font-size:11px;color:var(--blue);line-height:1.5">Buy half your planned position at the pivot on volume confirmation. Add the other half at the breakout level if the trade holds.</div>'+
        '</div>':'')+ 
      // Entry / Stop / Target
      (parsed.entry||parsed.stop||parsed.target?
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">'+
          (parsed.entry?'<div class="card-sm"><div style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">'+(parsed.pivotPoint?'Breakout entry':'Entry')+'</div><div style="font-size:15px;font-weight:700;color:var(--blue);font-variant-numeric:tabular-nums">'+esc(parsed.entry)+'</div>'+(parsed.pivotPoint?'<div style="font-size:10px;color:var(--t3);margin-top:2px">Full confirmation</div>':'')+'</div>':'')+
          (parsed.stop?'<div class="card-sm"><div style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Stop loss</div><div style="font-size:15px;font-weight:700;color:var(--red);font-variant-numeric:tabular-nums">'+esc(parsed.stop)+'</div><div style="font-size:10px;color:var(--t3);margin-top:2px">Same for both entries</div></div>':'')+
          (parsed.target?'<div class="card-sm"><div style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Target</div><div style="font-size:15px;font-weight:700;color:var(--green);font-variant-numeric:tabular-nums">'+esc(parsed.target)+'</div></div>':'')+
        '</div>':'') +
      // Size + Exit
      // Minervini selling rules — always visible after any GO/CAUTION analysis
      (parsed.warrenSays?
        '<div style="background:var(--blue-bg);border-radius:var(--r3);padding:11px 14px;margin-bottom:12px;border-left:3px solid var(--blue)">'+
          '<div style="font-size:10px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">Minervini says</div>'+
          '<div style="font-size:13px;color:var(--t1);line-height:1.65;font-style:italic">'+esc(parsed.warrenSays)+'</div>'+
        '</div>':'')+
      ((parsed.size||parsed.exit)?
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">'+
          (parsed.size?'<div class="card-sm"><div style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Position size</div><div style="font-size:13px;font-weight:600;color:var(--t1)">'+esc(parsed.size)+'</div></div>':'')+
          (parsed.exit||parsed.exitSignal?'<div class="card-sm"><div style="font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Exit if</div><div style="font-size:13px;font-weight:600;color:var(--t1)">'+esc(parsed.exit||parsed.exitSignal)+'</div></div>':'')+
        '</div>':'')+ 
      (parsed.earningsNote?
        (function(){
          var en=parsed.earningsNote;
          var isPreEarnings=/pre-earnings breakout/i.test(en);
          var isHighRisk=/high.*risk|within.*3 weeks|within.*2 weeks/i.test(en);
          var isImminent=/imminent|tomorrow|same day|within.*week/i.test(en);
          var color=isPreEarnings?'var(--green)':isImminent?'var(--red)':isHighRisk?'var(--amber)':'var(--t3)';
          var bg=isPreEarnings?'var(--green-bg)':isImminent?'var(--red-bg)':isHighRisk?'var(--amber-bg)':'var(--bg)';
          var border=isPreEarnings?'var(--green)':isImminent?'var(--red)':isHighRisk?'var(--amber)':'var(--border2)';
          var icon=isPreEarnings?'📈':isImminent?'🚨':isHighRisk?'⚠':'📅';
          var label=isPreEarnings?'Pre-earnings breakout setup':isImminent?'Earnings imminent — read carefully':isHighRisk?'Earnings risk — read before entering':'Earnings note';
          // Parse scenarios if present
          var hasScenarios=/BEAT:|MEET:|MISS:/i.test(en);
          var sections=en.split(/\n/).filter(Boolean);
          var mainText=sections.filter(function(s){return!/^(BEAT:|MEET:|MISS:|Scenarios)/i.test(s.trim());}).join(' ');
          var beatLine=sections.find(function(s){return/^BEAT:/i.test(s.trim());});
          var meetLine=sections.find(function(s){return/^MEET:/i.test(s.trim());});
          var missLine=sections.find(function(s){return/^MISS:/i.test(s.trim());});
          return'<div style="background:'+bg+';border-radius:var(--r3);padding:12px 14px;margin-bottom:12px;border-left:3px solid '+border+'">'+
            '<div style="font-size:10px;font-weight:700;color:'+color+';text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">'+icon+' '+label+'</div>'+
            '<div style="font-size:13px;color:var(--t1);line-height:1.65;margin-bottom:'+(hasScenarios?'10px':'0')+'">'+esc(mainText)+'</div>'+
            (hasScenarios?
              '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:8px">'+
                (beatLine?'<div style="background:var(--green-bg);border-radius:var(--r4);padding:8px 10px"><div style="font-size:9px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">If earnings beat</div><div style="font-size:12px;color:var(--t1);line-height:1.5">'+esc(beatLine.replace(/^BEAT:\s*/i,''))+'</div></div>':'')+
                (meetLine?'<div style="background:var(--bg);border-radius:var(--r4);padding:8px 10px;border:1px solid var(--border2)"><div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">If earnings meet</div><div style="font-size:12px;color:var(--t1);line-height:1.5">'+esc(meetLine.replace(/^MEET:\s*/i,''))+'</div></div>':'')+
                (missLine?'<div style="background:var(--red-bg);border-radius:var(--r4);padding:8px 10px"><div style="font-size:9px;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">If earnings miss</div><div style="font-size:12px;color:var(--t1);line-height:1.5">'+esc(missLine.replace(/^MISS:\s*/i,''))+'</div></div>':'')+
              '</div>':'')+ 
          '</div>';
        })():'')+ 
      // Breakout level card
      (parsed.breakoutLevel?
        '<div style="background:var(--blue-bg);border-radius:var(--r3);padding:11px 13px;margin-bottom:12px;border-left:3px solid var(--blue)">'+
          '<div style="font-size:10px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">Breakout level to watch</div>'+
          '<div style="font-size:16px;font-weight:700;color:var(--blue);font-variant-numeric:tabular-nums;margin-bottom:4px">'+esc((parsed.breakoutLevel.match(/\$?[\d,.]+/)||['—'])[0])+'</div>'+
          '<div style="font-size:12px;color:var(--t2);line-height:1.5">'+esc(parsed.breakoutLevel)+'</div>'+
          '<div style="font-size:11px;color:var(--t3);margin-top:4px">Needs 1.5x+ average volume to confirm. Low-volume break = trap. Saved as blue marker on your position track.</div>'+
        '</div>':'')+ 
      // Warren says
      (parsed.warrenSays?'<div class="warren-box" style="margin-bottom:12px"><div class="warren-box-title">Warren says</div><div class="warren-box-text" style="font-style:italic">'+esc(parsed.warrenSays)+'</div></div>':'')+
      // IBKR order instructions
      ((!isPass&&(parsed.entry||parsed.pivotPoint)&&parsed.stop)?
        (function(){
          var entryNum=extractNumber(parsed.pivotPoint||parsed.entry);
          var stopNum=extractNumber(parsed.stop);
          var portSize=10000; // default if no portfolio size known
          var riskPerShare=entryNum&&stopNum?Math.abs(entryNum-stopNum):null;
          var totalShares=riskPerShare?Math.floor(portSize*0.02/riskPerShare):null;
          var halfShares=totalShares?Math.floor(totalShares/2):null;
          var boNum=extractNumber(parsed.breakoutLevel||parsed.entry);
          return buildIBKROrders(ticker,entryNum,stopNum,totalShares||100,entryNum,halfShares,boNum);
        })():'')+ 
      // Action buttons
      (!isPass?
        '<div class="btn-row">'+
          '<button class="btn btn-green" onclick="addFromWarren(\'pos\','+JSON.stringify({ticker:ticker,verdict:parsed.verdict,entry:parsed.entry,stop:parsed.stop,target:parsed.target,size:parsed.size,exit:parsed.exit,why:parsed.why,pivotPoint:parsed.pivotPoint,breakoutLevel:parsed.breakoutLevel,earningsDate:parsed.earningsDate||null}).replace(/</g,'&lt;').replace(/>/g,'&gt;')+')">Add to positions</button>'+
          '<button class="btn btn-ghost" onclick="addFromWarren(\'watch\','+JSON.stringify({ticker:ticker,entry:parsed.entry,why:parsed.why}).replace(/</g,'&lt;').replace(/>/g,'&gt;')+')">Add to watchlist</button>'+
          '<button class="btn btn-ghost" onclick="closeSheet()">Dismiss</button>'+
        '</div>':
        '<button class="btn btn-ghost" onclick="closeSheet()">Got it</button>'
      );

    btn.textContent='Ask again';btn.disabled=false;
  }catch(e){
    out.innerHTML='<div style="color:var(--red);font-size:14px">Could not connect to Warren. Check your Railway server.</div>';
    btn.textContent='Try again';btn.disabled=false;
  }
}

function setupStatusCard(setupStatus){
  if(!setupStatus)return'';
  var s=setupStatus.toLowerCase();
  var isAct=s.includes('stage 3')||s.includes('ready to act')||s.includes('breaking out');
  var isAlert=s.includes('stage 2')||s.includes('set alert');
  var isWatch=s.includes('stage 1')||s.includes('watch only');
  var isExtended=s.includes('extended');
  var isDown=s.includes('breaking down');
  var col=isAct?'var(--green)':isAlert?'var(--amber)':isWatch?'var(--blue)':(isExtended||isDown)?'var(--red)':'var(--t2)';
  var bg=isAct?'var(--green-bg)':isAlert?'var(--amber-bg)':isWatch?'var(--blue-bg)':(isExtended||isDown)?'var(--red-bg)':'var(--bg)';
  var border=isAct?'var(--green)':isAlert?'var(--amber)':isWatch?'var(--blue)':(isExtended||isDown)?'var(--red)':'var(--border2)';
  var actionSplit=setupStatus.split(/ACTION:/i);
  var stagePart=actionSplit[0].replace(/^\[|\]$/g,'').trim();
  var actionPart=actionSplit.length>1?actionSplit[1].trim():'';
  return'<div style="background:'+bg+';border-radius:var(--r3);padding:12px 14px;border-left:3px solid '+border+'">'+
    '<div style="font-size:10px;font-weight:700;color:'+col+';text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">Setup status</div>'+
    '<div style="font-size:15px;font-weight:700;color:'+col+';margin-bottom:'+(actionPart?'8px':'0')+'">'+esc(stagePart)+'</div>'+
    (actionPart?
      '<div style="background:#fff;border-radius:var(--r4);padding:9px 12px;border-left:3px solid '+col+'">'+
        '<div style="font-size:10px;font-weight:700;color:'+col+';text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">What to do now</div>'+
        '<div style="font-size:13px;color:var(--t1);line-height:1.6">'+esc(actionPart)+'</div>'+
      '</div>':'')+
  '</div>';
}


function parseWarrenAnalysis(text){
  var result={};
  // First pass — extract multi-line blocks before single-line parsing
  // EARNINGS NOTE can span multiple lines (includes BEAT/MEET/MISS scenarios)
  var earningsMatch=text.match(/^EARNINGS NOTE:\s*([\s\S]*?)(?=\n[A-Z][A-Z\s]+:|$)/m);
  if(earningsMatch)result.earningsNote=earningsMatch[1].trim();

  // Extract multi-line SELECTIVITY_NOTE block (contains MINERVINI/DRUCKENMILLER/ONEIL sub-lines)

  // Single-line field parsing
  var lines=text.split('\n');
  var skipNextIfEarnings=false;
  lines.forEach(function(line){
    var l=line.trim();
    if(!l)return;
    if(/^VERDICT:/i.test(l))result.verdict=l.replace(/^VERDICT:\s*/i,'');
    else if(/^GATE_VERDICT:/i.test(l))result.gateVerdict=l.replace(/^GATE_VERDICT:\s*/i,'');
    else if(/^GATE_SUMMARY:/i.test(l))result.gateSummary=l.replace(/^GATE_SUMMARY:\s*/i,'');
    else if(/^GATE_1:/i.test(l))result.gate1=l.replace(/^GATE_1:\s*/i,'');
    else if(/^GATE_2:/i.test(l))result.gate2=l.replace(/^GATE_2:\s*/i,'');
    else if(/^GATE_3:/i.test(l))result.gate3=l.replace(/^GATE_3:\s*/i,'');
    else if(/^GATE_4:/i.test(l))result.gate4=l.replace(/^GATE_4:\s*/i,'');
    else if(/^GATE_5:/i.test(l))result.gate5=l.replace(/^GATE_5:\s*/i,'');
    else if(/^GATE_6:/i.test(l))result.gate6=l.replace(/^GATE_6:\s*/i,'');
    else if(/^GATE_7:/i.test(l))result.gate7=l.replace(/^GATE_7:\s*/i,'');
    else if(/^WHY:/i.test(l))result.why=l.replace(/^WHY:\s*/i,'');
    else if(/^CATALYST:/i.test(l))result.catalyst=l.replace(/^CATALYST:\s*/i,'');
    else if(/^MARKET REGIME:/i.test(l))result.marketRegime=l.replace(/^MARKET REGIME:\s*/i,'');
    else if(/^SETUP STATUS:/i.test(l))result.setupStatus=l.replace(/^SETUP STATUS:\s*/i,'');
    else if(/^BASE TIGHTENING:/i.test(l))result.baseTightening=l.replace(/^BASE TIGHTENING:\s*/i,'');
    else if(/^RESISTANCE LEVEL:/i.test(l))result.resistanceLevel=l.replace(/^RESISTANCE LEVEL:\s*/i,'');
    else if(/^PIVOT POINT:/i.test(l))result.pivotPoint=l.replace(/^PIVOT POINT:\s*/i,'');
    else if(/^RELATIVE STRENGTH:/i.test(l))result.relativeStrength=l.replace(/^RELATIVE STRENGTH:\s*/i,'');
    else if(/^BREAKOUT LEVEL:/i.test(l))result.breakoutLevel=l.replace(/^BREAKOUT LEVEL:\s*/i,'');
    else if(/^IMPLIED MOVE:/i.test(l))result.impliedMove=l.replace(/^IMPLIED MOVE:\s*/i,'');
    else if(/^EARNINGS DATE:/i.test(l))result.earningsDate=l.replace(/^EARNINGS DATE:\s*/i,'');
    else if(/^ENTRY:/i.test(l))result.entry=l.replace(/^ENTRY:\s*/i,'');
    else if(/^STOP:/i.test(l))result.stop=l.replace(/^STOP:\s*/i,'');
    else if(/^TARGET:/i.test(l))result.target=l.replace(/^TARGET:\s*/i,'');
    else if(/^SIZE_TIER:/i.test(l))result.sizeTier=l.replace(/^SIZE_TIER:\s*/i,'');
    else if(/^SCORE_TOTAL:/i.test(l))result.scoreTotal=l.replace(/^SCORE_TOTAL:\s*/i,'');
    else if(/^SIZE_REASON:/i.test(l))result.sizeReason=l.replace(/^SIZE_REASON:\s*/i,'');
    else if(/^SIZE:/i.test(l))result.size=l.replace(/^SIZE:\s*/i,'');
    else if(/^EXIT SIGNAL:/i.test(l))result.exitSignal=l.replace(/^EXIT SIGNAL:\s*/i,'');
    else if(/^EXIT:/i.test(l)&&!result.exitSignal)result.exit=l.replace(/^EXIT:\s*/i,'');
    else if(/^INSTITUTIONAL:/i.test(l))result.institutional=l.replace(/^INSTITUTIONAL:\s*/i,'');
    else if(/^INSIDER ACTIVITY:/i.test(l))result.insiderActivity=l.replace(/^INSIDER ACTIVITY:\s*/i,'');
    else if(/^MINERVINI SAYS:/i.test(l))result.warrenSays=l.replace(/^MINERVINI SAYS:\s*/i,'');
    else if(/^WARREN SAYS:/i.test(l))result.warrenSays=l.replace(/^WARREN SAYS:\s*/i,'');
    else if(/^MINERVINI_NOTE:/i.test(l))result.minerviniNote=l.replace(/^MINERVINI_NOTE:\s*/i,'');
    else if(/^SCORE_FUNDAMENTALS:/i.test(l))result.scoreFundamentals=l.replace(/^SCORE_FUNDAMENTALS:\s*/i,'');
    else if(/^PIVOT ENTRY:/i.test(l))result.pivotEntry=l.replace(/^PIVOT ENTRY:\s*/i,'');
    else if(/^BREAKOUT ENTRY:/i.test(l))result.breakoutEntry=l.replace(/^BREAKOUT ENTRY:\s*/i,'');
  });
  if(!result.verdict&&!result.why)result.why=text;
  return result;
}

function copyIBKR(btn){
  var orderDiv=btn.parentElement;
  var text=orderDiv.innerText.replace('Copy','').trim();
  navigator.clipboard.writeText(text).then(function(){
    var orig=btn.textContent;
    btn.textContent='Copied!';
    setTimeout(function(){btn.textContent=orig;},1500);
  }).catch(function(){
    // Fallback
    var ta=document.createElement('textarea');
    ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);
    btn.textContent='Copied!';setTimeout(function(){btn.textContent='Copy';},1500);
  });
}

function buildIBKROrders(ticker, entry, stop, shares, pivotEntry, pivotShares, breakoutLevel){
  // entry = pivot or main entry price
  // shares = total shares
  // pivotShares = half size for pivot entry (null if no pivot)
  if(!ticker||!entry||!stop||!shares)return'';
  var t=esc(ticker.toUpperCase());
  var halfShares=pivotShares||shares;
  var remainShares=shares-halfShares;
  var hasPivot=!!(pivotEntry&&halfShares<shares);
  var entryPrice=pivotEntry||entry;
  var boPrice=breakoutLevel||entry;

  return'<div style="background:var(--bg);border-radius:var(--r3);padding:14px;margin-top:14px;border:1px solid var(--border2)">'+
    '<div style="font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">IBKR order instructions</div>'+
    '<div style="font-size:12px;color:var(--t3);margin-bottom:12px">Place these in order. Order 2 (stop loss) is the most critical — place it within seconds of your buy filling.</div>'+

    // Order 1 — buy
    '<div style="background:var(--blue-bg);border-radius:var(--r4);padding:10px 12px;margin-bottom:8px">'+
      '<div style="font-size:10px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Order 1 — Buy'+(hasPivot?' (half size at pivot)':'')+'</div>'+
      '<div style="font-family:monospace;font-size:13px;color:var(--t1);background:#fff;border-radius:var(--r4);padding:10px 12px;border:1px solid var(--border2);line-height:2.1;position:relative">'+
        'Action: BUY<br>'+
        'Quantity: '+halfShares.toLocaleString()+' shares<br>'+
        'Symbol: '+t+'<br>'+
        'Order type: LIMIT<br>'+
        'Limit price: $'+Number(entryPrice).toFixed(2)+'<br>'+
        'Time in force: DAY'+
        (hasPivot?'<br><span style="color:var(--t3);font-size:11px">Only place if relative volume is 1.5x+ when price hits this level</span>':'')+
        '<button onclick="copyIBKR(this)" style="position:absolute;top:8px;right:8px;padding:4px 10px;background:var(--blue);color:#fff;border:none;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit">Copy</button>'+
      '</div>'+
    '</div>'+

    // Order 2 — stop loss (always present, most important)
    '<div style="background:var(--red-bg);border-radius:var(--r4);padding:10px 12px;margin-bottom:8px">'+
      '<div style="font-size:10px;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Order 2 — Stop loss ⚠ Place immediately after buy fills</div>'+
      '<div style="font-family:monospace;font-size:13px;color:var(--t1);background:#fff;border-radius:var(--r4);padding:10px 12px;border:1px solid var(--border2);line-height:2.1;position:relative">'+
        'Action: SELL<br>'+
        'Quantity: '+halfShares.toLocaleString()+' shares<br>'+
        'Symbol: '+t+'<br>'+
        'Order type: STOP<br>'+
        'Stop price: $'+Number(stop).toFixed(2)+'<br>'+
        'Time in force: GTC<br>'+
        '<span style="color:var(--t3);font-size:11px">GTC = Good Till Cancelled. Stays active until triggered or you cancel it.</span>'+
        '<button onclick="copyIBKR(this)" style="position:absolute;top:8px;right:8px;padding:4px 10px;background:var(--red);color:#fff;border:none;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit">Copy</button>'+
      '</div>'+
    '</div>'+

    // Order 3 — add at breakout (only if half-size pivot entry)
    (hasPivot&&remainShares>0?
      '<div style="background:var(--green-bg);border-radius:var(--r4);padding:10px 12px;margin-bottom:8px">'+
        '<div style="font-size:10px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Order 3 — Add at breakout (remaining '+remainShares.toLocaleString()+' shares, on high volume)</div>'+
        '<div style="font-family:monospace;font-size:13px;color:var(--t1);background:#fff;border-radius:var(--r4);padding:10px 12px;border:1px solid var(--border2);line-height:2.1;position:relative">'+
          'Action: BUY<br>'+
          'Quantity: '+remainShares.toLocaleString()+' shares<br>'+
          'Symbol: '+t+'<br>'+
          'Order type: STOP LIMIT<br>'+
          'Stop trigger: $'+Number(boPrice).toFixed(2)+'<br>'+
          'Limit price: $'+(Number(boPrice)+Number(boPrice)*0.02).toFixed(2)+'<br>'+
          'Time in force: DAY<br>'+
          '<span style="color:var(--t3);font-size:11px">Only add if breakout is on 1.5x+ volume. Cancel this order if the pivot entry fails.</span>'+
          '<button onclick="copyIBKR(this)" style="position:absolute;top:8px;right:8px;padding:4px 10px;background:var(--green);color:#fff;border:none;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit">Copy</button>'+
        '</div>'+
      '</div>':'')+ 

    '<div style="font-size:11px;color:var(--t3);line-height:1.6">In IBKR mobile: tap the stock → tap Buy → fill in the fields above → tap Submit. Then immediately create the stop order using the same process with Sell.</div>'+
  '</div>';
}

function addFromWarren(type, data){
  if(typeof data==='string'){try{data=JSON.parse(data);}catch(e){data={};}}
  if(type==='pos'){
    openSheet('pos-manual',{
      ticker:data.ticker||'',
      thesis:(data.why||'')+(data.exit?'\nExit if: '+data.exit:''),
      target:extractNumber(data.target),
      stopLoss:extractNumber(data.stop),
      breakoutLevel:extractNumber(data.breakoutLevel),
      pivotPoint:extractNumber(data.pivotPoint),
      earningsDate:data.earningsDate||null
    });
  } else {
    watchlist.push({ticker:data.ticker||'',entryPrice:extractNumber(data.entry),thesis:data.why||'',addedAt:new Date().toISOString()});
    DB.set('watchlist',watchlist);
    closeSheet();
    renderPosWatchlist();
    // Switch to watchlist tab
    document.querySelectorAll('.seg-btn').forEach(function(b,i){b.classList.toggle('active',i===1);});
    ['seg-open','seg-watch'].forEach(function(s,i){document.getElementById(s).style.display=i===1?'':'none';});
  }
}

function extractNumber(str){
  if(!str)return null;
  var m=str.match(/\$?([\d,]+\.?\d*)/);
  return m?parseFloat(m[1].replace(',','')):null;
}

function openSheet(id,prefill){
  currentSheet=id;editIdx=-1;
  if(prefill&&(id==='pos-manual'||id==='pos-add')){
    editIdx=positions.findIndex(function(p){return prefill.ticker&&p.ticker===prefill.ticker;});
  }
  document.getElementById('sheetBody').innerHTML=sheetForms[id]?sheetForms[id](prefill):'';
  document.getElementById('overlay').classList.add('open');
}
function closeSheet(){document.getElementById('overlay').classList.remove('open');editIdx=-1;}
function gv(id){var el=document.getElementById(id);return el?el.value.trim():'';}
function gf(id){var v=parseFloat(gv(id));return isNaN(v)?null:v;}

function savePos(){
  var ticker=gv('f-ticker').toUpperCase();
  var shares=gf('f-shares');
  var avgCost=gf('f-cost');
  var currentPrice=gf('f-price');
  if(!ticker||!shares||!avgCost||!currentPrice){alert('Ticker, shares, avg cost and current price are required.');return;}
  var pos={ticker,name:gv('f-name'),shares,avgCost,currentPrice,
    stopLoss:gf('f-stop'),addLevel:gf('f-add'),target:gf('f-target'),
    breakoutLevel:gf('f-breakout')||null,
    pivotPoint:gf('f-pivot')||null,
    earningsDate:gv('f-earnings-date')||null,
    sector:gv('f-sector'),thesis:gv('f-thesis'),addedAt:new Date().toISOString()};
  if(editIdx>=0)positions[editIdx]=pos;else positions.push(pos);
  DB.set('positions',positions);closeSheet();renderPositions();updateBadges();updateWarren('positions');
}
function saveWatch(){
  var ticker=gv('f-ticker').toUpperCase();
  if(!ticker){alert('Ticker is required.');return;}
  watchlist.push({ticker,name:gv('f-name'),entryPrice:gf('f-entry'),thesis:gv('f-thesis'),addedAt:new Date().toISOString()});
  DB.set('watchlist',watchlist);closeSheet();renderPosWatchlist();
}


// ── MARKET MEMORY ──
// Stores the regime from the last sector rotation scan
// and injects it automatically into every Warren analysis

function getMarketMemory(){
  return DB.get('marketMemory')||null;
}

function buildRegimeContext(){
  var mem=getMarketMemory();
  if(!mem||!mem.regime)return'';
  // Minervini market timing — SEPA method
  // Gates: SPY vs MAs, market regime, sector leadership
  // VIX is shown elsewhere as sizing "feel" only — it never gates a verdict
  // Never used as signals: TNX, DXY, options flow, sentiment indicators
  var ctx='\n\nMINERVINI MARKET TIMING (SEPA — updated '+( mem.updated||'recently')+'): '+
    'Market stage: '+mem.regime+'. '+
    (mem.spyRegime?'SPY vs MAs: '+mem.spyRegime+'. ':'')+
    (mem.spy5day?'SPY 5-day performance: '+mem.spy5day+'. ':'')+
    (mem.qqq5day?'Nasdaq 5-day: '+mem.qqq5day+' — growth leadership signal. ':'')+
    (mem.iwm5day?'Small caps 5-day: '+mem.iwm5day+' — breadth signal (Minervini watches whether small caps participate). ':'')+
    (mem.iwm5day?'Small caps 5-day: '+mem.iwm5day+' — breadth signal (Minervini watches whether small caps participate). ':'')+
    (mem.highsVsLows?'52-week new highs vs lows: '+(mem.newHighs||'?')+' highs / '+(mem.newLows||'?')+' lows — '+(mem.highsVsLows||'')+' (Minervini primary breadth indicator — expanding highs = healthy market). ':'')+
    (mem.avoidSectors?'Weak sectors (avoid new longs): '+mem.avoidSectors+'. ':'')+
    '\n\nMINERVINI MARKET TIMING RULES (apply these strictly):\n'+
    '— Downtrend (SPY below both MAs): Do not open any new long positions. Cash is a position. Sit out.\n'+
    '— Transitioning (internals weak despite SPY above MAs): Reduce size on new entries. Half position maximum. Be selective — only A+ setups in clearly leading sectors.\n'+
    '— Uptrend confirmed: Normal position sizing rules apply. Look for VCP setups in leading sectors.\n'+
    '— Sector matters: A great setup in a weak sector has a much lower probability of working than the same setup in a leading sector. Always prefer setups in the top sectors.\n'+
    '— If a stock is in the avoid sectors: flag it as fighting against the tide. Minervini would look elsewhere first.\n';
  return ctx;
}

// Sector ETF mapping — maps sector/industry keywords to the most relevant ETF
var SECTOR_ETF_MAP=[
  {keywords:['space','spacecraft','satellite','launch','rocket','orbit'],etf:'UFO',name:'Space ETF'},
  {keywords:['defense','defence','military','aerospace','contractor','weapon','missile','navy','army','air force'],etf:'ITA',name:'Defense & Aerospace ETF'},
  {keywords:['semiconductor','chip','gpu','cpu','wafer','foundry','nvidia','amd','intel','tsmc'],etf:'SOXX',name:'Semiconductor ETF'},
  {keywords:['technology','software','saas','cloud','ai','artificial intelligence','cybersecurity','data'],etf:'XLK',name:'Technology ETF'},
  {keywords:['biotech','pharmaceutical','drug','fda','clinical','genomics','biopharma'],etf:'IBB',name:'Biotech ETF'},
  {keywords:['healthcare','hospital','medical device','insurance','health'],etf:'XLV',name:'Healthcare ETF'},
  {keywords:['energy','oil','gas','petroleum','refinery','lng','pipeline'],etf:'XLE',name:'Energy ETF'},
  {keywords:['financial','bank','insurance','asset management','fintech','lending'],etf:'XLF',name:'Financials ETF'},
  {keywords:['consumer','retail','restaurant','apparel','luxury','e-commerce','amazon','walmart'],etf:'XLY',name:'Consumer Discretionary ETF'},
  {keywords:['industrial','manufacturing','machinery','transport','logistics','construction'],etf:'XLI',name:'Industrials ETF'},
  {keywords:['communication','media','telecom','streaming','social','advertising','google','meta'],etf:'XLC',name:'Communication ETF'},
  {keywords:['material','mining','steel','copper','gold','silver','chemical'],etf:'XLB',name:'Materials ETF'},
  {keywords:['real estate','reit','property','housing'],etf:'XLRE',name:'Real Estate ETF'},
  {keywords:['utility','utilities','electric','water','power grid'],etf:'XLU',name:'Utilities ETF'},
];

function getSectorEtf(sector){
  if(!sector)return null;
  var s=sector.toLowerCase();
  for(var i=0;i<SECTOR_ETF_MAP.length;i++){
    var entry=SECTOR_ETF_MAP[i];
    for(var j=0;j<entry.keywords.length;j++){
      if(s.includes(entry.keywords[j]))return entry;
    }
  }
  return null;
}

function updateRegimeBanner(){
  var mem=getMarketMemory();
  var bar=document.getElementById('regimeBanner');
  if(!bar)return;
  if(!mem||!mem.regime){
    bar.style.display='flex';
    bar.style.background='var(--bg)';
    bar.style.borderBottom='1px solid var(--border)';
    bar.innerHTML='<div style="font-size:12px;color:var(--t3)">No market data saved yet — go to <strong style="color:var(--t1)">Discovery</strong> and run Market Conditions to set it.</div>';
    return;
  }
  var isUp=mem.regime.toLowerCase().includes('uptrend');
  var isDown=mem.regime.toLowerCase().includes('downtrend');
  var color=isUp?'var(--green)':isDown?'var(--red)':'var(--amber)';
  var bg=isUp?'var(--green-bg)':isDown?'var(--red-bg)':'var(--amber-bg)';

  // Check staleness
  var stale=false;
  var staleMsg='';
  if(mem.updated){
    var parts=mem.updated.split(' ');
    var months={January:0,February:1,March:2,April:3,May:4,June:5,July:6,August:7,September:8,October:9,November:10,December:11};
    var parsed=new Date(parseInt(parts[2]),months[parts[1]],parseInt(parts[0]));
    if(!isNaN(parsed)){
      var daysDiff=Math.floor((Date.now()-parsed.getTime())/86400000);
      if(daysDiff>3){stale=true;staleMsg=' · '+daysDiff+'d old — refresh recommended';}
    }
  }

  bar.style.display='flex';
  bar.style.background=bg;
  bar.style.borderBottom='1px solid '+(isUp?'var(--green-mid)':isDown?'var(--red-mid)':'var(--amber-mid)');
  bar.innerHTML=
    '<div style="display:flex;align-items:center;gap:10px;flex:1;flex-wrap:wrap">'+
      '<div style="display:flex;align-items:center;gap:5px">'+
        '<div style="width:7px;height:7px;border-radius:50%;background:'+color+'"></div>'+
        '<div style="font-size:12px;font-weight:700;color:'+color+'">'+esc(mem.regime)+'</div>'+
      '</div>'+
      (mem.spy5day?'<div style="font-size:12px;color:var(--t2)">SPY '+esc(mem.spy5day)+'</div>':'')+
      (mem.qqq5day?'<div style="font-size:12px;color:var(--t2)">· QQQ '+esc(mem.qqq5day)+'</div>':'')+
      (mem.iwm5day?'<div style="font-size:12px;color:var(--t2)">· IWM '+esc(mem.iwm5day)+'</div>':'')+
      (mem.highsVsLows?'<div style="font-size:12px;color:'+(mem.highsVsLows.toLowerCase().includes('expanding')?'var(--green)':mem.highsVsLows.toLowerCase().includes('contracting')?'var(--red)':'var(--t2)')+';">· Breadth: '+esc(mem.highsVsLows.split(' ')[0])+'</div>':'')+
      (mem.vix?'<div style="font-size:12px;color:var(--t2)">· VIX '+esc(mem.vix)+'</div>':'')+
      (mem.topSectors?'<div style="font-size:12px;color:var(--t2)">· <span style="color:var(--green);font-weight:600">&uarr; '+esc(mem.topSectors)+'</span></div>':'')+
      (mem.avoidSectors?'<div style="font-size:12px;color:var(--t2)">· <span style="color:var(--red);font-weight:600">&darr; '+esc(mem.avoidSectors)+'</span></div>':'')+
    '</div>'+
    '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0">'+
      (stale?'<div style="font-size:11px;color:var(--amber);font-weight:600">'+staleMsg+'</div>':
              '<div style="font-size:11px;color:var(--t3)">Updated '+esc(mem.updated||'—')+'</div>')+
      (stale?'<button class="btn btn-ghost btn-sm" style="font-size:11px;padding:3px 10px" onclick="nav(document.querySelector(\'[data-page=discovery]\'));runSectorRotation()">Refresh</button>':'')
    +'</div>';
}

// ── DISCOVERY ──

var SECTOR_ETFS=[
  {ticker:'XLK',name:'Technology'},{ticker:'XLF',name:'Financials'},
  {ticker:'XLE',name:'Energy'},{ticker:'XLV',name:'Healthcare'},
  {ticker:'XLI',name:'Industrials'},{ticker:'XLC',name:'Communication'},
  {ticker:'XLY',name:'Consumer Disc.'},{ticker:'XLP',name:'Consumer Staples'},
  {ticker:'XLRE',name:'Real Estate'},{ticker:'XLU',name:'Utilities'},
  {ticker:'XLB',name:'Materials'},{ticker:'ITA',name:'Defense & Aerospace'},
  {ticker:'UFO',name:'Space'},{ticker:'SOXX',name:'Semiconductors'},{ticker:'IBB',name:'Biotech'}
];

// ── BREADTH STORAGE KEY ──
var BREADTH_KEY='breadthRolling';

function saveDailyBreadth(){
  var raw=document.getElementById('breadthDailyIn').value.trim();
  var status=document.getElementById('breadthSaveStatus');
  if(!raw){status.textContent='Paste today\'s numbers first.';return;}

  // Parse "New Highs: 132\nNew Lows: 28" or just "132\n28"
  var nums=raw.match(/\d+/g);
  if(!nums||nums.length<2){status.textContent='Could not parse — paste two numbers.';return;}
  var highs=parseInt(nums[0]);
  var lows=parseInt(nums[1]);
  if(highs<=0||lows<0){status.textContent='Invalid numbers.';return;}

  // Load existing rolling store (max 5 days)
  var stored=[];
  try{stored=JSON.parse(DB.get(BREADTH_KEY)||'[]');}catch(e){stored=[];}
  if(!Array.isArray(stored))stored=[];

  // Add today — keyed by date so re-saving today overwrites, not duplicates
  var today=new Date().toISOString().slice(0,10);
  stored=stored.filter(function(d){return d.date!==today;});
  stored.unshift({date:today,highs:highs,lows:lows,ratio:highs/lows});
  stored=stored.slice(0,5); // keep last 5 only
  DB.set(BREADTH_KEY,JSON.stringify(stored));

  // Calculate and save breadth signals to market memory
  calculateAndSaveBreadth(stored);
  renderBreadthDisplay(stored);
  document.getElementById('breadthDailyIn').value='';
  status.textContent='✓ Saved — Gate 6 updated';
  setTimeout(function(){status.textContent='';},3000);
}

function calculateAndSaveBreadth(stored){
  if(!stored||stored.length===0)return;

  // Signal 1 — today ratio (20%)
  var current=stored[0];
  var todayRatio=current.ratio;

  // Signal 2 — 5-day average ratio (40%)
  var avgRatio=stored.reduce(function(s,d){return s+d.ratio;},0)/stored.length;

  // Signal 3 — trend (40%) — compare newest 2 vs oldest 2
  var trend='Stable';
  var trendDelta=0;
  if(stored.length>=3){
    var recentAvg=(stored[0].ratio+(stored[1]?stored[1].ratio:stored[0].ratio))/2;
    var olderIdx=stored.length-1;
    var olderAvg=(stored[olderIdx].ratio+(stored[olderIdx-1]?stored[olderIdx-1].ratio:stored[olderIdx].ratio))/2;
    trendDelta=recentAvg-olderAvg;
    trend=trendDelta>0.15?'Improving':trendDelta<-0.15?'Deteriorating':'Stable';
  }

  // Breadth score (0-100 for easy reading)
  // avgRatio * 0.4 + trendBonus * 0.4 + todayRatio * 0.2, scaled to 100
  var trendBonus=trend==='Improving'?0.5:trend==='Deteriorating'?-0.5:0;
  var rawScore=(avgRatio*0.4)+(trendBonus*0.4)+(todayRatio*0.2);
  var breadthScore=Math.max(0,Math.min(100,Math.round(rawScore*40))); // scale: 2.5 ratio = 100

  // Verdict
  var breadthStatus;
  if(avgRatio>=1.5&&trend!=='Deteriorating') breadthStatus='PASS';
  else if(avgRatio>=1.5&&trend==='Deteriorating') breadthStatus='CAUTION';
  else if(avgRatio>=1&&trend==='Improving') breadthStatus='CAUTION';
  else if(avgRatio>=1) breadthStatus='CAUTION';
  else breadthStatus='STOP';

  // Save to market memory
  var mem=getMarketMemory()||{};
  mem.breadthStatus=breadthStatus;
  mem.breadthScore=breadthScore;
  mem.breadthCurrentRatio=todayRatio.toFixed(2);
  mem.breadthAvgRatio=avgRatio.toFixed(2);
  mem.breadthTrend=trend;
  mem.breadthTrendDelta=trendDelta.toFixed(2);
  mem.breadthDays=stored.length;
  mem.newHighs=current.highs;
  mem.newLows=current.lows;
  mem.highsVsLows=breadthStatus==='PASS'?'Expanding':breadthStatus==='STOP'?'Contracting':'Neutral';
  DB.set('marketMemory',mem);
  updateRegimeBanner();
}

function renderBreadthDisplay(stored){
  var out=document.getElementById('breadthRollingDisplay');
  if(!out)return;
  if(!stored||stored.length===0){out.innerHTML='';return;}

  var mem=getMarketMemory()||{};
  var avgRatio=parseFloat(mem.breadthAvgRatio||0);
  var trend=mem.breadthTrend||'Stable';
  var score=mem.breadthScore||0;
  var status=mem.breadthStatus||'CAUTION';
  var statusColor=status==='PASS'?'var(--green)':status==='STOP'?'var(--red)':'var(--amber)';
  var trendColor=trend==='Improving'?'var(--green)':trend==='Deteriorating'?'var(--red)':'var(--t2)';

  out.innerHTML=
    // 3 signal cards
    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:8px">'+
      '<div style="background:var(--surface);border-radius:var(--r3);padding:8px 10px;border:1px solid var(--border2)">'+
        '<div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;margin-bottom:2px">Today <span style="color:var(--blue)">(20%)</span></div>'+
        '<div style="font-size:15px;font-weight:700;color:'+(parseFloat(mem.breadthCurrentRatio)>=1.5?'var(--green)':parseFloat(mem.breadthCurrentRatio)>=1?'var(--amber)':'var(--red)')+'">'+parseFloat(mem.breadthCurrentRatio||0).toFixed(1)+':1</div>'+
        '<div style="font-size:10px;color:var(--t3)">'+mem.newHighs+' H / '+mem.newLows+' L</div>'+
      '</div>'+
      '<div style="background:var(--surface);border-radius:var(--r3);padding:8px 10px;border:1px solid var(--border2)">'+
        '<div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;margin-bottom:2px">'+stored.length+'-day avg <span style="color:var(--blue)">(40%)</span></div>'+
        '<div style="font-size:15px;font-weight:700;color:'+(avgRatio>=1.5?'var(--green)':avgRatio>=1?'var(--amber)':'var(--red)')+'">'+avgRatio.toFixed(1)+':1</div>'+
        '<div style="font-size:10px;color:var(--t3)">'+(stored.length<5?stored.length+'/5 days':'5 days')+'</div>'+
      '</div>'+
      '<div style="background:var(--surface);border-radius:var(--r3);padding:8px 10px;border:1px solid var(--border2)">'+
        '<div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;margin-bottom:2px">Trend <span style="color:var(--blue)">(40%)</span></div>'+
        '<div style="font-size:15px;font-weight:700;color:'+trendColor+'">'+trend+'</div>'+
        '<div style="font-size:10px;color:var(--t3)">Score: '+score+'/100</div>'+
      '</div>'+
    '</div>'+
    // Rolling daily bars
    '<div style="display:flex;gap:4px;align-items:flex-end;height:40px;margin-bottom:4px">'+
    stored.slice().reverse().map(function(d){
      var h=Math.min(100,d.ratio*30);
      var c=d.ratio>=1.5?'var(--green)':d.ratio>=1?'var(--amber)':'var(--red)';
      return'<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">'+
        '<div style="font-size:9px;color:var(--t3)">'+d.ratio.toFixed(1)+'</div>'+
        '<div style="background:'+c+';border-radius:2px;width:100%;height:'+h+'%;min-height:4px;opacity:0.8"></div>'+
        '<div style="font-size:8px;color:var(--t3)">'+d.date.slice(5)+'</div>'+
      '</div>';
    }).join('')+
    '</div>'+
    '<div style="font-size:10px;color:var(--t3)">Gate 6 status: <span style="font-weight:700;color:'+statusColor+'">'+status+'</span> · Tap Refresh on Market Conditions to update gate check</div>';
}

function loadBreadthOnStart(){
  var stored=[];
  try{stored=JSON.parse(DB.get(BREADTH_KEY)||'[]');}catch(e){stored=[];}
  if(Array.isArray(stored)&&stored.length>0){
    calculateAndSaveBreadth(stored);
    renderBreadthDisplay(stored);
  }
}

async function runBreadthFromPaste(){} // kept for safety — replaced by saveDailyBreadth

function runSectorFromPaste(){
  var raw=document.getElementById('breadthPasteIn').value.trim();
  var out=document.getElementById('breadthResult');
  if(!raw){alert('Paste the last 5 days of NYSE new highs and lows first.');return;}

  // Parse rows — accept any whitespace-separated format
  var rows=[];
  raw.split('\n').forEach(function(line){
    var nums=line.match(/\d+/g);
    if(nums&&nums.length>=2){
      var h=parseInt(nums[nums.length-2]);
      var l=parseInt(nums[nums.length-1]);
      if(h>0&&l>0)rows.push({highs:h,lows:l,ratio:h/l});
    }
  });

  if(rows.length<2){
    out.innerHTML='<div style="color:var(--red);font-size:13px">Could not parse — paste at least 2 rows of highs and lows numbers.</div>';
    return;
  }

  // ── SIGNAL 1: Current day ratio (20% weight) ──
  var current=rows[0];
  var currentRatio=current.ratio;

  // ── SIGNAL 2: 5-day average ratio (40% weight) ──
  var avgRatio=rows.reduce(function(s,r){return s+r.ratio;},0)/rows.length;

  // ── SIGNAL 3: Trend over last 5 days (40% weight) ──
  // Compare first 2 days vs last 2 days
  var recentAvg=(rows[0].ratio+(rows[1]?rows[1].ratio:rows[0].ratio))/2;
  var olderAvg=(rows[rows.length-1].ratio+(rows[rows.length-2]?rows[rows.length-2].ratio:rows[rows.length-1].ratio))/2;
  var trendDelta=recentAvg-olderAvg;
  var trend=trendDelta>0.15?'Improving':trendDelta<-0.15?'Deteriorating':'Stable';
  var trendColor=trend==='Improving'?'var(--green)':trend==='Deteriorating'?'var(--red)':'var(--t2)';

  // ── WEIGHTED BREADTH VERDICT ──
  // Avg ratio is 40% weight, trend 40%, current 20%
  var breadthStatus,breadthVerdict,breadthColor,breadthBg;

  if(avgRatio>=1.5&&(trend==='Improving'||trend==='Stable')){
    breadthStatus='PASS';
    breadthVerdict='Healthy breadth — broad participation confirmed';
    breadthColor='var(--green)';breadthBg='var(--green-bg)';
  } else if(avgRatio>=1.5&&trend==='Deteriorating'){
    breadthStatus='CAUTION';
    breadthVerdict='Average ratio healthy but trend is deteriorating — watch closely this week';
    breadthColor='var(--amber)';breadthBg='var(--amber-bg)';
  } else if(avgRatio>=1&&trend==='Improving'){
    breadthStatus='CAUTION';
    breadthVerdict='Ratio borderline but improving — participation starting to broaden';
    breadthColor='var(--amber)';breadthBg='var(--amber-bg)';
  } else if(avgRatio>=1){
    breadthStatus='CAUTION';
    breadthVerdict='Ratio at borderline — not enough stocks participating to confirm rally';
    breadthColor='var(--amber)';breadthBg='var(--amber-bg)';
  } else {
    breadthStatus='STOP';
    breadthVerdict='New lows outnumbering new highs — breadth has broken down. Minervini reduces exposure significantly.';
    breadthColor='var(--red)';breadthBg='var(--red-bg)';
  }

  // Save to memory so gate 6 uses real calculated values
  var mem=getMarketMemory()||{};
  mem.breadthStatus=breadthStatus;
  mem.breadthCurrentRatio=currentRatio.toFixed(2);
  mem.breadthAvgRatio=avgRatio.toFixed(2);
  mem.breadthTrend=trend;
  mem.newHighs=current.highs;
  mem.newLows=current.lows;
  mem.highsVsLows=breadthStatus==='PASS'?'Expanding':breadthStatus==='STOP'?'Contracting':'Neutral';
  DB.set('marketMemory',mem);

  // Render
  out.innerHTML=
    '<div style="background:'+breadthBg+';border-radius:var(--r3);padding:12px 14px;border:1px solid '+breadthColor+';margin-bottom:8px">'+
      '<div style="font-size:10px;font-weight:700;color:'+breadthColor+';text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Breadth — '+breadthStatus+'</div>'+
      '<div style="font-size:14px;font-weight:700;color:'+breadthColor+';margin-bottom:4px">'+esc(breadthVerdict)+'</div>'+
    '</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:8px">'+
      // Signal 1 — current ratio (20% weight)
      '<div style="background:var(--surface);border-radius:var(--r3);padding:9px 11px;border:1px solid var(--border2)">'+
        '<div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.3px;margin-bottom:2px">Today\'s ratio <span style="color:var(--blue)">(20%)</span></div>'+
        '<div style="font-size:16px;font-weight:700;color:'+(currentRatio>=1.5?'var(--green)':currentRatio>=1?'var(--amber)':'var(--red)')+'">'+currentRatio.toFixed(1)+':1</div>'+
        '<div style="font-size:10px;color:var(--t3)">'+current.highs+' highs / '+current.lows+' lows</div>'+
      '</div>'+
      // Signal 2 — 5-day average (40% weight)
      '<div style="background:var(--surface);border-radius:var(--r3);padding:9px 11px;border:1px solid var(--border2)">'+
        '<div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.3px;margin-bottom:2px">5-day avg ratio <span style="color:var(--blue)">(40%)</span></div>'+
        '<div style="font-size:16px;font-weight:700;color:'+(avgRatio>=1.5?'var(--green)':avgRatio>=1?'var(--amber)':'var(--red)')+'">'+avgRatio.toFixed(1)+':1</div>'+
        '<div style="font-size:10px;color:var(--t3)">across '+rows.length+' days</div>'+
      '</div>'+
      // Signal 3 — trend (40% weight)
      '<div style="background:var(--surface);border-radius:var(--r3);padding:9px 11px;border:1px solid var(--border2)">'+
        '<div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.3px;margin-bottom:2px">5-day trend <span style="color:var(--blue)">(40%)</span></div>'+
        '<div style="font-size:16px;font-weight:700;color:'+trendColor+'">'+trend+'</div>'+
        '<div style="font-size:10px;color:var(--t3)">'+(trendDelta>=0?'+':'')+trendDelta.toFixed(2)+' ratio change</div>'+
      '</div>'+
    '</div>'+
    // Daily rows
    '<div style="font-size:11px;color:var(--t3);margin-bottom:3px;font-weight:600">Daily breakdown (most recent first):</div>'+
    '<div style="display:grid;grid-template-columns:repeat('+rows.length+',1fr);gap:4px">'+
    rows.map(function(r,i){
      var c=r.ratio>=1.5?'var(--green)':r.ratio>=1?'var(--amber)':'var(--red)';
      return'<div style="background:var(--surface);border-radius:var(--r3);padding:6px 8px;text-align:center">'+
        '<div style="font-size:11px;font-weight:700;color:'+c+'">'+r.ratio.toFixed(1)+':1</div>'+
        '<div style="font-size:10px;color:var(--t3)">'+r.highs+'/'+r.lows+'</div>'+
      '</div>';
    }).join('')+
    '</div>';

  // Re-run gate display if market conditions are already showing
  var mcOut=document.getElementById('sectorIndicatorResult');
  if(mcOut&&mcOut.innerHTML.includes('Gate check')){
    // Trigger a soft refresh of just the gate display
    var refreshNote=document.createElement('div');
    refreshNote.style.cssText='font-size:11px;color:var(--blue);margin-top:6px';
    refreshNote.textContent='✓ Breadth saved to memory — tap Refresh to update gate check with new breadth data.';
    out.appendChild(refreshNote);
  }
}

async function runSectorFromPaste(){
  var raw=document.getElementById('sectorPasteIn').value.trim();
  if(!raw){alert('Paste the sector data from Finviz first.');return;}
  var out=document.getElementById('sectorResult');
  var btn=event.target;
  btn.textContent='Warren reading...';btn.disabled=true;
  out.innerHTML='<div style="text-align:center;padding:12px"><div class="loader"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div></div>';
  var today=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  var mem=getMarketMemory()||{};

  var prompt='You are Warren applying Minervini SEPA methodology. Today is '+today+'. No disclaimers.\n\n'+
    'The investor has pasted sector performance data from Finviz:\n\n'+
    raw+'\n\n'+
    'MINERVINI SECTOR RULES — apply strictly. This is a shift from 1-week/1-month to 1-month/3-month, focused on finding sectors where institutional buying is genuinely ACCELERATING, not just historically strong:\n\n'+
    'RULE 1 — THE BASELINE (3-month is the anchor):\n'+
    'A sector only qualifies if its 3-month performance is POSITIVE. This proves sustained institutional accumulation over a full quarter — not a one-off bounce. Negative 3-month = disqualified immediately, regardless of what 1-month looks like.\n\n'+
    'RULE 2 — THE TRIGGER (1-month acceleration):\n'+
    'For every sector that passes Rule 1, calculate:\n'+
    '  Step 1: Implied monthly rate = 3M% divided by 3\n'+
    '  Step 2: Acceleration = 1M% minus implied monthly rate\n'+
    '  Step 3: Higher acceleration = institutions are stepping up their buying pace RIGHT NOW = higher priority\n'+
    'Example: 3M +15% → implied monthly rate +5%. If 1M is +10%, acceleration = +5% (institutions aggressively stepping up the pace). If 1M is only +2%, acceleration = -3% (decelerating — lower priority even though it still technically qualifies).\n\n'+
    'RULE 3 — THE CONTRADICTION KILL-SWITCH (overrides Rule 1 qualification):\n'+
    'If a sector is positive on 3-month but NEGATIVE on 1-month, the trend has stalled or institutions are distributing. DISQUALIFY it immediately — no matter how strong the 3-month number looks on its own. A strong quarter with a negative current month is a warning sign, not a leader.\n\n'+
    'RULE 4 — OUTPUT EXACTLY THE TOP 3, NO MORE:\n'+
    'Rank every sector that survives Rules 1-3 by acceleration score. Output ONLY the top 3 as "Accelerating Leaders" — never a 4th, even if more sectors technically qualify. Individual stock scans are strictly limited to these top 3 sectors this cycle. Precision beats breadth here.\n\n'+
    'Output ONLY in this exact format:\n\n'+
    'MEMORY BLOCK:\n'+
    'TOP_SECTORS: [exactly the top 3 Accelerating Leaders, comma separated, strongest first — never more than 3]\n'+
    'AVOID_SECTORS: [every sector disqualified by Rule 1 or the Rule 3 kill-switch — comma separated]\n'+
    'UPDATED: '+today+'\n\n'+
    'SECTOR RANKINGS (ALL sectors sorted by 3M, best to worst):\n'+
    '[Sector name]: 1M: [+/-X.X%] | 3M: [+/-X.X%] | [ACCELERATING #N (accel: +/-X.X%) or DISQUALIFIED (baseline/kill-switch) or QUALIFIES — NOT TOP 3]\n'+
    '(include every sector — do not skip any)\n\n'+
    'TOP 3 ACCELERATING LEADERS:\n'+
    '#1 [Sector]: acceleration +/-X.X% — [one sentence: how aggressively is buying pace stepping up]\n'+
    '#2 [Sector]: acceleration +/-X.X% — [one sentence]\n'+
    '#3 [Sector]: acceleration +/-X.X% — [one sentence]\n'+
    '(exactly 3 — if fewer than 3 sectors qualify, list only those that do and say so)\n\n'+
    'DISQUALIFIED:\n'+
    '[Sector]: [one sentence — failed the 3-month baseline, or hit the 1-month kill-switch]\n\n'+
    "MINERVINI'S FOCUS: [one sentence — the single #1 accelerating sector and why it leads]\n\n"+
    'Numbers only from the pasted data. No options sentiment. Pure price-based sector rotation.';

  try{
    var resp=await fetch(RAILWAY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      model:'claude-sonnet-5',max_tokens:4000,
      messages:[{role:'user',content:prompt}]
    })});
    var data=await resp.json();
    if(data.error){out.innerHTML='<div style="color:var(--red);font-size:13px">API error: '+esc((data.error.message||'').slice(0,200))+'</div>';btn.textContent='Warren reads this';btn.disabled=false;return;}
    var blocks=(data.content||[]).filter(function(b){return b.type==='text';});
    var text=blocks[blocks.length-1]&&blocks[blocks.length-1].text||'';
    if(!text){out.innerHTML='<div style="color:var(--red);font-size:13px">No response. Try again.</div>';btn.textContent='Warren reads this';btn.disabled=false;return;}

    // Parse memory
    var newMem=Object.assign({},mem);
    text.split('\n').forEach(function(line){
      var l=line.trim();
      if(/^TOP_SECTORS:/i.test(l))newMem.topSectors=l.replace(/^TOP_SECTORS:\s*/i,'');
      else if(/^AVOID_SECTORS:/i.test(l))newMem.avoidSectors=l.replace(/^AVOID_SECTORS:\s*/i,'');
      else if(/^UPDATED:/i.test(l))newMem.updated=l.replace(/^UPDATED:\s*/i,'');
    });
    // Hard safety cap — never allow more than 3 in topSectors even if the model
    // ignored the instruction and listed more. Sector selection exclusivity is
    // enforced in code, not left to the model's compliance alone.
    if(newMem.topSectors){
      var capped=newMem.topSectors.split(',').map(function(s){return s.trim();}).filter(Boolean).slice(0,3);
      newMem.topSectors=capped.join(', ');
    }
    DB.set('marketMemory',newMem);
    updateRegimeBanner();

    // Parse sections
    var sectorLines=[],leadLines=[],avoidLines=[],focusLines=[],section='';
    text.split('\n').forEach(function(line){
      var l=line.trim();
      if(!l||/^MEMORY BLOCK/i.test(l)||/^(TOP_SECTORS|AVOID_SECTORS|UPDATED):/i.test(l))return;
      if(/^SECTOR RANK/i.test(l)){section='sectors';return;}
      if(/^TOP\s*3\s*ACCELERATING/i.test(l)){
        var inline=l.replace(/^TOP\s*3\s*ACCELERATING[^:]*:\s*/i,'').trim();
        if(inline.length>5)leadLines.push(inline);
        section='lead';return;
      }
      if(/^DISQUALIFIED/i.test(l)){
        var inline=l.replace(/^DISQUALIFIED[^:]*:\s*/i,'').trim();
        if(inline.length>5)avoidLines.push(inline);
        section='avoid';return;
      }
      if(/^MINERVINI'?S?\s*FOCUS/i.test(l)){
        var inline=l.replace(/^MINERVINI'?S?\s*FOCUS[:\s]*/i,'').trim();
        if(inline.length>5)focusLines.push(inline);
        section='focus';return;
      }
      if(section==='sectors'&&l.match(/[+-]?[\d.]+%/))sectorLines.push(l);
      else if(section==='lead'&&l.length>5&&leadLines.length<3)leadLines.push(l); // hard cap at 3, matches Rule 4
      else if(section==='avoid'&&l.length>5)avoidLines.push(l);
      else if(section==='focus'&&l.length>5)focusLines.push(l);
    });

    // Render
    var dashHtml=
      (sectorLines.length?
        '<div style="margin-bottom:14px">'+
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'+
            '<div style="font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.5px">Sector Rankings — 3M Baseline / 1M Acceleration</div>'+
            '<div style="font-size:10px;color:var(--t3)">3M = quarter baseline &middot; 1M = acceleration trigger</div>'+
          '</div>'+
          '<div style="display:grid;gap:3px">'+
          sectorLines.map(function(line){
            var isLead=/ACCELERATING/i.test(line);
            var isAvoid=/DISQUALIFIED/i.test(line);
            var bg=isLead?'var(--green-bg)':isAvoid?'var(--red-bg)':'var(--bg)';
            var parts=line.split(':');var name=parts[0].trim();var rest=parts.slice(1).join(':').trim();
            var m1m=rest.match(/1M:\s*([+-]?[\d.]+%)/i);var m3m=rest.match(/3M:\s*([+-]?[\d.]+%)/i);
            var rankM=rest.match(/ACCELERATING\s*#(\d+)/i);
            var accelM=rest.match(/accel:\s*([+-]?[\d.]+%)/i);
            var v1=m1m?m1m[1]:'';var v3=m3m?m3m[1]:'';
            var v1col=v1.startsWith('-')?'var(--red)':'var(--green)';
            var v3col=v3.startsWith('-')?'var(--red)':'var(--t3)';
            var badge=isLead?
              '<span style="font-size:9px;font-weight:700;color:var(--green);background:var(--green-bg);border:1px solid var(--green);padding:1px 5px;border-radius:3px;margin-left:6px">'+
                (rankM?'#'+rankM[1]+' ACCEL':'ACCEL')+
              '</span>':isAvoid?
              '<span style="font-size:9px;font-weight:700;color:var(--red);background:var(--red-bg);border:1px solid var(--red);padding:1px 5px;border-radius:3px;margin-left:6px">DISQUALIFIED</span>':
              '<span style="font-size:9px;font-weight:700;color:var(--t3);background:var(--surface);border:1px solid var(--border2);padding:1px 5px;border-radius:3px;margin-left:6px">QUALIFIES — NOT TOP 3</span>';
            return'<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:'+bg+';border-radius:var(--r4)">'+
              '<div style="display:flex;align-items:center;font-size:13px;color:var(--t1)">'+esc(name)+badge+'</div>'+
              '<div style="display:flex;gap:12px;align-items:center">'+
                (accelM?'<div style="font-size:10px;color:var(--t3);font-variant-numeric:tabular-nums">accel '+esc(accelM[1])+'</div>':'')+
                (v3?'<div style="font-size:11px;color:'+v3col+';font-variant-numeric:tabular-nums">3M: '+esc(v3)+'</div>':'')+
                (v1?'<div style="font-size:13px;font-weight:700;color:'+v1col+';font-variant-numeric:tabular-nums">'+esc(v1)+'</div>':'')+
              '</div>'+
            '</div>';
          }).join('')+
          '</div></div>':'')+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">'+
        (leadLines.length?'<div style="background:var(--green-bg);border-radius:var(--r3);padding:11px 13px;border-left:3px solid var(--green)"><div style="font-size:10px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.4px;margin-bottom:7px">↑ Top 3 Accelerating Leaders</div>'+leadLines.map(function(l){return'<div style="font-size:13px;color:var(--t1);margin-bottom:5px;line-height:1.5">'+esc(l)+'</div>';}).join('')+'</div>':'')+
        (avoidLines.length?'<div style="background:var(--red-bg);border-radius:var(--r3);padding:11px 13px;border-left:3px solid var(--red)"><div style="font-size:10px;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:.4px;margin-bottom:7px">&darr; Disqualified</div>'+avoidLines.map(function(l){return'<div style="font-size:13px;color:var(--t1);margin-bottom:5px;line-height:1.5">'+esc(l)+'</div>';}).join('')+'</div>':'')+
      '</div>'+
      (focusLines.length?'<div style="background:var(--blue-bg);border-radius:var(--r3);padding:11px 13px;border-left:3px solid var(--blue);margin-bottom:10px"><div style="font-size:10px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Minervini\'s focus this week</div>'+focusLines.map(function(l){return'<div style="font-size:13px;color:var(--t1);line-height:1.65">'+esc(l)+'</div>';}).join('')+'</div>':'');

    out.innerHTML=dashHtml||'<div style="color:var(--t3);font-size:13px">No sector data parsed.</div>';
    btn.textContent='Warren reads this';btn.disabled=false;
  }catch(e){
    out.innerHTML='<div style="color:var(--red);font-size:13px">Error: '+esc(e.message)+'</div>';
    btn.textContent='Warren reads this';btn.disabled=false;
  }
}

async function runSectorRotation(){
  var btn=document.getElementById('sectorBtn');
  var out=document.getElementById('sectorIndicatorResult');
  btn.textContent='Checking...';btn.disabled=true;
  var today=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});

  // ── CALL 1: Market indicators (SPY, QQQ, IWM, VIX, breadth) ──
  // Minervini market timing — fetches only what SEPA uses. VIX is context/feel only, never a gate.
  out.innerHTML='<div style="text-align:center;padding:16px"><div class="loader"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div><div style="font-size:13px;color:var(--t3);margin-top:8px">Fetching Minervini market timing signals...</div></div>';

  // Call 1A: SPY/QQQ/IWM — 1 fetch each, max 3 pages
  var p1a='Data tool. Today is '+today+'. Do exactly 2 searches, output 8 lines, stop.\n\nSearch 1: \"SPY QQQ IWM performance week today 50 day moving average\" — get SPY 5-day %, whether SPY above/below 50MA and 200MA, QQQ 5-day %, IWM 5-day %.\nSearch 2: fetch https://finance.yahoo.com/quote/%5EVIX for VIX level. Then search \"NYSE new highs new lows today\" and use the FIRST result only — get NYSE 52-week new highs count and new lows count for today specifically. Expanding = highs > lows. Contracting = lows > highs.\n\nOutput ONLY these 8 lines:\nSPY_5DAY: [+/-X.X%]\nSPY_REGIME: [Above both MAs/Below 50MA/Below both MAs]\nQQQ_5DAY: [+/-X.X%]\nIWM_5DAY: [+/-X.X%]\nVIX: [number — Calm/Normal/Elevated/Fearful/Panic]\nNEW_HIGHS: [NYSE 52-week highs today]\nNEW_LOWS: [NYSE 52-week lows today]\nHIGHS_VS_LOWS: [Expanding/Contracting/Neutral]\n8 lines only. Stop.';

  // Call 1B: VIX + breadth search
  var p1b='Data tool. Today is '+today+'.\nFetch https://finance.yahoo.com/quote/%5EVIX — get VIX level.\nSearch: "NYSE new highs new lows today breadth" — get approximate count.\nOutput ONLY 4 lines:\nVIX: [number — Calm/Normal/Elevated/Fearful/Panic]\nNEW_HIGHS: [number]\nNEW_LOWS: [number]\nHIGHS_VS_LOWS: [Expanding/Contracting/Neutral]\n4 lines only.';


  var indicators={};
  try{
    // Call FMP endpoint with timeout
    var fmpController=new AbortController();
    var fmpTimeout=setTimeout(function(){fmpController.abort();},10000);
    var r1=await fetch(RAILWAY+'/fmp/market-conditions',{signal:fmpController.signal});
    clearTimeout(fmpTimeout);
    var fmpData=await r1.json();

    if(fmpData.error){
      console.log('FMP error:', fmpData.error);
      out.innerHTML='<div style="color:var(--red);font-size:13px;padding:8px">FMP error: '+esc(fmpData.error)+'<br>Check Railway logs — FMP_API_KEY may not be set correctly.</div>';
      btn.textContent='Fetch now';btn.disabled=false;return;
    }

    console.log('FMP raw:', JSON.stringify(fmpData).slice(0,400));

    // ── PARSE FMP DATA INTO MINERVINI GATE INPUTS ──
    var spy=fmpData.spy||{};
    var spyPrice=spy.price||0;
    var ma50=spy.priceAvg50||0;
    var ma150=spy.priceAvg150||spy.priceAvg50||0; // fallback to 50 if 150 not returned
    var ma200=spy.priceAvg200||0;
    var ma200slope=spy.ma200Slope||fmpData.spy200slope||null;
    var vixVal=parseFloat(fmpData.vix||0);

    // QQQ gets the exact same treatment as SPY — Minervini weighs Nasdaq equally, and growth
    // leaders often confirm Stage 2 weeks before the broader index does.
    var qqq=fmpData.qqq||{};
    var qqqPrice=qqq.price||0;
    var qqqMa50=qqq.priceAvg50||0;
    var qqqMa150=qqq.priceAvg150||qqq.priceAvg50||0;
    var qqqMa200=qqq.priceAvg200||0;
    var qqqMa200slope=qqq.ma200Slope||fmpData.qqq200slope||null;
    var qqqConfirmed=!!(qqqMa50&&qqqMa150&&qqqMa200&&qqqPrice>qqqMa50&&qqqPrice>qqqMa150&&qqqPrice>qqqMa200&&qqqMa150>qqqMa200&&qqqMa200slope==='Rising');
    var qqqBroken=!!(qqqMa200&&qqqPrice<qqqMa200&&qqqMa200slope==='Falling');

    // ── STEP 2: MARKET BREADTH — Method 2: Volume-Weighted Batch Quote Check ──
    // Only runs if the market is NOT already in a Confirmed Bear state — a quick preview
    // classification using the already-hoisted indexStage2Status() (defined later in this
    // function, but function declarations are hoisted so it's callable here). If both
    // indices are fully broken, breadth doesn't change the answer, so skip the extra fetch.
    var spyStage2Preview=indexStage2Status(spyPrice,ma50,ma150,ma200);
    var qqqStage2Preview=indexStage2Status(qqqPrice,qqqMa50,qqqMa150,qqqMa200);
    var wouldBeConfirmedBear=spyStage2Preview==='below_all'&&qqqStage2Preview==='below_all';

    var breadthCheckData=null;
    if(!wouldBeConfirmedBear){
      try{
        var breadthController=new AbortController();
        var breadthTimeout=setTimeout(function(){breadthController.abort();},15000);
        var rBreadth=await fetch(RAILWAY+'/fmp/breadth-check',{signal:breadthController.signal});
        clearTimeout(breadthTimeout);
        breadthCheckData=await rBreadth.json();
      }catch(e){breadthCheckData=null;}
    }
    var advanceRatio=(breadthCheckData&&breadthCheckData.advanceRatio!==null&&breadthCheckData.advanceRatio!==undefined)?breadthCheckData.advanceRatio:null;
    indicators.advanceRatio=advanceRatio;
    indicators.breadthAdvances=breadthCheckData?breadthCheckData.advances:null;
    indicators.breadthDeclines=breadthCheckData?breadthCheckData.declines:null;
    indicators.breadthUniverseSize=breadthCheckData?breadthCheckData.total:null;

    // Save to indicators for memory
    indicators.spyPrice=spyPrice;
    indicators.spyMA50=ma50;
    indicators.spyMA150=ma150;
    indicators.spyMA200=ma200;
    indicators.spy200slope=ma200slope;
    indicators.qqqPrice=qqqPrice;
    indicators.qqqMA50=qqqMa50;
    indicators.qqqMA150=qqqMa150;
    indicators.qqqMA200=qqqMa200;
    indicators.qqq200slope=qqqMa200slope;
    indicators.vix=vixVal.toFixed(2)+' — '+(vixVal<15?'Calm':vixVal<20?'Normal':vixVal<25?'Elevated':vixVal<30?'Fearful':'Panic');
    if(fmpData.qqq)indicators.qqq5day=(parseFloat(fmpData.qqq.change5d||0)>=0?'+':'')+parseFloat(fmpData.qqq.change5d||0).toFixed(2)+'%';
    if(fmpData.iwm)indicators.iwm5day=(parseFloat(fmpData.iwm.change5d||0)>=0?'+':'')+parseFloat(fmpData.iwm.change5d||0).toFixed(2)+'%';

    // ── MINERVINI GATE CALCULATION — weighted per his actual methodology ──
    var hardStop=false;
    var softStop=false;
    var cautionCount=0;
    var gates=[];

    // Gate 1 — 200MA Slope (CRITICAL)
    var g1slope=ma200slope==='Rising'?'PASS':ma200slope==='Flat'?'CAUTION':'STOP';
    gates.push({status:g1slope,label:'200MA Slope',priority:'CRITICAL',
      why:'The 200MA slope determines market stage. Falling 200MA = Stage 4. Minervini never buys in Stage 4.',
      detail:ma200slope==='Rising'?'Rising — Stage 2 uptrend intact':ma200slope==='Flat'?'Flat — Stage 2 not yet confirmed':ma200slope==='Falling'?'Falling — Stage 4 decline. Go to cash.':'Unknown — check manually'});
    if(g1slope==='STOP')hardStop=true;
    if(g1slope==='CAUTION')cautionCount++;

    // Gate 2 — Price vs 200MA (CRITICAL)
    var g2status=(!ma200||spyPrice>ma200)?'PASS':'STOP';
    gates.push({status:g2status,label:'SPY vs 200MA',priority:'CRITICAL',
      why:"Price below 200MA = Stage 4 decline. Minervini's most absolute rule. No longs below 200MA, ever.",
      detail:ma200?(spyPrice>ma200?'$'+spyPrice.toFixed(2)+' above $'+ma200.toFixed(2)+' (+'+((spyPrice/ma200-1)*100).toFixed(1)+'%)':'SPY $'+spyPrice.toFixed(2)+' BELOW 200MA $'+ma200.toFixed(2)+' — go to cash'):'No 200MA data'});
    if(g2status==='STOP')hardStop=true;

    // Gate 3 — Price vs 150MA (HIGH)
    if(ma150&&ma150!==ma50){
      var g3status=spyPrice>ma150?'PASS':'STOP';
      gates.push({status:g3status,label:'SPY vs 150MA',priority:'HIGH',
        why:'150MA confirms Stage 2 is mature. Below 150MA = Stage 2 not fully confirmed. No new entries.',
        detail:spyPrice>ma150?'$'+spyPrice.toFixed(2)+' above 150MA $'+ma150.toFixed(2)+' — Stage 2 confirmed':'SPY below 150MA $'+ma150.toFixed(2)+' — no new entries'});
      if(g3status==='STOP')softStop=true;
    }

    // Gate 4 — Price vs 50MA (MEDIUM — caution not hard stop)
    var g4status=(!ma50||spyPrice>ma50)?'PASS':'CAUTION';
    gates.push({status:g4status,label:'SPY vs 50MA',priority:'MEDIUM',
      why:'Below 50MA = pressure but not a downtrend if 200MA still rising. Minervini reduces size, stays selective.',
      detail:ma50?(spyPrice>ma50?'$'+spyPrice.toFixed(2)+' above 50MA $'+ma50.toFixed(2)+' — no pressure':'SPY $'+spyPrice.toFixed(2)+' below 50MA $'+ma50.toFixed(2)+' — reduce new position size'):'No 50MA data'});
    if(g4status==='CAUTION')cautionCount++;

    // Gate 5 — 150MA vs 200MA alignment (MEDIUM)
    if(ma150&&ma150!==ma50&&ma200){
      var g5status=ma150>ma200?'PASS':'CAUTION';
      gates.push({status:g5status,label:'150MA vs 200MA',priority:'MEDIUM',
        why:'When 150MA is above 200MA, Stage 2 is maturing properly. Misaligned MAs suggest early or late-stage transition.',
        detail:ma150>ma200?'150MA ($'+ma150.toFixed(2)+') above 200MA ($'+ma200.toFixed(2)+') — MAs aligned':'150MA ($'+ma150.toFixed(2)+') below 200MA ($'+ma200.toFixed(2)+') — not yet aligned'});
      if(g5status==='CAUTION')cautionCount++;
    }

    // Gate 6 — New Highs vs Lows (SUPPORTING — use pasted breadth data if available)
    var mem0=getMarketMemory()||{};
    var newH=parseInt(mem0.newHighs||0);
    var newL=parseInt(mem0.newLows||0);
    var savedBreadthStatus=mem0.breadthStatus||null;
    var savedAvgRatio=parseFloat(mem0.breadthAvgRatio||0);
    var savedTrend=mem0.breadthTrend||null;
    var g6status,g6detail;

    if(savedBreadthStatus){
      // Use full calculated breadth from paste
      g6status=savedBreadthStatus;
      g6detail=(savedAvgRatio?'5-day avg '+savedAvgRatio+':1 ratio':'')+
        (savedTrend?' · Trend: '+savedTrend:'')+
        (newH&&newL?' · Today: '+newH+' highs / '+newL+' lows':'');
    } else if(newH>0&&newL>0){
      // Fall back to single-day ratio
      var breadthRatio=newH/newL;
      if(breadthRatio>=1.5){g6status='PASS';g6detail=newH+' highs / '+newL+' lows ('+breadthRatio.toFixed(1)+':1) — single day snapshot';}
      else if(breadthRatio>=1){g6status='CAUTION';g6detail=newH+' highs / '+newL+' lows ('+breadthRatio.toFixed(1)+':1) — paste 5-day data for accurate read';}
      else{g6status='STOP';g6detail=newH+' highs / '+newL+' lows — lows outnumber highs';}
    } else {
      g6status='CAUTION';
      g6detail='No breadth data — paste 5 days of NYSE highs/lows in the Breadth section below for accurate signal';
    }
    gates.push({status:g6status,label:'New Highs vs Lows',priority:'SUPPORTING',
      why:'Minervini watches the 5-day trend and average ratio — not one day. Paste breadth data below for the full 3-signal calculation (today ratio 20%, 5-day avg 40%, trend 40%).',
      detail:g6detail});
    if(g6status==='CAUTION')cautionCount++;
    if(g6status==='STOP')cautionCount+=2;

    // Gate 7 — QQQ Stage 2 confirmation (CRITICAL — equal weight to SPY, shown for transparency)
    var g7status,g7detail;
    if(qqqMa50&&qqqMa150&&qqqMa200){
      g7status=qqqConfirmed?'PASS':qqqBroken?'STOP':'CAUTION';
      g7detail='QQQ $'+qqqPrice.toFixed(2)+' vs 50MA $'+qqqMa50.toFixed(2)+' / 150MA $'+qqqMa150.toFixed(2)+' / 200MA $'+qqqMa200.toFixed(2)+(qqqMa200slope?' — 200MA '+qqqMa200slope:'')+(qqqConfirmed?' — Stage 2 confirmed on Nasdaq':qqqBroken?' — Nasdaq breaking down':' — not fully confirmed');
    } else {
      g7status='CAUTION';g7detail='QQQ MA data unavailable — verify manually';
    }
    gates.push({status:g7status,label:'QQQ Stage 2 (Nasdaq)',priority:'CRITICAL',
      why:'Growth leaders live on the Nasdaq. The Dual-Engine matrix below uses SPY and QQQ together, with equal weight, to classify the market stage.',
      detail:g7detail});

    // ── DUAL-ENGINE MARKET STAGE MATRIX ──
    // Precise per-index classification: the 150-day and 200-day SMAs act as a CONJOINED
    // structural floor (macro stage) — an index below them cannot be in a healthy Stage 2
    // uptrend, full stop. The 50-day SMA is the separate momentum trigger — first line to
    // break in a selloff, first line reclaimed in a bottoming attempt. This produces four
    // precise states instead of a vague "partial" bucket:
    //   below_all              — price below 50, 150, AND 200 (Confirmed Bear for this index)
    //   early_bounce            — reclaimed 50, still below BOTH 150 and 200 (bottoming attempt)
    //   distribution_pullback   — below 50, but still above BOTH 150 and 200 (momentum stall,
    //                             macro trend structurally intact)
    //   above_all               — above 50, 150, AND 200 (candidate Bull) — but only "clean"
    //                             if additionally 50MA>150MA>200MA are aligned in that order;
    //                             price above all three without that alignment is not yet a
    //                             confirmed bull structure, just price running ahead of the MAs.
    function indexStage2Status(price,iMa50,iMa150,iMa200){
      if(!iMa50||!iMa150||!iMa200)return'unknown';
      var above50=price>iMa50,above150=price>iMa150,above200=price>iMa200;
      var aligned=iMa50>iMa150&&iMa150>iMa200;
      if(above50&&above150&&above200)return aligned?'above_all':'above_all_unaligned';
      if(!above50&&!above150&&!above200)return'below_all';
      if(above50&&!above150&&!above200)return'early_bounce';
      if(!above50&&above150&&above200)return'distribution_pullback';
      return'mixed'; // rare combos not cleanly covered (e.g. above 150 but not 200)
    }
    var spyStage2=spyStage2Preview;
    var qqqStage2=qqqStage2Preview;

    var STAGE_LABELS={
      below_all:'Confirmed Bear (below 50/150/200)',
      early_bounce:'Early Bounce — reclaimed 50MA, still below 150/200 (Transition: Early Bottoming)',
      distribution_pullback:'Distribution/Pullback — below 50MA, still above 150/200 (Transition: Intermediate Correction)',
      above_all:'Confirmed Bull (above 50/150/200, MAs aligned)',
      above_all_unaligned:'Above all three, but MAs not yet aligned (50/150/200 out of order) — not a clean confirmed bull structure',
      mixed:'Mixed — does not cleanly fit one state',
      unknown:'MA data unavailable'
    };
    // Surface the precise per-index diagnosis on the SPY and QQQ gate rows, not just a
    // generic partial/strength label.
    gates[1].detail+=' — '+STAGE_LABELS[spyStage2];
    gates[gates.length-1].detail+=' — '+STAGE_LABELS[qqqStage2];

    // For cross-matrix purposes: treat below_all as broken, above_all (clean, aligned) as
    // confirmed, above_all/above_all_unaligned as "strong", and early_bounce/distribution_pullback
    // as their own named partial states — checked symmetrically (either index, or both
    // agreeing) rather than only specific asymmetric SPY-vs-QQQ role combinations.
    var spyBroken=spyStage2==='below_all', spyConfirmedClean=spyStage2==='above_all';
    var qqqBrokenState=qqqStage2==='below_all', qqqConfirmedClean=qqqStage2==='above_all';
    var spyStrong=spyConfirmedClean||spyStage2==='above_all_unaligned';
    var qqqStrong=qqqConfirmedClean||qqqStage2==='above_all_unaligned';
    var spyEarlyBounce=spyStage2==='early_bounce', qqqEarlyBounce=qqqStage2==='early_bounce';
    var spyDistPullback=spyStage2==='distribution_pullback', qqqDistPullback=qqqStage2==='distribution_pullback';

    var verdict,verdictSub,verdictColor,verdictBg,dualRegime;
    if(spyBroken&&qqqBrokenState){
      verdict='CONFIRMED BEAR MARKET';
      verdictSub='SPY and QQQ are both below all key moving averages. 100% cash — total defense. Breakouts will consistently fail here; institutional selling pressure overwhelms any momentum.';
      verdictColor='var(--red)';verdictBg='var(--red-bg)';dualRegime='Downtrend';
    } else if(spyConfirmedClean&&qqqConfirmedClean){
      verdict='CONFIRMED BULL MARKET';
      verdictSub='Both SPY and QQQ are above all key moving averages, with 50MA above 150MA above 200MA on both — a clean, aligned Stage 2 structure. Full offense: buy breakouts heavily.';
      verdictColor='var(--green)';verdictBg='var(--green-bg)';dualRegime='Uptrend';
    } else if(spyBroken&&qqqStrong){
      verdict='TRANSITION (AGGRESSIVE)';
      verdictSub='SPY is below its MAs, but QQQ/Nasdaq has already reclaimed its full structure — growth is leading the way. Pilot positions only: small size in the strongest leaders, in leading growth sectors. Do not fully deploy until SPY confirms too.';
      verdictColor='var(--amber)';verdictBg='var(--amber-bg)';dualRegime='Transitioning';
    } else if(qqqBrokenState&&spyStrong){
      verdict='TRANSITION (DEFENSIVE)';
      verdictSub='SPY is holding up (above all its MAs) but QQQ/Nasdaq is below all its moving averages — this often signals a fake rally or defensive/value-led churn rather than a real new uptrend. Stay cautious on growth entries; avoid chasing strength that isn\'t confirmed by the Nasdaq.';
      verdictColor='var(--amber)';verdictBg='var(--amber-bg)';dualRegime='Transitioning';
    } else if((spyEarlyBounce||qqqEarlyBounce)&&!spyDistPullback&&!qqqDistPullback){
      verdict='TRANSITION (EARLY BOTTOMING)';
      verdictSub=(spyEarlyBounce&&qqqEarlyBounce?'Both SPY and QQQ have':(spyEarlyBounce?'SPY has':'QQQ/Nasdaq has'))+' just reclaimed the 50MA while still below the 150/200MA structural floor — a classic bottom-fishing rally or early cyclical turn. Minervini will not buy the indexes here, but starts hunting for elite individual stocks that have already reclaimed all three of their own averages ahead of the market. Scan only — do not size up broadly yet.';
      verdictColor='var(--amber)';verdictBg='var(--amber-bg)';dualRegime='Transitioning';
    } else if((spyDistPullback||qqqDistPullback)&&!spyEarlyBounce&&!qqqEarlyBounce){
      verdict='TRANSITION (INTERMEDIATE CORRECTION)';
      verdictSub=(spyDistPullback&&qqqDistPullback?'Both SPY and QQQ have':(spyDistPullback?'SPY has':'QQQ/Nasdaq has'))+' dropped below the 50MA but still holds above the 150/200MA structural floor — the macro bull market is technically intact, but intermediate momentum has stalled. Institutions are distributing or sitting on their hands. Freeze new buying, trail stops on existing winners, and wait for the 50MA to be cleanly reclaimed before buying new breakouts.';
      verdictColor='var(--amber)';verdictBg='var(--amber-bg)';dualRegime='Transitioning';
    } else {
      verdict='TRANSITION (MIXED SIGNALS)';
      verdictSub='SPY and QQQ are not cleanly aligned in either direction (partial/choppy on at least one, or genuinely contradictory — e.g. one bottoming while the other stalls). Stay selective — favor only A+ VCP setups in the leading sectors, reduce size until one engine confirms clearly.';
      verdictColor='var(--amber)';verdictBg='var(--amber-bg)';dualRegime='Transitioning';
    }
    // Breadth (Gate 6, highs/lows) still matters as a sizing modifier within the matrix
    // stage, even though it no longer changes the primary Bear/Transition/Bull classification.
    if(cautionCount>=2&&dualRegime!=='Downtrend'){
      verdictSub+=' Breadth and other supporting signals are weak on top of this — size down further than the stage alone would suggest.';
    }

    // Gate 8 — Advance/Decline Breadth (Method 2: Volume-Weighted Batch Quote Check)
    var g8status,g8detail;
    if(advanceRatio!==null){
      g8status=advanceRatio>70?'PASS':advanceRatio<40?'STOP':'CAUTION';
      g8detail=advanceRatio.toFixed(1)+'% advancing ('+breadthCheckData.advances+' of '+breadthCheckData.total+' in the tracked growth universe)';
    } else {
      g8status='CAUTION';g8detail='Breadth check unavailable this run — verify manually';
    }
    gates.push({status:g8status,label:'Advance/Decline Breadth',priority:'SUPPORTING',
      why:'How many individual leading stocks are actually participating today — a real-time complement to the SPY/QQQ moving-average structure. Strong breadth (>70% advancing) during a transition is one of Minervini\'s key confirming signals; weak breadth (<40%) undercuts even a strong-looking index price.',
      detail:g8detail});

    // ── STEP 3: COMBINE REGIME + BREADTH (THE FUSE) ──
    // Rule 1: if the MA structure alone shows a Transition state, but broad participation
    // confirms it (>70% advancing), upgrade to a distinct high-probability label — still a
    // Transition regime (the MA structure genuinely hasn't confirmed yet), but noted as
    // breadth-confirmed rather than left as an unconfirmed guess.
    // Rule 1b: high breadth also validates an already-Confirmed Bull Market — not just
    // transitions — per Step 3's explicit requirement.
    // Rule 2: if breadth is weak (<40% advancing), flag a failed rally / distribution warning
    // regardless of what the index price or MA structure suggests — this can downgrade an
    // apparent Uptrend, since strong price without broad participation is exactly the
    // "fake rally" pattern Minervini warns about.
    var weakBreadthWarning=false;
    if(advanceRatio!==null){
      if(dualRegime==='Transitioning'&&advanceRatio>70){
        verdict='CONFIRMED BULLISH TRANSITION';
        verdictSub+=' Breadth confirms this: '+advanceRatio.toFixed(1)+'% of the tracked growth universe ('+breadthCheckData.advances+' of '+breadthCheckData.total+') is advancing today — broad participation backs this transition. High-probability, but the index MA structure has not fully confirmed Stage 2 yet, so this is not the same as a Confirmed Bull Market.';
        verdictColor='var(--green)';verdictBg='var(--green-bg)';
      } else if(dualRegime==='Uptrend'&&advanceRatio>70){
        verdictSub+=' Breadth validates this: '+advanceRatio.toFixed(1)+'% of the tracked growth universe ('+breadthCheckData.advances+' of '+breadthCheckData.total+') is advancing today — broad participation confirms this is a true bull market, not a narrow, thin rally.';
      }
      if(advanceRatio<40){
        weakBreadthWarning=true;
        verdict=verdict+' — WEAK BREADTH WARNING';
        verdictSub+=' WARNING: only '+advanceRatio.toFixed(1)+'% of the tracked growth universe ('+breadthCheckData.advances+' of '+breadthCheckData.total+') is advancing — this looks like a failed rally or distribution phase, even if the index price itself looks strong. Do not trust price alone here.';
        verdictColor='var(--red)';verdictBg='var(--red-bg)';
        if(dualRegime==='Uptrend')dualRegime='Transitioning'; // don't let a full "confirmed bull" stand uncontested against weak breadth
      }
    }

    // ── STEP 4: OUTPUT THE TRADING ACTION ──
    // A single, definitive directive distilled from everything above — exactly three
    // possible outputs, no in-between: Full Offense, Pilot Mode, or Lockdown Mode.
    var tradingAction;
    if(dualRegime==='Downtrend'||weakBreadthWarning){
      tradingAction='LOCKDOWN MODE';
    } else if(dualRegime==='Uptrend'){
      tradingAction='FULL OFFENSE';
    } else {
      tradingAction='PILOT MODE';
    }
    var TRADING_ACTION_TEXT={
      'FULL OFFENSE':'Aggressively buy breakouts in Stage 2 stocks.',
      'PILOT MODE':'Buy 1 or 2 small testing positions only.',
      'LOCKDOWN MODE':'Freeze all buying, tighten trailing stop-losses, or move 100% to cash.'
    };
    indicators.tradingAction=tradingAction;

    // Save regime to memory
    indicators.spyRegime=verdict;
    // CRITICAL: this is the field buildRegimeContext(), the regime banner, and every
    // deterministic Gate 1/2 override read — it must use Uptrend/Transitioning/Downtrend
    // vocabulary. Now driven directly by the Dual-Engine matrix above.
    indicators.regime=dualRegime;
    indicators.updated=today;

    // ── RENDER ──
    function gateRow(g){
      if(!g)return'';
      var sc=g.status==='PASS'?'var(--green)':g.status==='CAUTION'?'var(--amber)':'var(--red)';
      var icon=g.status==='PASS'?'✓':g.status==='CAUTION'?'⚠':'✗';
      var priorityColor=g.priority==='CRITICAL'?'var(--red)':g.priority==='HIGH'?'var(--amber)':g.priority==='MEDIUM'?'var(--blue)':'var(--t3)';
      var priorityBg=g.priority==='CRITICAL'?'rgba(239,68,68,0.1)':g.priority==='HIGH'?'rgba(245,158,11,0.1)':g.priority==='MEDIUM'?'rgba(59,130,246,0.1)':'var(--surface)';
      return'<div style="padding:9px 0;border-bottom:1px solid var(--border)">'+
        '<div style="display:flex;align-items:flex-start;gap:10px">'+
          '<div style="font-size:13px;font-weight:700;color:'+sc+';width:16px;flex-shrink:0;margin-top:1px">'+icon+'</div>'+
          '<div style="flex:1">'+
            '<div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">'+
              '<div style="font-size:12px;font-weight:700;color:var(--t1)">'+esc(g.label)+'</div>'+
              '<div style="font-size:9px;font-weight:700;color:'+priorityColor+';background:'+priorityBg+';padding:1px 5px;border-radius:3px;text-transform:uppercase;letter-spacing:.3px">'+esc(g.priority||'')+'</div>'+
            '</div>'+
            '<div style="font-size:12px;color:var(--t2);margin-bottom:3px">'+esc(g.detail)+'</div>'+
            '<div style="font-size:11px;color:var(--t3);font-style:italic">'+esc(g.why||'')+'</div>'+
          '</div>'+
          '<div style="font-size:10px;font-weight:700;color:'+sc+';flex-shrink:0;margin-top:2px">'+g.status+'</div>'+
        '</div>'+
      '</div>';
    }

    var actionColor=tradingAction==='FULL OFFENSE'?'var(--green)':tradingAction==='LOCKDOWN MODE'?'var(--red)':'var(--amber)';
    var actionBg=tradingAction==='FULL OFFENSE'?'var(--green-bg)':tradingAction==='LOCKDOWN MODE'?'var(--red-bg)':'var(--amber-bg)';
    var earlyHtml=
      '<div style="background:'+actionColor+';border-radius:var(--r2);padding:12px 16px;margin-bottom:10px;text-align:center">'+
        '<div style="font-size:10px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.8px;opacity:.85;margin-bottom:2px">Today\'s Directive</div>'+
        '<div style="font-size:20px;font-weight:800;color:#fff;letter-spacing:.3px">'+tradingAction+'</div>'+
        '<div style="font-size:12px;color:#fff;opacity:.9;margin-top:2px">'+TRADING_ACTION_TEXT[tradingAction]+'</div>'+
      '</div>'+
      '<div style="background:'+verdictBg+';border-radius:var(--r2);padding:14px 16px;margin-bottom:12px;border:1.5px solid '+verdictColor+'">'+
        '<div style="font-size:10px;font-weight:700;color:'+verdictColor+';text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Minervini SEPA — Market Verdict</div>'+
        '<div style="font-size:17px;font-weight:800;color:'+verdictColor+';margin-bottom:6px">'+esc(verdict)+'</div>'+
        '<div style="font-size:13px;color:var(--t1);line-height:1.6;margin-bottom:6px">'+esc(verdictSub)+'</div>'+
        '<div style="font-size:11px;color:var(--t3)">SPY $'+spyPrice.toFixed(2)+' · 50MA $'+ma50.toFixed(2)+' · 200MA $'+ma200.toFixed(2)+(ma200slope?' · 200MA '+ma200slope:'')+(vixVal?' · VIX '+vixVal.toFixed(2):'')+'</div>'+
      '</div>'+
      // Gate rows
      '<div style="background:var(--surface);border-radius:var(--r3);padding:10px 14px;margin-bottom:12px">'+
        '<div style="font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Gate check</div>'+
        gates.map(gateRow).join('')+
      '</div>'+
      // VIX context
      (vixVal?'<div style="background:var(--bg);border-radius:var(--r3);padding:9px 12px;border:1px solid var(--border2);font-size:12px;color:var(--t2)">VIX '+vixVal.toFixed(2)+' — '+(vixVal<15?'Calm — ideal environment for breakouts':vixVal<20?'Normal — acceptable for new positions':vixVal<25?'Elevated — be selective, wait for tight setups':vixVal<30?'Fearful — Minervini sizes down significantly':'Panic — Minervini goes to cash')+'</div>':'');

    out.innerHTML=earlyHtml;
    // Save to memory
    var existingMem=getMarketMemory()||{};
    var mergedMem=Object.assign({},existingMem,indicators);
    DB.set('marketMemory',mergedMem);
    updateRegimeBanner();
    console.log('Gates rendered. Verdict:', verdict);
  }catch(e){
    console.log('FMP fetch error:',e.message);
    out.innerHTML='<div style="color:var(--red);font-size:13px;padding:8px">Error: '+esc(e.message)+'</div>';
  }
  btn.textContent='Refresh';btn.disabled=false;
}

// ── THIS WEEK — SEPA CANDIDATES WATCHLIST ──
var WATCHLIST_KEY='sepaWatchlist';

function getWatchlist(){
  try{return JSON.parse(DB.get(WATCHLIST_KEY)||'[]');}catch(e){return[];}
}

function saveWatchlist(list){
  DB.set(WATCHLIST_KEY,JSON.stringify(list));
  updateWatchlistBadge();
}

function updateWatchlistBadge(){
  var list=getWatchlist();
  var badge=document.getElementById('watchlistBadge');
  if(!badge)return;
  if(list.length>0){badge.textContent=list.length;badge.style.display='inline';}
  else{badge.style.display='none';}
}

// Bulk-adds multiple tickers to This Week without the per-call navigation addToWatchlist()
// does — used by the automated sector screener to add all passed stocks in one shot.
function bulkAddToWatchlist(tickers,source){
  var list=getWatchlist();
  var existing={};
  list.forEach(function(c){existing[c.ticker]=true;});
  var added=0;
  tickers.forEach(function(t){
    var ticker=(t||'').trim().toUpperCase().replace(/[^A-Z]/g,'');
    if(!ticker||ticker.length>5||existing[ticker])return;
    list.unshift({ticker:ticker,source:source||'Manual',added:new Date().toISOString().slice(0,10),verdict:null,analysis:null});
    existing[ticker]=true;
    added++;
  });
  saveWatchlist(list);
  renderWatchlist();
  return added;
}

async function runSectorScreen(){
  var btn=document.getElementById('sectorScreenBtn');
  var statusEl=document.getElementById('sectorScreenStatus');
  var resultEl=document.getElementById('sectorScreenResult');
  var mem=getMarketMemory()||{};
  if(!mem.topSectors){
    statusEl.innerHTML='<span style="color:var(--red)">No Top 3 sectors set yet — paste sector rankings above first.</span>';
    return;
  }
  var sectors=mem.topSectors.split(',').map(function(s){return s.trim();}).filter(Boolean).slice(0,3);
  btn.disabled=true;btn.textContent='Screening...';
  statusEl.textContent='Fetching liquid stocks in '+sectors.join(', ')+' from FMP, filtering through the Trend Template, then the RS Benchmark Ratio — fully automatic, no steps in between. This can take a couple of minutes for a few hundred stocks...';
  resultEl.innerHTML='<div style="text-align:center;padding:16px"><div class="loader"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div></div>';

  try{
    var r=await fetch(RAILWAY+'/fmp/sector-screen?sectors='+encodeURIComponent(sectors.join(',')));
    var d=await r.json();
    btn.disabled=false;btn.textContent='Re-screen';

    if(d.error){
      statusEl.innerHTML='<span style="color:var(--red)">'+esc(d.error)+'</span>';
      resultEl.innerHTML='';
      return;
    }

    var unrecognizedNote=(d.unrecognizedSectors&&d.unrecognizedSectors.length)?' Could not map to FMP: '+d.unrecognizedSectors.join(', ')+'.':'';
    statusEl.innerHTML='Screened '+d.universeSize+' liquid stocks across '+sectors.length+' sectors → '+
      '<b>'+d.gate1PassedCount+'</b> passed Gate 1 (Trend Template)'+(d.gate1ErrorCount?' ('+d.gate1ErrorCount+' skipped, data unavailable)':'')+' → of those, '+
      '<span style="color:var(--green);font-weight:600">'+(d.passed?d.passed.length:0)+' PASSED</span> Gate 2 (RS 1.15+), '+
      '<span style="color:var(--amber);font-weight:600">'+(d.watchlist?d.watchlist.length:0)+' in CAUTION</span> (RS 1.10-1.14), '+
      (d.discardedCount||0)+' discarded (RS below 1.10).'+unrecognizedNote;

    if(d.spyError){
      resultEl.innerHTML='<div style="font-size:13px;color:var(--red);padding:8px 0">SPY benchmark score unavailable this run ('+esc(d.spyError)+') — '+(d.unclassified?d.unclassified.length:0)+' Gate 1 survivors could not be RS-classified. Try again shortly.</div>';
      return;
    }

    if((!d.passed||!d.passed.length)&&(!d.watchlist||!d.watchlist.length)){
      resultEl.innerHTML='<div style="font-size:13px;color:var(--t3);padding:8px 0">No stocks in these sectors currently clear both gates.</div>';
      return;
    }

    function renderTier(list,label,color,bg,addFn){
      if(!list||!list.length)return'';
      var sorted=list.slice().sort(function(a,b){return (b.rsRatio||0)-(a.rsRatio||0);});
      return'<div style="margin-bottom:14px">'+
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">'+
          '<div style="font-size:11px;font-weight:700;color:'+color+';text-transform:uppercase;letter-spacing:.4px">'+label+' ('+sorted.length+')</div>'+
          '<button class="btn btn-sm" style="background:'+color+';color:#fff" onclick="'+addFn+'()">Add all to This Week</button>'+
        '</div>'+
        '<div style="display:grid;gap:3px;max-height:320px;overflow-y:auto">'+
        sorted.map(function(s){
          return'<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:'+bg+';border-radius:var(--r4)">'+
            '<div style="font-size:13px;font-weight:600;color:var(--t1)">'+esc(s.symbol)+'<span style="font-size:11px;font-weight:400;color:var(--t3);margin-left:6px">'+esc(s.companyName||'')+(s.industry?' — '+esc(s.industry):'')+'</span></div>'+
            '<div style="display:flex;gap:12px;align-items:center;font-size:11px;color:var(--t3);font-variant-numeric:tabular-nums">'+
              '<div style="font-weight:700;color:'+color+'">'+(s.rsRatio?s.rsRatio.toFixed(2)+'x SPY':'')+'</div>'+
              '<div>$'+(s.price?s.price.toFixed(2):'?')+'</div>'+
              '<div>'+(s.pctOffHigh!==undefined?s.pctOffHigh.toFixed(1)+'% off high':'')+'</div>'+
              '<div>'+(s.marketCap?'$'+(s.marketCap/1e9).toFixed(1)+'B':'')+'</div>'+
            '</div>'+
          '</div>';
        }).join('')+
        '</div></div>';
    }

    resultEl.innerHTML=
      renderTier(d.passed,'Passed — RS 1.15+','var(--green)','var(--green-bg)','bulkAddPassedToWatchlist')+
      renderTier(d.watchlist,'Watchlist / Caution — RS 1.10-1.14','var(--amber)','var(--amber-bg)','bulkAddCautionToWatchlist');

    window._lastSectorScreenPassed=(d.passed||[]).map(function(s){return s.symbol;});
    window._lastSectorScreenWatchlist=(d.watchlist||[]).map(function(s){return s.symbol;});
  }catch(e){
    btn.disabled=false;btn.textContent='Screen now';
    statusEl.innerHTML='<span style="color:var(--red)">Could not connect — check your Railway server.</span>';
  }
}

function bulkAddPassedToWatchlist(){
  var tickers=window._lastSectorScreenPassed||[];
  if(!tickers.length)return;
  var added=bulkAddToWatchlist(tickers,'Sector Screen — Passed');
  alert(added+' new ticker(s) added to This Week ('+(tickers.length-added)+' already on the list).');
  var wlNav=document.querySelector('[data-page="watchlist"]');
  if(wlNav)nav(wlNav);
}

function bulkAddCautionToWatchlist(){
  var tickers=window._lastSectorScreenWatchlist||[];
  if(!tickers.length)return;
  var added=bulkAddToWatchlist(tickers,'Sector Screen — Caution');
  alert(added+' new ticker(s) added to This Week ('+(tickers.length-added)+' already on the list).');
  var wlNav=document.querySelector('[data-page="watchlist"]');
  if(wlNav)nav(wlNav);
}

function addToWatchlist(ticker,source){
  ticker=(ticker||'').trim().toUpperCase().replace(/[^A-Z]/g,'');
  if(!ticker||ticker.length>5)return;
  var list=getWatchlist();
  if(list.find(function(c){return c.ticker===ticker;})){
    var inp=document.getElementById('watchlistInput');
    if(inp)inp.value='';
    return;
  }
  list.unshift({ticker:ticker,source:source||'Manual',added:new Date().toISOString().slice(0,10),verdict:null,analysis:null});
  saveWatchlist(list);
  var inp=document.getElementById('watchlistInput');
  if(inp)inp.value='';
  renderWatchlist();
  // Switch to watchlist page
  var wlNav=document.querySelector('[data-page="watchlist"]');
  if(wlNav)nav(wlNav);
}

function removeFromWatchlist(ticker){
  var list=getWatchlist().filter(function(c){return c.ticker!==ticker;});
  saveWatchlist(list);
  renderWatchlist();
}

function clearWatchlist(){
  if(!confirm('Clear all candidates for this week?'))return;
  DB.set(WATCHLIST_KEY,'[]');
  updateWatchlistBadge();
  renderWatchlist();
}

function sourceColor(src){
  if(/catalyst/i.test(src))return'var(--blue)';
  if(/finviz/i.test(src))return'var(--purple)';
  if(/screener/i.test(src))return'var(--purple)';
  return'var(--t3)';
}

function verdictColor(v){
  if(!v)return'var(--t3)';
  if(/^GO/i.test(v))return'var(--green)';
  if(/^CAUTION/i.test(v))return'var(--amber)';
  if(/^SKIP|^STOP/i.test(v))return'var(--red)';
  return'var(--amber)';
}

// ── GATE ANALYSIS PARSING — turns Warren's raw GATE_N: text into structured boxes ──
var WL_GATE_LABELS={1:'200MA Slope',2:'Market Stage',3:'Sector',4:'Stage 2 (Price vs MAs)',5:'Fundamentals + RS',6:'VCP Setup',7:'Entry Risk'};

function parseGateAnalysis(text){
  var out={gates:[],verdict:null,summary:null};
  if(!text)return out;
  text.split('\n').forEach(function(line){
    var l=line.trim();
    if(!l)return;
    var gm=l.match(/^GATE_(\d):\s*\[?(PASS|CAUTION|STOP)\]?\s*[—-]?\s*(.*)$/i);
    if(gm){out.gates.push({num:gm[1],status:gm[2].toUpperCase(),detail:gm[3].trim().replace(/[—-]\s*$/,'').trim()});return;}
    var vm=l.match(/^GATE_VERDICT:\s*\[?([^\]]*)\]?\s*$/i);
    if(vm){out.verdict=vm[1].trim();return;}
    var sm=l.match(/^GATE_SUMMARY:\s*(.*)$/i);
    if(sm){out.summary=sm[1].trim();return;}
    // Anything else (stray commentary the model added despite instructions) is dropped —
    // this is what keeps the popup as clean boxes instead of a wall of text.
  });
  return out;
}

// ── DETERMINISTIC GATE ENFORCEMENT ──
// The model doesn't reliably apply its own stated rules consistently across tickers
// (e.g. the same "Transitioning" regime being marked CAUTION for one ticker and PASS
// for another). For anything computable from data we already trust, don't leave the
// PASS/CAUTION/STOP call to the model's judgment — compute it here and enforce it.

// Gates 1, 2, 4 are fully determined by data we already have before the model even runs.
function computeDeterministicGates(mem,fmpStock){
  var out={};
  var slope=((mem&&mem.spy200slope)||'').toLowerCase();
  if(slope.indexOf('rising')!==-1)out.gate1='PASS';
  else if(slope.indexOf('falling')!==-1)out.gate1='STOP';
  else if(slope.indexOf('flat')!==-1)out.gate1='CAUTION';

  var regime=((mem&&mem.regime)||'').toLowerCase();
  if(regime.indexOf('uptrend')!==-1)out.gate2='PASS';
  else if(regime.indexOf('downtrend')!==-1)out.gate2='STOP';
  else if(regime.indexOf('transitioning')!==-1)out.gate2='CAUTION';

  if(fmpStock&&fmpStock.sector){
    var sectorGate=computeSectorGate(fmpStock.sector,mem&&mem.topSectors,mem&&mem.avoidSectors);
    if(sectorGate)out.gate3=sectorGate;
  }

  if(fmpStock&&fmpStock.quote&&num(fmpStock.quote.price)!==null){
    var price=num(fmpStock.quote.price);
    var ma50=num(fmpStock.quote.priceAvg50);
    var ma150=num(fmpStock.sma150);
    var ma200=num(fmpStock.quote.priceAvg200);
    var yearHigh=num(fmpStock.quote.yearHigh);
    var yearLow=num(fmpStock.quote.yearLow);
    // Full Minervini Trend Template criteria 1,2,4,5,6,7: price above all three MAs, 150>200,
    // 50MA above both 150 and 200 (criterion 4), the stock's own 200MA trending up (criterion 3),
    // price within 25% of the 52-week high (criterion 7), and price at least 25% above the
    // 52-week low (criterion 6). Only force a determination when every required data point
    // actually came back — missing data should never silently pass as "not required".
    if(price!==null&&ma50!==null&&ma150!==null&&ma200!==null&&fmpStock.sma200Slope&&yearHigh&&yearLow){
      var orderingOk=price>ma50&&price>ma150&&price>ma200&&ma150>ma200&&ma50>ma150&&ma50>ma200;
      var slopeOk=fmpStock.sma200Slope==='Rising';
      var pctOffHigh=((yearHigh-price)/yearHigh)*100;
      var pctAboveLow=((price-yearLow)/yearLow)*100;
      var rangeOk=pctOffHigh<=25&&pctAboveLow>=25;
      out.gate4=(orderingOk&&slopeOk&&rangeOk)?'PASS':'STOP';
    }

    // Gate 6 (VCP) — the algorithmic analysis (real weekly candle swing detection) was already
    // computed in buildFmpDataBlock and cached on the fmpStock object. Reuse it directly rather
    // than asking the model to independently re-derive a verdict from the same candles.
    if(fmpStock._vcpAnalysis){
      var v=fmpStock._vcpAnalysis.verdict;
      out.gate6=(v==='tight VCP')?'PASS':(v==='insufficient data')?undefined:'STOP';
    }
  }
  return out;
}

// Gate 5's RS Rating is now computed directly (getComputedRSRating) using IBD's real formula —
// Finviz never had an RS Rating field at all (only RSI, an unrelated metric). This extractor is
// kept as a fallback for the rare case the universe hasn't been built yet and the model still
// mentions some RS-like number in its own text; the threshold logic is reapplied either way.
function extractRSFromDetail(detail){
  if(!detail)return null;
  var m=detail.match(/RS\s*(?:Rating)?\s*[:\s]?\s*(\d+(?:\.\d+)?)/i);
  return m?parseFloat(m[1]):null;
}
function computeGate5(fund,rs){
  if(rs===null||rs===undefined||isNaN(rs))return null;
  var epsDeclining=fund.epsYoyPct!==null&&fund.epsYoyPct<0;
  var salesDeclining=fund.revYoyPct!==null&&fund.revYoyPct<0;
  if(rs<1.0||epsDeclining||salesDeclining)return'STOP'; // underperforming SPY outright, or fundamentals declining
  var epsOk=fund.epsYoyPct!==null&&fund.epsYoyPct>=25;
  var salesOk=fund.revYoyPct!==null&&fund.revYoyPct>=25;
  if(rs>=1.15&&epsOk&&salesOk)return'PASS'; // beating SPY by 15%+, matching Minervini's real-leader bar
  return'CAUTION'; // beating the market, but not by enough margin yet
}

// Apply all deterministic corrections to a parsed gate-analysis result, then recompute
// the overall verdict from the corrected gates rather than trusting the model's own
// aggregation — one STOP anywhere means SKIP, any CAUTION means CAUTION, otherwise GO.
function enforceGateConsistency(parsed,mem,fmpStock){
  var det=computeDeterministicGates(mem,fmpStock);
  var fund=computeFmpFundamentals(fmpStock&&fmpStock.incomeStatements,fmpStock&&fmpStock.keyMetrics);
  parsed.gates.forEach(function(g){
    if(g.num==='1'&&det.gate1)g.status=det.gate1;
    if(g.num==='2'&&det.gate2)g.status=det.gate2;
    if(g.num==='3'&&det.gate3){
      g.status=det.gate3;
      if(fmpStock&&fmpStock.sector)g.detail='sector '+fmpStock.sector+(fmpStock.industry?' ('+fmpStock.industry+')':'')+' — '+(det.gate3==='PASS'?'confirmed leading sector':'confirmed on avoid list or not leading');
    }
    if(g.num==='4'&&det.gate4){
      g.status=det.gate4;
      var ttDetail=formatTrendTemplateDetail(fmpStock);
      if(ttDetail)g.detail=ttDetail;
    }
    if(g.num==='5'){
      var computedRS=getComputedRSRating(fmpStock);
      var rs=computedRS!==null?computedRS:extractRSFromDetail(g.detail);
      var g5=computeGate5(fund,rs);
      if(g5){
        g.status=g5;
        if(computedRS!==null){
          var epsStr=fund.epsYoyPct!==null?fund.epsYoyPct.toFixed(1)+'%':'?';
          var salesStr=fund.revYoyPct!==null?fund.revYoyPct.toFixed(1)+'%':'?';
          g.detail='EPS '+epsStr+' sales '+salesStr+' RS '+formatRSRatioValue(computedRS);
        }
      }
    }
    if(g.num==='6'&&det.gate6){
      g.status=det.gate6;
      var vcpDetail=formatVcpGateDetail(fmpStock&&fmpStock._vcpAnalysis);
      if(vcpDetail)g.detail=vcpDetail;
    }
  });
  var hasStop=parsed.gates.some(function(g){return g.status==='STOP';});
  var hasCaution=parsed.gates.some(function(g){return g.status==='CAUTION';});
  parsed.computedVerdict=hasStop?'SKIP':hasCaution?'CAUTION':(parsed.gates.length?'GO':null);
  return parsed;
}

// ── DETERMINISTIC GATE ENFORCEMENT — POSITION TRADES ──
// Same principle, applied to Position Trades' own 7-gate structure, which is numbered
// differently from This Week's: 1=Market Stage, 2=Sector, 3=Stock Stage 2, 4=Fundamentals,
// 5=Relative Strength, 6=VCP Setup, 7=Entry Risk.
//
// Gate 6 (VCP) is enforced algorithmically — analyzeVCP() detects real swing highs/lows in
// the weekly candles, measures each contraction, and computes the actual Minervini ratio.
// Gate 2 (Sector) is enforced using FMP's real company sector classification, keyword-matched
// against the pasted leading/avoid sector lists (computeSectorGate) — only forces a status
// when the match is confident; ambiguous cases still fall back to the model.

function computePosDeterministicGates(mem,fmpStock){
  var out={};
  var regime=((mem&&mem.regime)||'').toLowerCase();
  if(regime.indexOf('uptrend')!==-1)out.gate1='PASS';
  else if(regime.indexOf('downtrend')!==-1)out.gate1='STOP';
  else if(regime.indexOf('transitioning')!==-1)out.gate1='CAUTION';

  if(fmpStock&&fmpStock.sector){
    var sectorGate=computeSectorGate(fmpStock.sector,mem&&mem.topSectors,mem&&mem.avoidSectors);
    if(sectorGate)out.gate2=sectorGate;
  }

  if(fmpStock&&fmpStock.quote&&num(fmpStock.quote.price)!==null){
    var price=num(fmpStock.quote.price);
    var ma50=num(fmpStock.quote.priceAvg50);
    var ma150=num(fmpStock.sma150);
    var ma200=num(fmpStock.quote.priceAvg200);
    var yearHigh=num(fmpStock.quote.yearHigh);
    var yearLow=num(fmpStock.quote.yearLow);
    if(price!==null&&ma50!==null&&ma150!==null&&ma200!==null&&fmpStock.sma200Slope&&yearHigh&&yearLow){
      var orderingOk=price>ma50&&price>ma150&&price>ma200&&ma150>ma200&&ma50>ma150&&ma50>ma200;
      var slopeOk=fmpStock.sma200Slope==='Rising';
      var pctOffHigh=((yearHigh-price)/yearHigh)*100;
      var pctAboveLow=((price-yearLow)/yearLow)*100;
      var rangeOk=pctOffHigh<=25&&pctAboveLow>=25;
      out.gate3=(orderingOk&&slopeOk&&rangeOk)?'PASS':'STOP';
    }

    var fund=computeFmpFundamentals(fmpStock.incomeStatements,fmpStock.keyMetrics);
    if(fund.epsYoyPct!==null&&fund.revYoyPct!==null&&fund.roePct!==null){
      var epsDeclining=fund.epsYoyPct<0;
      var salesDeclining=fund.revYoyPct<0;
      if(epsDeclining||salesDeclining||fund.roePct<10)out.gate4='STOP';
      else if(fund.epsYoyPct>=25&&fund.revYoyPct>=25&&fund.roePct>17&&fund.gmTrend==='Expanding')out.gate4='PASS';
      else out.gate4='CAUTION';
    }

    // Gate 6 (VCP) — reuse the algorithmic analysis already computed and cached in buildFmpDataBlock.
    if(fmpStock._vcpAnalysis){
      var v=fmpStock._vcpAnalysis.verdict;
      out.gate6=(v==='tight VCP')?'PASS':(v==='insufficient data')?undefined:'STOP';
    }
  }
  return out;
}

// Gate 5 (RS) — same principle as This Week: only the model can fetch the RS number, but
// once we have it, re-apply the threshold rule in code rather than trusting its own verdict.
function computePosGate5(rs){
  if(rs===null||rs===undefined||isNaN(rs))return null;
  if(rs<1.10)return'STOP'; // raised from 1.0 — matching the market isn't good enough, Minervini requires real outperformance
  if(rs>=1.15)return'PASS';
  return'CAUTION';
}

// Gate 7 (Entry risk) — extract the risk% the model itself stated and re-apply Minervini's
// 7%/8% thresholds, rather than trusting whichever status word it chose to write.
function extractRiskPctFromDetail(detail){
  if(!detail)return null;
  var m=detail.match(/(\d+(?:\.\d+)?)\s*%\s*risk|risk[:\s]*(?:from entry to stop[:\s]*)?(\d+(?:\.\d+)?)\s*%/i);
  if(!m)return null;
  var v=parseFloat(m[1]||m[2]);
  return isNaN(v)?null:v;
}
function computePosGate7(riskPct){
  if(riskPct===null||riskPct===undefined||isNaN(riskPct))return null;
  if(riskPct<=7)return'PASS';
  if(riskPct<=8)return'CAUTION';
  return'STOP';
}

// Recompute the overall gate verdict from the (corrected) individual gates, following the
// exact rule hierarchy already stated in the prompt — rather than trusting the model's own
// aggregation, which is exactly where inconsistency was observed.
function computePosVerdict(gates){
  if(gates[4]==='STOP')return'SKIP';
  if(gates[1]==='STOP'||gates[2]==='STOP'||gates[3]==='STOP'||gates[6]==='STOP'||gates[7]==='STOP')return'WAIT';
  if(gates[5]==='STOP')return'WAIT';
  var cautionCount=[1,2,3,4,5,6,7].filter(function(n){return gates[n]==='CAUTION';}).length;
  if(cautionCount>=2)return'WAIT';
  var allPass=[1,2,3,4,5,6,7].every(function(n){return gates[n]==='PASS';});
  if(allPass)return'GO';
  if(cautionCount===1)return'CAUTION';
  return null; // insufficient coverage (e.g. several gates unparsed) — don't guess a verdict
}

function enforceGateConsistencyPos(parsed,mem,fmpStock){
  var det=computePosDeterministicGates(mem,fmpStock);

  function statusOf(raw){
    if(!raw)return undefined;
    var m=raw.match(/^(PASS|CAUTION|STOP)/i);
    return m?m[1].toUpperCase():undefined;
  }
  function setStatus(raw,newStatus){
    var detail=(raw||'').replace(/^(PASS|CAUTION|STOP)\s*[—-]?\s*/i,'');
    return newStatus+' — '+detail;
  }

  var gates={};
  gates[1]=det.gate1||statusOf(parsed.gate1);
  if(det.gate1)parsed.gate1=setStatus(parsed.gate1,det.gate1);

  gates[2]=det.gate2||statusOf(parsed.gate2);
  if(det.gate2){
    parsed.gate2=det.gate2+' — '+(fmpStock&&fmpStock.sector?('sector '+fmpStock.sector+(fmpStock.industry?' ('+fmpStock.industry+')':'')+' — '+(det.gate2==='PASS'?'confirmed leading sector':'confirmed on avoid list or not leading')):setStatus(parsed.gate2,det.gate2).replace(/^(PASS|CAUTION|STOP)\s*[—-]?\s*/i,''));
  }

  gates[3]=det.gate3||statusOf(parsed.gate3);
  if(det.gate3){
    var ttDetailPos=formatTrendTemplateDetail(fmpStock);
    parsed.gate3=det.gate3+' — '+(ttDetailPos||setStatus(parsed.gate3,det.gate3).replace(/^(PASS|CAUTION|STOP)\s*[—-]?\s*/i,''));
  }

  gates[4]=det.gate4||statusOf(parsed.gate4);
  if(det.gate4)parsed.gate4=setStatus(parsed.gate4,det.gate4);

  var computedRSPos=getComputedRSRating(fmpStock);
  var rs=computedRSPos!==null?computedRSPos:extractRSFromDetail(parsed.gate5);
  var g5=computePosGate5(rs);
  gates[5]=g5||statusOf(parsed.gate5);
  if(g5){
    if(computedRSPos!==null){
      var fund5=computeFmpFundamentals(fmpStock&&fmpStock.incomeStatements,fmpStock&&fmpStock.keyMetrics);
      var epsStr5=fund5.epsYoyPct!==null?fund5.epsYoyPct.toFixed(1)+'%':'?';
      var salesStr5=fund5.revYoyPct!==null?fund5.revYoyPct.toFixed(1)+'%':'?';
      parsed.gate5=g5+' — EPS '+epsStr5+' sales '+salesStr5+' RS '+formatRSRatioValue(computedRSPos);
    }else{
      parsed.gate5=setStatus(parsed.gate5,g5);
    }
  }

  gates[6]=det.gate6||statusOf(parsed.gate6);
  if(det.gate6){
    var vcpDetailPos=formatVcpGateDetail(fmpStock&&fmpStock._vcpAnalysis);
    parsed.gate6=det.gate6+' — '+(vcpDetailPos||setStatus(parsed.gate6,det.gate6).replace(/^(PASS|CAUTION|STOP)\s*[—-]?\s*/i,''));
  }

  var riskPct=extractRiskPctFromDetail(parsed.gate7);
  var g7=computePosGate7(riskPct);
  gates[7]=g7||statusOf(parsed.gate7);
  if(g7)parsed.gate7=setStatus(parsed.gate7,g7);

  // Only override the headline verdict when we have solid deterministic coverage on the
  // core disqualifying gates (1, 3, 4) — otherwise leave whatever the model concluded.
  if(det.gate1&&det.gate3&&det.gate4){
    var computedVerdict=computePosVerdict(gates);
    if(computedVerdict)parsed.gateVerdict=computedVerdict;
  }
  return parsed;
}

// Formats Gate 6's detail text from the real algorithmic VCP analysis — used whenever the
// deterministic verdict overrides the model's status, so the pivot/reasoning shown to the
// user is also the real computed one, not whatever number the model's narrative happened to state.
function formatVcpGateDetail(vcpAnalysis){
  if(!vcpAnalysis)return null;
  var parts=[];
  if(vcpAnalysis.minerviniRatio!==null&&vcpAnalysis.minerviniRatio!==undefined)parts.push('Minervini ratio '+vcpAnalysis.minerviniRatio);
  if(vcpAnalysis.pivot)parts.push('pivot $'+vcpAnalysis.pivot);
  parts.push(vcpAnalysis.reason);
  return parts.join(', ');
}

// Full Minervini Trend Template breakdown — every criterion itemized explicitly, not a
// compressed one-liner. Used to fully replace Gate 4 (This Week) / Gate 3 (Position Trades)
// detail text so nothing the model checked stays hidden from what's actually displayed.
function formatTrendTemplateDetail(fmpStock){
  if(!fmpStock||!fmpStock.quote)return null;
  var q=fmpStock.quote;
  var price=num(q.price);
  var ma50=num(q.priceAvg50);
  var ma150=num(fmpStock.sma150);
  var ma200=num(q.priceAvg200);
  var yearHigh=num(q.yearHigh);
  var yearLow=num(q.yearLow);
  if(price===null)return null;

  function yn(cond){return cond===null||cond===undefined?'?':(cond?'YES':'NO');}
  var lines=[];
  lines.push('Price>50MA: '+yn(ma50!==null?price>ma50:null)+' ($'+price.toFixed(2)+' vs $'+(ma50!==null?ma50.toFixed(2):'?')+')');
  lines.push('Price>150MA: '+yn(ma150!==null?price>ma150:null)+' ($'+price.toFixed(2)+' vs $'+(ma150!==null?ma150.toFixed(2):'?')+')');
  lines.push('Price>200MA: '+yn(ma200!==null?price>ma200:null)+' ($'+price.toFixed(2)+' vs $'+(ma200!==null?ma200.toFixed(2):'?')+')');
  lines.push('50MA>150MA: '+yn(ma50!==null&&ma150!==null?ma50>ma150:null));
  lines.push('150MA>200MA: '+yn(ma150!==null&&ma200!==null?ma150>ma200:null));
  if(fmpStock.sma200Slope){
    var months=fmpStock.sma200TrendMonths;
    var monthsNote=months!==null&&months!==undefined?(months>=4?months+'+ months (meets Minervini\'s 4-5 month preference)':months>=1?months+' month(s) (meets 1-month minimum, below the 4-5 preferred)':'less than 1 month'):'duration unknown';
    lines.push('200MA trending up 1+ month (4-5 preferred): '+(fmpStock.sma200Slope==='Rising'?'YES':'NO')+' — '+fmpStock.sma200Slope+', '+monthsNote);
  }else{
    lines.push('200MA trending up 1+ month: unavailable — verify manually');
  }
  if(price!==null&&yearLow){
    var pctAboveLow=((price-yearLow)/yearLow)*100;
    lines.push('25-30% above 52-week low: '+yn(pctAboveLow>=25)+' ('+pctAboveLow.toFixed(1)+'% above $'+yearLow.toFixed(2)+')');
  }
  if(price!==null&&yearHigh){
    var pctOffHigh=((yearHigh-price)/yearHigh)*100;
    lines.push('Within 25% of 52-week high: '+yn(pctOffHigh<=25)+' ('+pctOffHigh.toFixed(1)+'% off $'+yearHigh.toFixed(2)+')');
  }
  return lines.join('; ');
}

// ── SECTOR LEADERSHIP — real FMP classification instead of model guesswork ──
// Keyword-based canonicalization, robust to naming variations between FMP/GICS sector
// labels and Finviz's own labels (e.g. "Financial Services" vs "Financial" vs "Financials"),
// rather than requiring exact string equality which would break on any spelling difference.
var SECTOR_KEYWORDS={
  'financial':['financial'],'technology':['technology','tech'],'healthcare':['health'],
  'consumer cyclical':['consumer cyclical','consumer discretionary'],
  'consumer defensive':['consumer defensive','consumer staples'],
  'industrials':['industrial'],'energy':['energy'],'basic materials':['materials'],
  'real estate':['real estate'],'utilities':['utilit'],'communication services':['communication']
};
function canonicalSector(name){
  if(!name)return null;
  var n=name.toLowerCase().trim();
  for(var key in SECTOR_KEYWORDS){
    var kws=SECTOR_KEYWORDS[key];
    for(var i=0;i<kws.length;i++){ if(n.indexOf(kws[i])!==-1)return key; }
  }
  return n;
}
function sectorInList(sector,listText){
  if(!sector||!listText)return false;
  var target=canonicalSector(sector);
  var items=listText.split(',').map(function(s){return canonicalSector(s.trim());});
  return items.indexOf(target)!==-1;
}
// Only forces a status when the fetched sector confidently resolves against the pasted
// lists — otherwise returns null and leaves it to the model, same never-guess principle
// used everywhere else.
function computeSectorGate(stockSector,topSectors,avoidSectors){
  if(!stockSector)return null;
  if(sectorInList(stockSector,avoidSectors))return'STOP';
  if(sectorInList(stockSector,topSectors))return'PASS';
  return null;
}

// ── IBD-STYLE RELATIVE STRENGTH — Benchmark Performance Ratio ──
// Finviz has no RS Rating field at all (verified) — what it has is RSI, a completely
// different momentum oscillator that shares a similar name/scale by coincidence. Rather than
// risk the model confusing the two or fabricating a number, RS is computed here using IBD's
// actual documented formula: raw = 2*(C0/C63) + (C0/C126) + (C0/C189) + (C0/C252) — but instead
// of ranking that raw score against a small, necessarily-biased universe of other stocks
// (which distorts the result depending on which names happen to be in the comparison set),
// it's expressed as a direct ratio against SPY's own score computed the same way:
// RS Ratio = Stock_Score / SPY_Score. Ratio > 1.0 means beating the index; the Trend Template
// requires 1.15+ (beating the market by 15%+) to pass. One extra fetch total (SPY's own
// history) — no universe to build or keep fresh. Honest tradeoff: this measures "beats SPY by
// how much," not IBD's literal "percentile rank against every stock in the market" — a related
// but not identical question.

function getSpyBenchmarkScore(){
  try{ return DB.get('spyBenchmarkScore')||null; }catch(e){ return null; }
}

// Fetches (or reuses a same-day cached) SPY benchmark score. Cheap enough (one fetch) to just
// call transparently whenever needed — no manual "build" step required.
async function ensureSpyBenchmarkScore(){
  var cached=getSpyBenchmarkScore();
  if(cached&&cached.computedAt){
    var ageMs=Date.now()-new Date(cached.computedAt).getTime();
    if(ageMs<86400000)return cached; // same-day cache is fine, SPY's weighted score barely moves day to day
  }
  try{
    var r=await fetch(RAILWAY+'/fmp/benchmark-score');
    var d=await r.json();
    if(!d||d.score===null||d.score===undefined||d.error)return cached; // fall back to stale cache rather than nothing
    var fresh={score:d.score,computedAt:d.computedAt||new Date().toISOString()};
    DB.set('spyBenchmarkScore',fresh);
    return fresh;
  }catch(e){
    return cached; // network hiccup — stale cache is still better than nothing
  }
}

// Given a candidate's fmpStock (which already has rsRawScore computed server-side from the
// same daily history fetched for everything else), returns the RS Ratio vs SPY, or null if
// either score is unavailable — never fabricates a number.
function getComputedRSRating(fmpStock){
  if(!fmpStock||fmpStock.rsRawScore===null||fmpStock.rsRawScore===undefined)return null;
  var spy=getSpyBenchmarkScore();
  if(!spy||!spy.score)return null;
  return +(fmpStock.rsRawScore/spy.score).toFixed(3);
}

// Consistent phrasing for the RS Ratio wherever it's injected into a prompt or shown in a
// gate detail — used everywhere instead of hand-writing this string repeatedly.
function formatRSRatioValue(ratio){
  return ratio+'x SPY ('+(ratio>=1?'+':'')+((ratio-1)*100).toFixed(1)+'% vs market)';
}
function rsRatioUnavailableNote(){
  return'unavailable — the SPY benchmark score has not been fetched yet in this app (it\'s a single lightweight call, refreshes automatically). Do NOT fetch Finviz for an "RS Rating" — it has no such field, only RSI, a completely different unrelated momentum metric. Mark the RS component of Gate 5 as unconfirmed rather than substituting RSI or inventing a number.';
}

async function runRefreshBenchmark(){
  var btn=document.getElementById('rsBenchmarkBtn');
  if(btn){btn.disabled=true;btn.textContent='Refreshing...';}
  await ensureSpyBenchmarkScore();
  showRSBenchmarkStatus();
  if(btn){btn.disabled=false;btn.textContent='Refresh now';}
}

function showRSBenchmarkStatus(){
  var statusEl=document.getElementById('rsBenchmarkStatus');
  if(!statusEl)return;
  var spy=getSpyBenchmarkScore();
  if(!spy){
    statusEl.textContent='Not fetched yet — RS Ratio will show as unavailable in gate checks until this refreshes.';
    return;
  }
  var ageMs=Date.now()-new Date(spy.computedAt).getTime();
  var ageHours=Math.floor(ageMs/3600000);
  var stale=ageHours>=24;
  statusEl.innerHTML='SPY benchmark score: '+spy.score.toFixed(3)+' · fetched '+new Date(spy.computedAt).toLocaleString()+
    (stale?' <span style="color:var(--amber)">— refreshing on next use</span>':' <span style="color:var(--green)">— current</span>');
}

function gateBoxesHtml(parsed){
  if(!parsed.gates.length)return'<div style="font-size:13px;color:var(--t3);text-align:center;padding:16px 0">No gate data parsed from this analysis. Try re-analysing.</div>';
  return parsed.gates.map(function(g){
    var isStop=g.status==='STOP';
    var isCaution=g.status==='CAUTION';
    var col=isStop?'var(--red)':isCaution?'var(--amber)':'var(--green)';
    var bg=isStop?'var(--red-bg)':isCaution?'var(--amber-bg)':'var(--green-bg)';
    var icon=isStop?'✗':isCaution?'⚠':'✓';
    var label=WL_GATE_LABELS[g.num]||('Gate '+g.num);
    return'<div style="background:'+bg+';border-radius:var(--r3);padding:10px 12px;margin-bottom:8px;border-left:3px solid '+col+'">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;gap:8px">'+
        '<div style="font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.4px">Gate '+esc(g.num)+' · '+esc(label)+'</div>'+
        '<div style="font-size:11px;font-weight:800;color:'+col+';flex-shrink:0">'+icon+' '+g.status+'</div>'+
      '</div>'+
      '<div style="font-size:12px;color:var(--t1);line-height:1.5">'+esc(g.detail||'—')+'</div>'+
    '</div>';
  }).join('');
}

function openWatchlistDetail(ticker){
  var list=getWatchlist();
  var c=list.find(function(x){return x.ticker===ticker;});
  if(!c)return;
  openSheet('wl-detail',c);
}

function renderWatchlist(){
  var container=document.getElementById('watchlistContainer');
  if(!container)return;
  var list=getWatchlist();
  updateWatchlistBadge();

  if(list.length===0){
    container.innerHTML=
      '<div style="padding:22px;text-align:center;padding-top:40px;color:var(--t3)">'+
        '<div style="font-size:40px;margin-bottom:14px">📋</div>'+
        '<div style="font-size:16px;font-weight:600;color:var(--t2);margin-bottom:8px">No candidates yet this week</div>'+
        '<div style="font-size:13px;line-height:1.7;max-width:360px;margin:0 auto">'+
          'Add tickers from Catalyst Radar, your Finviz screener results, or type below.<br>'+
          'Warren runs a full 7-gate SEPA check on each one.'+
        '</div>'+
      '</div>';
    return;
  }

  container.innerHTML=list.map(function(c){
    var vc=verdictColor(c.verdict);
    var sc=sourceColor(c.source);
    return'<div style="background:var(--surface);border-radius:var(--r2);padding:14px 16px;margin-bottom:8px;border:1px solid var(--border2)" id="wl-card-'+c.ticker+'">'+
      // Header row — verdict is visible here, before any click
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">'+
        '<div style="font-size:22px;font-weight:800;color:var(--t1);letter-spacing:.5px;font-variant-numeric:tabular-nums">'+esc(c.ticker)+'</div>'+
        '<div style="font-size:10px;font-weight:700;color:'+sc+';background:var(--bg);border:1px solid '+sc+';padding:2px 7px;border-radius:10px;opacity:.85">'+esc(c.source)+'</div>'+
        (c.verdict?'<div style="font-size:11px;font-weight:700;color:'+vc+';padding:2px 8px;background:var(--bg);border:1px solid '+vc+';border-radius:10px">'+esc(c.verdict.split('—')[0].trim())+'</div>':'')+
        '<div style="margin-left:auto;display:flex;gap:6px;align-items:center">'+
          (c.analysedAt?'<div style="font-size:10px;color:var(--t3)">'+esc(c.analysedAt)+'</div>':'')+
          '<button class="btn btn-ghost btn-sm" style="font-size:11px;padding:2px 8px;color:var(--t3)" onclick="removeFromWatchlist(\''+c.ticker+'\')">✕</button>'+
        '</div>'+
      '</div>'+
      // Single action button — analysis itself lives in the popup, not inline
      '<div style="display:flex;gap:8px">'+
        (c.analysis?
          '<button class="btn btn-blue btn-sm" onclick="openWatchlistDetail(\''+c.ticker+'\')">See analysis</button>'
          :'<button class="btn btn-blue btn-sm" onclick="runWatchlistAnalysis(\''+c.ticker+'\')" id="wl-btn-'+c.ticker+'">Run SEPA analysis</button>')+
      '</div>'+
      '<div id="wl-loading-'+c.ticker+'" style="display:none;padding:8px 0"><div class="loader"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div></div>'+
    '</div>';
  }).join('');
}

function clearWatchlistAnalysis(ticker){
  var list=getWatchlist();
  var item=list.find(function(c){return c.ticker===ticker;});
  if(item){item.analysis=null;item.verdict=null;}
  saveWatchlist(list);
  renderWatchlist();
}

async function runWatchlistAnalysis(ticker){
  var btn=document.getElementById('wl-btn-'+ticker);
  var loading=document.getElementById('wl-loading-'+ticker);
  var card=document.getElementById('wl-card-'+ticker);
  if(btn){btn.disabled=true;btn.textContent='Fetching FMP data...';}
  if(loading)loading.style.display='block';

  var regimeCtx=buildRegimeContext();
  var mem=getMarketMemory()||{};
  var ticker_lower=ticker.toLowerCase();
  var today=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});

  var fmpStock=await fetchFmpStock(ticker);
  var fmpBlock=buildFmpDataBlock(fmpStock);
  var computedRS=getComputedRSRating(fmpStock);
  if(btn)btn.textContent='Analysing...';

  var detGates=computeDeterministicGates(mem,fmpStock);
  var predetermined=[];
  if(detGates.gate1)predetermined.push('Gate 1 status is already determined: '+detGates.gate1+' (from saved 200MA slope). Use this exact status.');
  if(detGates.gate2)predetermined.push('Gate 2 status is already determined: '+detGates.gate2+' (from saved market regime). Use this exact status.');
  if(detGates.gate3)predetermined.push('Gate 3 status is already determined: '+detGates.gate3+' (the stock\'s real sector is '+(fmpStock&&fmpStock.sector||'?')+', matched against your saved leading/avoid sector lists). Use this exact status.');
  if(detGates.gate4)predetermined.push('Gate 4 status is already determined: '+detGates.gate4+' (computed from real price vs 50/150/200MA ordering, the stock\'s own 200MA slope, and 52-week high/low range — see STAGE 2 CHECK and 52-WEEK RANGE lines above). Use this exact status.');
  if(computedRS!==null)predetermined.push('RS Ratio is already computed: '+formatRSRatioValue(computedRS)+' (Benchmark Performance Ratio: Stock_Score / SPY_Score, both computed with IBD\'s real formula — see RS RATING line above). Use this exact number for Gate 5 — do not fetch, estimate, or substitute a different figure.');
  if(detGates.gate6)predetermined.push('Gate 6 status is already determined: '+detGates.gate6+' (computed algorithmically from real weekly candle swing analysis — see VCP ANALYSIS line above, which also gives you the pivot price to use). Use this exact status and pivot — do not recalculate or contradict it.');

  var dataSection=fmpBlock
    ?fmpBlock+'\n'+
     'RS RATING: '+(computedRS!==null?formatRSRatioValue(computedRS)+' — this is not from Finviz, do not fetch Finviz for it':rsRatioUnavailableNote())+'\n\n'
    :'Fetch https://stockanalysis.com/stocks/'+ticker_lower+'/ — get EPS growth YoY, revenue growth YoY, next earnings date.\n\n'+
     'RS RATING: '+(computedRS!==null?formatRSRatioValue(computedRS):rsRatioUnavailableNote())+'\n\n';

  var prompt='Minervini SEPA gate check on '+ticker+'. Today '+today+'. No disclaimers. Be concise but precise — every gate must cite an actual number, never a vague judgment call.\n\n'+
    regimeCtx+'\n\n'+
    dataSection+
    (predetermined.length?'PRE-DETERMINED GATE STATUSES (computed from real data before this analysis — these are not judgment calls, use the exact status given, every time, no exceptions):\n'+predetermined.join('\n')+'\n\n':'')+
    'Apply these exact Minervini thresholds for the remaining gates. Do not soften them or round in the stock\'s favour:\n\n'+
    'GATE_1 — 200MA slope: Rising = PASS. Flat = CAUTION. Falling = STOP.'+(detGates.gate1?' (already given above)':'')+'\n'+
    'GATE_2 — Market stage: map directly from the saved market regime above. Uptrend = PASS. Transitioning = CAUTION (half-size only, not a hard stop). Downtrend = STOP.'+(detGates.gate2?' (already given above)':'')+'\n'+
    'GATE_3 — Sector: leading on BOTH 1-week AND 1-month = PASS. Leading on only one timeframe, neutral, or on the avoid list = STOP.'+(fmpStock&&fmpStock.sector?' The stock\'s real sector (from FMP) is '+fmpStock.sector+(fmpStock.industry?' / '+fmpStock.industry:'')+'.':'')+(detGates.gate3?' (already given above)':'')+'\n'+
    'GATE_4 — Stage 2 structure (full Minervini Trend Template): price above 50MA AND 150MA AND 200MA, 150MA above 200MA, 50MA above BOTH 150MA and 200MA, the stock\'s own 200MA trending up (not just the market\'s), price within 25% of the 52-week high, AND price at least 25% above the 52-week low = PASS. Any one of those fails = STOP.'+(detGates.gate4?' (already given above)':'')+'\n'+
    'GATE_5 — Fundamentals + Relative Strength: EPS growth 25%+ AND sales growth 25%+ AND RS Ratio 1.15+ (beating SPY by 15%+) = PASS. RS Ratio 1.0-1.14 with strong fundamentals = CAUTION (beating the market, but not by Minervini\'s required margin — only acceptable in an exceptionally strong sector). RS Ratio below 1.0 (underperforming SPY outright), OR EPS/sales declining = STOP. A stock does NOT pass on fundamentals alone — RS Ratio below 1.15 caps this at CAUTION even with excellent earnings.\n'+
    'GATE_6 — VCP setup: use the VCP ANALYSIS line above — it was computed algorithmically from the actual weekly candle swings (real contraction measurements, real Minervini ratio, real pivot), not a visual guess. State that verdict and pivot in your answer.'+(detGates.gate6?' (already given above)':' If unavailable, analyze the weekly candles above yourself: a valid VCP needs a prior uptrend into the base, contractions that each get tighter than the last, the tightest week\'s range under 50% of the first base week\'s range, volume drying up at the tightest point, and price within 5-15% of the 52-week high with an identifiable pivot.')+'\n'+
    'GATE_7 — Entry risk: only meaningful if Gate 6 passes. The stop sits just below the low of the tightest week; risk = (pivot − stop) / pivot. 7% or less = PASS. 7-8% = CAUTION. Over 8%, or no valid base to anchor a stop to = STOP.\n\n'+
    'Output ONLY these lines:\n'+
    'GATE_1: [PASS/CAUTION/STOP] — 200MA slope [Rising/Flat/Falling]\n'+
    'GATE_2: [PASS/CAUTION/STOP] — market stage\n'+
    'GATE_3: [PASS/STOP] — sector [name] [LEADING/AVOID]\n'+
    'GATE_4: [PASS/STOP] — itemize every criterion: price vs 50MA, price vs 150MA, price vs 200MA, 50MA vs 150MA, 150MA vs 200MA, 200MA trend duration, % above 52-week low, % off 52-week high\n'+
    'GATE_5: [PASS/CAUTION/STOP] — EPS [X%] sales [X%] RS [X]\n'+
    'GATE_6: [PASS/STOP] — Minervini ratio [X.XX], pivot $X, [tight VCP / extended / no base]\n'+
    'GATE_7: [PASS/CAUTION/STOP] — stop $X, risk [X%]\n'+
    'GATE_VERDICT: [GO/CAUTION/WAIT/SKIP]\n'+
    'GATE_SUMMARY: [one sentence]\n\n'+
    'Every number must come from the data provided above or from Finviz. No estimates, no rounding in the stock\'s favour.';

  try{
    var resp=await fetch(RAILWAY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      model:'claude-sonnet-5',max_tokens:8000,
      messages:[{role:'user',content:prompt}],
      tools:[{type:'web_search_20250305',name:'web_search'}]
    })});
    var data=await resp.json();

    if(data.error){
      if(loading)loading.style.display='none';
      if(btn){btn.disabled=false;btn.textContent='Run SEPA analysis';}
      var errDiv=document.createElement('div');
      errDiv.style.cssText='color:var(--red);font-size:12px;margin-top:6px';
      errDiv.textContent='Error: '+(data.error.message||JSON.stringify(data.error));
      if(card)card.appendChild(errDiv);
      return;
    }

    var blocks=(data.content||[]).filter(function(b){return b.type==='text';});
    var text=blocks.map(function(b){return b.text||'';}).join('\n').trim();

    if(!text){
      if(loading)loading.style.display='none';
      if(btn){btn.disabled=false;btn.textContent='Run SEPA analysis';}
      var errDiv=document.createElement('div');
      errDiv.style.cssText='color:var(--amber);font-size:12px;margin-top:6px';
      errDiv.textContent='No response. Stop reason: '+(data.stop_reason||'unknown')+'. Try again.';
      if(card)card.appendChild(errDiv);
      return;
    }

    var parsed=parseGateAnalysis(text);
    enforceGateConsistency(parsed,mem,fmpStock);
    var verdict=parsed.computedVerdict||parsed.verdict||'See analysis';

    // Rebuild the stored text from the corrected gates so everything downstream
    // (card pill, popup boxes, re-reads later) reflects the enforced, consistent values —
    // not whatever the model happened to write before correction.
    var rebuiltText=parsed.gates.map(function(g){
      return'GATE_'+g.num+': '+g.status+' — '+g.detail;
    }).join('\n')+
      '\nGATE_VERDICT: '+verdict+
      (parsed.summary?'\nGATE_SUMMARY: '+parsed.summary:'');

    var list=getWatchlist();
    var item=list.find(function(c){return c.ticker===ticker;});
    if(item){
      item.analysis=rebuiltText;
      item.verdict=verdict;
      item.analysedAt=new Date().toISOString().slice(0,10);
    }
    saveWatchlist(list);
    renderWatchlist();
  }catch(e){
    if(loading)loading.style.display='none';
    if(btn){btn.disabled=false;btn.textContent='Run SEPA analysis';}
    var errDiv=document.createElement('div');
    errDiv.style.cssText='color:var(--red);font-size:12px;margin-top:6px';
    errDiv.textContent='Error: '+e.message;
    if(card)card.appendChild(errDiv);
  }
}

function initWatchlist(){
  renderWatchlist();
  updateWatchlistBadge();
}

function askWarrenAbout(ticker){
  addToWatchlist(ticker,'Catalyst Radar');
}

async function runOwnResearch(){
  var raw=document.getElementById('ownResearchIn').value.trim();
  if(!raw){alert('Paste what you found first.');return;}
  var out=document.getElementById('ownResearchOut');
  var btn=event.target;
  btn.textContent='Warren reading...';btn.disabled=true;
  out.innerHTML='<div style="text-align:center;padding:12px"><div class="loader"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div></div>';
  var today=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  var mem=getMarketMemory()||{};
  var prompt='You are Warren. $50M own money. Today is '+today+'. No disclaimers. No web searches — analyse only what is pasted below.\n\n'+
    'The investor has done their own research and found the following:\n\n'+raw+'\n\n'+
    'Market context: '+buildRegimeContext()+'\n\n'+
    'For each item they found:\n'+
    '1. Is this signal real or noise? Why?\n'+
    '2. Does it align with or contradict the current market regime and leading sectors?\n'+
    '3. Is there a trade here? If yes — what stage is the setup, what is the entry trigger, and what is the risk?\n'+
    '4. Priority: High (act this week) / Medium (watch) / Low (interesting but not actionable now)\n\n'+
    'Be direct and specific. If something is not actionable, say why. If something is worth investigating further with Warren stock analysis, say so explicitly with the ticker.\n\n'+
    'Format each item as:\n'+
    '[TICKER or topic]: [Priority] — [2-3 sentences on signal quality and action]';
  try{
    var resp=await fetch(RAILWAY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      model:'claude-sonnet-5',max_tokens:2000,
      messages:[{role:'user',content:prompt}]
    })});
    var data=await resp.json();
    if(data.error){out.innerHTML='<div style="color:var(--red);font-size:13px">API error: '+esc((data.error.message||'').slice(0,200))+'</div>';btn.textContent='Warren reads this';btn.disabled=false;return;}
    var blocks=(data.content||[]).filter(function(b){return b.type==='text';});
    var text=blocks[blocks.length-1]&&blocks[blocks.length-1].text||'';
    if(!text){out.innerHTML='<div style="color:var(--red);font-size:13px">No response. Try again.</div>';btn.textContent='Warren reads this';btn.disabled=false;return;}
    // Render each item
    var html='';
    text.split('\n').filter(Boolean).forEach(function(line){
      var isHigh=/High/i.test(line)&&line.length<200;
      var isMed=/Medium/i.test(line)&&line.length<200;
      var col=isHigh?'var(--green)':isMed?'var(--amber)':'var(--t3)';
      var bg=isHigh?'var(--green-bg)':isMed?'var(--amber-bg)':'var(--bg)';
      var border=isHigh?'var(--green)':isMed?'var(--amber)':'var(--border2)';
      var tickerMatch=line.match(/^\[?([A-Z]{1,5})\]?:/);
      var ticker=tickerMatch?tickerMatch[1]:'';
      html+='<div style="background:'+bg+';border-radius:var(--r3);padding:10px 13px;margin-bottom:7px;border-left:3px solid '+border+'">';
      html+='<div style="font-size:13px;color:var(--t1);line-height:1.6">'+esc(line)+'</div>';
      if(ticker){html+='<button class="btn btn-ghost btn-sm" style="margin-top:6px" onclick="analyseFromDiscovery(\''+esc(ticker)+'\')">Ask Warren about '+esc(ticker)+' →</button>';}
      html+='</div>';
    });
    out.innerHTML=html||'<div style="color:var(--t3);font-size:13px">No items parsed.</div>';
    btn.textContent='Warren reads this';btn.disabled=false;
  }catch(e){
    out.innerHTML='<div style="color:var(--red);font-size:13px">Error: '+esc(e.message)+'</div>';
    btn.textContent='Warren reads this';btn.disabled=false;
  }
}

async function runCatalystRadar(){
  var btn=document.getElementById('catalystBtn');
  var out=document.getElementById('catalystResult');
  btn.textContent='Fetching earnings calendar...';btn.disabled=true;
  out.innerHTML='<div style="text-align:center;padding:16px"><div class="loader"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div><div style="font-size:13px;color:var(--t3);margin-top:8px">Scanning for SEPA setups...</div></div>';
  var today=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  var todayISO=new Date().toISOString().slice(0,10);
  var weekEndISO=new Date(Date.now()+6*86400000).toISOString().slice(0,10);
  var mem=getMarketMemory()||{};
  var topSectors=mem.topSectors||'not set — paste sector data first';
  var avoidSectors=mem.avoidSectors||'none set';

  // Real earnings calendar for the week — removes ticker/date hallucination risk entirely.
  // Warren is only allowed to report on names that actually appear in this list.
  var earningsListText='Earnings calendar fetch failed — do not invent any tickers or dates for the EARNINGS section; say the calendar is unavailable instead.';
  try{
    var er=await fetch(RAILWAY+'/fmp/earnings-calendar?from='+todayISO+'&to='+weekEndISO);
    var ed=await er.json();
    var elist=(ed.earnings||[]).slice(0,300);
    earningsListText=elist.length
      ?elist.map(function(e){return e.symbol+' '+e.date+(e.time?' ('+e.time+')':'');}).join(', ')
      :'No earnings calendar data returned for this date range.';
  }catch(e){}
  btn.textContent='Checking...';

  try{
    var prompt='You are Warren applying Minervini SEPA methodology. Today is '+today+'. No disclaimers.\n\n'+
      'LEADING SECTORS THIS WEEK (both 1W and 1M positive): '+topSectors+'\n'+
      'AVOID SECTORS: '+avoidSectors+'\n\n'+
      'REAL EARNINGS CALENDAR, '+todayISO+' to '+weekEndISO+' (fetched live from FMP — this is the authoritative list, do not use any ticker or date not in it):\n'+
      earningsListText+'\n\n'+
      'Quality bar: accuracy matters far more than speed or search count here — real money is being risked on this list. Search and fetch as many pages as you need to verify each candidate properly. Never classify a technical setup from a headline or search snippet alone — fetch the stock\'s actual price/MA data (e.g. Finviz or a stock data page) before calling it tight VCP, extended, or no base. If you cannot verify a setup with real data, write "setup unconfirmed — verify manually" instead of guessing.\n\n'+
      'EARNINGS section: pick up to 4 tickers FROM THE REAL EARNINGS CALENDAR ABOVE that are in or adjacent to the leading sectors. Do not use any ticker not in that list.\n'+
      'HIGHS section: search for stocks making new 52-week highs, then fetch each candidate\'s actual data page to confirm it is genuinely near its 52-week high with real price/MA numbers before including it — do not trust a search snippet\'s claim on its own.\n\n'+
      'After verifying, write EXACTLY this — start each section with the exact header line shown:\n\n'+
      '===EARNINGS===\n'+
      '[TICKER] -- [Company] -- [Date]. Sector: [name]. Setup: [tight VCP / extended / no base / setup unconfirmed — verify manually]. Minervini: [wait for post-earnings base / pre-earnings entry if 3-5 weeks out / skip].\n'+
      '[repeat for up to 4 stocks, fewer if the real calendar does not support 4 relevant names]\n\n'+
      '===HIGHS===\n'+
      'Only stocks in these leading sectors: '+topSectors+'\n'+
      '[TICKER] -- [Sector]. [VCP breakout from tight base / extended avoid / setup unconfirmed — verify manually], with the real price and 52-week high you fetched. One sentence why.\n'+
      '[repeat for 3 stocks]\n\n'+
      '===WATCHLIST===\n'+
      '[TICKER] -- [Sector]. [Why SEPA criteria likely met]. [What to confirm before full analysis].\n'+
      '[repeat for 3 stocks]\n\n'+
      'Use exactly ===EARNINGS=== ===HIGHS=== ===WATCHLIST=== as section markers. Nothing else before the first marker. No markdown.';

    var resp=await fetch(RAILWAY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      model:'claude-sonnet-5',max_tokens:8000,
      messages:[{role:'user',content:prompt}],
      tools:[{type:'web_search_20250305',name:'web_search'}]
    })});
    var data=await resp.json();
    var blocks=(data.content||[]).filter(function(b){return b.type==='text';});
    var text=blocks.map(function(b){return b.text||'';}).join('\n').trim();
    if(!text){
      var sr=data.stop_reason||'unknown';
      var ct=(data.content||[]).map(function(b){return b.type;}).join(', ')||'none';
      var errMsg=data.error?JSON.stringify(data.error).slice(0,200):'';
      out.innerHTML='<div style="color:var(--red);font-size:13px;padding:8px">'+
        'Stop reason: <strong>'+esc(sr)+'</strong>. Types: '+esc(ct)+
        (errMsg?'<br>Error: '+esc(errMsg):'')+
        '<br><br>Raw response: <code style="font-size:11px">'+esc(JSON.stringify(data).slice(0,400))+'</code>'+
      '</div>';
      btn.textContent='Check now';btn.disabled=false;return;
    }

    // Strip markdown
    text=text.split('**').join('').split('##').join('').split('#').join('');

    // Parse sections using === markers
    var sections={earnings:[],highs:[],watchlist:[]};
    var currentSection='';
    text.split('\n').forEach(function(line){
      var l=line.trim();
      if(!l)return;
      if(/^===EARNINGS===/i.test(l)){currentSection='earnings';return;}
      if(/^===HIGHS===/i.test(l)){currentSection='highs';return;}
      if(/^===WATCHLIST===/i.test(l)){currentSection='watchlist';return;}
      // Also catch if Warren ignores markers and uses plain headers
      if(/^EARNINGS/i.test(l)&&l.length<40){currentSection='earnings';return;}
      if((/^STOCKS.*HIGH/i.test(l)||/^52.WEEK/i.test(l)||/^NEW HIGH/i.test(l))&&l.length<60){currentSection='highs';return;}
      if((/^MINERVINI|^WATCHLIST|^CANDIDATES/i.test(l))&&l.length<60){currentSection='watchlist';return;}
      // Skip instruction lines and continuation fragments
      if(/^Only stocks/i.test(l)||/^Only include/i.test(l))return;
      // Skip lines starting with lowercase or punctuation — continuations
      if(/^[a-z,;.)]/.test(l))return;
      // For highs and watchlist sections, only accept lines starting with ticker pattern: 1-5 uppercase letters followed by space and --
      if((currentSection==='highs'||currentSection==='watchlist')&&!/^[A-Z]{1,5}\s*(--|—)/.test(l))return;
      if(currentSection&&l.length>5)sections[currentSection].push(l);
    });

    // Ticker detection skip list
    var skipWords=['SPY','QQQ','ETF','CEO','CFO','FDA','DOD','CPI','GDP','FED','USA','IPO','EPS','AI','THE','FOR','AND','NOT','ARE','ALL','NEW','ITS','HAS','BUT','THIS','WEEK','NEXT','HIGH','HIGHS','MACRO','TOP','FOMC','ECB','BOJ','SEC','DOJ','FROM','WITH','INTO','THAN','SOME','OVER','ONLY','SAME','WELL','EVEN','BACK','MANY','WILL','MAKE','TAKE','COME','LOOK','NYSE','VCP','SEPA','SMA','IBD','YOY','QOQ','TD','RBC','BNY'];

    function renderSection(lines, sectionLabel, color, bg){
      if(!lines.length)return'';
      return'<div style="background:'+bg+';border-radius:var(--r3);padding:12px 14px;margin-bottom:10px;border-left:3px solid '+color+'">'+
        '<div style="font-size:10px;font-weight:700;color:'+color+';text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px">'+esc(sectionLabel)+'</div>'+
        lines.map(function(line){
          // Find tickers in this line
          // Extract tickers: match 1-5 uppercase letters preceded by line start or space and followed by ' --'
          var tickerMatches=line.match(/(?:^|\s)([A-Z]{1,5})(?=\s*--|\s*—)/g)||[];
          var tickers=tickerMatches.map(function(m){return m.trim();}).filter(function(t){return t.length>=1&&!skipWords.includes(t);});
          var uniqueTickers=tickers.filter(function(v,i,a){return a.indexOf(v)===i;}).slice(0,2);
          return'<div style="margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid rgba(0,0,0,0.06)">'+
            '<div style="font-size:13px;color:var(--t1);line-height:1.6">'+esc(line)+'</div>'+
            (uniqueTickers.length?'<div style="margin-top:5px;display:flex;gap:6px">'+
              uniqueTickers.map(function(t){
                return'<button class="btn btn-ghost btn-sm" style="font-size:11px;padding:2px 8px" onclick="askWarrenAbout(\''+t+'\')">Ask Warren about '+t+' →</button>';
              }).join('')+
            '</div>':'');
        }).join('')+
      '</div>';
    }

    var html='<div style="font-size:12px;color:var(--t3);margin-bottom:12px">Week of '+today+
      (topSectors!=='not set — paste sector data first'?' · Leading sectors: <span style="color:var(--green);font-weight:600">'+esc(topSectors)+'</span>':' · <span style="color:var(--amber)">Run sector rankings first for sector-aware results</span>')+
      '</div>'+
      renderSection(sections.earnings,'Earnings this week — Minervini action','var(--purple)','var(--bg)')+
      renderSection(sections.highs,'52-week highs in leading sectors','var(--green)','var(--green-bg)')+
      renderSection(sections.watchlist,"Minervini's watchlist — candidates for full SEPA analysis",'var(--blue)','var(--blue-bg)');

    // If nothing parsed, show raw text so we can debug
    var totalLines=sections.earnings.length+sections.highs.length+sections.watchlist.length;
    if(totalLines===0){
      html+='<div style="color:var(--amber);font-size:12px;margin-bottom:8px">No sections parsed — showing raw response:</div>'+
        '<div style="background:var(--bg);border-radius:var(--r4);padding:10px;font-size:12px;font-family:monospace;color:var(--t2);white-space:pre-wrap;max-height:300px;overflow-y:auto;border:1px solid var(--border2)">'+esc(text.slice(0,1500))+'</div>';
    }

    out.innerHTML=html||'<div style="color:var(--t3);font-size:13px">No data returned. Try again.</div>';
    btn.textContent='Check now';btn.disabled=false;
  }catch(e){
    out.innerHTML='<div style="color:var(--red);font-size:13px">Error: '+esc(e.message)+'</div>';
    btn.textContent='Check now';btn.disabled=false;
  }
}


function renderDiscoveryText(out,text,colorMap){
  var paras=text.split('\n\n').filter(Boolean);
  out.innerHTML=paras.map(function(para){
    var upper=para.toUpperCase();
    var isFlow=colorMap.flow&&upper.includes(colorMap.flow.toUpperCase());
    var isAvoid=colorMap.avoid&&upper.includes(colorMap.avoid.toUpperCase());
    var isFocus=colorMap.focus&&upper.includes(colorMap.focus.toUpperCase());
    var isAlert=colorMap.alert&&upper.includes(colorMap.alert.toUpperCase());
    var bg=isAlert?'var(--amber-bg)':isFocus?'var(--blue-bg)':isFlow?'var(--green-bg)':isAvoid?'var(--red-bg)':'var(--bg)';
    var border=isAlert?'var(--amber)':isFocus?'var(--blue)':isFlow?'var(--green)':isAvoid?'var(--red)':'transparent';
    var titleColor=isAlert?'var(--amber)':isFocus?'var(--blue)':isFlow?'var(--green)':isAvoid?'var(--red)':'var(--t3)';
    return'<div style="background:'+bg+';border-radius:var(--r3);padding:12px 14px;margin-bottom:8px;border-left:3px solid '+border+'">'+
      para.split('\n').filter(Boolean).map(function(line,i){
        return'<div style="font-size:'+(i===0?'11px':'13px')+';font-weight:'+(i===0?'700':'400')+';color:'+(i===0?titleColor:'var(--t1)')+';'+(i===0?'text-transform:uppercase;letter-spacing:.5px;':'')+' line-height:1.65;margin-bottom:3px">'+esc(line)+'</div>';
      }).join('')+'</div>';
  }).join('');
}

function analyseFromDiscovery(ticker){
  document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active');});
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  var posNav=document.querySelector('[data-page="positions"]');
  posNav.classList.add('active');
  document.getElementById('page-positions').classList.add('active');
  document.getElementById('pageTitle').textContent=titles['positions'];
  var btn=document.getElementById('topBtn');
  btn.textContent='Ask Warren about a stock';btn.style.display='';
  btn.onclick=function(){openSheet('warren-pos');};
  openSheet('warren-pos');
  setTimeout(function(){var input=document.getElementById('f-ticker');if(input){input.value=ticker;}},150);
}


async function init(){
  updateBadges();
  renderPositions();
  renderPosWatchlist();
  renderWatchlist();
  updateWarren('positions');
  updateRegimeBanner();
  loadBreadthOnStart();
  initWatchlist();
  showRSBenchmarkStatus();
  ensureSpyBenchmarkScore().then(showRSBenchmarkStatus); // cheap (1 fetch) — safe to do on every load
}
init();
</script>
</body>
</html>
