import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'public/fonts/**'] },

  js.configs.recommended,

  // ---------------------------------------------------------------------------
  // TypeScript: fully type-checked.
  // ---------------------------------------------------------------------------
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        // Both projects are listed explicitly: tsconfig.json covers the app
        // (DOM lib), tsconfig.node.json covers build config and scripts (node
        // lib). Project auto-discovery only finds the nearest tsconfig.json and
        // would leave vite.config.ts unlinted.
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // CLAUDE.md rule 3: the pinned model ID lives in exactly one place, so that
  // changing it is always a visible, deliberate re-baseline.
  {
    files: ['src/**/*.ts', 'src/**/*.tsx', 'api/**/*.ts', 'shared/**/*.ts'],
    ignores: ['shared/model.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^claude-/]',
          message:
            'Model IDs belong in shared/model.ts as PINNED_MODEL. Changing the pin is a re-baseline (CLAUDE.md rule 3), never an inline literal.',
        },
      ],
    },
  },

  // CLAUDE.md: randomisation is injected, never global, so assignment is
  // deterministic under test and drivable from URL parameters.
  {
    files: ['src/**/*.ts', 'src/**/*.tsx', 'shared/**/*.ts'],
    ignores: ['src/platform/rng.ts'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'Math',
          property: 'random',
          message:
            'Use the injected Rng from src/platform/rng.ts. Math.random is banned so assignment stays deterministic under test.',
        },
      ],
    },
  },

  // CLAUDE.md rule 2: the API key never reaches the browser.
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'ANTHROPIC_API_KEY', message: 'The API key must never appear in client code.' },
      ],
    },
  },

  // CLAUDE.md rule 7: no literal denominators in derived measures. Every count
  // is derived from the same source as the thing being counted.
  {
    files: ['src/domain/metrics.ts'],
    rules: {
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignore: [0, 1, 100],
          ignoreArrayIndexes: true,
          // The Confidence union is `0 | 1 | 2 | 3 | 4 | 5`. Numbers in a type
          // position are documentation, not arithmetic.
          ignoreNumericLiteralTypes: true,
          enforceConst: true,
          detectObjects: false,
        },
      ],
    },
  },

  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },

  // ---------------------------------------------------------------------------
  // Plain JavaScript: config files and build scripts. These run in Node and are
  // not part of a TypeScript project, so type-aware rules do not apply.
  // ---------------------------------------------------------------------------
  {
    files: ['**/*.js', '**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      // check-size.mjs is a command-line tool; printing is its job.
      'no-console': 'off',
    },
  },

  prettier,
);
