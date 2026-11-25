/**
 * @file Register application specific middleware, routes, etc
 */

import express from "express";
import * as mw from "./middleware.mjs";
import { engine } from "./build.mjs";
import { routes } from "./../routes.mjs";

export const app = express();

// Add functions and view engines to the app so they can be used anywhere
app.response.sendPrivateFile = mw.sendPrivateFile;
app.response.sendDynamicFile = mw.sendDynamicFile;
app.set("view engine", "ejs");
app.engine("ejs", engine);

// Serving files
app.use("/", routes);
app.use(mw.redirectToFormattedURL);
app.use(mw.staticFiles);

// Error handling
app.use(mw.notFound, mw.errorHandler);
