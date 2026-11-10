/**
 * Register application specific middleware, routes, etc
 */

import express from "express";
import { setup } from "./setup.mjs";

export const app = express();
setup(app);

// TODO: add middleware

// TODO: add routes

// TODO: add error handling

// just for testing for now
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

