import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

const pagesRoot = new URL("../pages-dist/", import.meta.url);

test("GitHub Pages build is portable and compact", async () => {
  const html = await readFile(new URL("index.html", pagesRoot), "utf8");
  assert.match(html, /<title>Nice Classification<\/title>/);
  assert.match(html, /src="\.\/assets\/[^\"]+\.js"/);
  assert.match(html, /href="\.\/assets\/[^\"]+\.css"/);
  assert.doesNotMatch(html, /https?:\/\/(?:fonts|cdn)\./i);

  const assets = await readdir(new URL("assets/", pagesRoot));
  const javascript = assets.find((name) => name.endsWith(".js"));
  assert.ok(javascript);
  assert.ok((await stat(new URL(`assets/${javascript}`, pagesRoot))).size < 350_000);
});

test("responsive and reduced-motion rules ship with the page", async () => {
  const assets = await readdir(new URL("assets/", pagesRoot));
  const stylesheet = assets.find((name) => name.endsWith(".css"));
  assert.ok(stylesheet);
  const css = await readFile(new URL(`assets/${stylesheet}`, pagesRoot), "utf8");
  assert.match(css, /(?:min-width:1280px|width>=1280px)/);
  assert.match(css, /(?:max-width:700px|width<=700px)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
});
