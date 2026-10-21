import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";

export default defineConfig({
	main: {
		build: {
			rollupOptions: {
				input: resolve(__dirname, "src/main/index.ts"),
			},
		},
	},
	renderer: {
		root: resolve(__dirname, "src/ui"),
		build: {
			rollupOptions: {
				input: resolve(__dirname, "src/ui/index.html"),
			},
		},
		plugins: [react()],
	},
});
