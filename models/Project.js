const mongoose = require('mongoose');

const Project = mongoose.Schema({
    project_name:String,
    parent:String
})
module.exports = mongoose.model('ProjectTest',Project);
