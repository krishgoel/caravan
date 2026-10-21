import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const root = document.getElementById("root");

if (root === null) {
	throw new Error("Missing application root");
}

createRoot(root).render(
	<StrictMode>
		<main>Caravan</main>
	</StrictMode>,
);
