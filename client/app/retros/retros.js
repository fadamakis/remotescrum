import { Template } from 'meteor/templating';
import { Retros } from '/imports/api/retros.js';

Template.retros.onCreated( () => {
    let template = Template.instance();
    template.subscribe('retros');
});

Template.retros.events({
    'click .createRetro': function(event){
        event.preventDefault();
        $('#retroModal').modal('show');
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

Template.retros.helpers({
    retros() {
        return Retros.find({});
    }
});
