# Nice Classification

[Open the live explorer](https://kylemcdonald.github.io/nice-classification/)

A fast, single-page guide to all 45 Nice classes for trademark goods and services. The interface keeps every class visible on desktop, adapts to mobile, and searches the official class headings and “includes in particular” examples as you type.

## Features

- 45 compact, color-grouped class cards with solid silhouette icons
- Clear separation between goods (Classes 1–34) and services (Classes 35–45)
- Instant relevance-ranked full-text search without changing class order
- Quick side sheet on desktop and bottom sheet on mobile
- Official headings, explanatory scope, positive examples, and collapsed exclusions
- Keyboard support: `/` focuses search, Enter opens the best match, and Escape closes details
- No external fonts, image requests, analytics, or runtime API calls

## Data

The class content comes from the USPTO’s [Nice Agreement Thirteenth Edition, version 2026 (NCL 13-2026)](https://www.uspto.gov/trademarks/trademark-updates-and-announcements/nice-agreement-current-edition-version-general-remarks), effective January 1, 2026.

Refresh the checked-in dataset from the source page with:

```bash
python3 scripts/fetch_nice_data.py
```

This project is an independent reference tool, not legal advice and not an official USPTO service.

## Development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Useful checks:

```bash
npm test
npm run build:pages
```

`npm test` verifies the complete dataset, server-rendered map, representative search rankings, responsive rules, reduced-motion support, and the static bundle budget.

## Deployment

Pushes to `main` build the static site and deploy it through GitHub Actions to GitHub Pages. The repository also retains a vinext build for compatible edge hosting.

## Credits and license

Interface code is available under the [MIT License](LICENSE). Icons are from [Material Design Icons](https://pictogrammers.com/library/mdi/) and are distributed under Apache 2.0.
