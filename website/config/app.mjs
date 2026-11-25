/**
 * @file Register application specific middleware, routes, etc
 */

import express from "express";
import * as mw from "./middleware.mjs";
import { engine } from "./build.mjs";
import { routes } from "./../routes.mjs";

export const app = express();

// Add functions to the app for operations used often in the controllers
// so you don't have to import them into each one
app.response.sendPrivateFile = mw.sendPrivateFile;
app.response.sendDynamicFile = mw.sendDynamicFile;

// View engine(s)
app.set("view engine", "ejs");
app.engine("ejs", engine);

// Serving files
app.use("/", routes);
app.use(mw.redirectToFormattedURL);
app.use(mw.staticFiles);

// TODO: define error handling here
