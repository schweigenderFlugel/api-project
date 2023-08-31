import Joi from "joi";

const name = Joi.string();
const price = Joi.number();
const description = Joi.string();

const createProductSchema = new Joi.object({
    name: name.required(),
    price: price.required(),
    description: description.required()
})

const updateProductSchema = new Joi.object({
    name: name,
    price: price,
    description: description
})

export { createProductSchema, updateProductSchema } 