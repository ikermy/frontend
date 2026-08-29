// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // Your custom configs here
  {
    extends: ["prettier"],
    plugins: ["prettier"],
    rules: {
      "vue/multi-word-component-names": "off",
      "prettier/prettier": "error",
    },
  }
);
