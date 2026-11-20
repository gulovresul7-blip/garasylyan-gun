# Garaşylýan Gün 💛
Toý, doglan gün we başga ähli ajaýyp günlere galan wagty sanaýan programma (Android + iOS).
Döredijisi: **Gulow Resul**, +99362056128

Bu taslama Expo / React Native bilen ýazylan: bir kod — Android we iOS.

## APK almagyň iň ýönekeý 3 ýoly

### 1) GitHub bilen (kompýuter gurmaga hajat ýok, mugt)
1. github.com-da mugt hasap açyň, täze repository dörediň.
2. Şu papkadaky ähli faýllary (`.github` bilen bilelikde) repository-ä ýükläň.
3. Repository → **Actions** → «APK gur» → **Run workflow**.
4. ~15 minutdan soň işiň içinden **garasylyan-gun-apk** faýlyny ýükläp alyň — içinde `.apk` bar. Telefona salyp guruň.

### 2) EAS (Expo-nyň bulut gurluşygy)
```
npm install
npx expo install --fix
npm install -g eas-cli
eas login
eas build -p android --profile preview     # APK
```

### 3) Kompýuterde (Android Studio / SDK bolsa)
```
npm install
npx expo install --fix
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```
APK: `android/app/build/outputs/apk/release/app-release.apk`

## iOS
iOS-da «APK» ýok — format **IPA**. Gurmak üçin Apple Developer hasaby (ýylda 99 USD) gerek:
```
eas build -p ios --profile production
```
Ýa-da Mac-da `npx expo run:ios`.

## Aýratynlyklar
- Başlangyç: ad, ýaş, ýer, ilkinji sene (Toý / Doglan gün / Ýubileý / özüň ýazan ady), gizlinlik habary, ähli rugsatlar
- Ortada ýaşaýan sanagyç: gün, sagat, minut, sekunt
- Meýilnama: san çäksiz, senesi, salgy (awtomatik ýer), telefon (kontaktdan, jaň/SMS), suratlar (asyl hil)
- Awtomatik ýatlatmalar (7 gün, 1 gün, şol gün; işler üçin ertir / şu gün; gündelik)
- Çakylyk sanawy: kontaktlardan awtomatik, gerekmezleri aýyrmak, SMS çakylyk
- Pursatlar: surat, wideo, ses, ýazgy — «polaroid» görnüşli sebitli tor
- Dil: Türkmen, Türk, Rus, Iňlis; Gije/Gündiz; 6 ýazgy görnüşi; ýumşak ses effektleri
