const { ERR_CONSTANTS } = require("../constants");
const AddressData = require("../data-access/address-data");
const {AddressConcise, Address, AddressEntry, AddressEntryDetail}= require("../models/address-entry"); 
const { isNumeric } = require("../utils/general");


exports.getConciseAddress=async  (req, res, next)=>{
    try{
        
        const id= parseInt(req.params[0]);
        let prevEntryId= req.query.prevEntryId;
        if(prevEntryId && !isNumeric(prevEntryId)){
            return next(Error(ERR_CONSTANTS.badRequest));
        }
        if(!prevEntryId){
            prevEntryId=0;
        }
        const result1= await AddressData.getConciseAddress(id, prevEntryId);
        
        const results= result1.map((data)=> {
            return AddressConcise.fromRows(data)
        });
        if(results.length==0){
          return res.status(204);  
        }
        res.status(200).json({"data": results});
    }
    catch(err){
        console.error("error is: "+err); 
        next(err); 
    }


};

exports.getAddressDetail=async  (req, res, next)=> {
    const entryId= parseInt(req.params[0]);
    const tuples= await AddressData.getAddressDetail(entryId);
    const data= tuples.map((data)=> Address.fromRows(data));
    if(data.length==0){
        res.status(204);
    }
    else res.status(200);
    res.json(data);
}


exports.createDefaultAddressEntry= async(req, res, next)=>{
    // parse the req body to AddressEntry object(firstName, lastName, address, userId ) and address object
    //address object: city addressName, city , zipCode 
    try{
     const addressEntry = AddressEntry.fromRows(req.body); 
     const data= await AddressData.createDefaultAddressEntry(addressEntry);
     res.status(201).json({"resources": data});   
     
    }   
    catch(error){
        poolQuery().query('rollback');
        console.error(error);
        next(error);
    }         
}

exports.addAddressEntry = async (req, res, next)=> {
try {
    const entryId = req.body.entryId;
    const addressId= await AddressData.addAddresstoEntry(Address.fromRows(req.body), 
    entryId);
    console.log(addressId);
    res.status(201).json({"newEntryId":entryId }); 
} catch (error) {
    next(error);    
}    
}

exports.fetchEntryWithAddress = async (req, res, next)=> {
    try {
        const uId= parseInt(req.params.uId);
        if ((req.query.prevUid || req.query.prevEntryId) && 
        (!isNumeric(req.query.prevUid) || !isNumeric(req.query.prevEntryId))){
           return next(Error(ERR_CONSTANTS.badRequest)); 
        }
        const prevEntryId= parseInt(req.query.prevEntryId);
        const tuples = await AddressData.fetchEntryWithAddress(uId, prevEntryId);
        if(tuples.length==0){
            return res.status(204);
        }
        const aeDetails= AddressEntryDetail.addressEntryMapper(tuples); 
        res.status(200).json(aeDetails);
    } catch (error) {
        console.log(error);
        next(error);        
    }

}   