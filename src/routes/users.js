
const userRouter= require('express').Router();
const userController= require('../controllers/user-controller');

const userValidation= require("../utils/validations/user-validation");

userRouter.post('/login',userController.login); 


userRouter.post('/register',userValidation.userCreateValidations,userValidation.checkEmail, userController.registerUser);

userRouter.get(/^\/(\d+)$/, userController.getUserById);  

userRouter.patch(/^\/(\d+)$/, userValidation.validateUserPatch,userController.patchName);

module.exports= userRouter; 