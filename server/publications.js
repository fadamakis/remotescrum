import { Meteor } from 'meteor/meteor';
import { Retros } from '/imports/api/retros.js';
import { Notes } from '/imports/api/notes.js';
import { Categories } from '/imports/api/categories.js';

Meteor.publish( 'retros', function() {
    return Retros.find({ owner: this.userId });
});

Meteor.publish( 'currentRetro', function(id) {
    return Retros.find({_id: id});
});

Meteor.publish( 'notes', function() {
    return Notes.find({});
});

Meteor.publish( 'categories', function() {
    return Categories.find({});
});
