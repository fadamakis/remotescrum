FlowRouter.route('/retro/:_id', {
    name: 'retro.show',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "board"});
    }
});

FlowRouter.route('/retros', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "retros"});
    }
});

FlowRouter.route('/', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "landing"});
    }
});
