# Bağımsız Dijital Kartvizit — Android + iPhone

Bu paket, arka uç/veritabanı gerektirmeyen bir Progressive Web App (PWA) dijital kartvizittir.

## Özellikler
- Android ve iPhone/iPad ana ekranına uygulama gibi kurulabilir.
- Kart verileri cihazın `localStorage` alanında tutulur.
- Profil fotoğrafı ve kurum logosu ekleme/kaldırma.
- Kurum, ad-soyad, ünvan, birim, iki telefon, WhatsApp, e-posta, web, adres ve sosyal medya alanları.
- Arama, WhatsApp, e-posta ve harita kısayolları.
- VCF/vCard kişi kartı oluşturma.
- vCard içeren QR kod oluşturma ve SVG olarak indirme.
- Sistem paylaşım menüsü desteği.
- JSON yedek alma ve geri yükleme.
- Açık/koyu tema.
- Service Worker ile çevrimdışı kullanım.

## Çalıştırma
PWA kurulumu için dosyalar HTTPS üzerinden sunulmalıdır. GitHub Pages, Cloudflare Pages, Netlify veya herhangi bir HTTPS web sunucusu kullanılabilir.

Dosyaları sunucunun kök klasörüne birlikte yükleyin:
`index.html`, `style.css`, `app.js`, `manifest.webmanifest`, `sw.js`, `icons/`.

### Android
1. Siteyi Chrome ile açın.
2. “Uygulamayı Kur” düğmesine veya Chrome menüsündeki “Uygulamayı yükle / Ana ekrana ekle” seçeneğine dokunun.
3. Kurulduktan sonra uygulama bağımsız pencerede açılır.

### iPhone / iPad
1. Siteyi Safari ile açın.
2. Paylaş simgesine dokunun.
3. “Ana Ekrana Ekle” seçeneğini seçin.
4. “Ekle” ile tamamlayın.

## Çevrimdışı kullanım notu
Kartın ana özellikleri yereldir. QR kod kütüphanesi ilk çevrimiçi açılışta CDN üzerinden alınır ve Service Worker önbelleğine kaydedilir; sonrasında çevrimdışı kullanılabilir.

## Veri gizliliği
Uygulama kendi başına hiçbir kart bilgisini bir sunucuya göndermez. Harita, WhatsApp, web ve sosyal medya düğmelerine basıldığında ilgili dış servis açılır.
