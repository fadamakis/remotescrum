import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Retros = new Mongo.Collection("Retros");

if (Meteor.isServer) {
    Meteor.publish( 'retros', () => {
        return Retros.find({});
    });
    Meteor.publish( 'currentRetro', (id) => {
        return Retros.find({_id: id});
    });
}

Meteor.methods({
    'retros.insert'(title) {
        check(title, String);
        Retros.insert({
            title,
            createdAt: new Date(),
            owner: 'me',
        });
    }
});
