# Zulfiqar Group - Umrah Package Calculator

A responsive, static Umrah quotation calculator built with HTML, CSS, and vanilla JavaScript. It needs no build step, server, account, or third-party dependency.

## Use

Open `index.html` in a modern browser, or publish this folder through GitHub Pages. Use **Download JSON** to save a package and **Load JSON** to restore it. `data/sample-package.json` is a ready-made example.

The print buttons use the browser's native print dialog with an A4 layout. Choose "Save as PDF" there if a PDF file is needed.

## Company Mode and Client Mode

- **Company Mode** is the internal workspace. It shows all costs, currency conversion, profit, commission, discounts, and the complete package calculation.
- **Client Mode** creates a customer quotation with the airline, visa status, hotels, transport type and route, inclusions, any discount, and only the final payable amount. Internal prices and margins are not shown.

Use **Print / Save Client Quote** while in Client Mode to create the customer PDF. Share that PDF with the customer rather than the live calculator link.

## Included features

- Live passenger, room-night, SAR-to-PKR, and full package calculations with an editable exchange rate
- Unlimited flights, hotels, private transport, ziyarat, and extra-charge rows
- Room capacity warnings and check-in/check-out validation
- Configurable company profile: logo URL/upload, company and contact details, prepared-by name, and footer text
- Separate internal Company Mode and client-safe Client Mode
- Bus and private-transport quotation cards with the Umrah route
- A4 Company Sheet and client quotation layouts, including print-to-PDF support
- Responsive layout, browser-local persistence, and JSON save/load
