import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import boom from "@hapi/boom";
import UserService from "../../../services/user.service.js";

const service = new UserService();

const LocalStrategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const user = await service.getUserByEmail(email);
      if (!user) done(boom.notFound("User not found!"));
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) done(boom.unauthorized(`Password doesn't match`));
      done(null, user); 
    } catch (err) {
      done(err, false);
    }
  }
);

export default LocalStrategy;