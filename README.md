# Nice Classification

[Open the live explorer](https://kylemcdonald.github.io/nice-classification/)

A fast, single-page guide to all 45 Nice classes for trademark goods and services. The interface keeps every class visible on desktop, adapts to mobile, and searches the official class headings and “includes in particular” examples as you type.

## Features

- 45 compact, color-grouped class cards with three switchable stamp-icon sets
- Clear separation between goods (Classes 1–34) and services (Classes 35–45)
- Instant relevance-ranked full-text search without changing class order
- Quick side sheet on desktop and bottom sheet on mobile
- Official headings, explanatory scope, positive examples, and collapsed exclusions
- Keyboard support: `/` focuses search, Enter opens the best match, and Escape closes details
- No external fonts, analytics, or runtime API calls; all images are local assets

## Class icons

The gear menu switches instantly among **Basic** (the original SVG marks), **Detailed** (the new single-object image set), and **Complex** (the first generated image set). Detailed is the default. Both raster sets are used as masks so every mark retains its class-group color.

The two image sets were generated independently with OpenAI’s [`gpt-image-2`](https://developers.openai.com/api/docs/guides/image-generation) at medium quality and 1024×1024 pixels. Each prompt supplies the official class heading and asks the model to choose its own visual metaphor. The newer prompt strongly prefers one coherent central object and permits one small supporting object only when necessary for clarity.

Full-resolution source PNGs and prompt manifests are in `output/imagegen/nice-class-icons` and `output/imagegen/nice-class-icons-single-object`. Lightweight transparent 256×256 versions used by the site are in `public/class-icons` and `public/class-icons-single`.

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

Interface code is available under the [MIT License](LICENSE). The class illustrations were generated with OpenAI’s `gpt-image-2`. Interface-control icons are from [Material Design Icons](https://pictogrammers.com/library/mdi/) under Apache 2.0.
