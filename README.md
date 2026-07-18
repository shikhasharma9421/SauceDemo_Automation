# SauceDemo Automation

End-to-end UI test automation for [saucedemo.com](https://www.saucedemo.com) using Playwright + TypeScript, following the Page Object Model.

Covers the full purchase journey — login, inventory, product details, cart, and checkout — with one page object and one spec file per screen, plus a full end-to-end flow.

## Setup & Run

```bash
npm install
npx playwright install
npm test                 # run all tests
npm run test:e2e         # run only the end-to-end flow
npm run report           # view the last HTML report
```

## Structure

- `pageobjects/` — one class per page (Login, Inventory, Products, Cart, Checkout)
- `tests/` — matching spec per page, plus `e2e.spec.ts` for the full flow
- `playwright.config.ts` — baseURL, timeouts, trace/video/screenshot on failure

## CI

GitHub Actions ([.github/workflows/playwright.yml](.github/workflows/playwright.yml)) runs the full suite on every push/PR.
