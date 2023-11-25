const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
   
  service:"gmail",
  auth: { 
    user: process.env.nodemailer_user,  
    pass: process.env.nodemailer_pass,
  },
});

function sendMail(toEmail, subject, content){
   const mailOptions = {
    from: "suryalakshmanan924@gmail",
    to: toEmail,
    subject: subject,
    html: content
   };

   transporter.sendMail(mailOptions,(error, info)=>{
    if(error){
        console.log("error occurred", error);
    } else {
        console.log("Email send:",info.response);
    }
});

};


module.exports= { sendMail };
 