# Kulay Cart

A shopping cart assessment built with Expo, React Native, TypeScript, and NativeWind.

**[Download Android APK (v1.0.0, 80 MB)](https://expo.dev/artifacts/eas/zKbYKo1GVI-niylKwlSeYDinGtA3XVFndZzU458aVAo.apk)**

Open the link on an Android phone, download the file, and tap it to install. Allow installation from your browser if prompted. The APK runs without Expo Go or a development server.

## Features

- Four products with local photos, descriptions, and PHP prices.
- Add, remove, and adjust quantities with live item counts and totals.
- Apply `discount10` for 10% off.

Cart state stays in memory and resets when the app restarts. There is no backend or checkout.

## Run

Requires Node.js 22.13+ LTS or 24.3+ LTS and npm.

```sh
npm ci
npm start
```

Scan the QR code with Expo Go compatible with SDK 57, using the same Wi-Fi as your computer. For a browser preview, run `npm run web`.

## Checks

```sh
npm run typecheck
npm test
npx expo-doctor
```

Tests cover cart quantities, removals, totals, vouchers, empty-cart navigation, and Android Back handling.

## Build APK

```sh
npx eas-cli@25.3.0 login
npx eas-cli@25.3.0 build --platform android --profile preview
```

Requires an Expo account with access to the linked EAS project. The `preview` profile produces an installable APK. APK files are excluded from Git and can be attached to GitHub Releases.

## Known limitations

Android device testing and removal of unused APK permissions are pending. `npm audit` reports unresolved transitive dependency findings (5 high, 5 moderate).

## Photo credits

[Pexels license](https://www.pexels.com/license/): [chicken rice, Denys Gromov](https://www.pexels.com/photo/rice-bowl-with-cooked-chicken-on-top-12916874/), [vegetable rice, Viridiana Rivera](https://www.pexels.com/photo/a-bowl-of-rice-meal-with-vegetables-12984978/), [iced tea, deno wang](https://www.pexels.com/photo/a-glass-of-iced-tea-with-lemon-slices-12033562/), and [water, nerea arance](https://www.pexels.com/photo/water-bottle-with-blue-bottle-cap-11860563/). These are sample products, not Kulay's official menu.
