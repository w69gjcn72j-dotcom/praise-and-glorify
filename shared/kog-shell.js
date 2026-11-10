/*! kog-shell.js - shared menu bar and language switch for the St Paul's Kogarah apps.

   Add to a page with one line, before the page's own scripts:
     <script src="https://.../shared/kog-shell.js" data-app="glorify-music"></script>

   What it gives the page
     KOG.lang                "en" | "zh-Hans" | "zh-Hant"   (remembered, and carried from app to app)
     KOG.setLang(l)          change it; fires a "kog:lang" event on document
     KOG.pick(en, hans, hant) the right string for the current language
     KOG.hant(text)          Simplified -> Traditional (once the table has loaded)
     KOG.url(href)           href with the current language attached
   Traditional Chinese is produced automatically: when 繁體 is chosen, Simplified text on the
   page is converted in place (and converted back when the reader leaves 繁體).

   Options on the script tag
     data-app="id"           which menu entry this page is (see MENU below)
     data-legacy-key="k"     an older localStorage key to read the first time ("zh" or "en")
     data-page-lang="en"     for a page written in one language ("en", "zh-Hans" or "zh-Hant").
     data-alt-en="x.html"      Where the other language is another file (x.html / x-cn.html), name
     data-alt-zh="x-cn.html"   it and the switch moves between the files; 繁體 is the 简体 file
                               converted. A language the page does not have is greyed out.
     data-bar="off"          language only, no menu bar
     data-hant="off"         do not convert the page automatically
     data-z="5"              stacking level of the bar

   Styling follows the G7 Design Scheme: brand teal band, coral rule, Calibri / Carlito type.
   Menu names live in MENU below and are listed for review in kog-glossary.json. */
