Template.loginModal.events({
    'click .register-link' : function(event, templateInstance){
        $('#login-modal').modal('hide');
        $('#register-modal').modal('show');
    },
    'submit .login-form' : function(event, templateInstance){
        event.preventDefault();
        var email = templateInstance.find('#login-email').value.trim(),
        password = templateInstance.find('#login-password').value.trim();
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
    'click .login-link' : function(event, templateInstance){
        $('#register-modal').modal('hide');
        $('#login-modal').modal('show');
    },
    'submit .register-form' : function(event, templateInstance){
        event.preventDefault();
        var email = templateInstance.find('#register-email').value.trim(),
        password = templateInstance.find('#register-password').value.trim(),
        fullname = templateInstance.find('#fullname').value.trim();
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
                fullname
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
    'click .logout' : function(event, templateInstance){
        event.preventDefault();
        Meteor.logout(function(err) {
            localStorage.removeItem('username');
            FlowRouter.go("/");
        });
    }
});
