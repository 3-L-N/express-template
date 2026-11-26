/**
 * @file Manage a HTTP server, including starting and stopping it
 */
import { once } from "node:events";

/**
 * Tries to start the server and announce it
 * @param {import("express").Express} app The Express application to serve
 * @param {string} host The host to listen on
 * @param {number} port The port to listen on
 *  @returns {Promise<import("node:http").Server>} The HTTP server instance.
 */
async function createServerAt(app, host, port) {
  const server = app.listen(port, host);
  await once(server, "listening");

  console.log(
    "Server listening at http://" +
      (process.env.DOMAIN ?? `${host}:${server.address().port}`),
  );

  server.on("error", function handleServerError(error) {
    console.error("Unable to start server:", error);
    process.exitCode = 1;
  });

  return server;
}

/**
 * Create a server using the values from getConfig()
 * @param {import("express").Express} app The Express application to serve
 * @returns {Promise<import("node:http").Server>} The HTTP server instance.
 */
export async function createServer(app) {
  const host = process.env.HOST || "127.0.0.1";
  const port = Number(process.env.PORT ?? 3000);
  return createServerAt(app, host, port);
}

/**
 * Properly close the server if it is still open and propagate any shutdown error.
 * @param {import("node:http").Server | null | undefined} server The server to close
 * @returns {Promise<void>} Resolves when server is closed; rejects if closing fails.
 */
export async function shutdownServer(server) {
  if (server?.listening) {
    return new Promise(function closeServer(resolve, reject) {
      server.close(function handleClose(error) {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}
