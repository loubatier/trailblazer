module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "script",
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "next",
      ],
      rules: {
        // Cherry-picked rules that fit our conventions
        "@typescript-eslint/no-use-before-define": "error",
        "@typescript-eslint/no-redeclare": "error",
        "@typescript-eslint/restrict-template-expressions": "error",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-inferrable-types": [
          "error",
          {
            ignoreParameters: true,
          },
        ],
        // Set to error when possible
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/unbound-method": "off",
        // Too restrictive for us now
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/restrict-plus-operands": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-return": "off",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "eslint-plugin-import-helpers",
    "react",
    "prettier",
  ],
  rules: {
    complexity: ["error", 20],
    "prefer-const": "warn",
    "import/no-anonymous-default-export": "off",
    "import-helpers/order-imports": [
      "warn",
      {
        groups: [
          "absolute",
          "/^react$/",
          "module",
          "/^(@(?!(radarly)).*)/",
          "/^@.+//",
          "parent",
          "sibling",
          "index",
        ],
        alphabetize: {
          order: "asc",
        },
      },
    ],
    // "prettier/prettier": "error",
    "no-console": [
      "error",
      {
        allow: ["warn", "error", "info", "debug", "trace"],
      },
    ],
    // "no-mixed-operators": "error",
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "polished",
            message: "Please use @glossy instead.",
          },
        ],
      },
    ],
    "sort-imports": [
      "warn",
      {
        ignoreDeclarationSort: true,
      },
    ],
  },
};
