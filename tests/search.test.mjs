import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { classMeta } from "../app/class-meta.ts";
import { scoreNiceClass } from "../app/search.ts";

const classes = JSON.parse(
  await readFile(new URL("../app/data/classes.json", import.meta.url), "utf8"),
);

function rank(query) {
  return classes
    .map((entry) => ({
      number: entry.number,
      score: scoreNiceClass(entry, classMeta[entry.number - 1], query),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.number - b.number);
}

test("search ranks direct class numbers and common examples", () => {
  assert.equal(rank("class 36")[0].number, 36);
  assert.equal(rank("software")[0].number, 9);
  assert.equal(rank("hotel reservations")[0].number, 43);
  assert.equal(rank("wedding ceremonies")[0].number, 45);
  assert.equal(rank("online gaming")[0].number, 41);
});

test("search handles inflections and accents", () => {
  assert.equal(rank("computer security")[0].number, 42);
  assert.equal(rank("creche")[0].number, 43);
  assert.equal(rank("telemedicine")[0].number, 44);
});

test("exclusions do not create misleading positive matches", () => {
  assert.equal(rank("pest control")[0].number, 44);
  assert.deepEqual(rank("chimney cleaners"), []);
});
