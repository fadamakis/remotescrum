import { Meteor } from 'meteor/meteor';
import { Sprints } from '/imports/api/sprints.js';
import { Notes } from '/imports/api/notes.js';
import { check } from 'meteor/check';

Meteor.publish( 'sprints', function() {
    return Sprints.find({ owner: this.userId }, {sort: {createdAt: -1}});
});

Meteor.publish( 'currentSprint', function(id) {
    check(id, String);
    return Sprints.find({_id: id});
});

Meteor.publish( 'notes', function(id) {
    check(id, String);
    return Notes.find({sprintId : id});
});
