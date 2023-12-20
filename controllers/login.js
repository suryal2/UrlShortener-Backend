const  User = require("../models/User");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const client = require("../radisl");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
dotenv.config();

async function CheckUser(email){
  try{
     const user = await User.findOne({ email: email });
    
     if (user) {
        return true;
     }
     return false; 
  } catch (e){
return "server Busy";
  }
}


async function AuthenticateUser(email, password){
    try{
      const userCheck = await User.findOne({ email:email });
      
      const validPassword = await bcrypt.compare(password,userCheck.password);
      console.log(password,userCheck.password)
      if(validPassword){
           const token = jwt.sign({email},process.env.login_secret_token);
           const response = {
            id: userCheck._id,
            name: userCheck.name,
            email:userCheck.email,
            token:token,
            status:true
           };
            
           await client.set(`key-${email}`,JSON.stringify(response))

           await User.findOneAndUpdate({email: userCheck.email},{$set: { token:token }},{new:true});
            return response
           

           }
           return "Invalid User name or password"

      } catch (e){
      console.log(e);
      return "Server Busy"
    }
  }

async function AuthorizeUser(token){
  try{
    const decodedToken = jwt.verify(token, process.env.login_secret_token);
   
    if(decodedToken) {
      const email = decodedToken.email;
      
      console.log(email);
      const auth = await client.get(`key-${email}`);
      console.log(auth);
      
       if (auth){
        const data = JSON.parse(auth)
         
        return data 
        
      } else {
        const data = await User.findOne({email: email})
        return data
      }
    }
    return false;
  } catch (e){ 
    console.log(e)
  }
}




 
 

module.exports = { CheckUser,AuthenticateUser, AuthorizeUser };