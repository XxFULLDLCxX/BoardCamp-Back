import Joi from "joi";

export const customers_schema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.alternatives().try(
    Joi.string().length(10).pattern(/^\d+$/),
    Joi.string().length(11).pattern(/^\d+$/)).required(),
  cpf: Joi.string().length(11).pattern(/^\d+$/).required(),
  birthday: Joi.date().required()
});