import express from 'express'
const authRouter = express.Router();

import { Register, Login, Logout } from '../Controllers/authController.js';

authRouter.options("*", (req, res) => {
  res.sendStatus(200);
});

authRouter.post('/login', Login);
authRouter.post('/register', Register);
authRouter.get('/logout', Logout);

export default authRouter