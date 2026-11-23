/**
 * @file Register application specific middleware, routes, etc
 */

import express from "express";
import { fileURLToPath } from "node:url";
import { redirectToFormattedURL, staticFiles } from "./middleware.mjs";
import { engine } from "./build.mjs";
import { routes } from "./../routes.mjs";

export const app = express();

// Send a private file
const privateViewsPath = fileURLToPath(
  new URL("../views/private/", import.meta.url),
);

app.response.sendPrivateFile = function sendPrivateFile(fileName) {
  return this.sendFile(fileName, { root: privateViewsPath });
};

// Render a dynamic file
app.response.sendDynamicFile = function sendDynamicFile(fileName, locals) {
  return this.render(`dynamic/${fileName}`, locals);
};

app.set("view engine", "ejs");
app.engine("ejs", engine);

// Serving files
app.use("/", routes);
app.use(redirectToFormattedURL);
app.use(staticFiles);

// TODO: define error handling here
