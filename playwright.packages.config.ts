import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
  ...base,
  testMatch: 'packages.spec.ts',
  outputDir: 'test-results/packages',
  projects: [
    { name: 'starter', use: { baseURL: 'http://127.0.0.1:4324' } },
    { name: 'business', use: { baseURL: 'http://127.0.0.1:4325' } },
  ],
  webServer: [
    {
      command:
        'npm run preview -- --outDir ./.package-starter-dist --host 127.0.0.1 --port 4324 --ignore-lock',
      url: 'http://127.0.0.1:4324',
      reuseExistingServer: false,
    },
    {
      command:
        'npm run preview -- --outDir ./.package-business-dist --host 127.0.0.1 --port 4325 --ignore-lock',
      url: 'http://127.0.0.1:4325',
      reuseExistingServer: false,
    },
  ],
});
