module.exports = {
  "extends": "react-app",
  "globals": {
    "render": true,
    "shallow": true,
    "mount": true
  },
  "env": {
    "browser": true,
    "jest": true,
    "node": true,
  },
  "plugins": [
    "react-hooks"
  ],
  "rules": {
    "arrow-parens": "off",
    "brace-style": ["error", "1tbs"],
    "function-paren-newline": ["error", "consistent"],
    "implicit-arrow-linebreak": "off",
    "import/extensions": "off",
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
    "import/prefer-default-export": "off",
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "max-len": ["warn", 100, { "ignoreComments": true }],
    "no-var": "error",
    "no-case-declarations": 0,
    "no-console": ["error", { "allow": ["table", "warn", "error"] }],
    "no-mixed-operators": ["error", { "allowSamePrecedence": true }],
    "no-prototype-builtins": "off",
    "no-underscore-dangle": "off",
    "object-curly-newline": ["error", { "consistent": true }],
    "padded-blocks": ["error", { "switches": "always" }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-boolean-value": ["error", "always"],
    "react/jsx-indent-props": ["error", 2],
    "react/jsx-indent": ["error", 2],
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-props-no-spreading": "off",
    "react/no-unused-prop-types": "off",
    "react/destructuring-assignment": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/control-has-associated-label": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/label-has-for": "off",
    "jsx-a11y/label-has-associated-control": [2, {
      "controlComponents": ["Input"],
      "depth": 3,
    }]
  },
}
