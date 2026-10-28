"""Reads every font file in client/public/fonts and records what it supports
(diacritics, Persian and Urdu letters, Latin, digit sets, weights) plus the
designer and vendor stored in the file. The site uses this to describe each
font. Run after adding fonts:

    pip install fonttools
    python3 scripts/font-specs.py
"""

import json
import pathlib

from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS = ROOT / "client/public/fonts"
OUT = ROOT / "server/data/font-specs.json"

ARABIC_LETTERS = [*range(0x0621, 0x063B), *range(0x0641, 0x064B)]
HARAKAT = range(0x064B, 0x0653)
PERSIAN = [0x067E, 0x0686, 0x0698, 0x06AF]
URDU = [0x0679, 0x0688, 0x0691, 0x06BA, 0x06D2]
LATIN = [*range(0x41, 0x5B), *range(0x61, 0x7B)]
EASTERN_DIGITS = range(0x0660, 0x066A)
PERSIAN_DIGITS = range(0x06F0, 0x06FA)
WESTERN_DIGITS = range(0x30, 0x3A)
# Text in name records that is not a real designer or vendor.
JUNK = ("crack", "http", "www.", "@", "copyright", "unknown", "©")


def covers(cmap, codes, share=1.0):
    codes = list(codes)
    return sum(code in cmap for code in codes) >= share * len(codes)


def name_record(font, name_id):
    record = font["name"].getName(name_id, 3, 1) or font["name"].getName(name_id, 1, 0)
    if not record:
        return None
    try:
        value = record.toUnicode().strip()
    except UnicodeDecodeError:
        return None
    if not value or len(value) > 60 or any(word in value.lower() for word in JUNK):
        return None
    return value


def specs(path):
    font = TTFont(path, lazy=True, fontNumber=0)
    cmap = font.getBestCmap() or {}
    result = {
        "glyphs": font["maxp"].numGlyphs,
        "arabic": covers(cmap, ARABIC_LETTERS, 0.9),
        "harakat": covers(cmap, HARAKAT),
        "persian": covers(cmap, PERSIAN),
        "urdu": covers(cmap, URDU),
        "latin": covers(cmap, LATIN),
        "easternDigits": covers(cmap, EASTERN_DIGITS),
        "persianDigits": covers(cmap, PERSIAN_DIGITS),
        "westernDigits": covers(cmap, WESTERN_DIGITS),
        "variable": "fvar" in font,
    }
    if "fvar" in font:
        weight = next((axis for axis in font["fvar"].axes if axis.axisTag == "wght"), None)
        if weight:
            result["weightRange"] = [int(weight.minValue), int(weight.maxValue)]
    designer = name_record(font, 9)
    vendor = name_record(font, 8)
    if designer:
        result["designer"] = designer
    if vendor and vendor != designer:
        result["vendor"] = vendor
    return result


def main():
    data = {}
    for path in sorted(FONTS.rglob("*")):
        if path.suffix.lower() not in (".ttf", ".otf") or path.parent.name == "licenses":
            continue
        key = f"{path.parent.name}/{path.name}"
        try:
            data[key] = specs(path)
        except Exception as error:  # A broken file should not stop the run.
            print(f"skip {key}: {error}")
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(data)} fonts -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
