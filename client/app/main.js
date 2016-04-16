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
            let category = event.target.attributes['data-id'].value;
            let text = event.target.value;
            Lists.update(this._id , {
                $push: {
                    items: {
                        "name": text,
                        "owner" : "me",
                        "votes" : 0
                    }
                },
            });
            event.target.value = '';
        }
    },
    'click .delete-item'(e) {
        e.stopPropagation();
        let id = e.target.attributes['category-id'].value;
        Lists.update({ _id: id },
            {
                $pull : {items : this}
            }
        );
    },
    'click .well': function(e) {
        e.preventDefault();

        $('#modal').modal('show');
    }


});

Template.lists.helpers({
    lists() {
        return Lists.find({});
    }
});
