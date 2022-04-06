const mongoose = require('mongoose');

const User = mongoose.Schema({
   username:String,
   last_name:String,
   first_name:String,
   password:String,
   m_code:String,
   num_agent:String,
   occupation:String,
   amount:Number
})
module.exports = mongoose.model('datauser',User);
