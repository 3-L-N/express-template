import express from "express";

// Import all controllers
import { currentTimeController } from "./controllers/current-time.mjs";
import { privatePageController } from "./controllers/private-page.mjs";

export const routes = express.Router();

// Define all routes
routes.get("/time", currentTimeController);
routes.get("/private-page", privatePageController);
