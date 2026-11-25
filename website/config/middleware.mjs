import express from "express";
import path from "node:path";

import {
  dynamicViewsPath,
  privateViewsPath,
  publicViewsPath,
} from "../constants.mjs";

const baseUrl = new URL(process.env.BASE_URL ?? "http://127.0.0.1:8000");

/**
 * Redirects requests to lowercase URLs without an `.html` suffix or `/index`.
 * @param {import("express").Request} req - The incoming request.
 * @param {import("express").Response} res - The response used to redirect.
 * @param {import("express").NextFunction} next - The next middleware callback.
 */
export function redirectToFormattedURL(req, res, next) {
  let newPath = req.path.toLowerCase();
  if (newPath.endsWith(".html")) {
    newPath = newPath.slice(0, -5);
  }
  if (newPath === "/index") {
    newPath = "/";
  }
  if (newPath !== req.path) {
    return res.redirect(301, new URL(newPath, baseUrl).toString());
  }
  next();
}

/**
 * Serve matching files in `public/`
 * @param {import("express").Request} req - The incoming request.
 * @param {import("express").Response} res - The response used to redirect.
 * @param {import("express").NextFunction} next - The next middleware callback.
 */
export const staticFiles = express.static(publicViewsPath, {
  index: "index.html",
  extensions: ["html"],
});

/**
 * Send a file from the private views directory.
 * @this {import("express").Response}
 * @param {string} fileName - The name of the file to send.
 * @returns {import("express").Response} The Express response.
 */
export function sendPrivateFile(fileName) {
  return this.sendFile(fileName, { root: privateViewsPath });
}

/**
 * Render a dynamic view with local template variables.
 * @this {import("express").Response}
 * @param {string} fileName - The name of the dynamic view.
 * @param {object} locals - Variables passed to the view engine.
 * @returns {import("express").Response} The Express response.
 */
export function sendDynamicFile(fileName, locals) {
  return this.render(path.join(dynamicViewsPath, fileName), locals);
}
