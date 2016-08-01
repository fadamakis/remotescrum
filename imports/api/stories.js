import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Stories = new Mongo.Collection("Stories");

Meteor.methods({
    'stories.insert'(sprintId, title) {
        check(sprintId, String);
        check(title, String);
        Stories.insert({
            title,
            sprintId,
            createdAt: new Date()
        });
    }
});
