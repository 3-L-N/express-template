/**
 * Tasks that MUST happen before the server starts
 */

/**
 * @returns {{host: string, port: number}} The host and port to listen on
 */
export function getConfig() {
  return {
    host: process.env.HOST || "127.0.0.1",
    port: Number(process.env.PORT ?? 3000),
  };
}

/**
 * Sets up the application with boilerplate middleware
 * @param {import("express").Express} app The application to set up
 */
export function setup(app) {
  return 1;
  // TODO: add middleware
}
