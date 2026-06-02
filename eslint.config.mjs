// Native ESLint 9 flat config. We import eslint-config-next's flat-config
// arrays directly instead of going through @eslint/eslintrc's FlatCompat —
// FlatCompat's legacy validator can't serialise eslint-plugin-react's flat
// config (circular ref → "Converting circular structure to JSON" crash).
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
];

export default eslintConfig;
