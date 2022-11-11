import Joi from 'joi';
import { createValidator } from 'express-joi-validation'

const validator = createValidator({})

export const createProductSchema = Joi.object({
	name: Joi.string().required().min(3),
	description: Joi.string(),
	price: Joi.number().positive()
})


export default validator;