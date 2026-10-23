const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const { Worker } = require("node:worker_threads");
const { resolve } = require("node:path");
const { createRequire } = require("node:module");

const manifest = require("../package.json");

test("npm and pnpm enforce the same security overrides", () => {
  const flattened = {};
  for (const [name, value] of Object.entries(manifest.overrides)) {
    if (typeof value === "string") flattened[name] = value;
    else for (const [child, version] of Object.entries(value)) {
      flattened[`${name}>${child}`] = version;
    }
  }
  assert.deepEqual(manifest.pnpm.overrides, flattened);
});

test("lockfile records the guarded braces replacement", () => {
  const lock = JSON.parse(readFileSync(resolve(__dirname, "../package-lock.json"), "utf8"));
  const entries = Object.entries(lock.packages).filter(([path]) => path.endsWith("node_modules/braces"));
  assert.ok(entries.length > 0);
  for (const [, entry] of entries) {
    assert.equal(entry.name, "@dieub/braces-depth-guard");
    assert.equal(entry.version, "3.0.3-pn.0");
  }
});

test("brace replacement preserves file patterns and blocks deep nesting", async () => {
  // A worker bounds the test even if a future update reintroduces a CPU hang.
  await new Promise((resolveTest, reject) => {
    const worker = new Worker(`
      const assert = require("node:assert/strict");
      const braces = require(${JSON.stringify(createRequire(require.resolve("micromatch")).resolve("braces"))});
      const micromatch = require(${JSON.stringify(require.resolve("micromatch"))});
      assert.deepEqual(braces.expand("src/**/*.{ts,tsx}"), ["src/**/*.ts", "src/**/*.tsx"]);
      assert.deepEqual(braces.expand("{1..3}"), ["1", "2", "3"]);
      assert.deepEqual(micromatch(["a.ts", "a.tsx", "a.js"], "*.{ts,tsx}"), ["a.ts", "a.tsx"]);
      const hostile = "{".repeat(1000) + "x" + "}".repeat(1000);
      for (const method of ["parse", "compile", "expand"]) {
        assert.throws(() => braces[method](hostile), /depth/i);
      }
    `, { eval: true });
    const timeout = setTimeout(() => {
      worker.terminate();
      reject(new Error("brace-pattern regression test timed out"));
    }, 3000);
    worker.on("error", reject);
    worker.on("exit", code => {
      clearTimeout(timeout);
      if (code === 0) resolveTest();
      else reject(new Error(`brace-pattern worker exited with ${code}`));
    });
  });
});

test("updated selector parser and markdown renderer preserve expected output", () => {
  const parser = require("postcss-selector-parser");
  assert.equal(parser().processSync(".prose :where(p, a)"), ".prose :where(p, a)");
  const MarkdownIt = require("markdown-it");
  assert.match(new MarkdownIt().render("# خطوط عربية"), /<h1>خطوط عربية<\/h1>/);
});
