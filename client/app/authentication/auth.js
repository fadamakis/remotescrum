Template.loginModal.events({
    'click .register-link' : function(e, t){
        $('#login-modal').modal('hide');
        $('#register-modal').modal('show');
    },
    'click .btn-login' : function(e, t){
        e.preventDefault();
        var email = t.find('#login-email').value,
        password = t.find('#login-password').value;
        $('#login-modal').modal('hide');
        Meteor.loginWithPassword(email, password, function(err){
            if (err) {
                // Inform the user that account creation failed
                alert(err);
            } else {
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
    'click .btn-register' : function(e, t){
        e.preventDefault();
        var email = t.find('#register-email').value,
        password = t.find('#register-password').value,
        fullname = t.find('#fullname').value;
        Accounts.createUser({
            email: email,
            password : password,
            profile: {
                fullname,
            }
        }, function(err){
            if (err) {
                alert(err);
            } else {
                localStorage.setItem('username', fullname);
                FlowRouter.go("/retros");
                $('#register-modal').modal('hide');
            }

        });

        return false;
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
