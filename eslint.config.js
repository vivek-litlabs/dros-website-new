import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // `dist` was Vite's output and no longer exists. `.next` is Next's generated build
  // output: linting it produced ~1450 errors in machine-written code and buried the
  // handful of real findings in source. `.claude` holds agent scratch worktrees.
  { ignores: ['.next', '.claude', 'node_modules', 'next-env.d.ts'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  }
);
