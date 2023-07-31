import { Router } from "express";
import { validateSchema } from "../middlewares/schema.validate.js";
import { customers_schema } from "../schemas/customers.schemas.js";
import {
  createCustomers, readCustomers, readCustomersById, updateCustomersById
} from "../controllers/customers.controllers.js";
import { getPage, orderBy } from "../middlewares/query_strings.utils.js";

export const customers_routes = Router();
customers_routes.post('/customers', validateSchema(customers_schema), createCustomers);
customers_routes.get('/customers', orderBy, getPage, readCustomers);
customers_routes.get('/customers/:id', readCustomersById);
customers_routes.put('/customers/:id', validateSchema(customers_schema), updateCustomersById);
