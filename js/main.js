/* PT. Sinergi Pratama Karya - interaksi & pelacakan */
(function () {
  'use strict';
  var dl = (window.dataLayer = window.dataLayer || []);
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- Menu mobile ---- */
  var toggle = $('#menu-toggle');
  var nav = $('#site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Simpan UTM & click ID selama sesi ---- */
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid'];
  var attr = {};
  try {
    var params = new URLSearchParams(window.location.search);
    KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) sessionStorage.setItem('spk_' + k, v);
    });
    KEYS.forEach(function (k) {
      var v = sessionStorage.getItem('spk_' + k);
      if (v) attr[k] = v;
    });
  } catch (e) { /* sessionStorage tidak tersedia */ }

  /* ---- Pesan WhatsApp (satu pesan untuk semua tombol) ---- */
  var WA_NUMBER = '6281219965256';
  var volume = null; // terisi hanya setelah pengunjung menggeser pengukur
  function waUrl() {
    var msg = 'Halo Ade, saya tertarik dengan solar industri dan biodiesel dari PT. Sinergi Pratama Karya. Mohon informasinya.\n\n' +
      'Perusahaan:\nLokasi pengiriman:\nPerkiraan kebutuhan (kL):' + (volume ? ' ' + volume : '');
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
  }
  function refreshWaLinks() {
    var url = waUrl();
    $$('a[data-wa]').forEach(function (a) { a.setAttribute('href', url); });
  }

  /* ---- Pengukur tangki ---- */
  var tank = $('#tank');
  var vol = $('#vol');
  var readout = $('#readout');
  var readoutL = $('#readout-l');
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function setLevel(v) {
    var pct = v / 40 * 100;
    if (tank) tank.style.setProperty('--lvl', pct + '%');
    if (vol) vol.style.setProperty('--fill', ((v - 5) / 35 * 100) + '%');
    if (readout) readout.textContent = v + ' kL';
    if (readoutL) readoutL.textContent = fmt(v * 1000) + ' liter';
  }
  if (vol && tank) {
    setLevel(5);
    tank.style.setProperty('--lvl', '0%');
    // Tangki terisi sampai garis minimum order saat halaman dibuka
    window.requestAnimationFrame(function () {
      window.setTimeout(function () { tank.style.setProperty('--lvl', '12.5%'); }, 250);
    });
    vol.addEventListener('input', function () {
      var v = parseInt(vol.value, 10);
      setLevel(v);
      volume = v;
      refreshWaLinks();
    });
  }

  /* ---- Tab sektor industri ---- */
  var tabs = $$('.sector-tab');
  var sectorBtn = $('#sector-btn');
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (sectorBtn) sectorBtn.setAttribute('data-sector', tab.getAttribute('data-sector') || '');
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var n = tabs.length, j = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = (i + 1) % n;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = (i - 1 + n) % n;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = n - 1;
      if (j !== null) { e.preventDefault(); selectTab(tabs[j], true); }
    });
  });

  /* ---- Garis langkah memulai ---- */
  var tl = $('#timeline');
  if (tl) {
    if ('IntersectionObserver' in window) {
      var tio = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { tl.classList.add('is-in'); tio.disconnect(); }
      }, { threshold: 0.4 });
      tio.observe(tl);
    } else { tl.classList.add('is-in'); }
  }

  /* ---- Pelacakan klik WhatsApp ---- */
  var SECTION_EVENT = {
    hero: 'hero_cta_click',
    produk: 'product_cta_click',
    final_cta: 'final_cta_click',
    footer: 'contact_cta_click'
  };
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[data-wa]') : null;
    if (!a) return;
    var section = a.getAttribute('data-section') || 'unknown';
    var base = {
      section_name: section,
      button_name: a.getAttribute('data-button') || 'whatsapp',
      page_location: window.location.href
    };
    if (volume) base.volume_kl = volume;
    var sector = a.getAttribute('data-sector');
    if (sector) base.sector = sector;
    for (var k in attr) base[k] = attr[k];
    dl.push(Object.assign({ event: 'whatsapp_click' }, base));
    if (SECTION_EVENT[section]) {
      dl.push(Object.assign({ event: SECTION_EVENT[section] }, base));
    }
  });

  /* ---- Video: putar otomatis saat terlihat, jeda saat keluar ---- */
  var video = $('#video-pengiriman');
  if (video && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          video.preload = 'auto';
          var p = video.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.4 });
    io.observe(video);
  }
})();
