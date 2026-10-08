import { defineConfig } from 'vite';

export default defineConfig({
	root: 'src',
	build: {
		outDir: '../dist',
		// dist/ is outside `root`, so Vite would not clean it on its own and
		// files from previous builds would pile up
		emptyOutDir: true,
		// three.js alone is ~530 kB minified: warn only if the bundle grows
		// noticeably beyond that (default limit: 500 kB)
		chunkSizeWarningLimit: 600,
	},
});
