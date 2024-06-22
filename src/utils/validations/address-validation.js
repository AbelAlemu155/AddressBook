const joi= require('joi');
const { ERR_CONSTANTS } = require('../../constants');

exports.addressEntryValidations= (req, res, next)=> {
    const schema = joi.object().keys({
        userId: joi.number().integer().required(), 
        firstName: joi.string().min(3).max(30).required(),
        lastName: joi.string().min(3).max(30).required(),
        address: joi.object().keys({
            zipCode: joi.string().regex(/(^\d{5}$)|(^\d{5}-\d{4}$)/),
            addressName:joi.string().min(3).max(30).required(),
            city: joi.string().min(3).max(30).required(),
        })
      });
      const validationResult =
      schema.validate(
        req.body, 
        { abortEarly: false } // Return all errors
      );  
      if(validationResult.error){
        next({message: ERR_CONSTANTS.badRequest, body: 
            validationResult.error.details.map(err => err.message)})      
      }
      else{
        next(); 
      }
}

exports.addressValidations= (req, _, next)=>{
 const schema =joi.object().keys({
    zipCode: joi.string().regex(/(^\d{5}$)|(^\d{5}-\d{4}$)/),
    addressName:joi.string().min(3).max(30).required(),
    city: joi.string().min(3).max(30).required(),
    entryId: joi.number().integer().required()
}); 
const validationResult = schema.validate(req.body);
if(validationResult.error){
  next({message: ERR_CONSTANTS.badRequest, body: 
    validationResult.error.details.map(err => err.message) });
}
else next();
}