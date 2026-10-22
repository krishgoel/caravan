import type { BackendCommand, BackendEvent } from "@caravan/api-contract";

type ParentPort = {
	on(
		event: "message",
		listener: (message: { data: BackendCommand }) => void,
	): void;
	postMessage(message: BackendEvent): void;
};

const parentPort = (process as NodeJS.Process & { parentPort?: ParentPort })
	.parentPort;

if (parentPort === undefined) {
	throw new Error("The backend must be started by the Electron application");
}

parentPort.on("message", ({ data }) => {
	if (data.type === "backend.shutdown") {
		process.exit(0);
	}
});

parentPort.postMessage({ type: "backend.ready" });
