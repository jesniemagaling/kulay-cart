# Kulay Cart

A small Expo / React Native shopping cart using TypeScript and NativeWind 4. The approved white-and-green menu, cart, voucher, and empty state are implemented with local product photos. There is no backend or checkout.

## Run

Use Node 22.13+ LTS or Node 24.3+ LTS and npm.

```sh
npm ci
npm start
```

Scan the QR code using an Expo Go version compatible with SDK 57. Keep the phone and computer on the same network. Press `a` for an Android emulator, if Android Studio and an emulator are installed. `npm run web` opens a browser preview.

## Verify

```sh
npm run typecheck
npm test
npx expo install --check
npx expo-doctor
npm run verify:android
```

Tests cover repeated additions, different products, quantity changes, removals, empty-cart navigation, voucher feedback and recalculation, and Android Back listener cleanup. `verify:android` exports an Android production bundle to `dist/android`; it does **not** create an APK.

Before handing in the APK, install it on Android and check safe areas, small screens, large system text, TalkBack labels, hardware Back, and voucher entry with the keyboard open. Apply should work on the first tap while typing, and the voucher and totals should remain reachable by scrolling.

## How it works

- `App.tsx` switches between menu and cart using local state. Its `useEffect` registers Android Back while the cart is open and cleans up on return.
- `src/products.ts` contains the four products and local image references. Add products here without changing the screens.
- `src/useCart.ts` owns quantities and the voucher. Functional state updates preserve repeated taps. `useMemo` derives cart lines, the unit count, and totals from that state; totals are not stored separately.
- `src/MenuScreen.tsx` and `src/CartScreen.tsx` render the two views. `ProductPhoto.tsx` keeps square image frames and matching crops.
- Prices are converted to integer centavos before multiplication. The discount is 10% of the subtotal, rounded to the nearest centavo. `src/money.ts` formats PHP amounts.

Minus removes one unit; at one it removes the line. Remove deletes the whole product line. `discount10` ignores surrounding spaces and letter case. Editing a code keeps the existing discount until Apply; applying an invalid or empty code removes it with an explanation. A valid voucher follows cart changes and remains active for the session. Restarting the app resets the cart and voucher.

Safe-area insets protect system bars. Android uses window resizing for the keyboard; iOS uses `KeyboardAvoidingView`. Scroll views keep the voucher reachable and let Apply receive taps while the keyboard is open. Expo SystemUI enforces the approved light appearance on Android. NativeWind supplies layout and color styling; Reanimated and Worklets are its required dependencies, with no custom animations added.

## Build an installable Android APK

An Expo account and internet connection are needed for [EAS Build](https://docs.expo.dev/build/setup/). No Play Store account or local Android SDK is required for a cloud APK build. The `preview` profile in `eas.json` requests a standalone, signed APK with the JavaScript bundle included, so it runs without Metro or Expo Go.

Run in this folder using PowerShell:

```powershell
$env:EAS_NO_VCS = '1'
$env:EAS_PROJECT_ROOT = (Get-Location).Path
npx eas-cli@25.3.0 login
npx eas-cli@25.3.0 init
npx eas-cli@25.3.0 build --platform android --profile preview
```

`EAS_NO_VCS` keeps these commands from initializing Git. `init` creates/links the project under your account and writes the actual EAS project ID to `app.json`. Allow EAS to generate a new Android keystore on the first build. Download the `.apk` from the completed build's artifact link, allow installation from that source on Android, and test it offline. Keep the same keystore for later builds that must update the installed app.

The project is linked to `@jesniemagaling/kulay-cart`. The [Android APK build](https://expo.dev/accounts/jesniemagaling/projects/kulay-cart/builds/c7cb687f-2e3b-46e8-86ea-dd4127644e2e) succeeded. [Download the APK](https://expo.dev/artifacts/eas/zKbYKo1GVI-niylKwlSeYDinGtA3XVFndZzU458aVAo.apk), or use the local copy at `artifacts/Kulay-Cart-v1.0.0.apk` (about 80 MB). Archive integrity, release manifest, embedded bundle, local photos, keyboard-resize configuration, and the light-appearance resource were checked. Installation and native device testing remain pending. `artifacts/` is ignored by Git; attach the APK to a GitHub release for reviewers to download.

`npm audit` currently reports 10 advisories in transitive Expo CLI / Tailwind tooling (5 high, 5 moderate). A nonbreaking `npm audit fix` did not resolve them. Do not use `--force` blindly: its proposed changes downgrade Expo or replace Tailwind with an incompatible major version.

## Photo credits

The existing reference photos are bundled locally under the [Pexels license](https://www.pexels.com/license/): [chicken rice, Denys Gromov](https://www.pexels.com/photo/rice-bowl-with-cooked-chicken-on-top-12916874/), [vegetable rice, Viridiana Rivera](https://www.pexels.com/photo/a-bowl-of-rice-meal-with-vegetables-12984978/), [iced tea, deno wang](https://www.pexels.com/photo/a-glass-of-iced-tea-with-lemon-slices-12033562/), and [water, nerea arance](https://www.pexels.com/photo/water-bottle-with-blue-bottle-cap-11860563/). They are sample products, not Kulay's menu or official branding.
