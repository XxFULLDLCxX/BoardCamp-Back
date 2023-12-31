import Joi from 'joi';

export const games_schema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
  stockTotal: Joi.number().greater(0).required(),
  pricePerDay: Joi.number().greater(0).required()
});
