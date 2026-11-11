# Shared menu and languages

One menu bar and one language switch for every St Paul's Kogarah app, kept here so a change is made once.

| File | What it is |
|---|---|
| `kog-shell.js` | The menu bar, the English / 简体 / 繁體 switch, and the code that turns Simplified into Traditional on the page. |
| `kog-hant.js` | The Simplified to Traditional table. Loaded only when a reader chooses 繁體. Generated, do not edit. |
| `kog-glossary.json` | Names and terms in all three forms, for review, and the list of Traditional overrides. |
| `tools/build_hant.py` | Rebuilds `kog-hant.js` after the glossary changes. |

## Adding the bar to a page

One line, placed before the page's own scripts:

```html
<script src="shared/kog-shell.js" data-app="glorify-music"></script>
```

`data-app` is the page's id in the `MENU` list at the top of `kog-shell.js`. That list holds every app's name and address in the three languages.

The bar follows the G7 Design Scheme: brand teal band, coral rule, Calibri (Carlito on phones), each team's colour beside its own section only.

## How the languages work

- The reader's choice is remembered on the device and carried to the next app in the address (`?lang=zh-Hant`).
- English and Simplified Chinese are written by hand. Traditional Chinese is produced from the Simplified automatically, so nothing is translated twice.
- A page can follow the switch by listening for the `kog:lang` event, or by reading `KOG.lang`.
- For a page that exists as two files (`x.html` and `x-cn.html`), add `data-page-lang`, `data-alt-en` and `data-alt-zh` to the script tag and the switch moves between the files.
- Mark anything that must never be converted with `data-kog-keep`.

## Changing a name or a Traditional rendering

1. Edit `kog-glossary.json`. `hant_overrides` is where the automatic Traditional result is replaced, for example 悉尼 to 雪梨.
2. If a menu name changed, change it in `MENU` in `kog-shell.js` as well.
3. Rebuild the table:

```
pip install opencc-python-reimplemented
python3 shared/tools/build_hant.py shared/kog-glossary.json shared/kog-hant.js
```

The table is derived from the OpenCC dictionaries (Apache License 2.0), Taiwan-standard character forms.
