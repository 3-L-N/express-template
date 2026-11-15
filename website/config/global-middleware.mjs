/**
 * Sets up the application with boilerplate middleware applied to all routes
 * @param {import("express").Express} app The application to set up
 */
export function setup(app) {
  app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
  });
  return 1;
}
