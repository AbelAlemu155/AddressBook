
const ERR_CONSTANTS= require('../constants').ERR_CONSTANTS; 

const errModule= (err,_,res,_)=> {

    switch(err.message){
        case(ERR_CONSTANTS.badRequest):
            const body= err.body ?? '';
            res.status(400).json({'error': "bad request "+body}); 
            break;
        case(ERR_CONSTANTS.authentication):
            res.status(401).json({'error': 'authentication failed'}); 
            break;        
        case(ERR_CONSTANTS.authorization):
            res.status(403).json({'error': 'authorization failed'}); 
            break;
        case(ERR_CONSTANTS.notFound):
           res.status(404).json({'error': 'resource not found'}); 
           break; 
        default: 
            console.log("error is: "+ err);
            res.status(500).json({'error': 'Internal server error'}); 

    }

};

module.exports=errModule;