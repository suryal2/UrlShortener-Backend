const express = require('express');
const shortid = require('shortid');
const Url = require("../models/Url");
 
const router = express.Router();
 
 


router.get('/:shortId', async (req, res) => {
  try {
  
    const longUrl = await Url.findOne(   {shortId: req.params.shortId}  );
    longUrl.clicks++
    longUrl.save()
    if (longUrl) {
      res.redirect(longUrl.shortener);
    } else {
      res.status(404).send('URL not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});











module.exports = router;
