/**
 * Tries to start the server and announce it
 * @param {import("express").Express} app The Express application to serve
 * @param {string} host The host to listen on
 * @param {number} port The port to listen on
 *  @returns {Promise<import("node:http").Server>} The HTTP server instance.
 */
export async function createServer(app, host, port) {
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
export async function shutdown(server) {
  if (server?.listening) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}
