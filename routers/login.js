const express = require("express");
const { AuthenticateUser } = require("../controllers/login");
 
const router = express.Router();

 



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
 