# Zulfiqar Group - Umrah Voucher & Package Builder

Responsive React/Vite app for creating premium Zulfiqar Group Umrah package flyers, hotel rate sheets, and flight ticket cards with live previews, dropdown helpers, LocalStorage templates, PNG/PDF export, and print support.

## Features

- 5 selectable design styles
- Brand color palette inspired by Zulfiqar Group emerald, gold, cream, marble, and navy
- Adjustable uploaded logo shape and fit
- Umrah package builder
- Hotel rate builder
- Flight ticket builder
- WhatsApp, Instagram, Facebook, Story, and A4 export presets
- Save, load, duplicate, and delete templates in LocalStorage

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages

The repository includes a GitHub Actions workflow that builds the Vite app and publishes `dist` to GitHub Pages.

1. Push the project to GitHub.
2. In repository settings, enable Pages with GitHub Actions as the source.
3. Push to `main`.

If your repository name is different, update `base` in `vite.config.js`.