(function () {
  "use strict";
  var K = window.KOG = window.KOG || {};
  if (K.version) return;
  K.version = "1.1.0";

  var LANGS = ["en", "zh-Hans", "zh-Hant"];
  var doc = document, me = doc.currentScript;
  var base = me && me.src ? me.src.replace(/[^\/]*([?#].*)?$/, "") : "";
  var opt = (me && me.dataset) || {};
  var GH = "https://w69gjcn72j-dotcom.github.io/", WP = "https://word.kogarah.church/";

  /* ---------------------------------------------------------------- menu
     Names are [English, 简体, 繁體]. `zh` is the address of an app's Chinese page, where it has one. */
  var MENU = {
    home: { name: ["St Paul's Kogarah", "高嘉华圣保罗堂", "高嘉華聖保羅堂"], url: "" },
    words: {
      menu: ["Menu", "菜单", "選單"],
      language: ["Language", "语言", "語言"],
      leaders: ["Leaders · passcode", "领袖专用 · 需通行码", "領袖專用 · 需通行碼"],
      none: ["Not available on this page", "此页面暂无此语言", "此頁面暫無此語言"]
    },
    groups: [
      { id: "glorify", color: "#c0392b", url: "https://glorify.kogarah.church/",
        name: ["Praise & Glorify", "赞美与荣耀", "讚美與榮耀"], team: ["GLORIFY", "荣耀团队", "榮耀團隊"],
        apps: [
          { id: "glorify-music", name: ["Praise & Glorify Music", "主日诗歌与乐谱", "主日詩歌與樂譜"], url: "https://glorify.kogarah.church/" },
          { id: "chords", name: ["Chord & Numeral", "和弦与级数", "和弦與級數"], url: "https://glorify.kogarah.church/chords/" }
        ] },
      { id: "word", color: "#1a5276", url: "https://word.kogarah.church/",
        name: ["Word & Prayer", "圣言与祷告", "聖言與禱告"], team: ["GROW", "成长团队", "成長團隊"],
        apps: [
          { id: "devotions", name: ["Daily Devotions", "每日灵修", "每日靈修"], url: WP + "devotions/", zh: WP + "daily-devotions-cn.html" },
          { id: "youth", name: ["KOGYouth Growth Groups", "青少年成长小组查经", "青少年成長小組查經"], url: WP + "studies/youth/", zh: WP + "bible-studies-cn.html?c=ky" },
          { id: "growth-groups", name: ["KOG Growth Groups", "成人成长小组查经", "成人成長小組查經"], url: WP + "studies/home-groups/", zh: WP + "bible-studies-cn.html?c=gg" },
          { id: "young-adults", name: ["KOG Young Adults", "青年成人查经", "青年成人查經"], url: WP + "studies/young-adults/", zh: WP + "bible-studies-cn.html?c=ya" },
          { id: "nursing-home", name: ["Nursing Home Talks", "安老院短讲", "安老院短講"], url: WP + "studies/nursing-home/", zh: WP + "bible-studies-cn.html?c=nh" },
          { id: "library", name: ["Seek & Find sermon library", "寻找就寻见 · 讲道库", "尋找就尋見 · 講道庫"], url: WP + "library/" },
          { id: "seven-stars", name: ["Seven Stars", "七星指向耶稣", "七星指向耶穌"], url: WP + "seven-stars/", zh: WP + "seven-stars-cn.html" }
        ] },
      { id: "g7", color: "#1a6b7a", url: GH + "G7KanBan/", lock: true,
        name: ["G7", "G7", "G7"], team: null,
        apps: [
          { id: "kanban", name: ["Kanban Board", "G7 看板", "G7 看板"], url: GH + "G7KanBan/" },
          { id: "cycle", name: ["The KOGCycle", "KOG 循环", "KOG 循環"], url: GH + "G7KanBan/cycle.html" },
          { id: "diary", name: ["Term Diary", "学期日程", "學期日程"], url: GH + "G7KanBan/calendar.html" },
          { id: "planner", name: ["Year Planner", "年度计划表", "年度計劃表"], url: GH + "G7KanBan/planner.html" },
          { id: "roster", name: ["Roster", "服事轮值表", "服事輪值表"], url: GH + "G7KanBan/roster.html" }
        ] }
    ]
  };
  K.menu = MENU;

  /* ---------------------------------------------------------------- language */
  function norm(v) {
    v = String(v == null ? "" : v).toLowerCase().trim();
    if (!v) return "";
    if (v === "en" || v.indexOf("en-") === 0) return "en";
    if (/^(zh-hant|zh-tw|zh-hk|zh-mo|tc|hant|cht)/.test(v)) return "zh-Hant";
    if (/^(zh|cn|sc|hans|chs)/.test(v)) return "zh-Hans";
    return "";
  }
  function mem(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {}
    return null;
  }
  function detect() {
    var n = (navigator.languages && navigator.languages[0]) || navigator.language || "";
    return norm(n) || "en";
  }

  var pageLang = norm(opt.pageLang);            /* set only on one-file-per-language pages */
  var fromUrl = "";
  try {
    var u = new URL(location.href);
    if (u.searchParams.has("lang")) {
      fromUrl = norm(u.searchParams.get("lang"));
      u.searchParams.delete("lang");
      history.replaceState(history.state, "", u.pathname + u.search + u.hash);
    }
  } catch (e) {}
  var saved = norm(mem("kog-lang")) || (opt.legacyKey ? norm(mem(opt.legacyKey)) : "");
  var lang = fromUrl || saved || (pageLang ? pageLang : detect());
  if (fromUrl) mem("kog-lang", fromUrl);

  function alt(l) { return l === "en" ? opt.altEn : opt.altZh; }
  function withLang(href, l) {
    try { var x = new URL(href, doc.baseURI || location.href); x.searchParams.set("lang", l || K.lang); return x.href; } catch (e) { return href; }
  }
  /* shown by this very file (繁體 is the 简体 file converted in place) */
  function here_(l) { return !pageLang || l === pageLang || (pageLang === "zh-Hans" && l === "zh-Hant"); }
  /* available at all: here, or in the other file */
  function can(l) {
    if (here_(l)) return true;
    if (pageLang === "zh-Hant" && l === "zh-Hans") return false;   /* Traditional to Simplified is not built */
    return !!alt(l);
  }
  K.can = can;
  if (pageLang) {
    if (fromUrl && !here_(fromUrl) && can(fromUrl)) {            /* arrived on the wrong file: move across */
      K.lang = pageLang;
      location.replace(withLang(alt(fromUrl), fromUrl));
      return;
    }
    if (!here_(lang)) lang = pageLang;                           /* show what this file really is */
    /* the reader's language exists as another file, yet they opened this one: that was a choice */
    if (!fromUrl && saved && (saved === "en") !== (lang === "en") && can(saved)) mem("kog-lang", lang);
  }
  K.lang = lang;

  function idx(l) { var i = LANGS.indexOf(l || K.lang); return i < 0 ? 0 : i; }
  K.pick = function (en, hans, hant) {
    if (en && typeof en === "object") { hant = en[2]; hans = en[1]; en = en[0]; }
    var i = idx();
    if (i === 0) return en;
    if (i === 1) return hans == null ? en : hans;
    return hant != null ? hant : (hans == null ? en : K.hant(hans));
  };
  K.url = withLang;

  function announce() {
    var ev;
    try { ev = new CustomEvent("kog:lang", { detail: { lang: K.lang, zh: K.lang !== "en", hant: K.lang === "zh-Hant" } }); }
    catch (e) { ev = doc.createEvent("CustomEvent"); ev.initCustomEvent("kog:lang", false, false, { lang: K.lang, zh: K.lang !== "en", hant: K.lang === "zh-Hant" }); }
    doc.dispatchEvent(ev);
  }
  K.setLang = function (l) {
    l = norm(l);
    if (!l || l === K.lang || !can(l)) return;
    mem("kog-lang", l);
    if (!here_(l)) { location.href = withLang(alt(l), l); return; }   /* the other language is another file */
    var was = K.lang;
    K.lang = l;
    if (was === "zh-Hant") leaveHant();
    paint();
    announce();
    if (l === "zh-Hant") enterHant();
  };
  K.onLang = function (fn) { doc.addEventListener("kog:lang", function (e) { fn(e.detail); }); };

  /* ---------------------------------------------------------------- Simplified -> Traditional
     Same method as the reference converter: the longest known phrase is matched first, the text
     either side is handled the same way, and what is left converts character by character. */
  var H = null, waiting = [], asked = false, cache = new Map();
  function build(d) {
    var C = new Map(), P = new Map(), i, seen = {};
    for (i = 0; i < d.s.length; i++) C.set(d.s.charAt(i), d.t.charAt(i));
    d.p.split("|").forEach(function (e) { var j = e.indexOf("="); if (j > 0) P.set(e.slice(0, j), e.slice(j + 1)); });
    d.q.split("|").forEach(function (e) { if (e && !P.has(e)) P.set(e, null); });
    P.forEach(function (v, k) { seen[k.length] = 1; });
    H = { C: C, P: P, lens: Object.keys(seen).map(Number).sort(function (a, b) { return b - a; }) };
  }
  function chars(s) {
    var o = "", i, c, m;
    for (i = 0; i < s.length; i++) { c = s.charAt(i); m = H.C.get(c); o += m === undefined ? c : m; }
    return o;
  }
  function seg(s, hint) {
    var n = s.length, li, L, i, k, v;
    if (n < 2) return chars(s);
    for (li = 0; li < H.lens.length; li++) {
      L = H.lens[li];
      if (L > n || L > hint) continue;
      for (i = 0; i + L <= n; i++) {
        k = s.substr(i, L);
        if (H.P.has(k)) {
          v = H.P.get(k);
          return seg(s.slice(0, i), L) + (v === null ? chars(k) : v) + seg(s.slice(i + L), L);
        }
      }
    }
    return chars(s);
  }
  var HAN_RUN = /[⺀-鿿豈-﫿]+/g, HAN = /[㐀-鿿]/;
  K.hant = function (str) {
    if (!H || str == null) return str;
    str = String(str);
    if (!HAN.test(str)) return str;
    var hit = cache.get(str);
    if (hit !== undefined) return hit;
    var out = str.replace(HAN_RUN, function (run) { return seg(run, 99); });
    if (cache.size > 4000) cache.clear();
    cache.set(str, out);
    return out;
  };
  K.hantReady = function (fn) {
    if (H) { fn(); return; }
    waiting.push(fn);
    if (asked) return;
    asked = true;
    K._hantLoaded = function () { build(K._hantData); K._hantData = null; waiting.splice(0).forEach(function (f) { try { f(); } catch (e) {} }); };
    if (K._hantData) { K._hantLoaded(); return; }
    var s = doc.createElement("script");
    s.src = base + "kog-hant.js"; s.async = true;
    s.onerror = function () { asked = false; };
    doc.head.appendChild(s);
  };

  /* converting the page in place, and putting it back */
  var host = null, mo = null, auto = opt.hant !== "off";
  var kept = new WeakMap(), keptAttr = new WeakMap(), titleKept = null, langKept = "";
  var ATTRS = ["placeholder", "title", "aria-label", "alt"];
  function barred(el) {
    var t = el.nodeName;
    return t === "SCRIPT" || t === "STYLE" || t === "TEXTAREA" || t === "NOSCRIPT" || el === host ||
           el.isContentEditable || el.hasAttribute("data-kog-keep");
  }
  function inBarred(el) {
    for (; el && el.nodeType === 1; el = el.parentNode) if (barred(el)) return true;
    return false;
  }
  function doText(n) {
    var d = n.data, r, c;
    if (!HAN.test(d)) return;
    r = kept.get(n);
    if (r && r.c === d) return;
    c = K.hant(d);
    if (c !== d) { kept.set(n, { o: d, c: c }); n.data = c; }
  }
  function doAttrs(el) {
    var i, a, v, c, r;
    for (i = 0; i < ATTRS.length; i++) {
      a = ATTRS[i]; v = el.getAttribute(a);
      if (!v || !HAN.test(v)) continue;
      r = keptAttr.get(el) || {};
      if (r[a] && r[a].c === v) continue;
      c = K.hant(v);
      if (c !== v) { r[a] = { o: v, c: c }; keptAttr.set(el, r); el.setAttribute(a, c); }
    }
  }
  function walk(root, each) {
    if (root.nodeType === 3) { if (!inBarred(root.parentNode)) each(root); return; }
    if (root.nodeType !== 1 || inBarred(root)) return;
    var w = doc.createTreeWalker(root, 5 /* elements + text */, {
      acceptNode: function (n) { return n.nodeType === 1 && barred(n) ? 2 /* reject */ : 1; }
    }), n = root;
    do { each(n); } while ((n = w.nextNode()));
  }
  function convert(n) { if (n.nodeType === 3) doText(n); else doAttrs(n); }
  function restore(n) {
    var r, a;
    if (n.nodeType === 3) { r = kept.get(n); if (r) { if (n.data === r.c) n.data = r.o; kept.delete(n); } return; }
    r = keptAttr.get(n);
    if (r) { for (a in r) if (n.getAttribute(a) === r[a].c) n.setAttribute(a, r[a].o); keptAttr.delete(n); }
  }
  function enterHant() {
    if (!auto || pageLang === "zh-Hant") return;                  /* a page written in Traditional needs no converting */
    K.hantReady(function () {
      if (K.lang !== "zh-Hant" || !doc.body) return;
      walk(doc.body, convert);
      if (HAN.test(doc.title)) { var t = K.hant(doc.title); if (t !== doc.title) { titleKept = { o: doc.title, c: t }; doc.title = t; } }
      if (doc.documentElement.lang !== "zh-Hant") langKept = doc.documentElement.lang;
      doc.documentElement.lang = "zh-Hant";
      if (!mo && window.MutationObserver) {
        mo = new MutationObserver(function (recs) {
          var i, j, r;
          for (i = 0; i < recs.length; i++) {
            r = recs[i];
            if (r.type === "childList") for (j = 0; j < r.addedNodes.length; j++) walk(r.addedNodes[j], convert);
            else if (r.type === "characterData") { if (!inBarred(r.target.parentNode)) doText(r.target); }
            else if (!inBarred(r.target)) doAttrs(r.target);
          }
          mo.takeRecords();                      /* our own edits need no second look */
          if (doc.documentElement.lang === "zh-Hans") doc.documentElement.lang = "zh-Hant";
        });
        mo.observe(doc.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
      }
      paint();
    });
  }
  function leaveHant() {
    if (mo) { mo.disconnect(); mo = null; }
    if (doc.body) walk(doc.body, restore);
    if (titleKept) { if (doc.title === titleKept.c) doc.title = titleKept.o; titleKept = null; }
    if (doc.documentElement.lang === "zh-Hant") doc.documentElement.lang = langKept || "zh-Hans";
  }

  /* ---------------------------------------------------------------- the bar */
  var CSS = [
    ":host{all:initial;display:block}",
    "*{box-sizing:border-box}",
    ".w{--teal:#1a6b7a;--coral:#e8724a;--ink:#212121;--alt:#f5f5f5;",
    "--head:'Calibri Light',Calibri,Carlito,Arial,'PingFang SC','PingFang TC','Microsoft YaHei','Microsoft JhengHei','Noto Sans CJK SC',sans-serif;",
    "--sans:Calibri,Carlito,Arial,'Helvetica Neue',Helvetica,'PingFang SC','PingFang TC','Microsoft YaHei','Microsoft JhengHei','Noto Sans CJK SC',sans-serif;",
    "font:400 16px/1.35 var(--sans);color:var(--ink);text-align:left;-webkit-text-size-adjust:100%}",
    ".band{background:var(--teal);color:#fff;display:flex;align-items:center;gap:10px;min-height:44px;",
    "padding:env(safe-area-inset-top,0px) max(12px,env(safe-area-inset-right,0px)) 0 max(12px,env(safe-area-inset-left,0px))}",
    "button{font:inherit;color:inherit;background:none;border:0;margin:0;padding:0;cursor:pointer}",
    ".menu{display:inline-flex;align-items:center;gap:9px;min-height:44px;padding:0 4px 0 0;font-family:var(--head);font-weight:300;font-size:17.33px;white-space:nowrap}",
    ".menu svg{width:18px;height:18px;flex:none}",
    ".crumb{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14.67px;opacity:.95;padding-left:10px;border-left:1px solid rgba(255,255,255,.4)}",
    ".lang{margin-left:auto;display:inline-flex;flex:none;border:1px solid rgba(255,255,255,.7);border-radius:6px;overflow:hidden}",
    ".lang button{padding:6px 10px;font-size:14px;line-height:1.2;color:#fff}",
    ".lang button+button{border-left:1px solid rgba(255,255,255,.7)}",
    ".lang button[aria-pressed=true]{background:#fff;color:var(--ink)}",
    ".lang button[aria-disabled=true]{opacity:.42;cursor:default}",
    ".rule{height:3px;background:var(--coral)}",
    ".panel{background:#fff;border-bottom:1px solid #d0d0d0}",
    ".cols{max-width:980px;margin:0 auto;padding:14px max(14px,env(safe-area-inset-right,0px)) 18px max(14px,env(safe-area-inset-left,0px));display:grid;gap:14px 30px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}",
    "h2{margin:0 0 4px;font-family:var(--head);font-weight:300;font-size:21.33px;line-height:1.25;display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 9px}",
    "h2 a{color:var(--ink);text-decoration:none}",
    "h2 a:hover{text-decoration:underline}",
    ".dot{width:11px;height:11px;border-radius:50%;flex:none;align-self:center}",
    ".team{font:700 12px/1 var(--sans);letter-spacing:.06em}",
    ".lock{font:italic 400 12px/1.2 var(--sans);color:var(--ink)}",
    "ul{list-style:none;margin:0;padding:0}",
    "li a{display:block;padding:9px 10px;color:var(--ink);text-decoration:none;border-left:3px solid transparent;font-size:16px}",
    "li a:hover{background:var(--alt)}",
    "li a[aria-current]{border-left-color:var(--coral);background:var(--alt)}",
    ":focus-visible{outline:2px solid var(--coral);outline-offset:2px;border-radius:3px}",
    ".band :focus-visible{outline-color:#fff}",
    "@media (max-width:560px){.crumb{display:none}}",
    "@media (max-width:340px){.menu{font-size:15.5px}.lang button{padding:6px 8px}}"
  ].join("");

  var root = null, open = false, here = null, hereGroup = null;
  MENU.groups.forEach(function (g) { g.apps.forEach(function (a) { if (a.id === opt.app) { here = a; hereGroup = g; } }); if (g.id === opt.app) hereGroup = g; });

  function h(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function link(a) { return K.url(K.lang !== "en" && a.zh ? a.zh : a.url); }
  function paint() {
    if (!root) return;
    var i = idx(), W = MENU.words, s = "";
    s += '<div class="w" lang="' + K.lang + '"><div class="band">';
    s += '<button class="menu" id="m" aria-expanded="' + open + '" aria-controls="p" aria-label="' + h(W.menu[i] + ": " + MENU.home.name[i]) + '">' +
         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
         "<span>" + h(MENU.home.name[i]) + "</span></button>";
    if (hereGroup) s += '<span class="crumb">' + h(hereGroup.name[i]) + (here ? " › " + h(here.name[i]) : "") + "</span>";
    s += '<div class="lang" role="group" aria-label="' + h(W.language[i]) + '">';
    [["en", "EN", "English"], ["zh-Hans", "简", "简体中文"], ["zh-Hant", "繁", "繁體中文"]].forEach(function (b, n) {
      var ok = can(b[0]);
      s += '<button data-l="' + b[0] + '" lang="' + b[0] + '" aria-pressed="' + (i === n) + '"' +
           (ok ? ' aria-label="' + b[2] + '"' : ' aria-disabled="true" aria-label="' + h(b[2] + ": " + W.none[i]) + '" title="' + h(W.none[i]) + '"') + ">" + b[1] + "</button>";
    });
    s += "</div>";
    s += '</div><div class="rule"></div>';
    s += '<nav class="panel" id="p" aria-label="' + h(MENU.home.name[i]) + '"' + (open ? "" : " hidden") + '><div class="cols">';
    MENU.groups.forEach(function (g) {
      s += '<section><h2><i class="dot" style="background:' + g.color + '"></i><a href="' + h(K.url(g.url)) + '">' + h(g.name[i]) + "</a>";
      if (g.team) s += '<span class="team" style="color:' + g.color + '">' + h(g.team[i]) + "</span>";
      if (g.lock) s += '<span class="lock">' + h(W.leaders[i]) + "</span>";
      s += "</h2><ul>";
      g.apps.forEach(function (a) {
        s += '<li><a href="' + h(link(a)) + '"' + (a === here ? ' aria-current="page"' : "") + ">" + h(a.name[i]) + "</a></li>";
      });
      s += "</ul></section>";
    });
    s += "</div></nav></div>";
    var keep = root.querySelector("style");
    root.innerHTML = "";
    root.appendChild(keep);
    var box = doc.createElement("div");
    box.innerHTML = s;
    root.appendChild(box.firstChild);
    place();
  }
  function toggle(to) {
    open = to === undefined ? !open : to;
    paint();
    if (open) { var b = root.getElementById("m"); if (b) b.focus(); }
  }
  /* sit across the very top of the page, whatever padding or width the app gives its body */
  function place() {
    if (!host) return;
    var st = host.style;
    st.cssText = "display:block;position:relative;margin:0;z-index:" + (opt.z || 5);
    var r = host.getBoundingClientRect();
    var left = r.left + (window.pageXOffset || 0), top = r.top + (window.pageYOffset || 0);
    st.marginLeft = -left + "px";
    st.marginTop = -top + "px";
    st.width = doc.documentElement.clientWidth + "px";
    st.marginBottom = Math.min(Math.max(top, 0), 28) + "px";
  }
  function mount() {
    if (opt.bar === "off" || host || !doc.body || !doc.body.attachShadow) return;
    if (!doc.querySelector('link[href*="family=Carlito"]')) {
      var f = doc.createElement("link");
      f.rel = "stylesheet"; f.href = "https://fonts.googleapis.com/css2?family=Carlito:wght@400;700&display=swap";
      doc.head.appendChild(f);
    }
    host = doc.createElement("div");
    host.id = "kog-shell";
    root = host.attachShadow({ mode: "open" });
    var st = doc.createElement("style");
    st.textContent = CSS;
    root.appendChild(st);
    doc.body.insertBefore(host, doc.body.firstChild);
    root.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-l],#m") : null;
      if (!t) return;
      if (t.id === "m") toggle(); else if (t.getAttribute("aria-disabled") !== "true") K.setLang(t.getAttribute("data-l"));
    });
    doc.addEventListener("keydown", function (e) { if (open && e.key === "Escape") toggle(false); });
    doc.addEventListener("click", function (e) { if (open && e.target !== host) toggle(false); });
    window.addEventListener("resize", place);
    window.addEventListener("load", place);
    doc.addEventListener("DOMContentLoaded", place);
    paint();
  }
  function start() {
    mount();
    if (K.lang === "zh-Hant") enterHant();
  }
  if (doc.body) start(); else doc.addEventListener("DOMContentLoaded", start);
})();
