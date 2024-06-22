const bcrypt = require("bcrypt");
const { ERR_CONSTANTS } = require("../constants");
const User = require("../models/user-models/user");
const poolFunction = require("./data-config");
const jwt = require("jsonwebtoken");


exports.getUserById = async (id) => {
  const res = await poolFunction().query(
    `select name::text,email::text,id::int
       from users where id=$1`,
    [id]
  );

  if (res.rows.length === 0) throw new Error(ERR_CONSTANTS.notFound);
  return User.fromObject(res.rows[0]);
};

exports.checkEmail = async (email)=> {
   const res = await poolFunction().query(
      `select id
         from users where email=$1`,
      [email]
    );
   if(res.rows.length!=0){
      throw new Error(ERR_CONSTANTS.badRequest);
   }   
};


exports.registerUser = async (userData) => {
  let workFactor = 8;
  const hashedPassword = await bcrypt.hash(userData.password, workFactor);
  const res = await poolFunction().query(
    `insert into users(name,email,password) values
   ($1,$2, $3) returning id::int`, [userData.name, userData.email, hashedPassword]
  );
  return res.rows[0].id;
};

exports.login= async (email, password)=> {
   const res= await poolFunction().query(
      "select id::int,name::text,password::text from users where email=$1",[email]
   );
   
   if(res.rows.length ==0 ){
      throw Error();
   }
   const hashedPassword= res.rows[0].password;
   console.log("before hash");
   await bcrypt.compare(password, hashedPassword); 

   return  jwt.sign({ id: res.rows[0].id, name: res.rows[0].name }, process.env.KEY, 
      { expiresIn: "2d" });
   
};

exports.checkUserId = async (id)=>{
   const tuples= await poolFunction().query(
      `select id from users where id=$1
      `,[id]
   );
   if(tuples.rows.length==0){
     throw Error( ERR_CONSTANTS.badRequest); 
   }

}

exports.patchName = async (name, id)=> {
    await poolFunction().query(
      `
      update users
      set name= $1
      where id= $2
      `,[name,id]
    );
}
