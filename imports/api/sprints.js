import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Notes } from '/imports/api/notes.js';

export const Sprints = new Mongo.Collection("Sprints");

Meteor.methods({
    'sprints.insert'(title) {
        check(title, String);
        Sprints.insert({
            title,
            createdAt: new Date(),
            owner: Meteor.userId(),
        });
    },
    'sprints.update'(sprint, newText) {
        check(sprint, Object);
        check(newText, String);
        sprint.title = newText;
        check(this.userId, sprint.owner);
        Sprints.update({ '_id': sprint._id }, sprint);
    },
    'sprints.remove'(sprint) {
        check(sprint, Object);
        check(this.userId, sprint.owner);
        Notes.remove({sprintId: sprint._id});
        Sprints.remove(sprint._id);
    }
});
