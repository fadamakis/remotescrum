import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Participants } from '/imports/api/participants.js';

export const Stories = new Mongo.Collection("Stories");

Meteor.methods({
    'stories.insert'(sprintId, title) {
        check(sprintId, String);
        check(title, String);

        let lastStory = Stories.findOne({
            sprintId
        }, {
            sort: {
                weight: -1
            }
        });

        let weight = lastStory && lastStory.weight || 0;
        weight++;

        Stories.insert({
            title,
            sprintId,
            status: 'pending',
            weight,
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
        } else {
            estimation = parseInt(estimation);
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
        check(estimation, Number);

        Stories.update({
            status: 'active',
            sprintId
        }, {
            $set: {
                estimation
            }
        });
    },
    'stories.rank'(storyId, newWeight) {
        check(storyId, String);
        check(newWeight, Number);

        Stories.update({
            _id: storyId
        }, {
            $set: {
                weight: newWeight
            }
        });
    },
    'stories.setActive'(story) {
        check(story, Object);
        let activeStory = Stories.findOne({
                status: 'active'
            }, {
                sort: {
                    weight: -1
                }
            });

        if(activeStory){
            let activeStoryStatus;
            if(activeStory.estimation) {
                activeStoryStatus = 'voted';
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
        }


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
    'stories.next'(sprintId) {
        check(sprintId, String);
        Stories.update({
            sprintId,
            status: 'active'
        }, {
            $set: {
                status: 'voted'
            }
        });

        let story = Stories.findOne({
            sprintId,
            status: 'pending'
        }, {
            sort: {
                weight: 1
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
            sprintId,
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
