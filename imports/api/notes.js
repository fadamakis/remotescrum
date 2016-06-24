import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Notes = new Mongo.Collection("Notes");

Meteor.methods({
    'notes.insert'(categoryId, retroId, text, username) {
        check(username, String);
        check(text, String);

        Notes.insert({
            text,
            createdAt: new Date(),
            categoryId,
            retroId,
            owner: username,
            "votes" : 1,
            "voted" : true
        });
    },
    'notes.vote'(note) {
        if(!note.voted){
            note.votes++;
            note.voted = true;
        } else {
            note.votes--;
            note.voted = false;
        }
        Notes.update({ '_id': note._id }, note);
    },
    'notes.remove'(note) {
        Notes.remove(note._id);
    },
    'notes.update'(note, newText) {
        note.text = newText;
        Notes.update({ '_id': note._id }, note);
    }
});
