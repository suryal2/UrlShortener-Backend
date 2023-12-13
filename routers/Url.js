const express = require('express');
const shortid = require('shortid');
const Url = require("../models/Url");
const {  calculateDailyCountAndSave, calculateMonthlyCount } = require("../controllers/Url"); 
const router = express.Router();
 
router.post('/urls', async (req, res) => {
  try {  
    const { shortener } = req.body; 
    const shortId =shortid.generate();
    
    const url = new Url({ shortener, shortId:shortId, userId: req.user._id });
    await url.save();
    const longUrl = await Url.findOne(   {shortId: shortId}  ); 
    const dailyCount = await calculateDailyCountAndSave(); 
    const monthlyCount = await calculateMonthlyCount(); 
    const shortUrl = `http://localhost:4002/shorturlRedirect/${shortId}`; 
    res.json({ shortUrl, dailyCount,monthlyCount });
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

    

    // Respond with the JSON containing the retrieved long URLs and associated user information
    res.json( {longUrls} );
  } catch (error) {
    // Handle any errors that might occur during the process
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});







module.exports = router;
