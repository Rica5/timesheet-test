const mongoose = require('mongoose');

const Project = mongoose.Schema({
    project_name:String,
    parent:parent
})
module.exports = mongoose.model('Project',Project);
