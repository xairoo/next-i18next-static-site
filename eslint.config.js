import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Recreate __dirname for ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("custom"),
  {
    settings: {
      next: {
        rootDir: ["apps/*/"],
      },
    },
  },
];
