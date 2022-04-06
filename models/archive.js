const mongoose = require('mongoose');

const User_archive = mongoose.Schema({
   last_name:String,
   first_name:String,
   m_code:String
})
module.exports = mongoose.model('archive',User_archive);