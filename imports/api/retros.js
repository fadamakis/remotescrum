import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Retros = new Mongo.Collection("Retros");

Meteor.methods({
    'retros.insert'(title) {
        check(title, String);
        Retros.insert({
            title,
            createdAt: new Date(),
            owner: Meteor.userId(),
        });
    },
    'retros.update'(retro, newText) {
        check(retro, Object);
        check(newText, String);
        retro.title = newText;
        check(this.userId, retro.owner);
        Retros.update({ '_id': retro._id }, retro);
    },
    'retros.remove'(retro) {
        check(retro, Object);
        check(this.userId, retro.owner);
        Retros.remove(retro._id);
    },
});
