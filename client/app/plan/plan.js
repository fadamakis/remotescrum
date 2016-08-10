import { Stories } from '/imports/api/stories.js';
import { Sprints } from '/imports/api/sprints.js';
import { Participants } from '/imports/api/participants.js';
import { ReactiveVar } from 'meteor/reactive-var';

let currentEstimation = new ReactiveVar();
let modalStory = new ReactiveVar();

Template.stories.events({
    'click .removeStory' (event, templateInstance){
        Meteor.call('stories.remove', this);
    },
    'click .setActiveStory' (event, templateInstance){
        Meteor.call('stories.setActive', this);
    },
    'click .editStory': function(event) {
        event.preventDefault();
        modalStory.set(this);
        $('#editStory').modal('show');
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
        let pendingVotes = Participants.find({ voteStatus: 'pending' }).count();
        if(!pendingVotes){
            let estimation = calculateEstimation();
            currentEstimation.set(estimation);
            let sprintId = FlowRouter.getParam('_id');
            Meteor.call('stories.estimate', sprintId, estimation);
        }
        return !pendingVotes;
    },
    getEstimation() {
        return currentEstimation.get();
    },
    currentStory() {
        return Stories.findOne({ status: 'active'});
    },
    votes() {
        return votes;
    }
});

function calculateEstimation(){
    let estimation = 0;
    let participants = Participants.find({ voteStatus:"voted" });

    participants.map(function(participant) {
        estimation += participant.vote;
    });

    estimation = Math.round(estimation / participants.count());

    for (vote of votes) {
        if(vote.value >= estimation) {
            return vote.value;
        }
    }
    return estimation;
}

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
        Meteor.call('stories.next', currentEstimation);
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
    },
    'change .estimationSelect': function(event, templateInstance){
        let sprintId = FlowRouter.getParam('_id');
        let estimation = event.target.options[event.target.selectedIndex].value;
        Meteor.call('stories.estimate', sprintId, estimation);
    }
});

Template.editStory.helpers({
    modalStory() {
        return modalStory.get();
    }
});

Template.editStory.events({
    'click .saveStory': function(event, templateInstance){
        event.stopPropagation();
        let story = modalStory.get();
        let newTitle = templateInstance.find("#title").value.trim();
        let newEstimation = parseInt(templateInstance.find("#estimation").value.trim());
        if(isNaN(newEstimation)) {
            newEstimation = null;
        }
        Meteor.call('stories.update', story, newTitle, newEstimation);
        $('#editStory').modal('hide');
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
