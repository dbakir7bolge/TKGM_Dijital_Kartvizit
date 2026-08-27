(() => {
  'use strict';

  const STORAGE_KEY = 'digital_card_v1';
  const THEME_KEY = 'digital_card_theme_v1';
  const defaultData = {
    organization: 'Kurum / İşletme Adı', organizationSub: 'Kurumsal alt başlık',
    fullName: 'Ad Soyad', title: 'Ünvan', unit: 'Birim / Açıklama',
    phone1: '', phone2: '', whatsapp: '', email: '', website: '', address: '', mapsUrl: '',
    instagram: '', facebook: '', youtube: '', whatsappChannel: '', profileImage: '', logoImage: ''
  };

  let data = loadData();
  let deferredInstallPrompt = null;
  let lastQrSvg = '';

  const $ = (id) => document.getElementById(id);
  const form = $('editorForm');
  const editorDialog = $('editorDialog');
  const qrDialog = $('qrDialog');
  const installDialog = $('installDialog');

  function loadData() {
    try { return { ...defaultData, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
    catch { return { ...defaultData }; }
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function showToast(message) {
    const t = $('toast');
    t.textContent = message;
    t.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  function setText(id, value, fallback) { $(id).textContent = (value || '').trim() || fallback; }

  function applyImage(wrapperId, imgId, value) {
    const wrapper = $(wrapperId), img = $(imgId);
    if (value) { img.src = value; wrapper.classList.add('has-img'); }
    else { img.removeAttribute('src'); wrapper.classList.remove('has-img'); }
  }

  function render() {
    setText('topTitle', data.fullName, 'Kartım');
    setText('orgView', data.organization, 'Kurum / İşletme Adı');
    setText('orgSubView', data.organizationSub, 'Kurumsal alt başlık');
    setText('nameView', data.fullName, 'Ad Soyad');
    setText('titleView', data.title, 'Ünvan');
    setText('unitView', data.unit, 'Birim / Açıklama');
    setText('phoneView', data.phone1 || data.phone2, 'Telefon eklenmedi');
    setText('emailView', data.email, 'E-posta eklenmedi');
    setText('addressView', data.address, 'Adres bilgisi eklenmedi.');
    // Profile wrapper has no id; handle it directly.
    const p = $('profileImg').parentElement; if (data.profileImage) { $('profileImg').src = data.profileImage; p.classList.add('has-img'); } else { p.classList.remove('has-img'); $('profileImg').removeAttribute('src'); }
    applyImage('logoBox', 'logoImg', data.logoImage);

    $('callBtn').disabled = !(data.phone1 || data.phone2);
    $('waBtn').disabled = !data.whatsapp;
    $('mailBtn').disabled = !data.email;
    $('mapBtn').disabled = !(data.mapsUrl || data.address);

    document.querySelectorAll('[data-social]').forEach(btn => {
      const key = btn.dataset.social;
      btn.hidden = !data[key];
    });
    $('socialSection').hidden = !['website','instagram','facebook','youtube','whatsappChannel'].some(k => data[k]);
  }

  function fillForm() {
    [...form.elements].forEach(el => {
      if (el.name && Object.prototype.hasOwnProperty.call(data, el.name)) el.value = data[el.name] || '';
    });
  }

  function sanitizeUrl(value) {
    const v = (value || '').trim();
    if (!v) return '';
    if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return v;
    return 'https://' + v;
  }

  function phoneHref(v) { return 'tel:' + String(v || '').replace(/[^+\d]/g, ''); }
  function whatsappDigits(v) {
    let d = String(v || '').replace(/\D/g, '');
    if (d.startsWith('00')) d = d.slice(2);
    if (d.startsWith('0') && d.length === 11) d = '90' + d.slice(1);
    return d;
  }

  function openExternal(url) {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function vEscape(v) { return String(v || '').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,'); }
  function createVCard() {
    const nameParts = (data.fullName || '').trim().split(/\s+/);
    const last = nameParts.length > 1 ? nameParts.pop() : '';
    const first = nameParts.join(' ');
    const lines = [
      'BEGIN:VCARD','VERSION:3.0',
      `N:${vEscape(last)};${vEscape(first)};;;`,
      `FN:${vEscape(data.fullName)}`,
      data.organization ? `ORG:${vEscape(data.organization)}` : '',
      data.title ? `TITLE:${vEscape(data.title)}` : '',
      data.unit ? `NOTE:${vEscape(data.unit)}` : '',
      data.phone1 ? `TEL;TYPE=CELL,VOICE:${vEscape(data.phone1)}` : '',
      data.phone2 ? `TEL;TYPE=WORK,VOICE:${vEscape(data.phone2)}` : '',
      data.whatsapp ? `TEL;TYPE=CELL:${vEscape(data.whatsapp)}` : '',
      data.email ? `EMAIL;TYPE=INTERNET:${vEscape(data.email)}` : '',
      data.website ? `URL:${vEscape(sanitizeUrl(data.website))}` : '',
      data.address ? `ADR;TYPE=WORK:;;${vEscape(data.address)};;;;` : '',
      'END:VCARD'
    ];
    return lines.filter(Boolean).join('\r\n');
  }

  function downloadBlob(blob, filename) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  }

  function safeFilename() {
    return (data.fullName || 'dijital-kartvizit').trim().replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ_-]+/gi,'-').replace(/^-+|-+$/g,'') || 'dijital-kartvizit';
  }

  function downloadVCard() {
    const blob = new Blob(['\ufeff' + createVCard()], {type:'text/vcard;charset=utf-8'});
    downloadBlob(blob, safeFilename() + '.vcf');
    showToast('VCF kişi kartı hazırlandı');
  }

  function buildShareText() {
    return [data.fullName, data.title, data.organization, data.phone1, data.email, data.website].filter(Boolean).join('\n');
  }

  async function shareCard() {
    const vcf = new File([createVCard()], safeFilename()+'.vcf', {type:'text/vcard'});
    try {
      if (navigator.canShare && navigator.canShare({files:[vcf]})) {
        await navigator.share({title:data.fullName || 'Dijital Kartvizit', text:buildShareText(), files:[vcf]});
      } else if (navigator.share) {
        await navigator.share({title:data.fullName || 'Dijital Kartvizit', text:buildShareText()});
      } else {
        await navigator.clipboard.writeText(buildShareText());
        showToast('Kart bilgileri panoya kopyalandı');
      }
    } catch (e) { if (e.name !== 'AbortError') showToast('Paylaşım başlatılamadı'); }
  }

  function utf8Bytes(s) { return Array.from(new TextEncoder().encode(s)); }
  function renderQr() {
    const mount = $('qrMount');
    if (typeof window.qrcode !== 'function') {
      mount.innerHTML = '<div class="qr-placeholder">QR modülü ilk açılışta internetten yüklenemedi. Bağlantıyı kontrol edip uygulamayı bir kez yeniden açın.</div>';
      lastQrSvg = '';
      return;
    }
    try {
      window.qrcode.stringToBytes = utf8Bytes;
      const qr = window.qrcode(0, 'M');
      qr.addData(createVCard());
      qr.make();
      lastQrSvg = qr.createSvgTag({cellSize:5, margin:12, scalable:true});
      mount.innerHTML = lastQrSvg;
      const svg = mount.querySelector('svg');
      if (svg) { svg.setAttribute('role','img'); svg.setAttribute('aria-label','Dijital kartvizit QR kodu'); }
    } catch (e) {
      console.error(e);
      mount.innerHTML = '<div class="qr-placeholder">QR oluşturulamadı. Kart bilgilerini kısaltıp tekrar deneyin.</div>';
      lastQrSvg = '';
    }
  }

  async function imageFileToDataUrl(file) {
    if (!file) return '';
    const dataUrl = await new Promise((resolve, reject) => { const r = new FileReader(); r.onload=()=>resolve(r.result); r.onerror=reject; r.readAsDataURL(file); });
    const img = await new Promise((resolve, reject) => { const i=new Image(); i.onload=()=>resolve(i); i.onerror=reject; i.src=dataUrl; });
    const max = 900, scale = Math.min(1, max/Math.max(img.width,img.height));
    const c=document.createElement('canvas'); c.width=Math.round(img.width*scale); c.height=Math.round(img.height*scale);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    return c.toDataURL('image/jpeg', .86);
  }

  function isStandalone() { return matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true; }

  function showInstallHelp() {
    const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    $('installHelp').innerHTML = isiOS
      ? '<p><strong>iPhone / iPad:</strong></p><ol><li>Sayfayı Safari ile açın.</li><li>Alt menüde <strong>Paylaş</strong> simgesine dokunun.</li><li><strong>Ana Ekrana Ekle</strong> seçeneğini seçin.</li><li><strong>Ekle</strong> ile tamamlayın.</li></ol><p>Kurulduktan sonra uygulama tam ekran ve bağımsız uygulama görünümünde açılır.</p>'
      : '<p><strong>Android:</strong></p><ol><li>Chrome ile açın.</li><li>Menüden <strong>Uygulamayı yükle</strong> veya <strong>Ana ekrana ekle</strong> seçeneğini kullanın.</li><li>Kurulumu onaylayın.</li></ol>';
    installDialog.showModal();
  }

  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstallPrompt=e; });
  window.addEventListener('appinstalled', () => { deferredInstallPrompt=null; showToast('Uygulama kuruldu'); });

  $('editBtn').addEventListener('click', () => { fillForm(); editorDialog.showModal(); });
  $('closeEditorBtn').addEventListener('click', () => editorDialog.close());
  $('cancelEditBtn').addEventListener('click', () => editorDialog.close());
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    for (const key of Object.keys(defaultData)) if (!['profileImage','logoImage'].includes(key)) data[key] = String(fd.get(key) || '').trim();
    try { saveData(); render(); editorDialog.close(); showToast('Kart bilgileri kaydedildi'); }
    catch { showToast('Depolama alanı dolu. Görselleri küçültün.'); }
  });

  $('profileInput').addEventListener('change', async e => { try { data.profileImage = await imageFileToDataUrl(e.target.files[0]); showToast('Profil fotoğrafı hazır'); } catch { showToast('Fotoğraf okunamadı'); } });
  $('logoInput').addEventListener('change', async e => { try { data.logoImage = await imageFileToDataUrl(e.target.files[0]); showToast('Logo hazır'); } catch { showToast('Logo okunamadı'); } });
  $('removeProfileBtn').addEventListener('click', () => { data.profileImage=''; $('profileInput').value=''; showToast('Profil fotoğrafı kaldırıldı'); });
  $('removeLogoBtn').addEventListener('click', () => { data.logoImage=''; $('logoInput').value=''; showToast('Logo kaldırıldı'); });

  $('callBtn').addEventListener('click', () => { const p=data.phone1||data.phone2; if(p) location.href=phoneHref(p); });
  $('waBtn').addEventListener('click', () => { const d=whatsappDigits(data.whatsapp); if(d) openExternal('https://wa.me/'+d); });
  $('mailBtn').addEventListener('click', () => { if(data.email) location.href='mailto:'+data.email; });
  $('mapBtn').addEventListener('click', () => { if(data.mapsUrl) openExternal(sanitizeUrl(data.mapsUrl)); else if(data.address) openExternal('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(data.address)); });
  $('vcardBtn').addEventListener('click', downloadVCard);
  $('shareBtn').addEventListener('click', shareCard);

  $('qrBtn').addEventListener('click', () => { qrDialog.showModal(); renderQr(); });
  $('closeQrBtn').addEventListener('click', () => qrDialog.close());
  $('qrVcardBtn').addEventListener('click', downloadVCard);
  $('downloadQrBtn').addEventListener('click', () => {
    if (!lastQrSvg) return showToast('Önce QR kod oluşturulmalı');
    downloadBlob(new Blob([lastQrSvg], {type:'image/svg+xml;charset=utf-8'}), safeFilename()+'-QR.svg');
    showToast('QR kod indirildi');
  });

  $('installBtn').addEventListener('click', async () => {
    if (isStandalone()) return showToast('Uygulama zaten kurulu');
    if (deferredInstallPrompt) { deferredInstallPrompt.prompt(); try { await deferredInstallPrompt.userChoice; } catch {} deferredInstallPrompt=null; }
    else showInstallHelp();
  });
  $('closeInstallBtn').addEventListener('click', () => installDialog.close());

  document.querySelectorAll('[data-social]').forEach(btn => btn.addEventListener('click', () => openExternal(sanitizeUrl(data[btn.dataset.social]))));

  $('backupBtn').addEventListener('click', () => {
    downloadBlob(new Blob([JSON.stringify({version:1,data},null,2)], {type:'application/json'}), safeFilename()+'-yedek.json');
    showToast('Yedek dosyası oluşturuldu');
  });
  $('restoreInput').addEventListener('change', async e => {
    const f=e.target.files[0]; if(!f) return;
    try { const parsed=JSON.parse(await f.text()); data={...defaultData,...(parsed.data||parsed)}; saveData(); render(); showToast('Yedek geri yüklendi'); }
    catch { showToast('Geçersiz yedek dosyası'); }
    e.target.value='';
  });
  $('resetBtn').addEventListener('click', () => {
    if (!confirm('Karttaki tüm kayıtlı bilgileri ve görselleri sıfırlamak istiyor musunuz?')) return;
    data={...defaultData}; saveData(); render(); showToast('Kart sıfırlandı');
  });

  function applyTheme(theme) { document.documentElement.classList.toggle('light', theme==='light'); localStorage.setItem(THEME_KEY,theme); }
  const preferred = localStorage.getItem(THEME_KEY) || (matchMedia('(prefers-color-scheme: light)').matches ? 'light':'dark');
  applyTheme(preferred);
  $('themeBtn').addEventListener('click', () => applyTheme(document.documentElement.classList.contains('light') ? 'dark':'light'));

  render();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(console.error);
})();
