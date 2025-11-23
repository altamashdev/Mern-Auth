import express from 'express';
import {isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVarifyOtp, varifyEmail} from '../controllers/authController.js';//register function from authControllers
import userAuth from '../middleware/userAuth.js';


// Express ke andar jo Router name ka function he usko hamne authRouter name ke variable me store kiya he ab hm variable ka use karke express ke ek router function ko call kar sakte he like post,get,put,delete methode
const authRouter = express.Router();

// The End Point API for Each authControllers Function to show in which api which function call in backend 
authRouter.post('/register' , register);
authRouter.post('/login' , login);
authRouter.post('/logout' , logout);
authRouter.post('/send-varify-otp' , userAuth , sendVarifyOtp);
authRouter.post('/varify-account' , userAuth , varifyEmail);
authRouter.get('/is-auth' , userAuth , isAuthenticated);
authRouter.post('/send-reset-otp' , sendResetOtp);
authRouter.post('/reset-password' ,  resetPassword);

export default authRouter;