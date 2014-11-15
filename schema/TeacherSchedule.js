/**
 * Created by hawang on 11/11/14.
 */

'use strict';

var exports = module.exports = function(app, mongoose) {

    var availabilitySchema =  new mongoose.Schema({
        startTime : Date,
        endTime : Date,
        capacity : Number,
        occupancy : Number
    });

    var teacherScheduleSchema = new mongoose.Schema({
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
        availability : [availabilitySchema]
    });
    teacherSchema.index({ teacher: 1 });
    teacherSchema.index({ course: 1 });
    teacherSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('TeacherSchedule', teacherScheduleSchema);
};
