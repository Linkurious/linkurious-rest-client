module.exports = {
  'parser': '@typescript-eslint/parser',
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended' // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  'parserOptions': {
    'ecmaVersion': 2017,
    'sourceType': 'module',
    'project': './tsconfig.json'
  },
  'rules': {
    'eqeqeq': ['error'], // Requires === or !== in place of == or !=
    '@typescript-eslint/no-empty-interface': ['off'], // Allows empty interfaces
    'object-shorthand': ['error', 'never'], // Disallows shorthand object literal
    '@typescript-eslint/ban-ts-ignore':['off'], // Allows @ts-ignore
    '@typescript-eslint/interface-name-prefix': ['off'], // Allows interfaces prefixed with I
    'import/no-unresolved': ['off'], // TODO Rule not working for TypeScript
    'import/order': ['error', {'newlines-between': 'always'}] // Orders imports by ['builtin', 'external', 'parent', 'sibling', 'index']
  }
};
