import { Router } from "express";
import { games_routes } from "./games.routes.js";
import { customers_routes } from "./customers.routes.js";
import { rentals_routes } from "./rentals.routes.js";

export const router = Router();
router.use(games_routes);
router.use(customers_routes);
router.use(rentals_routes);
