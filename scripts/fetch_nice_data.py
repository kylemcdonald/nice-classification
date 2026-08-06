#!/usr/bin/env python3
"""Fetch the current USPTO Nice class headings and explanatory examples."""

from __future__ import annotations

import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, urlopen


SOURCE_URL = (
    "https://www.uspto.gov/trademarks/trademark-updates-and-announcements/"
    "nice-agreement-current-edition-version-general-remarks"
)
OUTPUT_PATH = Path(__file__).resolve().parents[1] / "app" / "data" / "classes.json"


def clean(text: str) -> str:
    text = text.replace("\u00a0", " ")
    text = re.sub(r"\s+", " ", text).strip()
    return text


class NiceParser(HTMLParser):
    VOID_TAGS = {
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr",
    }

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[str] = []
        self.capture_tag: str | None = None
        self.capture_depth = 0
        self.capture_text: list[str] = []
        self.current: dict[str, object] | None = None
        self.phase = ""
        self.classes: list[dict[str, object]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "br" and self.capture_tag:
            self.capture_text.append(" ")
        if tag in self.VOID_TAGS:
            return
        self.stack.append(tag)
        if self.capture_tag is None and tag in {"h3", "h4", "p", "li"}:
            self.capture_tag = tag
            self.capture_depth = len(self.stack)
            self.capture_text = []

    def handle_startendtag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        if tag == "br" and self.capture_tag:
            self.capture_text.append(" ")

    def handle_data(self, data: str) -> None:
        if self.capture_tag:
            self.capture_text.append(data)

    def handle_endtag(self, tag: str) -> None:
        if (
            self.capture_tag == tag
            and len(self.stack) == self.capture_depth
        ):
            self.finish_capture(tag, clean("".join(self.capture_text)))
            self.capture_tag = None
            self.capture_text = []
        if self.stack:
            if self.stack[-1] == tag:
                self.stack.pop()
            elif tag in self.stack:
                index = len(self.stack) - 1 - self.stack[::-1].index(tag)
                del self.stack[index:]

    def finish_capture(self, tag: str, text: str) -> None:
        if tag == "h3":
            match = re.fullmatch(r"Class\s+(\d+)", text)
            if not match:
                return
            number = int(match.group(1))
            if not 1 <= number <= 45:
                return
            if self.current:
                self.classes.append(self.current)
            self.current = {
                "number": number,
                "heading": "",
                "note": "",
                "includes": [],
                "excludes": [],
            }
            self.phase = "heading"
            return

        if not self.current:
            return

        if tag == "h4" and text.lower() == "explanatory note":
            self.phase = "note"
            return

        if tag == "p":
            if text.startswith("This Class includes, in particular"):
                self.phase = "includes"
            elif text.startswith("This Class does not include, in particular"):
                self.phase = "excludes"
            elif self.phase == "heading" and not self.current["heading"]:
                self.current["heading"] = text
            elif self.phase == "note" and not self.current["note"]:
                self.current["note"] = text
            return

        if tag == "li" and self.phase in {"includes", "excludes"} and text:
            values = self.current[self.phase]
            assert isinstance(values, list)
            values.append(text)

    def close(self) -> None:
        super().close()
        if self.current:
            self.classes.append(self.current)
            self.current = None


def main() -> None:
    request = Request(
        SOURCE_URL,
        headers={"User-Agent": "NiceClassificationExplorer/1.0 (+https://github.com/)"},
    )
    with urlopen(request, timeout=30) as response:
        document = response.read().decode("utf-8")

    parser = NiceParser()
    parser.feed(document)
    parser.close()

    numbers = [entry["number"] for entry in parser.classes]
    if numbers != list(range(1, 46)):
        raise RuntimeError(f"Expected classes 1-45, received {numbers}")
    for entry in parser.classes:
        if not entry["heading"] or not entry["note"] or not entry["includes"]:
            raise RuntimeError(f"Incomplete content for class {entry['number']}")

    OUTPUT_PATH.write_text(
        json.dumps(parser.classes, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        f"Wrote {len(parser.classes)} classes, "
        f"{sum(len(entry['includes']) for entry in parser.classes)} examples, and "
        f"{sum(len(entry['excludes']) for entry in parser.classes)} exclusions."
    )


if __name__ == "__main__":
    main()
