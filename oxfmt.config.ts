export default {
  $schema: './node_modules/oxfmt/configuration_schema.json',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  arrowParens: 'avoid',
  bracketSameLine: false,
  trailingComma: 'none',
  printWidth: 80,
  sortPackageJson: false,
  ignorePatterns: [
    '/.vscode',
    '/coverage',
    '/images',
    '/Johnny-Five',
    '/node_modules',
    '/public',
    '*.md',
    '*.lock',
    '*.sh'
  ]
}
