import { Router } from "express";
import { getGames, postGames } from "../controllers/games.controllers.js";
import { validateSchema } from "../middlewares/schema.validate.js";
import { games_schema } from "../schemas/games.schemas.js";

export const games_routes = Router();
games_routes.get('/games', getGames);
games_routes.post('/games', validateSchema(games_schema), postGames);
