/**
 * @file Prepare files before they are served
 */

import ejs from "ejs";
import { minify } from "html-minifier-terser";
import {
  mkdir,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { minify as minifyJavaScript } from "terser";
import {
  privateViewsSourcePath,
  privateViewsPath,
  publicViewsSourcePath,
  publicViewsPath,
} from "../constants.mjs";

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

/**
 * Render an EJS template and minify the resulting HTML.
 * @param {string} filePath - Path to the template file.
 * @param {object} options - Template rendering options.
 * @param {Function} callback - Express rendering callback.
 * @returns {Promise<void>}
 */
export async function engine(filePath, options, callback) {
  let html;
  try {
    html = await ejs.renderFile(filePath, options);
    html = await minify(html, HTML_MINIFY_OPTIONS);
  } catch (error) {
    callback(error);
    return;
  }

  callback(null, html);
}

/**
 * Build all static files.
 * @param {string} [publicViewPath] - Public output base path.
 * @param {string} [privateViewPath] - Private output base path.
 * @param {string} [publicBuildPath] - Public source base path.
 * @param {string} [privateBuildPath] - Private source base path.
 */
export async function build(
  publicViewPath = publicViewsPath,
  privateViewPath = privateViewsPath,
  publicBuildPath = publicViewsSourcePath,
  privateBuildPath = privateViewsSourcePath,
) {
  const startTime = process.hrtime.bigint();

  // Delete previous folders first as their contents may be too old
  await Promise.all([
    rm(publicViewPath, { force: true, recursive: true }),
    rm(privateViewPath, { force: true, recursive: true }),
  ]);

  await Promise.all([
    buildFolder(publicBuildPath, publicViewPath),
    buildFolder(privateBuildPath, privateViewPath),
  ]);

  const elapsedMilliseconds = Math.round(
    Number(process.hrtime.bigint() - startTime) / 1e6,
  );
  console.log(`Static files built in ${elapsedMilliseconds}ms`);
}

/**
 * @param {string} file - File path to inspect.
 * @returns {boolean} Whether the file can be rendered.
 */
function canRender(file) {
  switch (file.slice(file.lastIndexOf("."))) {
    case ".js":
    case ".ejs":
      return true;
    default:
      return false;
  }
}

/**
 * Renders data based on the file extension
 * @param {string} data - File contents to process.
 * @param {string} fileName - Name of the file being processed.
 * @returns {Promise<string>} The rendered and/or minified contents.
 */
async function render(data, fileName) {
  try {
    if (fileName.endsWith(".js")) {
      return (await minifyJavaScript(data)).code;
    }
    return await minify(
      ejs.render(data, {}, { filename: fileName }),
      HTML_MINIFY_OPTIONS,
    );
  } catch (error) {
    throw new Error(`Failed to render ${fileName}`, { cause: error });
  }
}

/**
 * Copies a file to its destination, rendering supported file types and linking otherwise
 * @param {string} src - Source file
 * @param {string} dest - Destination file
 * @returns {Promise<void>} Resolves when the file is written or linked.
 */
async function buildFile(src, dest) {
  // If a file doesn't need to be rendered,
  // make a link to it instead of copying the file (less expensive)
  if (!canRender(src)) {
    const target = relative(dirname(resolve(dest)), resolve(src));
    await symlink(target, dest);
    return;
  }

  // Otherwise render the file and make a new file at the destination
  else {
    try {
      const content = await readFile(src, "utf8");
      const renderedContent = await render(content, src);
      await writeFile(dest, renderedContent);
    } catch (error) {
      throw new Error(`Could not build ${src} into ${dest}`, { cause: error });
    }
  }
}

/**
 * Builds every file in a folder and recurses through subfolders.
 * @param {string} src - Source folder.
 * @param {string} dest - Destination folder.
 * @returns {Promise<void>} Resolves when the folder is built.
 */
async function buildFolder(src, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const srcPath = resolve(src, entry.name);
      const destName = entry.name.endsWith(".ejs")
        ? `${entry.name.slice(0, -4)}.html`
        : entry.name;
      const destPath = resolve(dest, destName);

      if (entry.isDirectory()) {
        await buildFolder(srcPath, destPath);
      } else {
        await buildFile(srcPath, destPath);
      }
    }),
  );
}
