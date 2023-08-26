import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";

import LocalStrategy from "./utils/auth/strategies/local-strategy.js";
import JwtStrategy from "./utils/auth/strategies/jwt-strategy.js";
import corsOptions from "./middlewares/cors.handler.js";
import { errorHandler, boomErrorHandler } from "./middlewares/error.handler.js"; 

const createApp = () => {
  const app = express();

  // MIDDLEWARES
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(cors(corsOptions));

  routes(app);

  // PASSPORT
  passport.use(LocalStrategy);
  passport.use(JwtStrategy);

  // ERRORS HANDLERS
  app.use(boomErrorHandler);
  app.use(errorHandler);

  return app;

};

export default createApp;
