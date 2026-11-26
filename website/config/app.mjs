/**
 * @file Register application specific middleware, routes, etc
 */

import express from "express";
import * as mw from "./middleware.mjs";
import { engine } from "./build.mjs";
import { routes } from "./../routes.mjs";

import compression from "compression";
import helmet from "helmet";
import logger from "morgan";

export const app = express();

// Add functions and view engines to the app so they can be used anywhere
app.response.sendPrivateFile = mw.sendPrivateFile;
app.response.sendDynamicFile = mw.sendDynamicFile;
app.set("view engine", "ejs");
app.engine("ejs", engine);

// Register general middleware
applySecurityMiddleware(app);
app.use(logger("dev"));
app.use(compression()); // For high-traffic production sites, configure compression w/ reverse proxy.

// Register middleware to serve content
app.use("/", routes);
app.use(mw.redirectToFormattedURL);
app.use(mw.staticFiles);

// Error handling
app.use(mw.notFound);
app.use(mw.errorHandler);

/**
 * Register security middleware
 * @param {import("express").Express} app - The application to configure.
 */
function applySecurityMiddleware(app) {
  app.disable("x-powered-by"); // Don't say this is an express app in responses
  app.use(
    helmet({
      // cspell:disable-next-line
      hsts: { preload: true },
      contentSecurityPolicy: {
        directives: {
          requireTrustedTypesFor: ["'script'"],
        },
      },
    }),
  );
  // These settings are harsh and may need to be changed for your needs
  // app.use(express.json({ limit: "10kb" })); // Uncomment to use JSON
  app.use(
    express.urlencoded({
      limit: "10kb",
      extended: false,
      parameterLimit: 100,
    }),
  );
}
