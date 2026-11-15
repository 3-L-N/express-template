/**
 * @file Register application specific middleware, routes, etc
 */

import express from "express";
import { setup } from "./global-middleware.mjs";
import { routes } from "./../routes.mjs";

export const app = express();

setup(app);

app.use("/", routes);

// Define middleware specific to this app here

// TODO: define error handling here
