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
    'stories.update'(story, title, estimation) {
        check(story, Object);
        check(title, String);
        check(estimation, String);
        let voteStatus = 'voted';
        if(isNaN(parseInt(estimation))){
            estimation = null;
            voteStatus = 'pending';
        }
        Stories.update({
            '_id': story._id
        }, {
            $set: {
                title,
                estimation,
                voteStatus
            }
        });
    },
    'stories.remove'(story) {
        check(story, Object);
        Stories.remove(story._id);
    },
    'stories.estimate'(sprintId, estimation) {
        check(sprintId, String);

        Stories.update({
            status: 'active',
            sprintId
        }, {
            $set: {
                estimation
            }
        });
    },
    'stories.setActive'(story) {
        check(story, Object);
        let activeStory = Stories.findOne({status: 'active'});
        let activeStoryStatus;
        if(activeStory.estimation) {
            activeStoryStatus = 'completed';
        } else {
            activeStoryStatus = 'pending';
        }
        Stories.update({
            _id: activeStory._id
        }, {
            $set: {
                status: activeStoryStatus
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
