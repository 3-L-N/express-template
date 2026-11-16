/**
 * @file Entry point for the website.
 */

import { app } from "./app.mjs";
import { createServer, shutdownServer } from "./server.mjs";

const server = await createServer(app);

// Shut down properly on termination, ie Ctrl+C
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => {
    shutdownServer(server);
  });
}
