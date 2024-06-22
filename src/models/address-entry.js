//TODO: understand any design impacts of defining two classes in the same file.
// TODO: are there named parameters for constructors in javascript??

const { PAGE_INTERNAL_SIZE, PAGE_SIZE } = require("../constants");


class AddressConcise{
    constructor(entryID, firstName, lastName, count){
        this.entryID=entryID;
        this.firstName=firstName;
        this.lastName=lastName;
        this.address_numbers=count;
    }
    static fromRows(data){
        return new AddressConcise(data.entryid,
             data.firstname, data.lastname, data.count); 
    }
    
}


class Address{
    constructor(city, zipCode, addressName){
        this.city=city;
        this.addressName=addressName;
        this.zipCode=zipCode;
    }
    static fromRows(data){
        return new Address(data.city, data.zipCode, data.addressName); 
    }
    static newAddressMapping(data){
        return new Address(data.city, data.zip_code, data.address_name); 
    }
}

class AddressEntry{
    constructor( id,firstName, lastName, address ){
        this.id=id;
        this.firstName=firstName;
        this.lastName=lastName;
        this.address=address;
    }
    static fromRows(data){
        return new AddressEntry(data.id,data.firstName, data.lastName, Address.fromRows(data.address), 
    )   
    }
   
}

class AddressEntryDetail
{
    constructor(id, firstName, lastName ,addresses){
        this.id=id;
        this.firstName=firstName;
        this.lastName=lastName;
        this.addresses=addresses;
    }
    static addressEntryMapper(values){
        let aEntries=[];
        aEntries.size= PAGE_SIZE; 
        for(let i=0; i< values.length; i+=PAGE_INTERNAL_SIZE){ 
        let addresses=[];
        addresses.length= PAGE_INTERNAL_SIZE;
        for(let j=0; j< PAGE_INTERNAL_SIZE; j++){
            addresses[j]=Address.newAddressMapping(values[i+j]);
        } 
        let aEntry= new AddressEntryDetail(values[i].id, values[i].first_name, values[i].last_name, addresses);
        aEntries[i/PAGE_SIZE]= aEntry;                 
       }
       return aEntries;
    }   
}
module.exports= {AddressConcise, Address, AddressEntry, AddressEntryDetail}; 