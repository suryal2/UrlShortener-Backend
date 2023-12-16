const express = require("express");
const  User = require("../models/User");
const { sendMail} = require("../controllers/SendMail");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
 
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
dotenv.config();

const router = express.Router();



router.post("/forgot-password",async (req,res)=>{
     const {email}= req.body;
     const user = await User.findOne({ email: email });
console.log("users",user)
     if(!user){
        return res.send({status:"User not existed"});
     }
     const token = jwt.sign({id: user._id},process.env.forgot_secret_token)

    const update = await User.findOneAndUpdate({email: user.email}, {$set: { token:token }},{new:true});
       const resetLink = `https://657db1234f9e7f3aabfa932d--poetic-pasca-925a80.netlify.app/forgot/reset-password/${user._id}/${token}`;

     const content = `${resetLink}`
     sendMail(email,"Reset your password",content)
     res.status(200).send(true);
});

router.post("/reset-password/:id/:token", async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ token: token });
        
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.forgot_secret_token);
   

    // Extract user ID from the decoded token
    const userId = decoded.id;
  

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  

    // Update user's password in the database
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { password: hashedPassword }, { new: true });
 

    if (updatedUser) {
      res.status(200).send(true);
      const content =  `<h4> hi,there</h4>
      <h5>Welconme to the app</h5>
      <p> you are successfully reset the password </p>
      <p>Regards</p>
      <p>Team</p>`
      sendMail(user.email,"successfully Reset the password",content)
    } else {
      res.json(false);
    }
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ error: "Error resetting password" });
  }
});



module.exports = router;