import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

// End-to-end smoke tests against the production build (dist/).
// Run `npm run build` first: the web server below only serves dist/.
export default defineConfig({
	testDir: './tests/e2e',
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI
		? [['list'], ['github'], ['html', { open: 'never' }]]
		: [['list']],
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				launchOptions: {
					// CI runners have no GPU: let Chromium render WebGL in software
					args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
				},
			},
		},
	],
	webServer: {
		command: `npm run preview -- --port ${PORT} --strictPort`,
		url: `http://localhost:${PORT}`,
		reuseExistingServer: !process.env.CI,
	},
});
