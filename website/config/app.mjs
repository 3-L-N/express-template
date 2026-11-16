/**
 * @file Register application specific middleware, routes, etc
 */

import express from "express";
import { redirectToFormattedURL, staticFiles } from "./middleware.mjs";
import { routes } from "./../routes.mjs";

export const app = express();

// Override the default res.render
app.set("view engine", "ejs");
const oldRender = app.response.render;
app.response.render = function renderDynamic(viewName, ...args) {
  return oldRender.call(this, `dynamic/${viewName}`, ...args);
};

// Serving files
app.use("/", routes);
app.use(redirectToFormattedURL);
app.use(staticFiles);

// TODO: define error handling here
