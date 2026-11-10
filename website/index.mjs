/**
 * Starts the web server.
 */

import { app } from "./config/app.mjs";
import { createServer, shutdown } from "./config/server.mjs";
import { getConfig } from "./config/setup.mjs";

const { host, port } = getConfig();
const server = await createServer(app, host, port);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => {
    shutdown(server).catch((error) => {
      console.error("Unable to shut down cleanly:", error);
      process.exitCode = 1;
    });
  });
}