import { expect, test } from '@playwright/test';

test('the home page and all its assets load without errors', async ({ page, baseURL }) => {
	const pageErrors = [];
	const failedRequests = [];
	page.on('pageerror', (error) => pageErrors.push(error.message));
	page.on('response', (response) => {
		// Third-party resources (e.g. Typekit fonts) are not under our control
		if (response.url().startsWith(baseURL) && !response.ok()) {
			failedRequests.push(`${response.status()} ${response.url()}`);
		}
	});

	await page.goto('/');
	await page.waitForLoadState('networkidle');

	await expect(page).toHaveTitle('Alessandro\'s Website');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Alessandro Iudicone');
	expect(pageErrors).toEqual([]);
	expect(failedRequests).toEqual([]);
});

test('the 3D scene is rendered on the canvas', async ({ page }) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');

	const canvas = page.locator('canvas#bg');
	await expect(canvas).toBeVisible();

	// Copy the next frame drawn by three.js onto a small 2D canvas and count
	// its colors: a blank or broken canvas has just one or two
	const colors = await canvas.evaluate((webglCanvas) => new Promise((resolve) => {
		// Runs right after the page's own animation callback has rendered
		requestAnimationFrame(() => {
			const probe = document.createElement('canvas');
			probe.width = probe.height = 64;
			const context = probe.getContext('2d');
			context.drawImage(webglCanvas, 0, 0, probe.width, probe.height);
			const { data } = context.getImageData(0, 0, probe.width, probe.height);
			const distinct = new Set();
			for (let i = 0; i < data.length; i += 4) {
				distinct.add((data[i] << 16) | (data[i + 1] << 8) | data[i + 2]);
			}
			resolve(distinct.size);
		});
	}));
	expect(colors).toBeGreaterThan(100);
});
