import Joi from 'joi';
/*
{
  id: 1,
  name: 'Banco Imobiliário',
  image: 'http://',
  stockTotal: 3,
  pricePerDay: 1500,
}  
*/
export const games_schema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
  stockTotal: Joi.number().required(),
  pricePerDay: Joi.number().required()
});