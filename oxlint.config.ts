import { defineConfig } from 'oxlint'

export default defineConfig({
  ignorePatterns: [
    'dist/**',
    'coverage/**',
    'vendor/**',
    'test/snapshots/**',
    '.vscode/**',
    'images/**',
    'Johnny-Five/**',
    'node_modules/**',
    'public/**'
  ],
  $schema: './node_modules/oxlint/configuration_schema.json',
  plugins: ['react', 'oxc'],
  rules: {
    'react/rules-of-hooks': 'error',
    'react/only-export-components': ['warn', { allowConstantExport: true }]
  }
})
