const mongoose = require('mongoose');

const Timesheet = mongoose.Schema({
    m_code:String,
    num_agent:String,
    projects: String,
    date:String,
    time_start: String,
    time_end:String,
    task:String,
    validation:Boolean
})
module.exports = mongoose.model('TimesheetTest',Timesheet);
