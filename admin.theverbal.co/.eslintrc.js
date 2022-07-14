module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    extends: ["plugin:react/recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    overrides: [
        {
            files: ["**/*.js", "**/*.jsx"],
            rules: {
                "@typescript-eslint/explicit-module-boundary-types": 0,
            },
        },
    ],
    rules: { "linebreak-style": ["error", "unix"], "react/prop-types": "off" },
};
