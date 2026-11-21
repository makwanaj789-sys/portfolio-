(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var preview = /[?&]preview=1/.test(location.search);
  if (preview) document.documentElement.classList.add('preview');

  /* ---------------- product art (SVG, drawn per colour) ---------------- */
  var uid = 0;
  function phoneSVG(c, kind) {
    var id = 'g' + (uid++);
    var fold = kind === 'fold';
    var fw = fold ? 170 : 120, fx = fold ? 30 : 58;
    return '<svg class="art" viewBox="0 0 300 330" aria-hidden="true"><defs>' +
      '<linearGradient id="' + id + 'b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c.body + '"/><stop offset="1" stop-color="' + c.edge + '"/></linearGradient>' +
      '<radialGradient id="' + id + 'w" cx=".3" cy=".25" r="1"><stop offset="0" stop-color="' + c.w1 + '"/><stop offset=".55" stop-color="' + c.w2 + '"/><stop offset="1" stop-color="#0B0B10"/></radialGradient>' +
      '<linearGradient id="' + id + 's" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>' +
      '<ellipse cx="150" cy="312" rx="120" ry="10" fill="#0B0B10" opacity=".08"/>' +
      // back of phone
      '<rect x="150" y="22" width="116" height="250" rx="26" fill="url(#' + id + 'b)"/>' +
      '<rect x="150" y="22" width="116" height="250" rx="26" fill="url(#' + id + 's)"/>' +
      '<rect x="163" y="36" width="56" height="58" rx="16" fill="' + c.edge + '" opacity=".9"/>' +
      '<circle cx="180" cy="53" r="11" fill="#14151c"/><circle cx="180" cy="53" r="5" fill="#2b2f45"/>' +
      '<circle cx="203" cy="77" r="11" fill="#14151c"/><circle cx="203" cy="77" r="5" fill="#2b2f45"/>' +
      '<circle cx="180" cy="77" r="11" fill="#14151c"/><circle cx="180" cy="77" r="5" fill="#2b2f45"/>' +
      '<circle cx="205" cy="52" r="4" fill="#FFF6D6"/>' +
      // front of phone
      '<rect x="' + fx + '" y="58" width="' + fw + '" height="262" rx="26" fill="#0E0F15"/>' +
      '<rect x="' + (fx + 5) + '" y="63" width="' + (fw - 10) + '" height="252" rx="22" fill="url(#' + id + 'w)"/>' +
      (fold ? '<line x1="' + (fx + fw / 2) + '" y1="63" x2="' + (fx + fw / 2) + '" y2="315" stroke="#000" stroke-opacity=".25"/>' : '') +
      '<rect x="' + (fx + fw / 2 - 18) + '" y="71" width="36" height="10" rx="5" fill="#000"/>' +
      '<text x="' + (fx + fw / 2) + '" y="128" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-weight="700" font-size="34" fill="#fff" opacity=".92">9:41</text>' +
      '<rect x="' + (fx + 5) + '" y="63" width="' + (fw - 10) + '" height="252" rx="22" fill="url(#' + id + 's)" opacity=".6"/>' +
      '</svg>';
  }
  function laptopSVG(c, kind) {
    var id = 'g' + (uid++);
    var gaming = kind === 'gaming';
    return '<svg class="art" viewBox="0 0 320 250" aria-hidden="true"><defs>' +
      '<radialGradient id="' + id + 'w" cx=".25" cy=".2" r="1.1"><stop offset="0" stop-color="' + c.w1 + '"/><stop offset=".55" stop-color="' + c.w2 + '"/><stop offset="1" stop-color="#0B0B10"/></radialGradient>' +
      '<linearGradient id="' + id + 'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c.body + '"/><stop offset="1" stop-color="' + c.edge + '"/></linearGradient>' +
      '<linearGradient id="' + id + 's" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>' +
      '<ellipse cx="160" cy="236" rx="150" ry="9" fill="#0B0B10" opacity=".08"/>' +
      '<rect x="42" y="18" width="236" height="160" rx="12" fill="' + (gaming ? '#15161d' : c.edge) + '"/>' +
      '<rect x="49" y="25" width="222" height="144" rx="6" fill="url(#' + id + 'w)"/>' +
      (gaming
        ? '<path d="M70 150 120 70l30 45 25-30 50 65z" fill="#fff" opacity=".12"/><text x="160" y="105" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-weight="700" font-size="22" fill="#fff" opacity=".85">PULSE</text>'
        : '<circle cx="230" cy="60" r="26" fill="#fff" opacity=".12"/><rect x="66" y="128" width="90" height="10" rx="5" fill="#fff" opacity=".25"/><rect x="66" y="144" width="60" height="8" rx="4" fill="#fff" opacity=".15"/>') +
      '<rect x="49" y="25" width="222" height="144" rx="6" fill="url(#' + id + 's)"/>' +
      '<circle cx="160" cy="21.5" r="1.6" fill="#333"/>' +
      '<path d="M22 182h276l14 22c2 4-1 8-6 8H14c-5 0-8-4-6-8z" fill="url(#' + id + 'b)"/>' +
      '<rect x="134" y="182" width="52" height="6" rx="3" fill="#000" opacity=".18"/>' +
      (gaming ? '<rect x="40" y="206" width="240" height="3" rx="1.5" fill="url(#' + id + 'r)"/><defs><linearGradient id="' + id + 'r"><stop offset="0" stop-color="#ff3b3b"/><stop offset=".33" stop-color="#d4ff3a"/><stop offset=".66" stop-color="#3fe0d0"/><stop offset="1" stop-color="#5b3df5"/></linearGradient></defs>' : '') +
      '</svg>';
  }
  function art(p, ci) {
    var c = p.colors[ci || 0];
    return p.type === 'mobile' ? phoneSVG(c, p.kind) : laptopSVG(c, p.kind);
  }

  /* ---------------- catalogue (fictional products) ---------------- */
  var C = {
    titan: { name: 'Titan Black', body: '#3A3D4A', edge: '#1C1E26', w1: '#7C6CFF', w2: '#2A1F7A' },
    aurora: { name: 'Aurora Blue', body: '#9FC3FF', edge: '#4E78C9', w1: '#6FE3FF', w2: '#2F51D9' },
    gold: { name: 'Sunset Gold', body: '#F4D6A6', edge: '#C59A5C', w1: '#FFC46B', w2: '#E2564B' },
    mint: { name: 'Mint', body: '#BFF0DA', edge: '#6CC4A0', w1: '#7CF5C8', w2: '#127C6A' },
    lilac: { name: 'Lilac', body: '#D8CCFF', edge: '#9584DC', w1: '#F09BFF', w2: '#5B3DF5' },
    lime: { name: 'Neon Lime', body: '#E4FF7A', edge: '#9CBF1D', w1: '#D4FF3A', w2: '#1E8C5A' },
    silver: { name: 'Silver', body: '#E6E8EE', edge: '#A7ABB7', w1: '#9BD3FF', w2: '#3A57C9' },
    space: { name: 'Space Grey', body: '#8B8F9C', edge: '#4E525E', w1: '#B39BFF', w2: '#3B2A8F' },
    midnight: { name: 'Midnight', body: '#3B4160', edge: '#1D2136', w1: '#FF7AB6', w2: '#4B2A9C' },
    carbon: { name: 'Carbon', body: '#3A3B42', edge: '#16171C', w1: '#FF3B3B', w2: '#5B0E2B' },
    stealth: { name: 'Stealth', body: '#2B2E38', edge: '#111217', w1: '#3FE0D0', w2: '#0E3B6B' }
  };
  var PV = [{ l: '8GB · 128GB', a: 0 }, { l: '12GB · 256GB', a: 6000 }, { l: '16GB · 512GB', a: 14000 }];
  var LV = [{ l: '16GB · 512GB', a: 0 }, { l: '16GB · 1TB', a: 8000 }, { l: '32GB · 1TB', a: 20000 }];
  var products = [
    { id: 'vxp', type: 'mobile', name: 'Volt X Pro', sub: '6.7" 120Hz AMOLED · 200MP camera · 5000mAh', price: 54999, compare: 64999, rating: 4.8, reviews: 2140, badge: 'best', colors: [C.titan, C.aurora, C.gold], variants: PV, specs: ['6.7" 120Hz LTPO AMOLED, 2600 nits', '200MP main + 50MP ultra-wide + 3x telephoto', '5000mAh with 80W fast charging', 'IP68 water and dust resistance'] },
    { id: 'vx', type: 'mobile', name: 'Volt X', sub: '6.4" AMOLED · 64MP OIS · 67W charging', price: 39999, compare: 44999, rating: 4.7, reviews: 1630, colors: [C.lilac, C.titan, C.mint], variants: PV, specs: ['6.4" 120Hz AMOLED', '64MP OIS camera with 4K60 video', '4700mAh with 67W charging', 'Stereo speakers'] },
    { id: 'vfold', type: 'mobile', kind: 'fold', name: 'Volt Fold Z', sub: '7.8" foldable · 1 TB option · titanium hinge', price: 119999, compare: 134999, rating: 4.6, reviews: 412, badge: 'new', colors: [C.midnight, C.silver], variants: [{ l: '12GB · 256GB', a: 0 }, { l: '12GB · 512GB', a: 10000 }, { l: '16GB · 1TB', a: 25000 }], specs: ['7.8" inner + 6.3" cover display', 'Titanium hinge rated for 500K folds', '50MP triple camera', '4400mAh with 45W charging'] },
    { id: 'vair', type: 'mobile', name: 'Volt Air 5G', sub: '6.1 mm thin · 5G · 50MP camera', price: 24999, compare: 29999, rating: 4.5, reviews: 3120, colors: [C.mint, C.aurora, C.gold], variants: PV, specs: ['Ultra-thin 6.1 mm body', '6.6" 120Hz AMOLED', '50MP camera with night mode', '5000mAh battery'] },
    { id: 'vneo', type: 'mobile', name: 'Volt Neo', sub: '6.6" 90Hz · 5000mAh · 2 days battery', price: 14999, compare: 17999, rating: 4.4, reviews: 5480, badge: 'best', colors: [C.lime, C.titan, C.lilac], variants: PV.slice(0, 2), specs: ['6.6" 90Hz display', '50MP dual camera', '5000mAh, 2-day battery', 'Side fingerprint sensor'] },
    { id: 'vlite', type: 'mobile', name: 'Volt Lite', sub: 'Big screen, small price · 5G ready', price: 9999, compare: 11999, rating: 4.3, reviews: 6210, colors: [C.aurora, C.titan], variants: [{ l: '4GB · 64GB', a: 0 }, { l: '6GB · 128GB', a: 1500 }], specs: ['6.5" HD+ display', '5G ready', '13MP camera', '5000mAh battery'] },
    { id: 'nb14', type: 'laptop', name: 'Nimbus Book 14', sub: 'Core i5 · 14" 2.8K OLED · 1.2 kg', price: 59999, compare: 69999, rating: 4.7, reviews: 980, badge: 'best', colors: [C.silver, C.space], variants: LV, specs: ['Intel Core i5, 12 cores', '14" 2.8K OLED, 90Hz', 'Up to 14 hours battery', '1.2 kg aluminium body'] },
    { id: 'nbp16', type: 'laptop', name: 'Nimbus Book Pro 16', sub: 'Core Ultra 9 · 16" 3.2K 120Hz · creator ready', price: 129999, compare: 149999, rating: 4.8, reviews: 510, badge: 'new', colors: [C.space, C.silver], variants: [{ l: '32GB · 1TB', a: 0 }, { l: '32GB · 2TB', a: 15000 }, { l: '64GB · 2TB', a: 35000 }], specs: ['Intel Core Ultra 9', '16" 3.2K 120Hz, 100% DCI-P3', 'RTX 4070 for editing and 3D', 'Six-speaker audio'] },
    { id: 'g15', type: 'laptop', kind: 'gaming', gaming: true, name: 'Pulse G15 Gaming', sub: 'RTX 4060 · 165Hz · RGB keyboard', price: 84999, compare: 104999, rating: 4.7, reviews: 1320, badge: 'sale', colors: [C.carbon, C.stealth], variants: LV, specs: ['RTX 4060, 140W TGP', '15.6" 165Hz QHD display', 'Per-key RGB keyboard', 'Dual-fan vapour cooling'] },
    { id: 'g17', type: 'laptop', kind: 'gaming', gaming: true, name: 'Pulse G17 Ultra', sub: 'RTX 4080 · 17" 240Hz · Core i9', price: 179999, compare: 199999, rating: 4.9, reviews: 260, colors: [C.stealth, C.carbon], variants: [{ l: '32GB · 1TB', a: 0 }, { l: '32GB · 2TB', a: 12000 }, { l: '64GB · 2TB', a: 30000 }], specs: ['RTX 4080, 175W TGP', '17" 240Hz QHD+ display', 'Intel Core i9', 'Liquid-metal cooling'] },
    { id: 'nair', type: 'laptop', name: 'Nimbus Air 13', sub: 'Fanless · 13.3" · 18 hours battery', price: 49999, compare: 56999, rating: 4.6, reviews: 870, colors: [C.gold, C.silver, C.space], variants: [{ l: '8GB · 256GB', a: 0 }, { l: '16GB · 512GB', a: 9000 }], specs: ['Silent fanless design', '13.3" 2K display', 'Up to 18 hours battery', '1.1 kg'] },
    { id: 'flip', type: 'laptop', name: 'Nimbus Flip 14', sub: '2-in-1 touch · stylus included', price: 64999, compare: 72999, rating: 4.5, reviews: 430, badge: 'new', colors: [C.lilac, C.silver], variants: LV, specs: ['360° hinge, 2-in-1', '14" touch OLED with stylus', 'Core i7', 'Thunderbolt 4'] }
  ];
  var byId = {}; products.forEach(function (p) { byId[p.id] = p; });
  var deal = { id: 'g15', price: 84999 };

  var inr = function (n) { return '₹' + Math.round(n).toLocaleString('en-IN'); };
  var stars = function (r) { var f = Math.round(r); return '★★★★★'.slice(0, f) + '☆☆☆☆☆'.slice(0, 5 - f); };
  var priceOf = function (p) { return p.id === deal.id ? deal.price : p.price; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------------- storage (cart) ---------------- */
  var KEY = 'voltix-cart';
  var cart = [];
  try { if (!preview) cart = JSON.parse(localStorage.getItem(KEY) || '[]').filter(function (i) { return byId[i.id]; }); } catch (e) { cart = []; }
  function save() { if (preview) return; try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { } }

  /* ---------------- toast ---------------- */
  var toastT;
  function toast(msg) { var t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2200); }

  /* ---------------- grid ---------------- */
  var filter = 'all', sort = 'featured';
  var titles = { all: 'All products', mobile: 'Mobiles', laptop: 'Laptops', gaming: 'Gaming laptops', budget: 'Under ₹25,000' };
  var cardColor = {};
  function list() {
    var l = products.filter(function (p) {
      if (filter === 'all') return true;
      if (filter === 'gaming') return p.gaming;
      if (filter === 'budget') return priceOf(p) <= 25000;
      return p.type === filter;
    });
    if (sort === 'low') l.sort(function (a, b) { return priceOf(a) - priceOf(b); });
    if (sort === 'high') l.sort(function (a, b) { return priceOf(b) - priceOf(a); });
    if (sort === 'rating') l.sort(function (a, b) { return b.rating - a.rating; });
    return l;
  }
  function badgeHTML(p) {
    var off = Math.round((1 - priceOf(p) / p.compare) * 100);
    if (p.badge === 'new') return '<span class="badge new">NEW</span>';
    if (p.badge === 'best') return '<span class="badge best">BESTSELLER</span>';
    return '<span class="badge">−' + off + '%</span>';
  }
  function renderGrid() {
    $('#shop-title').textContent = titles[filter];
    $$('.tab').forEach(function (t) { t.classList.toggle('active', t.dataset.filter === filter); t.setAttribute('aria-selected', t.dataset.filter === filter); });
    $('#grid').innerHTML = list().map(function (p, i) {
      var ci = cardColor[p.id] || 0;
      var off = Math.round((1 - priceOf(p) / p.compare) * 100);
      return '<article class="product" style="animation-delay:' + (i * 0.04) + 's" data-id="' + p.id + '">' +
        '<div class="p-media" data-qv style="background:linear-gradient(160deg,' + p.colors[ci].body + '33,' + p.colors[ci].w2 + '22)">' + badgeHTML(p) + art(p, ci) +
        '<button class="quick" data-qv>Quick view</button></div>' +
        '<div class="p-body"><h3 class="p-title" data-qv>' + esc(p.name) + '</h3><p class="p-sub">' + esc(p.sub) + '</p>' +
        '<div class="rating"><span class="stars">' + stars(p.rating) + '</span>' + p.rating + ' (' + p.reviews.toLocaleString('en-IN') + ')</div>' +
        '<div class="price-row"><span class="price">' + inr(priceOf(p)) + '</span><s class="compare">' + inr(p.compare) + '</s><span class="off">' + off + '% off</span></div>' +
        '<div class="p-foot"><div class="swatches">' + p.colors.map(function (c, k) { return '<button class="sw' + (k === ci ? ' active' : '') + '" style="background:' + c.body + '" data-sw="' + k + '" aria-label="' + c.name + '"></button>'; }).join('') + '</div>' +
        '<button class="add" data-add>Add to cart</button></div></div></article>';
    }).join('');
  }
  $('#grid').addEventListener('click', function (e) {
    var card = e.target.closest('.product'); if (!card) return;
    var p = byId[card.dataset.id];
    var sw = e.target.closest('[data-sw]');
    if (sw) {
      var k = +sw.dataset.sw; cardColor[p.id] = k;
      var media = $('.p-media', card);
      $('.art', media).outerHTML = art(p, k);
      media.style.background = 'linear-gradient(160deg,' + p.colors[k].body + '33,' + p.colors[k].w2 + '22)';
      $$('.sw', card).forEach(function (s, i) { s.classList.toggle('active', i === k); });
      return;
    }
    if (e.target.closest('[data-add]')) {
      var b = e.target.closest('[data-add]');
      addToCart(p.id, cardColor[p.id] || 0, 0, 1);
      b.classList.add('done'); b.textContent = 'Added ✓';
      setTimeout(function () { b.classList.remove('done'); b.textContent = 'Add to cart'; }, 1400);
      return;
    }
    if (e.target.closest('[data-qv]')) openQV(p.id, cardColor[p.id] || 0);
  });

  function setFilter(f, scroll) {
    filter = f; renderGrid();
    if (scroll) $('#shop').scrollIntoView({ behavior: 'smooth' });
  }
  $$('[data-filter]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (el.classList.contains('tab')) { setFilter(el.dataset.filter, false); return; }
      e.preventDefault(); closeNav(); setFilter(el.dataset.filter, true);
    });
  });
  $('#sort').addEventListener('change', function (e) { sort = e.target.value; renderGrid(); });

  /* ---------------- overlays ---------------- */
  var lastFocus;
  function openOverlay(id) {
    lastFocus = document.activeElement;
    var o = $('#' + id); o.hidden = false; document.body.style.overflow = 'hidden';
    var f = $('[data-close], button, input', o); if (f) setTimeout(function () { (id === 'search' ? $('#search-input') : f).focus(); }, 30);
  }
  function closeOverlay(o) {
    o.hidden = true;
    if (!$$('.overlay').some(function (x) { return !x.hidden; })) document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$('.overlay').forEach(function (o) {
    o.addEventListener('click', function (e) { if (e.target === o || e.target.closest('[data-close]')) closeOverlay(o); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = $$('.overlay').filter(function (o) { return !o.hidden; }).pop();
    if (open) closeOverlay(open); else closeNav();
  });

  /* ---------------- quick view ---------------- */
  var qv = { id: null, c: 0, v: 0, q: 1 };
  function renderQV() {
    var p = byId[qv.id], price = priceOf(p) + p.variants[qv.v].a;
    $('#qv-media').innerHTML = art(p, qv.c);
    $('#qv-media').style.background = 'linear-gradient(160deg,' + p.colors[qv.c].body + '44,' + p.colors[qv.c].w2 + '22)';
    $('#qv-cat').textContent = p.type === 'mobile' ? 'Mobile' : (p.gaming ? 'Gaming laptop' : 'Laptop');
    $('#qv-title').textContent = p.name;
    $('#qv-rating').innerHTML = '<span class="stars">' + stars(p.rating) + '</span>' + p.rating + ' · ' + p.reviews.toLocaleString('en-IN') + ' ratings';
    $('#qv-price').innerHTML = '<span class="price">' + inr(price) + '</span><s class="compare">' + inr(p.compare + p.variants[qv.v].a) + '</s><span class="off">You save ' + inr(p.compare - priceOf(p)) + '</span>';
    $('#qv-emi').textContent = 'No-cost EMI from ' + inr(price / 9) + '/month for 9 months';
    $('#qv-color-name').textContent = p.colors[qv.c].name;
    $('#qv-colors').innerHTML = p.colors.map(function (c, k) { return '<button class="sw' + (k === qv.c ? ' active' : '') + '" style="background:' + c.body + '" data-k="' + k + '" aria-label="' + c.name + '"></button>'; }).join('');
    $('#qv-variants').innerHTML = p.variants.map(function (v, k) { return '<button class="var' + (k === qv.v ? ' active' : '') + '" data-k="' + k + '">' + v.l + (v.a ? ' · +' + inr(v.a) : '') + '</button>'; }).join('');
    $('#qv-qty span').textContent = qv.q;
    $('#qv-specs').innerHTML = p.specs.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
  }
  function openQV(id, c) { qv = { id: id, c: c || 0, v: 0, q: 1 }; renderQV(); openOverlay('qv'); }
  $('#qv-colors').addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (b) { qv.c = +b.dataset.k; renderQV(); } });
  $('#qv-variants').addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (b) { qv.v = +b.dataset.k; renderQV(); } });
  $('#qv-qty').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; qv.q = Math.max(1, Math.min(5, qv.q + (b.textContent === '+' ? 1 : -1))); renderQV(); });
  $('#qv-add').addEventListener('click', function () { addToCart(qv.id, qv.c, qv.v, qv.q); closeOverlay($('#qv')); openCart(); });
  $('#qv-now').addEventListener('click', function () { addToCart(qv.id, qv.c, qv.v, qv.q, true); closeOverlay($('#qv')); openCheckout(); });

  /* ---------------- cart ---------------- */
  var FREE = 999;
  function lineKey(i) { return i.id + '|' + i.c + '|' + i.v; }
  function unitPrice(i) { var p = byId[i.id]; return priceOf(p) + p.variants[i.v].a; }
  function addToCart(id, c, v, q, silent) {
    var key = id + '|' + c + '|' + v;
    var line = cart.filter(function (i) { return lineKey(i) === key; })[0];
    if (line) line.q = Math.min(9, line.q + q); else cart.push({ id: id, c: c, v: v, q: q });
    save(); renderCart();
    var cc = $('#cart-count'); cc.classList.remove('bump'); void cc.offsetWidth; cc.classList.add('bump');
    if (!silent) toast(byId[id].name + ' added to cart');
  }
  function total() { return cart.reduce(function (s, i) { return s + unitPrice(i) * i.q; }, 0); }
  function renderCart() {
    var n = cart.reduce(function (s, i) { return s + i.q; }, 0), t = total();
    $('#cart-count').textContent = n;
    $('#cart-n').textContent = n ? '(' + n + ')' : '';
    $('#subtotal').textContent = inr(t);
    $('#checkout-btn').disabled = !n;
    $('#ship-text').innerHTML = t >= FREE ? '🎉 You’ve unlocked <b>free delivery</b>' : 'Add <b>' + inr(FREE - t) + '</b> more for free delivery';
    $('#ship-bar').style.width = Math.min(100, t / FREE * 100) + '%';
    $('#cart-items').innerHTML = n ? cart.map(function (i, k) {
      var p = byId[i.id];
      return '<div class="ci" data-k="' + k + '"><div class="ci-art">' + art(p, i.c) + '</div>' +
        '<div><h4>' + esc(p.name) + '</h4><small>' + p.colors[i.c].name + ' · ' + p.variants[i.v].l + '</small>' +
        '<div class="qty"><button data-d="-1" aria-label="Decrease">−</button><span>' + i.q + '</span><button data-d="1" aria-label="Increase">+</button></div></div>' +
        '<div class="ci-right"><b>' + inr(unitPrice(i) * i.q) + '</b><button class="remove" data-rm>Remove</button></div></div>';
    }).join('') : '<div class="empty"><span>🛒</span><b>Your cart is empty</b><p>Find your next phone or laptop.</p><button class="btn btn-dark" data-close data-shop>Start shopping</button></div>';
  }
  $('#cart-items').addEventListener('click', function (e) {
    if (e.target.closest('[data-shop]')) { $('#shop').scrollIntoView({ behavior: 'smooth' }); return; }
    var row = e.target.closest('.ci'); if (!row) return;
    var k = +row.dataset.k;
    if (e.target.closest('[data-rm]')) cart.splice(k, 1);
    var d = e.target.closest('[data-d]');
    if (d) { cart[k].q += +d.dataset.d; if (cart[k].q < 1) cart.splice(k, 1); else cart[k].q = Math.min(9, cart[k].q); }
    save(); renderCart();
  });
  function openCart() { renderCart(); openOverlay('cart'); }
  $('#cart-open').addEventListener('click', openCart);

  /* ---------------- checkout (demo only: nothing leaves the page) ---------------- */
  function openCheckout() {
    if (!cart.length) return;
    var t = total();
    $('#co-total').textContent = inr(t) + (t >= FREE ? '' : ' + ₹99 delivery');
    $('#co-form-wrap').hidden = false; $('#co-done').hidden = true; $('#co-form').reset();
    openOverlay('checkout');
  }
  $('#checkout-btn').addEventListener('click', function () { closeOverlay($('#cart')); openCheckout(); });
  $('#co-form').addEventListener('submit', function (e) {
    e.preventDefault();
    $('#order-id').textContent = '#VX' + Math.floor(100000 + Math.random() * 900000);
    $('#co-form-wrap').hidden = true; $('#co-done').hidden = false;
    cart = []; save(); renderCart(); confetti();
  });
  function confetti() {
    var colors = ['#5B3DF5', '#D4FF3A', '#FF3B3B', '#0B0B10', '#3FE0D0'];
    for (var i = 0; i < 70; i++) {
      var d = document.createElement('i'); d.className = 'confetti';
      d.style.left = Math.random() * 100 + 'vw'; d.style.background = colors[i % colors.length];
      d.style.animationDuration = (1.6 + Math.random() * 1.6) + 's'; d.style.animationDelay = Math.random() * 0.4 + 's';
      document.body.appendChild(d); setTimeout(d.remove.bind(d), 3800);
    }
  }

  /* ---------------- search ---------------- */
  function renderSearch(q) {
    q = q.trim().toLowerCase();
    var res = products.filter(function (p) { return !q || (p.name + ' ' + p.sub + ' ' + p.type + (p.gaming ? ' gaming' : '')).toLowerCase().indexOf(q) > -1; });
    $('#search-results').innerHTML = res.length ? res.map(function (p) {
      return '<button class="sr-item" data-id="' + p.id + '"><span class="ci-art">' + art(p, 0) + '</span><span><b>' + esc(p.name) + '</b><br><small style="color:var(--muted)">' + esc(p.sub) + '</small></span><b>' + inr(priceOf(p)) + '</b></button>';
    }).join('') : '<div class="sr-empty">No products match “' + esc(q) + '”.</div>';
  }
  $('#search-open').addEventListener('click', function () { $('#search-input').value = ''; renderSearch(''); openOverlay('search'); });
  $('#search-input').addEventListener('input', function (e) { renderSearch(e.target.value); });
  $('#search-results').addEventListener('click', function (e) { var b = e.target.closest('[data-id]'); if (b) { closeOverlay($('#search')); openQV(b.dataset.id, 0); } });

  /* ---------------- mobile nav ---------------- */
  function closeNav() { $('#main-nav').classList.remove('open'); }
  $('#nav-open').addEventListener('click', function () { $('#main-nav').classList.add('open'); });
  $('#nav-close').addEventListener('click', closeNav);

  /* ---------------- hero stage: 3D parallax ---------------- */
  $('#stage-phone').innerHTML = phoneSVG(C.titan);
  $('#stage-laptop').innerHTML = laptopSVG(C.space);
  $('#deal-art').innerHTML = laptopSVG(C.carbon, 'gaming');
  $$('.cat-art').forEach(function (el) {
    var a = el.dataset.art;
    el.innerHTML = a === 'phone' ? phoneSVG(C.aurora) : a === 'laptop' ? laptopSVG(C.silver) : a === 'gaming' ? laptopSVG(C.stealth, 'gaming') : phoneSVG(C.lime);
  });
  $('#cat-mobile-count').textContent = products.filter(function (p) { return p.type === 'mobile'; }).length + ' models';
  $('#cat-laptop-count').textContent = products.filter(function (p) { return p.type === 'laptop'; }).length + ' models';
  var stage = $('#stage');
  if (!preview && matchMedia('(hover:hover)').matches) {
    document.querySelector('.hero').addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      $('#stage-laptop').style.transform = 'rotateY(' + (18 + x * 16) + 'deg) rotateX(' + (6 - y * 10) + 'deg)';
      $('#stage-phone').style.transform = 'rotateY(' + (-20 + x * 26) + 'deg) rotateX(' + (-y * 14) + 'deg) rotateZ(6deg) translateZ(80px)';
    });
  }

  /* ---------------- deal countdown (to midnight) ---------------- */
  function tick() {
    var now = new Date(), end = new Date(now); end.setHours(24, 0, 0, 0);
    var s = Math.max(0, Math.floor((end - now) / 1000));
    var p = function (n) { return String(n).padStart(2, '0'); };
    $('#cd-h').textContent = p(Math.floor(s / 3600)); $('#cd-m').textContent = p(Math.floor(s / 60) % 60); $('#cd-s').textContent = p(s % 60);
  }
  tick(); setInterval(tick, 1000);
  $('#deal-btn').addEventListener('click', function () { openQV('g15', 0); });

  /* ---------------- misc ---------------- */
  $('#news-form').addEventListener('submit', function (e) { e.preventDefault(); e.target.reset(); toast('Subscribed! (demo — no email is stored)'); });
  addEventListener('scroll', function () { $('#header').classList.toggle('scrolled', scrollY > 10); }, { passive: true });

  renderGrid();
  renderCart();
})();
