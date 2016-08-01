import { Stories } from '/imports/api/stories.js';
import { Sprints } from '/imports/api/sprints.js';

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
    }
});

Template.plan.onCreated( function() {
    let template = Template.instance();
    var self = this;
    self.autorun(function() {
        let sprintId = FlowRouter.getParam('_id');
        self.subscribe('currentSprint', sprintId);
        self.subscribe('stories', sprintId);
    });
});
