const  Url = require("../models/Url");
const mongoose = require("mongoose");
const shortid = require('shortid');

const calculateDailyCountAndSave = async () => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const dailyCount = await Url.countDocuments({ creationDate: { $gte: startOfDay } });

        
       
       

        return dailyCount;
    } catch (error) {
        console.error('Error calculating daily count:', error);
        throw error;
    }
};
const calculateMonthlyCount = async () => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);

        // Calculate the monthly count based on the entire month
        const monthlyCount = await Url.countDocuments({ creationDate: { $gte: startOfMonth } });
        
        

     

        return monthlyCount;
    } catch (error) {
        console.error('Error calculating monthly count:', error);
        throw error;
    }
}

const updateNotes = (shortener,id) => {
  
        const shortId = shortid.generate();
        console.log("short:", shortId);
        return Url.findOneAndUpdate(
          { _id: id },
          
          {
            $set: {
              shortener: shortener,
              shortId: shortId,
            },
          },
          { new: true }
        );
    
      
     
  };

  function deletedNotes(req){
    return Url.findByIdAndDelete({
        _id: req.params.id,
    });
}
  

module.exports = { calculateDailyCountAndSave, calculateMonthlyCount, updateNotes, deletedNotes };
