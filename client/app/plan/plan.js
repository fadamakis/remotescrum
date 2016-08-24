import { Stories } from '/imports/api/stories.js';
import { Sprints } from '/imports/api/sprints.js';
import { Participants } from '/imports/api/participants.js';
import { ReactiveVar } from 'meteor/reactive-var';

let currentEstimation = new ReactiveVar();
let modalStory = new ReactiveVar();

Template.stories.events({
    'click .removeStory' (event, templateInstance) {
        Meteor.call('stories.remove', this);
    },
    'click .setActiveStory' (event, templateInstance) {
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
                return Stories.find({
                    estimation: {
                        "$exists": false
                    }
                });
            case 'completed':
                return Stories.find({
                    estimation: {
                        "$exists": true
                    }
                });
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

let votes = [{
    display: '0',
    value: 0
}, {
    display: '1',
    value: 1
}, {
    display: '2',
    value: 2
}, {
    display: '3',
    value: 3
}, {
    display: '5',
    value: 5
}, {
    display: '8',
    value: 8
}, {
    display: '13',
    value: 13
}, {
    display: '21',
    value: 21
}, {
    display: '34',
    value: 34
}, {
    display: '55',
    value: 55
}, {
    display: '?',
    value: null
}, {
    display: '<img src="/coffee-icon.png" class="vote--coffee" alt="Coffee">',
    value: null
}];

Template.plan.helpers({
    isSprintOwner(userId) {
        return Sprints.findOne({}).owner === Meteor.userId();
    },
    storiesCount(tab) {
        switch (tab) {
            case 'remaining':
                return Stories.find({
                    status: {
                        $ne: 'voted'
                    }
                }).count();
            case 'completed':
                return Stories.find({
                    status: 'voted'
                }).count();
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
        let pendingVotes = Participants.find({
            voteStatus: 'pending'
        }).count();
        if (!pendingVotes) {
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
    getProgress() {
        let remaining = Stories.find({
            status: {
                $ne: 'voted'
            }
        }).count();
        let all = Stories.find().count();
        return 100 -( remaining / all * 100) + '%';
    },
    currentStory() {
        return Stories.findOne({
            status: 'active'
        });
    },
    votes() {
        return votes;
    }
});

function calculateEstimation() {
    let estimation = 0;
    let participants = Participants.find({
        voteStatus: "voted",
        vote: { $ne: null }
    });

    participants.map(function(participant) {
        estimation += participant.vote;
    });

    estimation = Math.round(estimation / participants.count());

    for (vote of votes) {
        if (vote.value >= estimation) {
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
        let username = localStorage.getItem('username');
        let sprintId = FlowRouter.getParam('_id');
        Meteor.call('participants.vote', sprintId, username, vote);

    },
    'click .nextStory' (event, templateInstance) {
        event.preventDefault();
        let sprintId = FlowRouter.getParam('_id');
        Meteor.call('stories.next', sprintId);
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
    'change .estimationSelect': function(event, templateInstance) {
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
    'click .saveStory': function(event, templateInstance) {
        event.stopPropagation();
        let story = modalStory.get();
        let newTitle = templateInstance.find("#title").value.trim();
        let newEstimation = templateInstance.find("#estimation").value.trim();
        Meteor.call('stories.update', story, newTitle, newEstimation);
        $('#editStory').modal('hide');
    }
});

Template.plan.onCreated(function() {
    let template = Template.instance();
    var self = this;
    let sprintId = FlowRouter.getParam('_id');
    let username = localStorage.getItem('username');
    if(username) {
        Meteor.call('participants.insert', sprintId, username);
    }
    self.autorun(function() {
        let sprintId = FlowRouter.getParam('_id');
        self.subscribe('currentSprint', sprintId);
        self.subscribe('stories', sprintId);
        self.subscribe('participants', sprintId);
    });
});


//Once the Template is rendered, run this function which
//  sets up JQuery UI's sortable functionality
Template.stories.onRendered(function() {
    this.$('.sortable-stories').sortable({
        handle: '.handle',
        stop: function(e, ui) {
            // get the dragged html element and the one before
            //   and after it
            el = ui.item.get(0);
            before = ui.item.prev().get(0);
            after = ui.item.next().get(0);

            if (!before) {
                //if it was dragged into the first position grab the
                // next element's data context and subtract one from the weight
                newWeight = Blaze.getData(after).weight - 1;
            } else if (!after) {
                //if it was dragged into the last position grab the
                //previous element's data context and add one to the weight
                newWeight = Blaze.getData(before).weight + 1;
            } else {
                //else take the average of the two ranks of the previous
                // and next elements
                newWeight = (Blaze.getData(after).weight + Blaze.getData(before).weight) / 2;
            }
            //update the dragged Item's weight
            Meteor.call('stories.rank', Blaze.getData(el)._id, newWeight);
        }
    })
});
