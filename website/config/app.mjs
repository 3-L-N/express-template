/**
 * @file Register application specific middleware, routes, etc
 */

import express from "express";
import ejs from "ejs";
import { minify } from "html-minifier-terser";
import { redirectToFormattedURL, staticFiles } from "./middleware.mjs";
import { routes } from "./../routes.mjs";

// TODO: modify this list - decide what options to use or not
const HTML_MINIFY_OPTIONS = {
  collapseWhitespace: true,
  // Minify other file types
  minifyCSS: true,
  minifyJS: true,
  // Sort elements so they can be compressed better
  sortAttributes: true,
  sortClassName: true,
  /* These may be changed later
  collapseBooleanAttributes: true,
  removeRedundantAttributes: true,
  removeOptionalTags: true,
  quoteCharacter: ",",
  minifyURLs: www.website.com //TODO: get the correct option from the env file
  decodeEntities: true,
  removeComments: true,
  */
};

export const app = express();

app.set("view engine", "ejs");
app.engine(
  "ejs",
  async function renderMinifiedEjs(filePath, options, callback) {
    let minifiedHtml;

    try {
      const html = await ejs.renderFile(filePath, options);
      minifiedHtml = await minify(html, HTML_MINIFY_OPTIONS);
    } catch (error) {
      callback(error);
      return;
    }

    callback(null, minifiedHtml);
  },
);
/*
const oldRender = app.response.render;
app.response.render = function renderDynamic(viewName, ...args) {
  return oldRender.call(this, `dynamic/${viewName}`, ...args);
};*/

// Serving files
app.use("/", routes);
app.use(redirectToFormattedURL);
app.use(staticFiles);

// TODO: define error handling here
