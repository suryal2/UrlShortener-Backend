const mongoose = require("mongoose");
// const { ObjectId } =require("bson");

const urlSchema = new mongoose.Schema({
 
  shortener: {
    type: String,
    required: true,
  },

  
  shortId: {
    type: String,
    required: true,
  },

 
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:"User",
  },

  // Date of creation for the URL
  creationDate: {
    type: Date,
    default: Date.now,
  },

  // Number of clicks on the short URL
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
});

  const Url = mongoose.model('Url', urlSchema);

  module.exports= Url;