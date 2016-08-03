import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Participants } from '/imports/api/participants.js';

export const Stories = new Mongo.Collection("Stories");

Meteor.methods({
    'stories.insert'(sprintId, title) {
        check(sprintId, String);
        check(title, String);
        Stories.insert({
            title,
            sprintId,
            status: 'pending',
            createdAt: new Date()
        });
    },
    'stories.remove'(story) {
        check(story, Object);
        Stories.remove(story._id);
    },
    'stories.setActive'(story) {
        check(story, Object);
        Stories.update({
            status: 'active'
        }, {
            // TODO if it has estimation we have to make it completed
            $set: {
                status: 'pending'
            }
        });

        Stories.update({
            _id: story._id
        }, {
            $set: {
                status: 'active'
            }
        });

        Participants.update({
            voteStatus: 'voted'
        },{
            $set: {
                voteStatus: 'pending'
            }
        },{
            multi: true
        });

    },
    'stories.next'() {
        Stories.update({
            status: 'active'
        }, {
            $set: {
                status: 'voted'
            }
        });

        Stories.update({
            status: 'pending'
        }, {
            $set: {
                status: 'active'
            }
        });

        Participants.update({
            voteStatus: 'voted'
        },{
            $set: {
                voteStatus: 'pending'
            }
        },{
            multi: true
        });
    }
});
