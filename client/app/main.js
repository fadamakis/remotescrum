import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Lists } from '/imports/api/lists.js';
import './main.html';

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });
//
// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });

Template.lists.events({
    'keyup input'(event, instance) {
        event.preventDefault();
        if(event.which === 13){
            let categoryId = this._id;
            let text = event.target.value;
            Meteor.call('lists.insert', categoryId, text);
            event.target.value = '';
        }
    },
    'click .well': function(e) {
        e.preventDefault();
        Session.set("selectedCategory", e.target.attributes['category-id'].value);
        Session.set("selectedItem", this);
        $('#modal').modal('show');
    },

    'click #voteItem': function(e) {
        e.stopPropagation();
        let id = e.target.attributes['category-id'].value;
        Meteor.call('lists.vote', id, this);
    }



});

Template.lists.helpers({
    lists() {
        return Lists.find({});
    }
});

Template.modalTemplate.helpers({
    session(input) {
        return Session.get('selectedItem')[input];
    }
});

Template.modalTemplate.events({
    'click .saveItem': function(e) {
        e.stopPropagation();
        let category = Session.get('selectedCategory');
        let item = Session.get('selectedItem');
        let oldItemName = item.name;
        let newVal = template.find("textarea").value;
        item.name = newVal;
        Meteor.call('lists.update', category, item, oldItemName);
        $('#modal').modal('hide');
    },
    'click .deleteItem': function(e) {
        e.stopPropagation();
        let category = Session.get('selectedCategory');
        let item = Session.get('selectedItem');
        Meteor.call('lists.remove', category, item);
        $('#modal').modal('hide');
    }
});
