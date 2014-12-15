/**
 * Created by hawang on 11/13/14.
 */
'use strict';

var exports;
exports = module.exports = function(app, mongoose) {
    var courseSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        description: String
    });
    courseSchemaSchema.index({ name: 1 });
    courseSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('Course', courseSchema);
};