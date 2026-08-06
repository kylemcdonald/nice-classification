"use client";

import {
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiClose,
  mdiMagnify,
} from "@mdi/js";
import classesJson from "./data/classes.json";
import { classMeta, groupAccents } from "./class-meta";
import { normalizeSearchText, scoreNiceClass } from "./search";

const SOURCE_URL =
  "https://www.uspto.gov/trademarks/trademark-updates-and-announcements/nice-agreement-current-edition-version-general-remarks";

type NiceClass = {
  number: number;
  heading: string;
  note: string;
  includes: string[];
  excludes: string[];
};

const niceClasses = classesJson as NiceClass[];
function Icon({
  path,
  overlay,
  fillRule,
  className,
}: {
  path: string;
  overlay?: string;
  fillRule?: "evenodd";
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      focusable="false"
    >
      <path d={path} fillRule={fillRule} clipRule={fillRule} />
      {overlay && <path d={overlay} />}
    </svg>
  );
}

function cleanListItem(value: string) {
  return value.replace(/[.;]$/, "");
}

function headingParts(value: string) {
  return value.split(/;\s*/).map(cleanListItem);
}

export default function NiceExplorer() {
  const [query, setQuery] = useState("");
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const cardRefs = useRef(new Map<number, HTMLButtonElement>());
  const closeTimerRef = useRef<number | null>(null);

  const normalizedQuery = normalizeSearchText(query).trim();
  const ranked = useMemo(() => {
    if (!normalizedQuery) return [];
    return niceClasses
      .map((entry) => ({
        entry,
        score: scoreNiceClass(entry, classMeta[entry.number - 1], normalizedQuery),
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.entry.number - b.entry.number);
  }, [normalizedQuery]);

  const scores = useMemo(
    () => new Map(ranked.map(({ entry, score }) => [entry.number, score])),
    [ranked],
  );
  const ranks = useMemo(
    () => new Map(ranked.map(({ entry }, index) => [entry.number, index])),
    [ranked],
  );

  const selectedClass = selectedNumber
    ? niceClasses[selectedNumber - 1]
    : null;
  const selectedMeta = selectedNumber ? classMeta[selectedNumber - 1] : null;

  const openClass = useCallback((number: number) => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    setSelectedNumber(number);
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    if (!selectedNumber) return;
    const returnTo = selectedNumber;
    setPanelOpen(false);
    cardRefs.current.get(returnTo)?.focus({ preventScroll: true });
    closeTimerRef.current = window.setTimeout(() => {
      setSelectedNumber(null);
    }, 190);
  }, [selectedNumber]);

  const moveSelection = useCallback(
    (direction: -1 | 1) => {
      if (!selectedNumber) return;
      const next = selectedNumber + direction;
      if (next >= 1 && next <= 45) setSelectedNumber(next);
    },
    [selectedNumber],
  );

  useEffect(() => {
    if (!panelOpen) return;
    closeRef.current?.focus({ preventScroll: true });
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = priorOverflow;
    };
  }, [panelOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && panelOpen) {
        event.preventDefault();
        closePanel();
        return;
      }
      if (
        event.key === "/" &&
        !panelOpen &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closePanel, panelOpen]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    },
    [],
  );

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    if (ranked[0]) openClass(ranked[0].entry.number);
  };

  const trapPanelFocus = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const renderSection = (
    label: "Goods" | "Services",
    range: string,
    entries: NiceClass[],
  ) => (
    <section
      className={`class-section ${label.toLowerCase()}`}
      aria-labelledby={`${label.toLowerCase()}-label`}
    >
      <div className="section-divider">
        <h2 id={`${label.toLowerCase()}-label`}>
          {label} <span>{range}</span>
        </h2>
        <span className="section-line" aria-hidden="true" />
      </div>
      <div className="class-grid">
        {entries.map((entry) => {
          const meta = classMeta[entry.number - 1];
          const rank = ranks.get(entry.number);
          const score = scores.get(entry.number) ?? 0;
          const matchState = !normalizedQuery
            ? "idle"
            : rank === 0
              ? "best"
              : rank !== undefined && rank < 6
                ? "strong"
                : score > 0
                  ? "weak"
                  : "none";
          return (
            <button
              className="class-card"
              data-match={matchState}
              data-selected={selectedNumber === entry.number || undefined}
              key={entry.number}
              type="button"
              onClick={() => openClass(entry.number)}
              aria-label={`Class ${entry.number}: ${meta.shortName}`}
              aria-pressed={selectedNumber === entry.number}
              ref={(node) => {
                if (node) cardRefs.current.set(entry.number, node);
                else cardRefs.current.delete(entry.number);
              }}
              style={
                { "--accent": groupAccents[meta.group] } as React.CSSProperties
              }
            >
              <span className="class-number">
                {String(entry.number).padStart(2, "0")}
              </span>
              <Icon
                path={meta.icon}
                overlay={meta.iconOverlay}
                fillRule={meta.fillRule}
                className="class-icon"
              />
              <span
                className="class-name"
                data-compact={meta.shortName.length > 22 || undefined}
              >
                {meta.shortName}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="site-title" href={SOURCE_URL}>
          Nice Classification
        </a>
        <form className="search-form" role="search" onSubmit={submitSearch}>
          <Icon path={mdiMagnify} className="search-icon" />
          <label className="sr-only" htmlFor="class-search">
            Search all class headings and examples
          </label>
          <input
            id="class-search"
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search goods and services"
            autoComplete="off"
            enterKeyHint="go"
          />
          {normalizedQuery && (
            <span className="match-count" aria-live="polite">
              {ranked.length ? `${ranked.length} match${ranked.length === 1 ? "" : "es"}` : "No matches"}
            </span>
          )}
          {query && (
            <button
              className="clear-search"
              type="button"
              onClick={() => {
                setQuery("");
                searchRef.current?.focus();
              }}
              aria-label="Clear search"
            >
              <Icon path={mdiClose} />
            </button>
          )}
        </form>
      </header>

      <div className="classification-map">
        {renderSection("Goods", "1–34", niceClasses.slice(0, 34))}
        {renderSection("Services", "35–45", niceClasses.slice(34))}
      </div>

      <div
        className={`panel-backdrop ${panelOpen ? "is-open" : ""}`}
        aria-hidden="true"
        onClick={closePanel}
      />
      <aside
        className={`detail-panel ${panelOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={selectedClass ? `Class ${selectedClass.number} details` : "Class details"}
        aria-hidden={!panelOpen}
        inert={!panelOpen}
        ref={panelRef}
        onKeyDown={trapPanelFocus}
        style={
          selectedMeta
            ? ({ "--accent": groupAccents[selectedMeta.group] } as React.CSSProperties)
            : undefined
        }
      >
        <div className="sheet-handle" aria-hidden="true" />
        {selectedClass && selectedMeta && (
          <>
            <div className="detail-header">
              <Icon
                path={selectedMeta.icon}
                overlay={selectedMeta.iconOverlay}
                fillRule={selectedMeta.fillRule}
                className="detail-icon"
              />
              <div className="detail-heading">
                <span className="detail-kicker">
                  Class {selectedClass.number} · {selectedClass.number <= 34 ? "Goods" : "Services"}
                </span>
                <h2>{selectedMeta.shortName}</h2>
              </div>
              <div className="detail-actions">
                <button
                  type="button"
                  onClick={() => moveSelection(-1)}
                  disabled={selectedClass.number === 1}
                  aria-label="Previous class"
                >
                  <Icon path={mdiChevronLeft} />
                </button>
                <button
                  type="button"
                  onClick={() => moveSelection(1)}
                  disabled={selectedClass.number === 45}
                  aria-label="Next class"
                >
                  <Icon path={mdiChevronRight} />
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={closePanel}
                  aria-label="Close class details"
                >
                  <Icon path={mdiClose} />
                </button>
              </div>
            </div>

            <div className="detail-scroll" key={selectedClass.number}>
              <section className="detail-section coverage">
                <h3>Official heading</h3>
                <ul>
                  {headingParts(selectedClass.heading).map((part) => (
                    <li key={part}>{part}</li>
                  ))}
                </ul>
              </section>

              <p className="scope-note">{selectedClass.note}</p>

              <section className="detail-section examples">
                <h3>Includes, in particular</h3>
                <ul>
                  {selectedClass.includes.map((example) => (
                    <li key={example}>{cleanListItem(example)}</li>
                  ))}
                </ul>
              </section>

              <details className="exclusions">
                <summary>
                  Usually not included <span>{selectedClass.excludes.length}</span>
                </summary>
                <ul>
                  {selectedClass.excludes.map((exclusion) => (
                    <li key={exclusion}>{cleanListItem(exclusion)}</li>
                  ))}
                </ul>
              </details>

              <a className="source-link" href={SOURCE_URL}>
                USPTO · NCL 13–2026
              </a>
            </div>
          </>
        )}
      </aside>
    </main>
  );
}
