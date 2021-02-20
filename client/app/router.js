FlowRouter.route('/retrospective/:_id', {
    name: 'sprint.retro',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "board", header: "header", footer: "boardFooter"});
    }
});

FlowRouter.route('/plan/:_id', {
    name: 'sprint.plan',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "plan", header: "header", footer: "boardFooter"});
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
        BlazeLayout.render("homeLayout", {content: "landing"});
    }
});
