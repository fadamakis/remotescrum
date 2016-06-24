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
    }
});
