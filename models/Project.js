const mongoose = require('mongoose');

const Project = mongoose.Schema({
    project_name:String,
    status:String
})
module.exports = mongoose.model('Project',Project);
