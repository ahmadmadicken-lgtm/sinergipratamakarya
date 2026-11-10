# PT. Sinergi Pratama Karya - Landing Page

Struktur: index.html, css/styles.css, js/main.js, js/config.js, assets/ (pengiriman.mp4, poster.jpg), favicon.svg, robots.txt, sitemap.xml.

## Sebelum go-live
1. Ganti `sinergipratamakarya.online` di index.html (canonical, og:url, og:image, JSON-LD), robots.txt, sitemap.xml.
2. assets/og-image.png sudah tersedia.
3. GTM_ID di js/config.js sudah terisi (GTM-W369BG88). Kosongkan untuk mematikan GTM.
4. Di GTM: buat trigger Custom Event untuk whatsapp_click (dan hero_cta_click, product_cta_click, contact_cta_click, final_cta_click), lalu tag GA4 Event dengan parameter section_name, button_name, page_location, utm_*, gclid. Uji di GTM Preview dan GA4 DebugView.
5. Setelah online: daftarkan domain di Google Search Console, kirim sitemap.xml.
6. Verifikasi nomor Kepmen ESDM di bagian Panduan B50 terhadap sumber resmi ESDM.

## Catatan
- Ilustrasi hero adalah SVG sementara. Ganti dengan foto bila ada.
- Tidak ada alamat, telepon lama, atau email lama di halaman.
- Klik WhatsApp bukan berarti percakapan atau lead berkualitas.
