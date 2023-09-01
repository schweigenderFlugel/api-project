import Joi from 'joi';

const username = Joi.string().min(8).max(20);
const email = Joi.string().pattern(/^\S+@\S+\.\S+$/);
const password = Joi.string().min(10).max(30);

const createUserSchema = Joi.object({
    username: username.required(),
    email: email.required(),
    password: password.required()
})

export default createUserSchema;