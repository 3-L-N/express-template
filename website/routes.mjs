import express from "express";

// Import all controllers
import { currentTimeController } from "./controllers/current-time.mjs";

export const routes = express.Router();

// Define all routes
routes.get("/time", currentTimeController);
