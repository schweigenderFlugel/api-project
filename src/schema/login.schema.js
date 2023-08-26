import Joi from "joi";

const email = Joi.string().pattern(/^\S+@\S+\.\S+$/);
const password = Joi.string(); 

const loginSchema = Joi.object({
    email: email.required(),
    password: password.required(),
})

export default loginSchema; 