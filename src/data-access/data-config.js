const pg= require('pg');
const { Pool } = pg
// function for getting a single instance of a pool
const poolFunction= (()=>{
 let pool; 
 return ()=> {
     if(!pool){
     pool= new Pool(); 
    }
    return pool;
 }   
})();

module.exports = poolFunction; 