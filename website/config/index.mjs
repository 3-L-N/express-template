/**
 * @file Entry point for the website.
 */

import { app } from "./app.mjs";
import { build } from "./build.mjs";
import { createServer, shutdownServer } from "./server.mjs";

await build();

const server = await createServer(app);

function handleTermination() {
  shutdownServer(server);
}

// Shut down properly on termination, ie Ctrl+C
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, handleTermination);
}
