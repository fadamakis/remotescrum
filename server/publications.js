import { Meteor } from 'meteor/meteor';
import { Sprints } from '/imports/api/sprints.js';
import { Notes } from '/imports/api/notes.js';
import { Stories } from '/imports/api/stories.js';
import { Participants } from '/imports/api/participants.js';
import { check } from 'meteor/check';

Meteor.publish('sprints', function() {
    return Sprints.find({ owner: this.userId }, {sort: {createdAt: -1}});
});

Meteor.publish('currentSprint', function(id) {
    check(id, String);
    return Sprints.find({_id: id});
});

Meteor.publish('notes', function(id) {
    check(id, String);
    return Notes.find({sprintId : id});
});

Meteor.publish('stories', function(id) {
    check(id, String);
    return Stories.find({sprintId : id});
});

Meteor.publish('participants', function(id) {
    check(id, String);
    return Participants.find({sprintId : id});
});
