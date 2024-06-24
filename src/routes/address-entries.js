const addRouter= require('express').Router();
const { checkAuthenticated } = require('../utils/user-utility');
const AddressController= require("../controllers/address-controller"); 
const { addressEntryValidations, addressValidations } = require('../utils/validations/address-validation');
const { validateUserId } = require('../utils/validations/user-validation');



// using regex to define routes for stronger input validation for the query parameters
addRouter.get(/^\/entry\/(\d+)\/(\d+)$/,checkAuthenticated,  
    AddressController.getConciseAddress); 

// fetching an address detail for a given address entry id    
addRouter.get(/^\/address-details\/(\d+)$/, checkAuthenticated, AddressController.getAddressDetail);

addRouter.post("/create-default-entry", checkAuthenticated, 
    addressEntryValidations, AddressController.createDefaultAddressEntry );

addRouter.post("/add-address-entry", checkAuthenticated, addressValidations,
     AddressController.addAddressEntry  );

addRouter.get("/entry-address/:uId", checkAuthenticated, AddressController.fetchEntryWithAddress);      

module.exports= addRouter; 