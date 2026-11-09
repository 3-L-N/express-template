/**
 * Starts the web server - main entry point
 */

import { app } from "./app.mjs";
import { host, port } from "./setup.mjs"

export let server = createServer();

/**
 * Tries to start the server and announce it
 *  @returns {Promise<import("node:http").Server>} The HTTP server instance.
 */
async function createServer() {
  const server = app.listen(port, host, (error) => {
    if (error) return;
    const address = server.address();
    console.log(`Example app listening at http://${host}:${address.port}`);
  });
  server.on("error", async (error) => {
    console.error("Unable to start server:", error);
    process.exitCode = 1;
  });
  return server;
}

/**
 * Properly close the server if it is still open
 * @param {import("node:http").Server | null | undefined} server The server to close
 * @returns {Promise<void>} Resolves when server is closed; rejects if closing fails.
 */
async function shutdown(server) {
  if (server?.listening) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

// If the program is forcibly exited, shut down the server
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => {
    shutdown(server).catch((error) => {
      console.error("Unable to shut down cleanly:", error);
      process.exitCode = 1;
    });
  });
}