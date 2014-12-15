/**
 * Created by hawang on 12/15/14.
 */

'use strict';

var exports = module.exports = function(app, mongoose) {

    var lessonSchema = new mongoose.Schema({
        lesson: {type: mongoose.Schema.Types.ObjectId, ref: 'TeacherSchedule'},
        student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
        status: { type: String, default: '' }
    });
    lessonSchema.index({ lesson: 1 });
    lessonSchema.index({ student: 1 });
    lessonSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('lesson', lessonSchema);
};
