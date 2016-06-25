FlowRouter.route('/retro/:_id', {
    name: 'retro.show',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "board", footer: "footer"});
    }
});

FlowRouter.route('/retros', {
    action: function() {
        if(Meteor.userId()) {
            BlazeLayout.render("mainLayout", {content: "retros"});
        } else {
            FlowRouter.go("/");
        }
    }
});

FlowRouter.route('/', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "landing"});
    }
});
