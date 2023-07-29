import { Router } from "express";
import { games_routes } from "./games.routes.js";

export const router = Router();
router.use(games_routes);
