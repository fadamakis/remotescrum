import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Participants = new Mongo.Collection("Participants");

Meteor.methods({
    'participants.insert'(sprintId, username) {
        check(sprintId, String);
        check(username, String);
        Participants.upsert({
            sprintId,
            username
        }, {
            $set: {
                sprintId,
                username
            }
        });

    },
    'participants.vote'(username, vote) {
        check(vote, Number);
        check(username, String);
        Participants.update({username: username}, {
          $set: {
              voteStatus: "voted",
              vote: vote
          },
        });
    }
});
