// generic authenicated address route>>

const { PAGE_SIZE, PAGE_INTERNAL_SIZE } = require('../constants');
const poolQuery= require('./data-config');

//paginate using 5 entries
exports.getConciseAddress= async (id, prevEntryId)=>{
    //TODO:: offset doesn't work well with large datasets... you can use a primary key attribute to set offset??
   
    const res= await poolQuery().query(
        `select ae.id::int as entryID,first_name::text as firstName,
        last_name::text as lastName, 
         count(*)::int as count
         from address_entries ae join addresses ad
         on ae.id= ad.add_id
         where u_id=$1 and ae.id > $3
         group by ae.id,first_name,last_name
         limit $2
        `,[id, PAGE_SIZE,prevEntryId]
    );
     
    return res.rows;
};

exports.getAddressDetail= async (entryId)=> {
    
    const tuples= await poolQuery().query(
        `   
        select address_name::text, zip_code::text, city::text 
        from addresses 
        where add_id=$1
        `,[entryId]
    );
    return tuples.rows;
};


exports.createDefaultAddressEntry = async(addressEntry)=>{
   const address= addressEntry.address; 
   // starting a transaction for the two operations because they need to complete atomically
   poolQuery().query("BEGIN");
   const tuple= await poolQuery().query(
    `
    Insert into address_entries(first_name, last_name,u_id) 
    values($1,$2,$3) returning id::int
    `, [addressEntry.firstName, addressEntry.lastName,addressEntry.userId]
   );

   const newEntryId = tuple.rows[0].id; 
   const tuple2= await poolQuery().query(
    `
    insert into addresses(address_name, zip_code, city, add_id)
    values($1,$2,$3,$4) returning id::int
    `, [address.addressName, address.zipCode, address.city, newEntryId ]
   ); 
   poolQuery().query('commit');
   
   const newAddressId= tuple2.rows[0].id;
   return {newEntryId: newEntryId, newAddressId: newAddressId};
};

exports.addAddresstoEntry = async(address, entryId)=> {
        const tuples = await poolQuery().query(
            `
            insert into addresses(address_name, zip_code,city, add_id) 
            values ($1,$2,$3,$4) returning id::int 
            `, [address.addressName, address.zipCode , address.city, entryId]
        );
        return tuples.rows[0].id; 
};

    exports.fetchEntryWithAddress= async(uId, prevEntryId)=>{
    /** 1. create an index on the u_id,add_id in address_entries to ensure an access time that is independent of the
      the size and offset used in pagination
      2. use a subquery to make use of the indexes
    3. use cursor based pagination on the address entries to make the speed of the operations proportional to 
    the size of the index scans
    4. TODO:: test the performance metrics
    **/

   // implementation of a pagination without using offset. Offsets don't scale well for large data sets
   const tuples = await poolQuery().query(
    `select * from paginated_address_entry($1,$2,$3,$4) 
       `, [uId, prevEntryId,  PAGE_SIZE, PAGE_INTERNAL_SIZE]
   );
       return tuples.rows; 
}



