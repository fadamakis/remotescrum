FlowRouter.route('/retrospective/:_id', {
    name: 'sprint.show',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "board", header: "header", footer: "boardFooter"});
    }
});

FlowRouter.route('/sprints', {
    action: function() {
        if(Meteor.userId()) {
            BlazeLayout.render("mainLayout", {content: "sprints", header: "header"});
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
