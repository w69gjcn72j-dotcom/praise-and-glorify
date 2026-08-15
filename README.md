# Chord & Numeral — deployment

An ear-training web app for the **Praise & Glorify** accompanist intensive, St Paul's Anglican Kogarah.
No build step, no dependencies, no accounts. Every file here is static.

---

## Publish it (GitHub Pages, ~5 minutes)

1. Go to **github.com/new** while signed in as `w69gjcn72j-dotcom`.
2. Repository name: **`praise-and-glorify`**. Set it **Public**. Do *not* tick "Add a README". Click **Create repository**.
3. On the empty repo page click **uploading an existing file**.
4. Drag in **every file from this folder** — all of them, at the top level. Do not create a subfolder.
5. Click **Commit changes**.
6. Go to **Settings → Pages**. Under *Source* choose **Deploy from a branch**, branch **`main`**, folder **`/ (root)`**. Click **Save**.
7. Wait 1–2 minutes, then open:

   **https://w69gjcn72j-dotcom.github.io/praise-and-glorify/**

That is the link to send the trainees.

### If you use a different account or repo name

Open `index.html` and change the two `og:image` / `twitter:image` URLs and the `og:url` near the top to match your real address. Everything else uses relative paths and will work anywhere.

---

## Add to homescreen

**iPhone (Safari):** open the link → Share button → *Add to Home Screen*.
**Android (Chrome):** open the link → ⋮ menu → *Install app* or *Add to Home screen*.

It then opens full-screen with no browser bars, and works with no signal.

---

## Files

| File | What it is |
|---|---|
| `index.html` | The whole app — markup, styles, Web Audio synth, quiz |
| `manifest.webmanifest` | Makes it installable; sets name, colours, icons |
| `sw.js` | Service worker; caches the app so it runs offline |
| `icon-512/192/180/167/152/120.png` | App icons |
| `icon-maskable-512.png` | Android adaptive icon (content inside the safe circle) |
| `favicon.ico`, `favicon-32.png`, `favicon-16.png` | Browser tab icon |
| `share-card.png` | 1200×630 preview shown when the link is pasted into WhatsApp, Messenger, Facebook, email |

---

## When you change something

Edit `index.html`, re-upload it, **and bump the version in `sw.js`** — change `chord-numeral-v1` to `-v2`. Without that, phones that already installed it keep serving the cached old copy.

---

## Notes

- Runs offline from `file://` too — double-click `index.html`. The service worker only registers over http/https, which is normal.
- On iPhone the first tap unlocks audio (a Safari rule) and the silent switch must be off.
- Fonts are a local stack — Cormorant → Didot → Bodoni → Georgia — so nothing is fetched from Google and it renders correctly with no internet.
- Design follows the **Tempered Ground** philosophy: ground `#0c1321`, bone `#f2ecdf`, brass `#d1a24c`. Three voices, no more.

*Rev. David Yung · St Paul's Anglican Kogarah · MMXXVI*
