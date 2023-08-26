import Joi from "joi";

const name = Joi.string();
const price = Joi.number();

const createProductSchema = new Joi.object({
    name: name.required(),
    price: price.required()
})

const updateProductSchema = new Joi.object({
    name: name,
    price: price
})

export { createProductSchema, updateProductSchema } 