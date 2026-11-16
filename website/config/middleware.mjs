import express from "express";
import path from "path";
import { fileURLToPath } from "node:url";

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
    return res.redirect(301, newPath);
  }
  next();
}

/**
 * Serve matching files in `public/`
 * @param {import("express").Request} req - The incoming request.
 * @param {import("express").Response} res - The response used to redirect.
 * @param {import("express").NextFunction} next - The next middleware callback.
 */
export const staticFiles = express.static(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "../public"),
  { index: "index.html", extensions: ["html"] },
);
