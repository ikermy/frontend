// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default withNuxt(
  prettierConfig,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "vue/multi-word-component-names": "off",
      "prettier/prettier": "error",
    },
  }
);
