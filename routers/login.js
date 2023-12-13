const express = require("express");
const { AuthenticateUser } = require("../controllers/login");
const client = require("../redis");
const router = express.Router();

client
.connect()
.then(()=>{
   console.log("connected to redis in login");
})
.catch((e)=>{
   console.log(e);
});




router.post("/", async (req,res)=>{
    try{
      const { email, password } = await req.body;
      var loginCredentials = await AuthenticateUser(email,password);
    
      if (loginCredentials === "Invalid User name or password"){
         res.status(200).send( "Invalid User name or password");
      } else if(loginCredentials === "Server Busy"){
         res.status(200).send("Server Busy");
      }else {
          res.status(200).json({token: loginCredentials.token});
      }
     
    } catch (e){
      console.log(e);
      res.status(500).send("server Busy");
    }
})

module.exports = router; 
 