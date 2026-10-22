import { join, resolve } from "node:path";
import type { BackendCommand, BackendEvent } from "@caravan/api-contract";
import {
	app,
	BrowserWindow,
	dialog,
	type UtilityProcess,
	utilityProcess,
} from "electron";

let backend: UtilityProcess | undefined;
let quitting = false;

function backendEntry(): string {
	return app.isPackaged
		? join(process.resourcesPath, "backend", "daemon.js")
		: resolve(__dirname, "../../../backend/dist/daemon.js");
}

function startBackend(): Promise<UtilityProcess> {
	return new Promise((resolveBackend, reject) => {
		const child = utilityProcess.fork(backendEntry(), [], {
			serviceName: "Caravan Backend",
		});

		child.once("message", (message: BackendEvent) => {
			if (message.type === "backend.ready") {
				resolveBackend(child);
				return;
			}

			reject(new Error("The backend sent an unexpected startup event"));
		});

		child.once("exit", (code) => {
			reject(new Error(`The backend exited during startup with code ${code}`));
		});
	});
}

function createWindow(): BrowserWindow {
	const window = new BrowserWindow({
		height: 720,
		show: false,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true,
		},
		width: 1080,
	});

	window.once("ready-to-show", () => {
		window.show();
	});

	const rendererUrl = process.env.ELECTRON_RENDERER_URL;
	if (rendererUrl === undefined) {
		void window.loadFile(join(__dirname, "../renderer/index.html"));
	} else {
		void window.loadURL(rendererUrl);
	}

	return window;
}

app
	.whenReady()
	.then(async () => {
		backend = await startBackend();

		backend.on("exit", (code) => {
			if (!quitting) {
				dialog.showErrorBox(
					"Caravan backend stopped",
					`The backend exited unexpectedly with code ${code}.`,
				);
				app.quit();
			}
		});

		createWindow();

		app.on("activate", () => {
			if (BrowserWindow.getAllWindows().length === 0) {
				createWindow();
			}
		});
	})
	.catch((error: unknown) => {
		const message = error instanceof Error ? error.message : String(error);
		dialog.showErrorBox("Caravan could not start", message);
		app.quit();
	});

app.on("before-quit", () => {
	quitting = true;
	backend?.postMessage({
		type: "backend.shutdown",
	} satisfies BackendCommand);
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
