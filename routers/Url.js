const express = require('express');
const shortid = require('shortid');
const Url = require("../models/Url");
const {  calculateDailyCountAndSave, calculateMonthlyCount, updateNotes, deletedNotes } = require("../controllers/Url"); 
const router = express.Router();
 
router.post('/urls', async (req, res) => {
  try {  
    const { shortener } = req.body; 
    if(shortener){
      const shortId =shortid.generate(); 
      const url = new Url({ shortener, shortId:shortId, userId: req.user._id });
      await url.save(); 
      const dailyCount = await calculateDailyCountAndSave(); 
      const monthlyCount = await calculateMonthlyCount(); 
      const shortUrl = `https://urlshort-zsjx.onrender.com/shorturlRedirect/${shortId}`; 
      res.json({ shortUrl, dailyCount,monthlyCount });
    } else{
      res.status(200).send("clint error");
    }
    
  } catch (error) {
    res.status(400).send(error);
  }  
});

router.get('/userurl', async (req, res) => {
  const longUrl = await Url.find({ userId: req.user._id } ).populate("userId", "name email");; 
  res.json({longUrl});
})
 


router.get('/publicurl', async (req, res) => {
  try {
    // Retrieve all URLs from the database and populate user information (name and email)
    const longUrls = await Url.find().populate("userId", "name email joinedOn");

    console.log(longUrls)

    // Respond with the JSON containing the retrieved long URLs and associated user information
    res.json( {longUrls} );
  } catch (error) {
    // Handle any errors that might occur during the process
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//edit for user

router.put("/user/edit/:id", async (req, res) => {
  const { shortener } = req.body;
  const id = req.params.id;

  if (shortener.trim() === '') {
    return res.status(200).json( "connot contain only spaces" );
  }
else if(shortener){
  const editNotes = await updateNotes(shortener, id);
  console.log(editNotes)
    if (!editNotes) {
     return res.status(200).send("clint error");
    }
  
    res.status(200).json({
      message: "Successfully updated",
      data: editNotes,
    });
}
 
});




//delet user notes
router.delete("/user/delete/:id",async (req,res) =>{
  try{
     const deletedNote = await deletedNotes(req);
     if(!deletedNote){
      return res.status(400).json({
          error: "Error Occured while deleting"
  });
  }
  res.status(201).json({
      message: "successfully deleted",
     });
  } catch (error) {
      console.log(error);
      res.status(500).json({error:"Internal Server"});
  }
});



module.exports = router;
