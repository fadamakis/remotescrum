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
                username,
                voteStatus: 'pending',
                vote: null,
            }
        });

    },
    'participants.vote'(sprintId, username, vote) {
        check(vote, Number);
        check(username, String);
        check(sprintId, String);
        Participants.update({
            username,
            sprintId
        }, {
          $set: {
              voteStatus: "voted",
              vote: vote
          },
        });
    },
    'participants.resetVotes'(sprintId) {
        check(sprintId, String);
        Participants.update({
            sprintId
        }, {
          $set: {
              voteStatus: "pending",
              vote: null,
          },
      }, {
          multi: true
      });
    },
    'participants.flipCards'(sprintId) {
        check(sprintId, String);
        Participants.update({
            sprintId,
            voteStatus: "pending",
        }, {
          $set: {
              voteStatus: "pass",
              vote: '-',
          },
        }, {
            multi: true
        });
    },
    'participants.kick'(sprintId, username) {
        check(username, String);
        check(sprintId, String);
        Participants.remove({
            username,
            sprintId
        });
    }
});
