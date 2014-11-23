/* global app:true */

(function() {
  'use strict';

  app = app || {};

  app.TeacherSignup = Backbone.Model.extend({
    url: '/teachersignup/social/',
    defaults: {
      errors: [],
      errfor: {},
      email: ''
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
      this.model.set('email', $('#data-email').text());
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
      this.$el.find('[name="email"]').focus();
    },
    preventSubmit: function(event) {
      event.preventDefault();
    },
    teachersignupOnEnter: function(event) {
      if (event.keyCode !== 13) { return; }
      event.preventDefault();
      this.teachersignup();
    },
    teachersignup: function() {
      this.$el.find('.btn-teachersignup').attr('disabled', true);

      this.model.save({
        email: this.$el.find('[name="email"]').val()
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
