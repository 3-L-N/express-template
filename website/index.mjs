/**
 * @file Entry point for the website.
 */

import { app } from "./config/app.mjs";
import * as server from /*{ createServer, shutdown, getConfig } from */"./config/server.mjs";

const { host, port } = server.getConfig();
const runningServer = await server.createServer(app, host, port);

// Shut down properly on termination, ie Ctrl+C
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => {
    server.shutdown(runningServer)
  });
}