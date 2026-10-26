// Writes server/data/font-added-dates.json: the date each font file was first
// committed. Used as the font's addedAt so dates survive fresh checkouts, where
// file mtimes are all the clone time. Re-run after adding fonts.
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const FONTS_DIR = "client/public/fonts/";
const log = execFileSync(
  "git",
  ["-c", "core.quotepath=false", "log", "--reverse", "--no-renames", "--diff-filter=A", "--name-only", "--format=@%aI", "--", FONTS_DIR],
  { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
);

const dates = {};
let current = null;
for (const line of log.split("\n")) {
  if (line.startsWith("@")) current = line.slice(1);
  else if (line.startsWith(FONTS_DIR) && current) {
    const file = line.slice(FONTS_DIR.length);
    if (!(file in dates) && /\.(ttf|otf|woff2?)$/i.test(file) && fs.existsSync(line)) dates[file] = current;
  }
}

const sorted = Object.fromEntries(Object.entries(dates).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync("server/data/font-added-dates.json", `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`Wrote ${Object.keys(sorted).length} font dates`);
