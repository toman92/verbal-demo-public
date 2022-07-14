module.exports = {
    env: {
        browser: false,
        es6: true,
        node: true,
        commonjs: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    overrides: [
        {
            files: ["**/*.js", "**/*.jsx"],
            rules: {
                "@typescript-eslint/explicit-module-boundary-types": 0,
            },
        },
    ],
    rules: { "linebreak-style": ["error", "unix"] },
};
