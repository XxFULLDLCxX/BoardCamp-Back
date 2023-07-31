import { Router } from "express";
import { validateSchema } from "../middlewares/schema.validate.js";
import { rentals_schema } from "../schemas/rentals.schemas.js";
import { createRentals, readRentals, returnRentalsById, deleteRentalsById } from "../controllers/rentals.controllers.js";

export const rentals_routes = Router();
rentals_routes.post('/rentals', validateSchema(rentals_schema), createRentals);
rentals_routes.get('/rentals', readRentals);
rentals_routes.post('/rentals/:id/return', returnRentalsById);
rentals_routes.delete('/rentals/:id', deleteRentalsById);
