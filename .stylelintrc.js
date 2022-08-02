module.exports = {
    extends: [
        'stylelint-config-standard-scss',
        'stylelint-config-prettier-scss',
    ],
    rules: {
        'string-quotes': 'single',
        'at-rule-no-unknown': null,
        'color-no-invalid-hex': true,
        'font-family-no-missing-generic-family-keyword': null,
        'length-zero-no-unit': true,
        'selector-class-pattern': null,
    },
};
