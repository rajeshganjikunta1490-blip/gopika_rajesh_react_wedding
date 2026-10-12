# Gopika Weds Rajesh — React Wedding Invitation

A modern responsive React + Vite wedding invitation site.

## Run locally
1. Install Node.js 20 or newer.
2. Run `npm install`
3. Run `npm run dev`

## Build for deployment
- Run `npm run build`
- Deploy the generated `dist/` folder to GitHub Pages or another static host.
- If deploying to a GitHub Pages project subpath, configure the Vite `base` option in `vite.config.js` to match the repository path.

## Included
- Responsive editorial design, traditional Telugu Hindu wedding palette: sindoor red, turmeric, warm ivory and temple gold
- Animated countdown to 15 November 2026, 9:28 PM IST
- Five-image invitation carousel, one image every 10 seconds
- Click-to-enlarge invitation images
- Venue directions and venue QR image
- Telugu background song, autoplay attempted immediately on page load and retried when the MP3 becomes ready, the page regains focus, or the visitor interacts

Browsers may prevent autoplay with sound until the visitor interacts with the page. A site cannot reliably override this browser policy.
