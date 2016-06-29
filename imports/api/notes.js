import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Notes = new Mongo.Collection("Notes");

Meteor.methods({
    'notes.insert'(categoryId, retroId, text, username) {
        check(categoryId, String);
        check(retroId, String);
        check(username, String);
        check(text, String);
        Notes.insert({
            text,
            createdAt: new Date(),
            updatedAt: null,
            categoryId,
            retroId,
            addedBy: username,
            updatedBy: null,
            voters : [username]
        });
    },
    'notes.vote'(note, user) {
        check(note, Object);
        check(user, String);
        let userPosition = note.voters.indexOf(user);
        if(userPosition > -1){
            note.voters.splice(userPosition, 1);
        } else {
            note.voters.push(user);
        }
        Notes.update({ '_id': note._id }, note);
    },
    'notes.remove'(note) {
        check(note, Object);
        Notes.remove(note._id);
    },
    'notes.update'(note, newText, username) {
        check(note, Object);
        check(newText, String);
        check(username, String);
        note.text = newText;
        note.updatedBy = username;
        note.updatedAt = new Date();
        Notes.update({ '_id': note._id }, note);
    }
});
