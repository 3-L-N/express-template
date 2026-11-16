/**
 * @file Register application specific middleware, routes, etc
 */

import express from "express";
import { redirectToFormattedURL, staticFiles } from "./middleware.mjs";
import { routes } from "./../routes.mjs";

export const app = express();

// Serving files
app.set("view engine", "ejs");
app.use("/", routes);
app.use(redirectToFormattedURL);
app.use(staticFiles);

// TODO: define error handling here
