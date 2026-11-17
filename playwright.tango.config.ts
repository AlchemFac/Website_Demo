import process from 'node:process';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'tango.spec.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  outputDir: 'test-results/tango',
  use: {
    baseURL: 'http://127.0.0.1:4340',
    browserName: 'chromium',
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview:tango -- --host 127.0.0.1 --ignore-lock',
    url: 'http://127.0.0.1:4340',
    reuseExistingServer: false,
  },
});
