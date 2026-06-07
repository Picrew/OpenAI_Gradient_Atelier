# OpenAI Gradient Atelier

A small static web app for generating soft diffusion, grain, watercolor, horizon, and material-style abstract backgrounds inspired by OpenAI editorial visuals.

The app runs entirely in the browser with Canvas. No build step, backend, or package install is required.

中文用户可以点击右上角 `中文` 切换界面语言。默认界面为英文。

## Examples

Both examples below were generated with `Horizon bands = 0`.

| Soft diffusion | Watercolor wash |
| --- | --- |
| ![Soft blue violet diffusion background](docs/examples/diffusion-blue-violet.png) | ![Warm watercolor wash background](docs/examples/watercolor-warm-wash.png) |

## Features

- Pure browser-based Canvas rendering
- Diffusion, horizon, watercolor, material, and mono modes
- Gradient sliders with live numeric values
- Smooth preview while dragging controls
- English and Chinese UI toggle
- 1:1, 16:9, and card export frames
- 10-candidate evolution panel for quick variation search
- PNG export from the current canvas

## Usage

Open `index.html` directly in a browser, or run a local static server:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

## Recommended GitHub About

Description:

```text
A browser-based Canvas tool for generating OpenAI-style diffusion, grain, watercolor, and material gradient backgrounds.
```

Website:

```text
https://picrew.github.io/OpenAI_Gradient_Atelier/
```

Topics:

```text
canvas, gradient, generative-art, background-generator, openai-style, design-tool, vanilla-javascript, static-site, bilingual
```

## Project Structure

```text
.
├── index.html
├── styles.css
├── app.js
└── docs/
    └── examples/
        ├── diffusion-blue-violet.png
        └── watercolor-warm-wash.png
```

## Notes

The repository intentionally excludes downloaded reference assets, scraper logs, and local browser test artifacts. The app itself is self-contained in the three source files plus the README example images.
