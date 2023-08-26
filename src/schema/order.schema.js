import Joi from "joi";

const productId = Joi.array();

const createOrderSchema = Joi.object({
    productId: productId.required(),
});

export default createOrderSchema;