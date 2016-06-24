import { Meteor } from 'meteor/meteor';
import { Retros } from '/imports/api/retros.js';
import { Notes } from '/imports/api/notes.js';
import { Categories } from '/imports/api/categories.js';
import { check } from 'meteor/check';

Meteor.publish( 'retros', function() {
    return Retros.find({ owner: this.userId }, {sort: {createdAt: -1}});
});

Meteor.publish( 'currentRetro', function(id) {
    check(id, String);
    return Retros.find({_id: id});
});

Meteor.publish( 'notes', function() {
    return Notes.find({});
});

Meteor.publish( 'categories', function() {
    return Categories.find({});
});
