# Kurumsal Dijital Kartvizit — GitHub Pages Hazır PWA

Bu klasörün içeriği GitHub repository kök dizinine **doğrudan** yüklenebilir.

## Ana özellikler
- Android ve iPhone/iPad'de ana ekrana kurulabilen PWA.
- Kurum logosu ekleme / değiştirme / kaldırma.
- Profil fotoğrafı ekleme / değiştirme / kaldırma.
- Kurumsal ana renk ve vurgu rengini kart içinden seçebilme.
- Ad Soyad, Ünvan, Birim, Telefon 1/2, WhatsApp, e-posta, web, açık adres, Google Maps ve sosyal medya alanları.
- VCF kişi kartı, vCard QR kodu, paylaşım, arama, WhatsApp, e-posta ve harita kısayolları.
- JSON yedek alma / geri yükleme.
- Açık / koyu tema.
- Service Worker ile çevrimdışı kullanım.
- QR üretim kütüphanesi paketin içindedir; CDN gerektirmez.

## Düzenleme kilidi
1. İlk açılışta **Düzenle** aktiftir.
2. Bilgileri, profil resmini, kurum logosunu ve kurumsal renkleri girin.
3. **Kaydet ve Kilitle** düğmesine basın.
4. Üstteki **Düzenle** düğmesi otomatik olarak pasif olur.
5. Daha sonra değişiklik gerekirse **Yönetim ve Yedek > Düzenleme Kilidini Aç** seçeneğini kullanın.

## GitHub Pages kurulumu
1. GitHub'da Public bir repository oluşturun.
2. Bu ZIP'in içindeki dosyaların tamamını repository köküne yükleyin. `index.html` kökte kalmalıdır.
3. Repository > Settings > Pages bölümüne girin.
4. Source olarak **Deploy from a branch** seçin.
5. Branch: `main`, Folder: `/ (root)` seçin ve kaydedin.
6. GitHub Pages adresini Android Chrome veya iPhone Safari ile açın.

## Android
Chrome menüsünden **Uygulamayı yükle / Ana ekrana ekle** kullanın.

## iPhone / iPad
Safari > **Paylaş > Ana Ekrana Ekle > Ekle** yolunu kullanın.

## Veri notu
Kart bilgileri cihazın tarayıcı depolamasında (localStorage) tutulur. Repository dosyaları otomatik olarak değiştirilmez. Bir cihazda girilen bilgiler başka cihazın localStorage alanına otomatik aktarılmaz; VCF/QR ve yedek araçları bilgi aktarımı içindir.

## QR bileşeni
Paket içindeki QR çekirdeği, npm ile birlikte gelen `qrcode-terminal` paketindeki MIT lisanslı Kazuhiko Arase QRCode uygulamasından tarayıcı için paketlenmiştir. Lisans metni `vendor/LICENSE-qrcode-terminal.txt` dosyasındadır.
