# SauceDemo E2E Automation Framework

Automated end-to-end UI test suite for [SauceDemo](https://saucedemo.com), built with Playwright and TypeScript using the Page Object Model (POM) design pattern.

The suite covers the complete purchase flow — login, inventory browsing, product details, cart, and checkout — with dedicated spec files per screen and a full end-to-end journey test.

## Getting Started

Install dependencies and browsers:

```
npm install
npx playwright install
```

Run the tests:

```
npm test                 # run the full suite
npm run test:e2e         # run only the end-to-end flow
npm run report            # view the last HTML report
```

## Configuration

The base URL and test user credentials are read from environment variables, defined in `utils/env.ts`. If unset, the suite falls back to SauceDemo's default public credentials.

To customise for a different environment:

```
cp .env.example .env
# edit .env with your values
```

## Project Structure

| Folder | Purpose |
|---|---|
| `pageobjects/` | One class per page (Login, Inventory, Products, Cart, Checkout) |
| `tests/` | Matching spec file per page, plus `e2e.spec.ts` for the full flow |
| `utils/env.ts` | Environment configuration (base URL, credentials) |
| `playwright.config.ts` | Base URL, timeouts, and trace/video/screenshot capture settings |

## Continuous Integration

This project runs automated tests on every push and pull request via GitHub Actions (`.github/workflows/playwright.yml`), and is also integrated with Jenkins for local pipeline execution.
