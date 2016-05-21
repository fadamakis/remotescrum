import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Lists = new Mongo.Collection("Lists");

Meteor.methods({
    'lists.insert'(id, text) {
        check(text, String);
        Lists.update(id , {
            $push: {
                items: {
                    "name": text,
                    "owner" : "me",
                    "votes" : 1,
                    "voted" : true
                }
            },
        });
    },
    'lists.remove'(categoryId, item) {
        Lists.update({ _id: categoryId },
            {
                $pull : {items : item}
            }
        );
    },
    'lists.vote'(categoryId, item) {
        if(!item.voted){
            item.votes++;
            item.voted = true;
        } else {
            item.votes--;
            item.voted = false;
        }
        Lists.update({
            '_id': categoryId,
            'items.name': item.name
        },
            {
                $set : {
                    'items.$' : item
                }
            }
        );
    },
    'lists.update'(categoryId, item, oldItemName) {
        Lists.update({
            '_id': categoryId,
            'items.name': oldItemName
        },
            {
                $set : {
                    'items.$' : item
                }
            }
        );
    }
});
