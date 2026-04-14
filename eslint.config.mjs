import js from '@eslint/js';
import ts from 'typescript-eslint';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    ignores: ['dist/**/*', '*.js', '*.cjs', '*.mjs']
  },
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  prettierPluginRecommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    languageOptions: {
      ecmaVersion: 2017,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json'
      }      
    },
    rules: {
      eqeqeq: ['error'], // Requires === or !== in place of == or !=
      'import/no-unresolved': ['off'], // Disable non working rule
      'import/order': ['error', {'newlines-between': 'always'}], // Orders imports by ['builtin', 'external', 'parent', 'sibling', 'index']
      'object-shorthand': ['error', 'never'], // Disallows shorthand object literal
      '@typescript-eslint/ban-ts-comment': ['off'], // Allows @ts-ignore
      '@typescript-eslint/ban-ts-ignore': ['off'], // Allows @ts-ignore
      '@typescript-eslint/interface-name-prefix': ['off'], // Allows interfaces prefixed with I
      '@typescript-eslint/no-empty-interface': ['off'], // Allows empty interfaces
      '@typescript-eslint/no-empty-function': ['off'], // Allows empty functions
      '@typescript-eslint/no-empty-object-type': ['off'], // Allow empty object types
      '@typescript-eslint/no-explicit-any': ['error'], // Don't allow any usage of 'any'
      '@typescript-eslint/no-non-null-assertion': ['off'], // Allows non-null assertion
      '@typescript-eslint/require-await': ['off'] // Allows async without await
    }
  }
];
