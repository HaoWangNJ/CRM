'use strict';

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.set('X-Auth-Required', 'true');
  req.session.returnUrl = req.originalUrl;
  res.redirect('/login/');
}

function ensureAdmin(req, res, next) {
  if (req.user.canPlayRoleOf('admin')) {
    return next();
  }
  res.redirect('/');
}

function ensureStudent(req, res, next) {
  if (req.user.canPlayRoleOf('student')) {
    if (req.app.config.requireAccountVerification) {
      if (req.user.roles.student.isVerified !== 'yes' && !/^\/account\/verification\//.test(req.url)) {
        return res.redirect('/student/verification/');
      }
    }
    return next();
  }
  res.redirect('/');
}

function ensureTeacher(req, res, next) {
  if (req.user.canPlayRoleOf('teacher')) {
    return next();
  }
  res.redirect('/');
}

var exports;
exports = module.exports = function(app, passport) {
  //front end
  app.get('/', require('./views/index').init);
  app.get('/about/', require('./views/about/index').init);
  app.get('/contact/', require('./views/contact/index').init);
  app.post('/contact/', require('./views/contact/index').sendMessage);

  //sign up
  app.get('/signup/', require('./views/signup/index').init);
  app.post('/signup/', require('./views/signup/index').signup);

  //course
  app.get('/course/', require('./views/course/index').init);

  // teacher sign up
  app.get('/teachersignup/', require('./views/teachersignup/index').init);
  app.post('/teachersignup/', require('./views/teachersignup/index').teachersignup);

  //social sign up
  app.post('/signup/social/', require('./views/signup/index').signupSocial);
  app.get('/signup/twitter/', passport.authenticate('twitter', { callbackURL: '/signup/twitter/callback/' }));
  app.get('/signup/twitter/callback/', require('./views/signup/index').signupTwitter);
  app.get('/signup/github/', passport.authenticate('github', { callbackURL: '/signup/github/callback/', scope: ['user:email'] }));
  app.get('/signup/github/callback/', require('./views/signup/index').signupGitHub);
  app.get('/signup/facebook/', passport.authenticate('facebook', { callbackURL: '/signup/facebook/callback/', scope: ['email'] }));
  app.get('/signup/facebook/callback/', require('./views/signup/index').signupFacebook);
  app.get('/signup/google/', passport.authenticate('google', { callbackURL: '/signup/google/callback/', scope: ['profile email'] }));
  app.get('/signup/google/callback/', require('./views/signup/index').signupGoogle);
  app.get('/signup/tumblr/', passport.authenticate('tumblr', { callbackURL: '/signup/tumblr/callback/' }));
  app.get('/signup/tumblr/callback/', require('./views/signup/index').signupTumblr);

  //login/out
  app.get('/login/', require('./views/login/index').init);
  app.post('/login/', require('./views/login/index').login);
  app.get('/login/forgot/', require('./views/login/forgot/index').init);
  app.post('/login/forgot/', require('./views/login/forgot/index').send);
  app.get('/login/reset/', require('./views/login/reset/index').init);
  app.get('/login/reset/:email/:token/', require('./views/login/reset/index').init);
  app.put('/login/reset/:email/:token/', require('./views/login/reset/index').set);
  app.get('/logout/', require('./views/logout/index').init);

  //social login
  app.get('/login/twitter/', passport.authenticate('twitter', { callbackURL: '/login/twitter/callback/' }));
  app.get('/login/twitter/callback/', require('./views/login/index').loginTwitter);
  app.get('/login/github/', passport.authenticate('github', { callbackURL: '/login/github/callback/' }));
  app.get('/login/github/callback/', require('./views/login/index').loginGitHub);
  app.get('/login/facebook/', passport.authenticate('facebook', { callbackURL: '/login/facebook/callback/' }));
  app.get('/login/facebook/callback/', require('./views/login/index').loginFacebook);
  app.get('/login/google/', passport.authenticate('google', { callbackURL: '/login/google/callback/', scope: ['profile email'] }));
  app.get('/login/google/callback/', require('./views/login/index').loginGoogle);
  app.get('/login/tumblr/', passport.authenticate('tumblr', { callbackURL: '/login/tumblr/callback/', scope: ['profile email'] }));
  app.get('/login/tumblr/callback/', require('./views/login/index').loginTumblr);

  //admin
  app.all('/admin*', ensureAuthenticated);
  app.all('/admin*', ensureAdmin);
  app.get('/admin/', require('./views/admin/index').init);

  //admin > users
  app.get('/admin/users/', require('./views/admin/users/index').find);
  app.post('/admin/users/', require('./views/admin/users/index').create);
  app.get('/admin/users/:id/', require('./views/admin/users/index').read);
  app.put('/admin/users/:id/', require('./views/admin/users/index').update);
  app.put('/admin/users/:id/password/', require('./views/admin/users/index').password);
  app.put('/admin/users/:id/role-admin/', require('./views/admin/users/index').linkAdmin);
  app.delete('/admin/users/:id/role-admin/', require('./views/admin/users/index').unlinkAdmin);
  app.put('/admin/users/:id/role-student/', require('./views/admin/users/index').linkAccount);
  app.delete('/admin/users/:id/role-student/', require('./views/admin/users/index').unlinkAccount);
  app.delete('/admin/users/:id/', require('./views/admin/users/index').delete);

  //admin > administrators
  app.get('/admin/administrators/', require('./views/admin/administrators/index').find);
  app.post('/admin/administrators/', require('./views/admin/administrators/index').create);
  app.get('/admin/administrators/:id/', require('./views/admin/administrators/index').read);
  app.put('/admin/administrators/:id/', require('./views/admin/administrators/index').update);
  app.put('/admin/administrators/:id/permissions/', require('./views/admin/administrators/index').permissions);
  app.put('/admin/administrators/:id/groups/', require('./views/admin/administrators/index').groups);
  app.put('/admin/administrators/:id/user/', require('./views/admin/administrators/index').linkUser);
  app.delete('/admin/administrators/:id/user/', require('./views/admin/administrators/index').unlinkUser);
  app.delete('/admin/administrators/:id/', require('./views/admin/administrators/index').delete);

  //admin > admin groups
  app.get('/admin/admin-groups/', require('./views/admin/admin-groups/index').find);
  app.post('/admin/admin-groups/', require('./views/admin/admin-groups/index').create);
  app.get('/admin/admin-groups/:id/', require('./views/admin/admin-groups/index').read);
  app.put('/admin/admin-groups/:id/', require('./views/admin/admin-groups/index').update);
  app.put('/admin/admin-groups/:id/permissions/', require('./views/admin/admin-groups/index').permissions);
  app.delete('/admin/admin-groups/:id/', require('./views/admin/admin-groups/index').delete);

  //admin > students
  app.get('/admin/students/', require('./views/admin/students/index').find);
  app.post('/admin/students/', require('./views/admin/students/index').create);
  app.get('/admin/students/:id/', require('./views/admin/students/index').read);
  app.put('/admin/students/:id/', require('./views/admin/students/index').update);
  app.put('/admin/students/:id/user/', require('./views/admin/students/index').linkUser);
  app.delete('/admin/students/:id/user/', require('./views/admin/students/index').unlinkUser);
  app.post('/admin/students/:id/notes/', require('./views/admin/students/index').newNote);
  app.post('/admin/students/:id/status/', require('./views/admin/students/index').newStatus);
  app.delete('/admin/students/:id/', require('./views/admin/students/index').delete);

  //admin > statuses
  app.get('/admin/statuses/', require('./views/admin/statuses/index').find);
  app.post('/admin/statuses/', require('./views/admin/statuses/index').create);
  app.get('/admin/statuses/:id/', require('./views/admin/statuses/index').read);
  app.put('/admin/statuses/:id/', require('./views/admin/statuses/index').update);
  app.delete('/admin/statuses/:id/', require('./views/admin/statuses/index').delete);

  //admin > categories
  app.get('/admin/categories/', require('./views/admin/categories/index').find);
  app.post('/admin/categories/', require('./views/admin/categories/index').create);
  app.get('/admin/categories/:id/', require('./views/admin/categories/index').read);
  app.put('/admin/categories/:id/', require('./views/admin/categories/index').update);
  app.delete('/admin/categories/:id/', require('./views/admin/categories/index').delete);

  //admin > search
  app.get('/admin/search/', require('./views/admin/search/index').find);

  //student
  app.all('/student*', ensureAuthenticated);
  app.all('/student*', ensureStudent);
  app.get('/student/', require('./views/student/index').init);

  //student > verification
  app.get('/student/verification/', require('./views/student/verification/index').init);
  app.post('/student/verification/', require('./views/student/verification/index').resendVerification);
  app.get('/student/verification/:token/', require('./views/student/verification/index').verify);

  //student > settings
  app.get('/student/settings/', require('./views/student/settings/index').init);
  app.put('/student/settings/', require('./views/student/settings/index').update);
  app.put('/student/settings/identity/', require('./views/student/settings/index').identity);
  app.put('/student/settings/password/', require('./views/student/settings/index').password);

  //student > settings > social
  app.get('/student/settings/twitter/', passport.authenticate('twitter', { callbackURL: '/student/settings/twitter/callback/' }));
  app.get('/student/settings/twitter/callback/', require('./views/student/settings/index').connectTwitter);
  app.get('/student/settings/twitter/disconnect/', require('./views/student/settings/index').disconnectTwitter);
  app.get('/student/settings/github/', passport.authenticate('github', { callbackURL: '/student/settings/github/callback/' }));
  app.get('/student/settings/github/callback/', require('./views/student/settings/index').connectGitHub);
  app.get('/student/settings/github/disconnect/', require('./views/student/settings/index').disconnectGitHub);
  app.get('/student/settings/facebook/', passport.authenticate('facebook', { callbackURL: '/student/settings/facebook/callback/' }));
  app.get('/student/settings/facebook/callback/', require('./views/student/settings/index').connectFacebook);
  app.get('/student/settings/facebook/disconnect/', require('./views/student/settings/index').disconnectFacebook);
  app.get('/student/settings/google/', passport.authenticate('google', { callbackURL: '/student/settings/google/callback/', scope: ['profile email'] }));
  app.get('/student/settings/google/callback/', require('./views/student/settings/index').connectGoogle);
  app.get('/student/settings/google/disconnect/', require('./views/student/settings/index').disconnectGoogle);
  app.get('/student/settings/tumblr/', passport.authenticate('tumblr', { callbackURL: '/student/settings/tumblr/callback/' }));
  app.get('/student/settings/tumblr/callback/', require('./views/student/settings/index').connectTumblr);
  app.get('/student/settings/tumblr/disconnect/', require('./views/student/settings/index').disconnectTumblr);

  //teacher
  app.all('/teacher*', ensureAuthenticated);
  app.all('/teacher*', ensureTeacher);
  app.get('/teacher/', require('./views/teacher/index').init);

  //route not found
  app.all('*', require('./views/http/index').http404);
};
