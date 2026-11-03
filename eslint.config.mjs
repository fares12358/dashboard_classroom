import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// eslint-config-next >= 16 ships a native flat config (no FlatCompat needed).
const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
