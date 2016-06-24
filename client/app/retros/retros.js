import { Template } from 'meteor/templating';
import { Retros } from '/imports/api/retros.js';


Template.retros.onCreated( () => {
    let template = Template.instance();
    template.subscribe('retros');
});

Template.retros.events({
    'click .createRetro': function(e){
        e.preventDefault();
        $('#retroModal').modal('show');
    },
    'click .saveRetro'(e, template) {
        e.stopPropagation();
        let title = template.find("textarea").value.trim();
        if(!title) return;
        Meteor.call('retros.insert', title);
        template.find("textarea").value = '';
        $('#retroModal').modal('hide');
    }
});


Template.retros.helpers({
    retros() {
        return Retros.find({});
    }
});
