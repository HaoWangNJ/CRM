'use strict';

var renderSettings = function(req, res, next, oauthMessage) {
  var outcome = {};

  var getStudentData = function(callback) {
    req.app.db.models.Student.findById(req.user.roles.student.id, 'name company phone zip').exec(function(err, student) {
      if (err) {
        return callback(err, null);
      }

      outcome.student = student;
      callback(null, 'done');
    });
  };

  var getUserData = function(callback) {
    req.app.db.models.User.findById(req.user.id, 'username email twitter.id github.id facebook.id google.id tumblr.id').exec(function(err, user) {
      if (err) {
        callback(err, null);
      }

      outcome.user = user;
      return callback(null, 'done');
    });
  };

  var asyncFinally = function(err, results) {
    if (err) {
      return next(err);
    }

    res.render('student/settings/index', {
      data: {
        student: escape(JSON.stringify(outcome.student)),
        user: escape(JSON.stringify(outcome.user))
      },
      oauthMessage: oauthMessage,
      oauthTwitter: !!req.app.config.oauth.twitter.key,
      oauthTwitterActive: outcome.user.twitter ? !!outcome.user.twitter.id : false,
      oauthGitHub: !!req.app.config.oauth.github.key,
      oauthGitHubActive: outcome.user.github ? !!outcome.user.github.id : false,
      oauthFacebook: !!req.app.config.oauth.facebook.key,
      oauthFacebookActive: outcome.user.facebook ? !!outcome.user.facebook.id : false,
      oauthGoogle: !!req.app.config.oauth.google.key,
      oauthGoogleActive: outcome.user.google ? !!outcome.user.google.id : false,
      oauthTumblr: !!req.app.config.oauth.tumblr.key,
      oauthTumblrActive: outcome.user.tumblr ? !!outcome.user.tumblr.id : false
    });
  };

  require('async').parallel([getStudentData, getUserData], asyncFinally);
};

exports.init = function(req, res, next){
  renderSettings(req, res, next, '');
};

exports.connectTwitter = function(req, res, next){
  req._passport.instance.authenticate('twitter', function(err, user, info) {
    if (!info || !info.profile) {
      return res.redirect('/student/settings/');
    }

    req.app.db.models.User.findOne({ 'twitter.id': info.profile.id, _id: { $ne: req.user.id } }, function(err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        renderSettings(req, res, next, 'Another user has already connected with that Twitter student.');
      }
      else {
        req.app.db.models.User.findByIdAndUpdate(req.user.id, { 'twitter.id': info.profile.id }, function(err, user) {
          if (err) {
            return next(err);
          }

          res.redirect('/student/settings/');
        });
      }
    });
  })(req, res, next);
};

exports.connectGitHub = function(req, res, next){
  req._passport.instance.authenticate('github', function(err, user, info) {
    if (!info || !info.profile) {
      return res.redirect('/student/settings/');
    }

    req.app.db.models.User.findOne({ 'github.id': info.profile.id, _id: { $ne: req.user.id } }, function(err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        renderSettings(req, res, next, 'Another user has already connected with that GitHub student.');
      }
      else {
        req.app.db.models.User.findByIdAndUpdate(req.user.id, { 'github.id': info.profile.id }, function(err, user) {
          if (err) {
            return next(err);
          }

          res.redirect('/student/settings/');
        });
      }
    });
  })(req, res, next);
};

exports.connectFacebook = function(req, res, next){
  req._passport.instance.authenticate('facebook', { callbackURL: '/student/settings/facebook/callback/' }, function(err, user, info) {
    if (!info || !info.profile) {
      return res.redirect('/student/settings/');
    }

    req.app.db.models.User.findOne({ 'facebook.id': info.profile.id, _id: { $ne: req.user.id } }, function(err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        renderSettings(req, res, next, 'Another user has already connected with that Facebook student.');
      }
      else {
        req.app.db.models.User.findByIdAndUpdate(req.user.id, { 'facebook.id': info.profile.id }, function(err, user) {
          if (err) {
            return next(err);
          }

          res.redirect('/student/settings/');
        });
      }
    });
  })(req, res, next);
};

