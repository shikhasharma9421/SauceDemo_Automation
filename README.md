# E2E SauceDemo Playwright Automation Framework

![Playwright Tests](https://github.com/shikhasharma9421/SauceDemo_Automation/actions/workflows/playwright.yml/badge.svg)

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

## Configuration

`baseURL` and the standard test-user credentials are read from environment variables (`utils/env.ts`), falling back to SauceDemo's public defaults if unset. To override for a different environment:

```bash
cp .env.example .env
# then edit .env
```

## Structure

- `pageobjects/` — one class per page (Login, Inventory, Products, Cart, Checkout)
- `tests/` — matching spec per page, plus `e2e.spec.ts` for the full flow
- `utils/env.ts` — environment config (baseURL, standard-user credentials)
- `playwright.config.ts` — baseURL, timeouts, trace/video/screenshot on failure

## CI

GitHub Actions ([.github/workflows/playwright.yml](.github/workflows/playwright.yml)) runs the full suite on every push/PR.
