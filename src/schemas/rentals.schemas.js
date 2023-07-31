import Joi from "joi";

export const rentals_schema = Joi.object({
  customerId: Joi.number().required(),
  gameId: Joi.number().required(),
  daysRented: Joi.number().greater(0).required(),
});