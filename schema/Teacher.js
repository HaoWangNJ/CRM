/**
 * Created by hawang on 10/24/14.
 */

'use strict';

var exports;
exports = module.exports = function(app, mongoose) {
    var teacherSchema = new mongoose.Schema({
        user: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String, default: '' }
        },
        description: { tyep: String, default: ''},
        company: { type: String, default: '' },
        phone: { type: String, default: '' },
        zip: { type: String, default: '' }
    });
    teacherSchema.plugin(require('./plugins/pagedFind'));
    teacherSchema.index({ user: 1 });
    teacherSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('Teacher', teacherSchema);
};