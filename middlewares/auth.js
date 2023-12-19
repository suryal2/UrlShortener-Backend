const jwt = require('jsonwebtoken');
// const { getUserById } = require("../controllers/login");
const  User = require("../models/User");

const isAuthorized = async (req,res,next) => {
  let token;
  if(req.headers) {
      try{
          token = await req.headers["x-auth-token"];
          // console.log("auth:",token)
          const decoded = jwt.verify(token, process.env.login_secret_token,{ complete: true });
         
      
          const email = decoded.payload.email;
         
          req.user =  await User.findOne({email})
        
         next();
      } catch (error) {
          console.log(error);
          res.status(500).json({error:"Internal Server"});
     }
  }
};


module.exports = { isAuthorized };
