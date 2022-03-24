const mongoose = require('mongoose');

const User = mongoose.Schema({
   username:String,
   password:String,
   m_code:String,
   num_agent:String,
   occupation:String
})
module.exports = mongoose.model('datauser',User);
