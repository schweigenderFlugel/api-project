import Joi from "joi";

const email = Joi.string().pattern(/^\S+@\S+\.\S+$/);
const token = Joi.string();
const password = Joi.string().min(10).max(30);

const sendEmail = Joi.object({
    email: email.required()
});

const newPassword = Joi.object({
    token: token.required(),
    password: password.required()
})

export { sendEmail, newPassword };