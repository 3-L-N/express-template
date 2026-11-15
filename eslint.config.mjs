import js from "@eslint/js";
import globals from "globals";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import cspellRecommended from "@cspell/eslint-plugin/recommended";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    // cspell:disable-next-line
    language: "markdown/commonmark",
    extends: ["markdown/recommended"],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },
  {
    ...cspellRecommended,
    rules: {
      "@cspell/spellchecker": [
        "error",
        { customWordListFile: "./project-words.txt" },
      ],
    },
  },
  prettierRecommended,
]);
