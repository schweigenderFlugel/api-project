import boom from "@hapi/boom";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import sendMail from "../utils/nodemailer.js";
import config from "../config/config.js";
import UserStorage from "../database/storage/user.storage.js";

const storage = new UserStorage();

class PasswordRecoveryService {
  async sendPasswordRecovery(email) {
    const user = await storage.getUserByEmail(email);
    if (!user) throw boom.unauthorized();

    const payload = { sub: user.id };
    const recoveryToken = jwt.sign(payload, config.jwtRecoveryToken, { expiresIn: "15m" });
    const link = `http://myfrontend.com/recovery?token=${recoveryToken}`;
    await storage.saveRecoveryToken(user.id, recoveryToken);
    const mail = {
      from: "TESTING <sender@gmail.com>",
      to: email,
      subject: "Recuperar contraseña",
      text: "Se ha registrado exitosamente",
      html: `Usted ha solicitado el proceso de recuperación de su contraseña. Haga click el siguiente enlace: ${link}`,
    };
    sendMail(mail);
  }

  async changePassword(recoveryToken, password) {
    const token = jwt.verify(recoveryToken, config.jwtRecoveryToken);
    const user = await storage.getUserById(token.sub);
    const hash = await bcrypt.hash(password, 10); 
    const tokenNull = null;
    if (user.recoveryToken !== recoveryToken) {
      throw boom.unauthorized();
    }
    await storage.changePassword(user.id, hash);
    await storage.saveRecoveryToken(user.id, tokenNull);
  }
}

export default PasswordRecoveryService;