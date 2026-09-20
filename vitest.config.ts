import path from 'node:path'
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    cloudflareTest(async () => ({
      miniflare: {
        bindings: {
          BETTER_AUTH_SECRET: 'test-secret-that-is-at-least-thirty-two-characters',
          EMAIL_DELIVERY_MODE: 'capture',
          TEST_MIGRATIONS: await readD1Migrations(path.join(import.meta.dirname, 'migrations')),
        },
      },
      wrangler: { configPath: './wrangler.jsonc', environment: 'e2e' },
    })),
  ],
  test: {
    include: ['worker/test/**/*.test.ts'],
    setupFiles: ['./worker/test/setup.ts'],
  },
})
