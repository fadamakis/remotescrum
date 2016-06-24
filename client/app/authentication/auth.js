Template.loginModal.events({
    'click .register-link' : function(e, t){
        $('#login-modal').modal('hide');
        $('#register-modal').modal('show');
    },
    'submit .login-form' : function(e, t){
        e.preventDefault();
        var email = t.find('#login-email').value.trim(),
        password = t.find('#login-password').value.trim();
        Meteor.loginWithPassword(email, password, function(err){
            if (err) {
                $.bootstrapGrowl(err.reason, {
                    type: 'danger',
                });
            } else {
                $('#login-modal').modal('hide');
                localStorage.setItem('username', Meteor.user().profile.fullname);
                FlowRouter.go("/retros");
            }
        });
    }
});

Template.registerModal.events({
    'click .login-link' : function(e, t){
        $('#register-modal').modal('hide');
        $('#login-modal').modal('show');
    },
    'submit .register-form' : function(e, t){
        e.preventDefault();
        var email = t.find('#register-email').value.trim(),
        password = t.find('#register-password').value.trim(),
        fullname = t.find('#fullname').value.trim();
        if(!fullname) {
            $.bootstrapGrowl('Please add your name.', {
                type: 'danger',
            });
            return;
        }
        Accounts.createUser({
            email: email,
            password : password,
            profile: {
                fullname,
            }
        }, function(err){
            if (err) {
                $.bootstrapGrowl(err.reason, {
                    type: 'danger',
                });
            } else {
                localStorage.setItem('username', fullname);
                FlowRouter.go("/retros");
                $('#register-modal').modal('hide');
            }
        });
    }
});

Template.mainLayout.events({
    'click .logout' : function(e, t){
        e.preventDefault();
        Meteor.logout(function(err) {
            Session.set("username", null);
            FlowRouter.go("/");
        });
    }
});
