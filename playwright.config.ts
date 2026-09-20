import { defineConfig } from '@playwright/test'

const baseURL = 'http://localhost:4173'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'laptop',
      use: { viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'phone',
      use: { viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: {
    command: 'npm run dev:e2e',
    env: {
      ...process.env,
      BETTER_AUTH_SECRET: 'e2e-secret-that-is-at-least-thirty-two-characters',
      CLOUDFLARE_ENV: 'e2e',
    },
    reuseExistingServer: false,
    timeout: 120_000,
    url: baseURL,
  },
})
