import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
	globalIgnores(['dist/', 'playwright-report/', 'test-results/']),

	{
		files: ['**/*.js'],
		plugins: { js, '@stylistic': stylistic },
		extends: ['js/recommended'],
		languageOptions: {
			globals: globals.browser,
		},
		// Same style rules as the old .eslintrc.js; they moved from ESLint core
		// to @stylistic/eslint-plugin
		rules: {
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/linebreak-style': ['error', 'unix'],
			'@stylistic/quotes': ['error', 'single'],
			'@stylistic/semi': ['error', 'always'],
		},
	},

	{
		// Config files and end-to-end tests run in Node.js, not in the browser
		files: ['*.config.js', 'tests/**/*.js'],
		languageOptions: {
			globals: globals.node,
		},
	},
]);
