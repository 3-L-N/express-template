/**
 * Main entry point. Starts and stops the server.
 */

import { app } from "./config/app.mjs";
import { createServer, shutdown } from "./config/server.mjs";
import { getConfig } from "./config/setup.mjs";

const { host, port } = getConfig();
const server = await createServer(app, host, port);

// Shut down properly on termination, ie Ctrl+C
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => {
    shutdown(server).catch((error) => {
      console.error("Unable to shut down cleanly:", error);
      process.exitCode = 1;
    });
  });
}