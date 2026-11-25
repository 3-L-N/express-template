/**
 * @file Constants used throughout the websites frontend and backend that are not specific to this environment
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

const viewsPath = fileURLToPath(new URL("./views/", import.meta.url));
const buildOutputPath = fileURLToPath(new URL("../dist/", import.meta.url));

export const dynamicViewsPath = path.join(viewsPath, "dynamic");

// This is there where website files are rendered from
export const publicViewsSourcePath = path.join(viewsPath, "public");
export const privateViewsSourcePath = path.join(viewsPath, "private");

// This is where they are rendered to
export const publicViewsPath = path.join(buildOutputPath, "public");
export const privateViewsPath = path.join(buildOutputPath, "private");
