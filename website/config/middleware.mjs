import express from "express";
import path from "node:path";

import {
  dynamicViewsPath,
  privateViewsPath,
  publicViewsPath,
} from "../constants.mjs";

const baseUrl = new URL("http://" + (process.env.DOMAIN ?? "localhost"));

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

const servePublicFiles = express.static(publicViewsPath, {
  index: "index.html",
  extensions: ["html"],
  dotfiles: "ignore",
});

/**
 * Serve all static public files, apart from the 404 page
 * @param {import("express").Request} req - The incoming request.
 * @param {import("express").Response} res - The response used to serve the file.
 * @param {import("express").NextFunction} next - The next middleware callback.
 */
export function staticFiles(req, res, next) {
  if (req.path === "/404") {
    return next();
  }
  servePublicFiles(req, res, next);
}

/**
 * Respond to unmatched requests with the public 404 page.
 * @param {import("express").Request} req - The incoming request.
 * @param {import("express").Response} res - The response used for the 404.
 * @returns {import("express").Response} The sent 404 response.
 */
export function notFound(req, res) {
  return res.status(404).sendFile("404.html", { root: publicViewsPath });
}

/**
 * Respond to application errors, only sharing detailed information during development
 * @param {Error & { status?: number, statusCode?: number }} error - The handled error.
 * @param {import("express").Request} req - The incoming request.
 * @param {import("express").Response} res - The response used for the error.
 * @param {import("express").NextFunction} next - The next middleware callback.
 * @returns {import("express").Response} The sent error response.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(error, req, res, next) {
  let theError = undefined;
  if (process.env.NODE_ENV === "development") {
    theError = error;
  }
  return res.sendDynamicFile(
    "500",
    { error: theError },
    theError?.status ?? 500,
  );
}

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
 * @param {number} [status=200] - The HTTP response status.
 * @returns {import("express").Response} The Express response.
 */
export function sendDynamicFile(fileName, locals, status = 200) {
  this.status(status);
  return this.render(path.join(dynamicViewsPath, fileName), locals);
}
