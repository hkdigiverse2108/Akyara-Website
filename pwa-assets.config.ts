import { defineConfig, minimal2023Preset as preset } from "@vite-pwa/assets-generator/config";

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset: {
    ...preset,
    apple: {
      ...preset.apple,
      resizeOptions: { background: "#111827", fit: "contain" },
      padding: 0.2,
    },
    maskable: {
      ...preset.maskable,
      resizeOptions: { background: "#111827", fit: "contain" },
      padding: 0.2,
    },
    transparent: {
      ...preset.transparent,
      resizeOptions: { background: "transparent", fit: "contain" },
      padding: 0.1,
    },
  },
  images: ["public/akayra-pwa-footer-logo.png"],
});
