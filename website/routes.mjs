import express from "express";

// Import all controllers
import { testController } from "./controllers/dynamic-page.mjs";

export const routes = express.Router();

// Define all routes
routes.get("/time", testController);