exports.connectGoogle = function(req, res, next){
  req._passport.instance.authenticate('google', { callbackURL: '/student/settings/google/callback/' }, function(err, user, info) {
    if (!info || !info.profile) {
      return res.redirect('/student/settings/');
    }

    req.app.db.models.User.findOne({ 'google.id': info.profile.id, _id: { $ne: req.user.id } }, function(err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        renderSettings(req, res, next, 'Another user has already connected with that Google student.');
      }
      else {
        req.app.db.models.User.findByIdAndUpdate(req.user.id, { 'google.id': info.profile.id }, function(err, user) {
          if (err) {
            return next(err);
          }

          res.redirect('/student/settings/');
        });
      }
    });
  })(req, res, next);
};

exports.connectTumblr = function(req, res, next){
  req._passport.instance.authenticate('tumblr', { callbackURL: '/student/settings/tumblr/callback/' }, function(err, user, info) {
    if (!info || !info.profile) {
      return res.redirect('/student/settings/');
    }

    if (!info.profile.hasOwnProperty('id')) {
      info.profile.id = info.profile.username;
    }

    req.app.db.models.User.findOne({ 'tumblr.id': info.profile.id, _id: { $ne: req.user.id } }, function(err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        renderSettings(req, res, next, 'Another user has already connected with that Tumblr student.');
      }
      else {
        req.app.db.models.User.findByIdAndUpdate(req.user.id, { 'tumblr.id': info.profile.id }, function(err, user) {
          if (err) {
            return next(err);
          }

          res.redirect('/student/settings/');
        });
      }
    });
  })(req, res, next);
};

exports.disconnectTwitter = function(req, res, next){
  req.app.db.models.User.findByIdAndUpdate(req.user.id, { twitter: { id: undefined } }, function(err, user) {
    if (err) {
      return next(err);
    }

    res.redirect('/student/settings/');
  });
};

exports.disconnectGitHub = function(req, res, next){
  req.app.db.models.User.findByIdAndUpdate(req.user.id, { github: { id: undefined } }, function(err, user) {
    if (err) {
      return next(err);
    }

    res.redirect('/student/settings/');
  });
};

exports.disconnectFacebook = function(req, res, next){
  req.app.db.models.User.findByIdAndUpdate(req.user.id, { facebook: { id: undefined } }, function(err, user) {
    if (err) {
      return next(err);
    }

    res.redirect('/student/settings/');
  });
};

exports.disconnectGoogle = function(req, res, next){
  req.app.db.models.User.findByIdAndUpdate(req.user.id, { google: { id: undefined } }, function(err, user) {
    if (err) {
      return next(err);
    }

    res.redirect('/student/settings/');
  });
};

exports.disconnectTumblr = function(req, res, next){
  req.app.db.models.User.findByIdAndUpdate(req.user.id, { tumblr: { id: undefined } }, function(err, user) {
    if (err) {
      return next(err);
    }

    res.redirect('/student/settings/');
  });
};

