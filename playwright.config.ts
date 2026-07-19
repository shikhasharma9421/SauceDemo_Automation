import { defineConfig } from '@playwright/test';
import { config } from './utils/env';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  reporter: 'html',

  use: {
    baseURL: config.baseURL,
    browserName: 'chromium',
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
});
