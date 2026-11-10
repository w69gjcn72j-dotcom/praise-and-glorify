# Praise & Glorify — St Paul's Anglican Kogarah

Lead sheets and Sunday song sets for the St Paul's Kogarah music team (English and Chinese).

Live: https://w69gjcn72j-dotcom.github.io/praise-and-glorify-music/

## How it is updated
- **Songs for each Sunday:** edit `Song Sets.xlsx` in the *Music › Praise and Glorify* OneDrive folder (sheet "Sundays").
- **New lead sheets:** download the Lead Sheet PDF from CCLI SongSelect and save it, unchanged, in *Music › Music files › English Choruses* or *Chinese Choruses*. Add a Chinese title on the "Library" sheet if you like.
- **Publishing:** `python3 tools/build.py` rebuilds `data.js` and the encrypted sheets in `s/`; then commit and push (GitHub Desktop). Tim does this every Friday.

The lead sheets in `s/` are encrypted and open only with the music team password (kept in `.pg-key`, never committed). They come from CCLI SongSelect under the church's CCLI licence (519980) and are for St Paul's Kogarah musicians only.

iPhone: open the link in Safari → Share → Add to Home Screen.

## Shared menu, languages and Chord & Numeral

- `shared/` holds the menu bar and the English / 简体 / 繁體 switch used by every St Paul's Kogarah app. See `shared/README.md`.
- `chords/` is the Chord & Numeral ear-training app, served at `glorify.kogarah.church/chords/`. It was a separate site (`praise-and-glorify-instrument`) before.
- Chinese on these pages is written once, in Simplified. Traditional is produced from it automatically; corrections go in `shared/kog-glossary.json`.
- Musicians' names and the team's notes are never written to `data.js`, which anyone can read. `tools/build.py` puts them in `s/_team.bin`, encrypted with the team password, and the page shows them only after unlocking.
