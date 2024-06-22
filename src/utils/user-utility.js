
const jwt = require("jsonwebtoken");
const { ERR_CONSTANTS } = require("../constants");

exports.checkAuthenticated=(req, res, next)=> {
    if(!req.headers.authorization){
        return next({message: ERR_CONSTANTS.authentication});       
    } 
    const tokens= req.headers.authorization.split(" ");
     const token = tokens[1]; 
     jwt.verify(token, process.env.KEY,(err,val)=>{
        
        if(err){
          next({message: ERR_CONSTANTS.authentication}); 
        }
        else next();
     }); 
};