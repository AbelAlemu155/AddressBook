const { ERR_CONSTANTS } = require('../constants');
const userData= require('../data-access/user-data');

exports.getUserById= async(req, res,next)=>{
  // evaluate on the request parameters and query strings security vulnerability'
  
 try {
    id= parseInt(req.params[0]);
    user= await userData.getUserById(id);
    res.status(200).json(user.toObject());  
    console.log(user);
  } catch (error) {
    console.error("error is: "+ error.message);
    next(error);
  } 
};



exports.registerUser= async(req, res, next)=> {
  try{
    const id= await userData.registerUser(req.body);
    console.log("success")
    res.status(201).json({"id": id});
  } 
  catch(error){
    next(error); 
  }
};

exports.login= async (req, res,next)=> {
  try{
    const token=await userData.login(req.body.email, req.body.password);
    console.log("token is: "+ token);
    res.status(200).json({"token": token});
  }
  catch(error){
    console.error(error);
    next({message: ERR_CONSTANTS.authentication});
  }
};
  exports.patchName = async(req, res, next)=> {
    try {
      await userData.patchName(req.body.name, parseInt(req.params[0]));
      res.status(204).json(); 
    } catch (error) {
      next(error);   
    }
  };
