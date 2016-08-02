import { Stories } from '/imports/api/stories.js';
import { Sprints } from '/imports/api/sprints.js';
import { Participants } from '/imports/api/participants.js';

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
        Meteor.call('participants.vote', username, vote);

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
