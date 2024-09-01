const express= require("express");
require('dotenv').config();
const userRouter= require("./routes/users");
const addRouter= require("./routes/address-entries");

const app= express();
const errModule= require('./utils/error-handler');  


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/address',addRouter); 
app.use('/user', userRouter); 
app.use((req, res)=>{
    res.status(404).json({'error': 'Resource not found'});
});
app.use(errModule); 

app.listen(port, console.log("listening on port:"+ process.env.PORT));
