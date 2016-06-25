import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Retros } from '/imports/api/retros.js';

let selectedRetro = new ReactiveVar();

Template.retros.onCreated( () => {
    let template = Template.instance();
    template.subscribe('retros');
});

Template.retros.events({
    'click .createRetro': function(event){
        event.preventDefault();
        $('#retroModal').modal('show');
    },
    'click .retro-edit': function(event, templateInstance) {
        event.preventDefault();
        selectedRetro.set(this);
        $('#retroModalEdit').modal('show');
    },
    'click .saveRetro'(event, templateInstance) {
        event.stopPropagation();
        let title = templateInstance.find("textarea").value.trim();
        if(!title) return;
        Meteor.call('retros.insert', title);
        templateInstance.find("textarea").value = '';
        $('#retroModal').modal('hide');
    }
});

Template.retroModalEdit.events({
    'click .updateRetro'(event, templateInstance) {
        event.stopPropagation();
        let title = templateInstance.find("textarea").value.trim();
        if(!title) return;
        let retro = selectedRetro.get();
        Meteor.call('retros.update', retro, title);
        templateInstance.find("textarea").value = '';
        $('#retroModalEdit').modal('hide');
    },
    'click .deleteRetro': function(event) {
        event.stopPropagation();
        let retro = selectedRetro.get();
        Meteor.call('retros.remove', retro);
        $('#retroModalEdit').modal('hide');
    }
});

Template.retros.helpers({
    retros() {
        return Retros.find({}, {sort: {createdAt: -1}});
    }
});

Template.retroModalEdit.helpers({
    selectedRetro() {
        return selectedRetro.get();
    }
});
