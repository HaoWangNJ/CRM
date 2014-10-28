/* global app:true */

(function() {
  'use strict';

  app = app || {};

  app.TeacherSignup = Backbone.Model.extend({
    url: '/teachersignup/',
    defaults: {
      errors: [],
      errfor: {},
      username: '',
      email: '',
      password: ''
    }
  });

  app.TeacherSignupView = Backbone.View.extend({
    el: '#teachersignup',
    template: _.template( $('#tmpl-teachersignup').html() ),
    events: {
      'submit form': 'preventSubmit',
      'keypress [name="password"]': 'teachersignupOnEnter',
      'click .btn-teachersignup': 'teachersignup'
    },
    initialize: function() {
      this.model = new app.TeacherSignup();
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
      this.$el.find('[name="username"]').focus();
    },
    preventSubmit: function(event) {
      event.preventDefault();
    },
    teachersignupOnEnter: function(event) {
      if (event.keyCode !== 13) { return; }
      if ($(event.target).attr('name') !== 'password') { return; }
      event.preventDefault();
      this.teachersignup();
    },
    teachersignup: function() {
      this.$el.find('.btn-teachersignup').attr('disabled', true);

      this.model.save({
        username: this.$el.find('[name="username"]').val(),
        email: this.$el.find('[name="email"]').val(),
        password: this.$el.find('[name="password"]').val()
      },{
        success: function(model, response) {
          if (response.success) {
            location.href = '/teacher/';
          }
          else {
            model.set(response);
          }
        }
      });
    }
  });

  $(document).ready(function() {
    app.teachersignupView = new app.TeacherSignupView();
  });
}());
