// This configuration serves as a base for the entire project
/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    es6: true,
  },
  // Remove the ignorePatterns to allow linting in apps and packages
  // Each app or package can extend this configuration
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
  ignorePatterns: ['.env*', '.*.js', 'node_modules/'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['tsconfig.json'],
      },
    },
  ],
};
