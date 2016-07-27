import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Sprints } from '/imports/api/sprints.js';

let selectedSprint = new ReactiveVar();

Template.sprints.onCreated( () => {
    let template = Template.instance();
    template.subscribe('sprints');
});

Template.sprints.events({
    'click .createSprint'(event) {
        event.preventDefault();
        $('#sprintModal').modal('show');
    },
    'click .sprint-edit'(event, templateInstance) {
        event.preventDefault();
        selectedSprint.set(this);
        $('#sprintModalEdit').modal('show');
    },
    'click .saveSprint'(event, templateInstance) {
        event.stopPropagation();
        let title = templateInstance.find("textarea").value.trim();
        if(!title) return;
        Meteor.call('sprints.insert', title);
        templateInstance.find("textarea").value = '';
        $('#sprintModal').modal('hide');
    }
});

Template.sprintModalEdit.events({
    'click .updateSprint'(event, templateInstance) {
        event.stopPropagation();
        let title = templateInstance.find("textarea").value.trim();
        if(!title) return;
        let sprint = selectedSprint.get();
        Meteor.call('sprints.update', sprint, title);
        $('#sprintModalEdit').modal('hide');
    },
    'click .deleteSprint': function(event) {
        event.stopPropagation();
        let sprint = selectedSprint.get();
        Meteor.call('sprints.remove', sprint);
        $('#sprintModalEdit').modal('hide');
    }
});

Template.sprints.helpers({
    sprints() {
        return Sprints.find({}, {sort: {createdAt: -1}});
    }
});

Template.sprintModalEdit.helpers({
    selectedSprint() {
        return selectedSprint.get();
    }
});
