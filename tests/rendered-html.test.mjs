import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the complete classification map", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Nice Classification<\/title>/i);
  assert.match(html, />Goods<!-- --> <span>1–34<\/span>/);
  assert.match(html, />Services<!-- --> <span>35–45<\/span>/);
  assert.equal((html.match(/class="class-card"/g) ?? []).length, 45);
  assert.match(html, /aria-label="Class 1: Chemicals"/);
  assert.match(html, /aria-label="Class 45: Legal &amp; security"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Starter Project/);
});

test("official data is complete and sequential", async () => {
  const classes = JSON.parse(
    await readFile(new URL("../app/data/classes.json", import.meta.url), "utf8"),
  );
  assert.equal(classes.length, 45);
  assert.deepEqual(
    classes.map(({ number }) => number),
    Array.from({ length: 45 }, (_, index) => index + 1),
  );
  assert.equal(
    classes.reduce((total, entry) => total + entry.includes.length, 0),
    335,
  );
  assert.equal(
    classes.reduce((total, entry) => total + entry.excludes.length, 0),
    315,
  );
  for (const entry of classes) {
    assert.ok(entry.heading.length > 10);
    assert.ok(entry.note.startsWith(`Class ${entry.number} includes mainly`));
    assert.ok(entry.includes.length > 0);
    assert.ok(entry.excludes.length > 0);
  }
});

test("classification copy uses US spelling", async () => {
  const classes = await readFile(
    new URL("../app/data/classes.json", import.meta.url),
    "utf8",
  );
  const britishSpellings =
    /\b(?:alcoholised|analogue|armoured|catalogues?|cheques?|defence|equalisers?|fertilised|fibreglass|fibres?|flavour(?:ed|ings?)?|fulfil|jewellery|licences?|orthopaedic|ploughs?|programmes?|signalling|travellers?|travelling|tyres?|watercolours?)\b/i;

  assert.doesNotMatch(classes, britishSpellings);
});
