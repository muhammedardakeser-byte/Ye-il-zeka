# Yeşil Zeka

Android ve iOS için Expo / React Native başlangıç projesi. Sohbet arayüzü hazırdır. Gerçek AI yanıtı için arka uç sunucusu ve API anahtarı gerekir.

## 1) Android APK oluşturma

Gerekenler:
- Node.js LTS
- Expo hesabı (ücretsiz hesapla başlayabilirsin)
- Android telefonunda Expo Go (geliştirme/test için)

Bilgisayarda proje klasörünü açıp:

```bash
npm install
npx expo install --fix
npm install --global eas-cli
eas login
eas build:configure
```

Bu projede `eas.json` içinde APK için `preview` profili tanımlıdır. APK derlemesini başlat:

```bash
eas build --platform android --profile preview
```

İlk derlemede Expo, Android uygulamasını bulutta derler. İşlem bitince EAS bir APK indirme bağlantısı verir. APK'yı Android telefona indirip yükle. Android, ilk kurulumda tarayıcıdan/Files uygulamasından yüklemeye izin vermeni isteyebilir.

Google Play'e yayınlamak için APK değil, production AAB gerekir:
```bash
eas build --platform android --profile production
```

## 2) Uygulamayı geliştirme modunda çalıştırma

```bash
npm install
npx expo start
```

Terminalde çıkan QR kodu Expo Go ile okut.

## 3) Gerçek yapay zekâ bağlantısı

Ayrı bir terminalde:

```bash
cd server
npm install
```

`server/.env.example` dosyasını `.env` olarak kopyala ve API anahtarını içine yaz. API anahtarını asla mobil uygulama koduna koyma ve kimseyle paylaşma.

Ardından:
```bash
npm start
```

### Telefonun sunucuya bağlanması
`App.js` içindeki `http://10.0.2.2:3001/chat` adresini kendi bilgisayarının yerel ağ IP adresiyle değiştir (ör. `http://192.168.1.20:3001/chat`). Android emülatöründe `10.0.2.2` bilgisayarın localhost adresidir. iOS simülatöründe `http://localhost:3001/chat` kullanılabilir. Telefon ve bilgisayar aynı Wi-Fi ağında olmalıdır.

Üretim sürümünde sunucuyu HTTPS destekleyen bir hosting ortamına dağıt ve `App.js` içindeki URL'yi bu HTTPS adresiyle değiştir. API anahtarı sadece sunucuda tutulmalıdır. Üretim sürümünde kimlik doğrulama, hız sınırı, veri gizliliği ve güvenli API anahtarı yönetimi eklenmelidir.

## 4) Önemli sınırlar
- Bu klasör uygulama kaynak kodudur; kendisi APK dosyası değildir.
- APK oluşturmak için yukarıdaki EAS bulut derlemesini çalıştırman gerekir.
- iOS cihazlara dağıtım için Apple'ın imzalama ve geliştirici hesabı koşulları geçerlidir.
