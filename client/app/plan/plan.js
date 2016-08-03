import { Stories } from '/imports/api/stories.js';
import { Sprints } from '/imports/api/sprints.js';
import { Participants } from '/imports/api/participants.js';
import { ReactiveVar } from 'meteor/reactive-var';

Template.stories.events({
    'click .removeStory' (event, templateInstance){
        Meteor.call('stories.remove', this);
    },
    'click .setActiveStory' (event, templateInstance){
        Meteor.call('stories.setActive', this);
    }
});

Template.stories.helpers({
    stories(tab) {
        switch (tab) {
            case 'remaining':
                return Stories.find({estimation:{"$exists":false}});
            case 'completed':
                return Stories.find({estimation:{"$exists":true}});
            default:
                return Stories.find({});
        }
    },
    getStatusClass(status) {
        switch (status) {
            case 'active':
                return 'success';
            default:
                return 'pending';
        }
    }
});

Template.plan.helpers({
    storiesCount(tab) {
        switch (tab) {
            case 'remaining':
                return Stories.find({estimation:{"$exists":false}}).count();
            case 'completed':
                return Stories.find({estimation:{"$exists":true}}).count();
            default:
                return Stories.find({}).count();
        }
    },
    sprint() {
        return Sprints.find({});
    },
    participants() {
        return Participants.find({});
    },
    allVoted() {
        return !Participants.find({ voteStatus: 'pending' }).count();
    },
    calculateEstimation() {
        let estimation = 0;

        let participants = Participants.find({ voteStatus:"voted" });

        participants.map(function(participant) {
            estimation += participant.vote;
        });

        return Math.round(estimation / participants.count());
    },
    currentStory() {
        return Stories.findOne({ status: 'active'});
    },
    votes() {
        let votes = [
            {
                display: '0',
                value: 0
            },
            {
                display: '1',
                value: 1
            },
            {
                display: '2',
                value: 2
            },
            {
                display: '3',
                value: 3
            },
            {
                display: '5',
                value: 5
            }
        ];
        return votes;
    }
});

Template.plan.events({
    'submit .addStoryForm' (event, templateInstance) {
        event.preventDefault();
        let input = templateInstance.find("#storyTitle");
        let title = input.value.trim();
        if (!title) return;
        let sprintId = FlowRouter.getParam('_id');
        Meteor.call('stories.insert', sprintId, title);
        input.value = '';
    },
    'click .voteStory' (event, templateInstance) {
        event.preventDefault();
        let vote = this.value;
        let username = localStorage.getItem('username') || 'anonymous';
        let sprintId = FlowRouter.getParam('_id');
        Meteor.call('participants.vote', sprintId, username, vote);

    },
    'click .nextStory' (event, templateInstance) {
        event.preventDefault();
        Meteor.call('stories.next');
    },
    'click .kickParticipant' (event, templateInstance) {
        event.preventDefault();
        let username = this.username;
        let sprintId = FlowRouter.getParam('_id');
        Meteor.call('participants.kick', sprintId, username);
    },
    'click .flipCards' (event, templateInstance) {
        event.preventDefault();
        let sprintId = FlowRouter.getParam('_id');
        Meteor.call('participants.flipCards', sprintId);
    },
    'click .resetVotes' (event, templateInstance) {
        event.preventDefault();
        let sprintId = FlowRouter.getParam('_id');
        Meteor.call('participants.resetVotes', sprintId);
    }
});

Template.plan.onCreated( function() {
    let template = Template.instance();
    var self = this;
    let username = localStorage.getItem('username') || 'anonymous';
    let sprintId = FlowRouter.getParam('_id');
    Meteor.call('participants.insert', sprintId, username);
    self.autorun(function() {
        let sprintId = FlowRouter.getParam('_id');
        self.subscribe('currentSprint', sprintId);
        self.subscribe('stories', sprintId);
        self.subscribe('participants', sprintId);
    });
});
