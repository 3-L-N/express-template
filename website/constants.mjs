/**
 * @file Constants used throughout the websites frontend and backend that are not specific to this environment
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

const viewsPath = fileURLToPath(new URL("./views/", import.meta.url));

export const publicViewsPath = path.join(viewsPath, "public");
export const privateViewsPath = path.join(viewsPath, "private");
export const publicViewsSourcePath = path.join(viewsPath, "public-src");
export const privateViewsSourcePath = path.join(viewsPath, "private-src");
export const dynamicViewsPath = path.join(viewsPath, "dynamic");
