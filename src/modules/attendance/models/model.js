'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AttendanceSchema = new Schema({
    id: {
        type: String,
        // required: 'Please fill a Attendance employeeId',
    },
    dateTime:{
        type: Date
    },
    workIn:{
        type: Date
    },
    workOut:{
        type: String,  
    },
    type: {
        type: String,//string is in or out
        // required: 'Please fill a Attendance attendance',
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {},
    updateby: {}
});
AttendanceSchema.pre('save',(next) => {
    let Attendance = this;
    const model = mongoose.model("Attendance", AttendanceSchema);
    if (Attendance.isNew) {
        // create
        next();
    }else{
        // update
        Attendance.updated = new Date();
        next();
    }
    
    
})
mongoose.model("Attendance", AttendanceSchema);