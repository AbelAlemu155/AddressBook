const joi= require('joi');
const { ERR_CONSTANTS } = require('../../constants');
const userData= require("../../data-access/user-data");

const nameSchema= joi.string().min(3).max(30).required(); 
exports.userCreateValidations= (req, res, next)=> {
    const schema = joi.object().keys({
        email: joi.string().email().required(),
        name: nameSchema,
        password: joi.string().regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/)
      });
      const validationResult =
      schema.validate(
        req.body, 
        { abortEarly: false } // Return all errors
      );  
      if(validationResult.error){
        next({"message": ERR_CONSTANTS.badRequest,
          "body": validationResult.error.details.map(err => err.message)
        }); 
    }
    else next();  

};

exports.checkEmail = async(req, res, next)=>{
  try{
    await userData.checkEmail(req.body.email);
    next(); 
  }
  catch(error){
    next({"message": ERR_CONSTANTS.badRequest, 
        "body": "email is already registered"

    });
  }
}

  exports.validateUserPatch = async (req, res, next)=>{
    console.log("validating user patch");
    //check if an id exists or not 
    const schema = joi.object().keys({
      name: nameSchema,
     });  
    const validationResult= schema.validate(req.body);
    if(validationResult.error){
      return next({"message": ERR_CONSTANTS.badRequest,
        "body": validationResult.error.details.map(err => err.message)
      }); 
    }
    const id=parseInt(req.params[0]);
    try {
      await userData.checkUserId(id);
      next(); 
    } catch (error) {
      next(error);     
    }
  
};

exports.validateUserId= async(req, res,next)=> 
  {
    const id=parseInt(req.params.uId);
    try {
      await userData.checkUserId(id);
      next(); 
    } catch (error) {
      next(error);     
    }
  }