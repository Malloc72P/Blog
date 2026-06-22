import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import onlyWarn from 'eslint-plugin-only-warn';
// @ts-check
import turboPlugin from 'eslint-plugin-turbo';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  // 빌드 산출물·커버리지 등은 린트 대상에서 제외한다(없으면 `eslint .`가 .next 등을 린트해 폭발한다).
  { ignores: ['jest.config.js', '.next/**', 'out/**', 'dist/**', 'coverage/**'] },
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-useless-escape': 'off',
    },
  }
);
