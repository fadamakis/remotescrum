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
            localStorage.setItem('username', username);
            $('#fullScreenModal').removeClass('in');
            setTimeout(function(){
                 $('#fullScreenModal').removeClass('show');
            }, 150);
        }
    }
});
