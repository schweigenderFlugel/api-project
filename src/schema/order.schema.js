import Joi from "joi";

const products = Joi.array();

const createOrderSchema = Joi.object({
    products: products.required(),
});

export default createOrderSchema;