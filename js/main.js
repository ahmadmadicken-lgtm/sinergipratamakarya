/* PT. Sinergi Pratama Karya - interaksi & pelacakan */
(function () {
  'use strict';
  var dl = (window.dataLayer = window.dataLayer || []);

  /* ---- Menu mobile ---- */
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('site-nav');
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
    for (var k in attr) base[k] = attr[k];
    // Event umum untuk semua tombol WhatsApp
    dl.push(Object.assign({ event: 'whatsapp_click' }, base));
    // Event spesifik untuk bagian tertentu
    if (SECTION_EVENT[section]) {
      dl.push(Object.assign({ event: SECTION_EVENT[section] }, base));
    }
  });

  /* ---- Video: putar otomatis saat terlihat, jeda saat keluar ---- */
  var video = document.getElementById('video-pengiriman');
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
