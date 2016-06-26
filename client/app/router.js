FlowRouter.route('/retrospective/:_id', {
    name: 'retro.show',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "board", footer: "boardFooter"});
    }
});

FlowRouter.route('/retrospectives', {
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
        BlazeLayout.render("mainLayout", {content: "landing", footer: "landingFooter"});
    }
});
