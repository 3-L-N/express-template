/**
 * Register application specific middleware, routes, etc
 */

import express from "express";
import * as bootstrap from "./setup.mjs";

export const app = express();
bootstrap.setup(app);

// TODO: add middleware

// TODO: add routes

// TODO: add error handling

// just for testing for now
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

