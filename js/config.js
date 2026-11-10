/* Konfigurasi pelacakan. Isi nilai di bawah setelah akun GTM dibuat.
   Biarkan kosong untuk menonaktifkan GTM (situs tetap berfungsi normal). */
window.SPK_CONFIG = {
  GTM_ID: 'GTM-W369BG88' // ID container GTM sinergipratamakarya.online
};
window.dataLayer = window.dataLayer || [];
(function () {
  var id = window.SPK_CONFIG.GTM_ID;
  if (!id) return;
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);
})();
