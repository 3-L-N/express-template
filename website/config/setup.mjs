/**
 * Tasks that MUST happen before the server starts
 */


const configuredPort = Number(process.env.PORT ?? 3000);
if (
  !Number.isInteger(configuredPort) ||
  configuredPort < 1 ||
  configuredPort > 65535
) {
  throw new RangeError("PORT must be an integer between 1 and 65535.");
}

export const host = process.env.HOST || "127.0.0.1";
export const port = configuredPort;

// TODO: Add boilerplate middleware (for security and that sort of stuff)

/** */
export function setup(app) {
  // app.use()
}
