module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['es5'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended' // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    eqeqeq: ['error'], // Requires === or !== in place of == or !=
    '@typescript-eslint/no-explicit-any': ['error'], // Don't allow any usage of 'any'
    '@typescript-eslint/no-empty-interface': ['off'], // Allows empty interfaces
    'object-shorthand': ['error', 'never'], // Disallows shorthand object literal
    '@typescript-eslint/ban-ts-ignore': ['off'], // Allows @ts-ignore
    '@typescript-eslint/ban-ts-comment': ['off'], // Allows @ts-ignore
    '@typescript-eslint/interface-name-prefix': ['off'], // Allows interfaces prefixed with I
    '@typescript-eslint/no-non-null-assertion': ['off'], // Allows non-null assertion
    '@typescript-eslint/no-empty-function': ['off'], // Allows empty functions
    '@typescript-eslint/require-await': ['off'], // Allows async without await
    'import/no-unresolved': ['off'], // Disable non working rule
    'import/order': ['error', {'newlines-between': 'always'}], // Orders imports by ['builtin', 'external', 'parent', 'sibling', 'index']

    // Rest-client specific
    '@typescript-eslint/explicit-function-return-type': ['off'], // All function return types are implicit to avoid duplicate code
    '@typescript-eslint/prefer-includes': ['off'], // es6 methods are not allowed
    '@typescript-eslint/prefer-string-starts-ends-with': ['off'], // es6 methods are not allowed
    'es5/no-es6-methods': ['error'],
    'es5/no-es6-static-methods': ['error']
  }
};
