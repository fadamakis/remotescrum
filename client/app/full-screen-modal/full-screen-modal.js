import { Sprints } from '/imports/api/sprints.js';

Template.fullScreenModal.onCreated( function() {
    var self = this;
    self.autorun(function() {
        let sprintId = FlowRouter.getParam('_id');
        self.subscribe('currentSprint', sprintId);
    });
});

Template.fullScreenModal.helpers({
    sprint() {
        return Sprints.findOne({});
    },
    shouldShowUsernamePrompt() {
        return !localStorage.getItem('username');
    }
});

Template.fullScreenModal.events({
    'submit .fullScreenModalForm': function(event, templateInstance) {
        event.preventDefault();
        let username = templateInstance.find(".usernameInput").value;
        if(username){
            // truncate long usernames
            if(username.length > 12){
                username = username.substring(0, 10) + '...';
            }
            localStorage.setItem('username', username);
            $('#fullScreenModal').removeClass('in');
            setTimeout(function(){
                 $('#fullScreenModal').removeClass('show');
            }, 150);
            if(FlowRouter.current().route.name === "sprint.plan"){
                let sprintId = FlowRouter.getParam('_id');
                Meteor.call('participants.insert', sprintId, username);
            }
        }
    }
});
