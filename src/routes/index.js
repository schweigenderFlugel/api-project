import express from 'express';
import productRoute from './product.route.js';
import userRoute from './user.route.js';
import loginRoute from './login.route.js';
import logoutRoute from './logout.route.js';
import profileRoute from './profile.route.js';
import orderRoute from './order.route.js';
import refreshTokenRoute from './refresh-token.route.js';

const routes = (app) => {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/product', productRoute);
    router.use('/user', userRoute)
    router.use('/login', loginRoute);
    router.use('/logout', logoutRoute);
    router.use('/profile', profileRoute);
    router.use('/order', orderRoute);
    router.use('/refresh-token', refreshTokenRoute);
}

export default routes;