exports.update = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.first) {
      workflow.outcome.errfor.first = 'required';
    }

    if (!req.body.last) {
      workflow.outcome.errfor.last = 'required';
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('patchStudent');
  });

  workflow.on('patchStudent', function() {
    var fieldsToSet = {
      name: {
        first: req.body.first,
        middle: req.body.middle,
        last: req.body.last,
        full: req.body.first +' '+ req.body.last
      },
      company: req.body.company,
      phone: req.body.phone,
      zip: req.body.zip,
      search: [
        req.body.first,
        req.body.middle,
        req.body.last,
        req.body.company,
        req.body.phone,
        req.body.zip
      ]
    };
    var options = { select: 'name company phone zip' };

    req.app.db.models.Student.findByIdAndUpdate(req.user.roles.student.id, fieldsToSet, options, function(err, student) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.student = student;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

exports.identity = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.username) {
      workflow.outcome.errfor.username = 'required';
    }
    else if (!/^[a-zA-Z0-9\-\_]+$/.test(req.body.username)) {
      workflow.outcome.errfor.username = 'only use letters, numbers, \'-\', \'_\'';
    }

    if (!req.body.email) {
      workflow.outcome.errfor.email = 'required';
    }
    else if (!/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(req.body.email)) {
      workflow.outcome.errfor.email = 'invalid email format';
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('duplicateUsernameCheck');
  });

  workflow.on('duplicateUsernameCheck', function() {
    req.app.db.models.User.findOne({ username: req.body.username, _id: { $ne: req.user.id } }, function(err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (user) {
        workflow.outcome.errfor.username = 'username already taken';
        return workflow.emit('response');
      }

      workflow.emit('duplicateEmailCheck');
    });
  });

  workflow.on('duplicateEmailCheck', function() {
    req.app.db.models.User.findOne({ email: req.body.email.toLowerCase(), _id: { $ne: req.user.id } }, function(err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (user) {
        workflow.outcome.errfor.email = 'email already taken';
        return workflow.emit('response');
      }

      workflow.emit('patchUser');
    });
  });

  workflow.on('patchUser', function() {
    var fieldsToSet = {
      username: req.body.username,
      email: req.body.email.toLowerCase(),
      search: [
        req.body.username,
        req.body.email
      ]
    };
    var options = { select: 'username email twitter.id github.id facebook.id google.id' };

    req.app.db.models.User.findByIdAndUpdate(req.user.id, fieldsToSet, options, function(err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.emit('patchAdmin', user);
    });
  });

  workflow.on('patchAdmin', function(user) {
    if (user.roles.admin) {
      var fieldsToSet = {
        user: {
          id: req.user.id,
          name: user.username
        }
      };
      req.app.db.models.Admin.findByIdAndUpdate(user.roles.admin, fieldsToSet, function(err, admin) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.emit('patchAccount', user);
      });
    }
    else {
      workflow.emit('patchAccount', user);
    }
  });

  workflow.on('patchAccount', function(user) {
    if (user.roles.student) {
      var fieldsToSet = {
        user: {
          id: req.user.id,
          name: user.username
        }
      };
      req.app.db.models.Student.findByIdAndUpdate(user.roles.student, fieldsToSet, function(err, account) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.emit('populateRoles', user);
      });
    }
    else {
      workflow.emit('populateRoles', user);
    }
  });

  workflow.on('populateRoles', function(user) {
    user.populate('roles.admin roles.student', 'name.full', function(err, populatedUser) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.user = populatedUser;
      workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

exports.password = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.newPassword) {
      workflow.outcome.errfor.newPassword = 'required';
    }

    if (!req.body.confirm) {
      workflow.outcome.errfor.confirm = 'required';
    }

    if (req.body.newPassword !== req.body.confirm) {
      workflow.outcome.errors.push('Passwords do not match.');
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('patchUser');
  });

  workflow.on('patchUser', function() {
    req.app.db.models.User.encryptPassword(req.body.newPassword, function(err, hash) {
      if (err) {
        return workflow.emit('exception', err);
      }

      var fieldsToSet = { password: hash };
      req.app.db.models.User.findByIdAndUpdate(req.user.id, fieldsToSet, function(err, user) {
        if (err) {
          return workflow.emit('exception', err);
        }

        user.populate('roles.admin roles.student', 'name.full', function(err, user) {
          if (err) {
            return workflow.emit('exception', err);
          }

          workflow.outcome.newPassword = '';
          workflow.outcome.confirm = '';
          workflow.emit('response');
        });
      });
    });
  });

  workflow.emit('validate');
};
