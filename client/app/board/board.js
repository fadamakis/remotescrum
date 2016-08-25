import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { Sprints } from '/imports/api/sprints.js';
import { Notes } from '/imports/api/notes.js';

let selectedNote = new ReactiveVar();

Template.board.onCreated( function() {
    let template = Template.instance();
    var self = this;
    self.autorun(function() {
        let sprintId = FlowRouter.getParam('_id');
        self.subscribe('currentSprint', sprintId);
        self.subscribe('notes', sprintId);
    });
});

Template.board.helpers({
    categories() {
        let categories = [{
            "_id": "good",
            "name": "What went well",
            "order": 1
        },{
            "_id": "bad",
            "name": "What didn't go well",
            "order": 2
        },{
            "_id": "actions",
            "name": "Action items",
            "order": 3
        }];
        return categories;
    },
    notes() {
        return Notes.find({});
    },
    sprint() {
        return Sprints.find({});
    }
});

Template.notesTemplate.helpers({
    notes() {
        return Notes.find({sprintId : FlowRouter.getParam('_id')});
    },
    haveVoted(note){
        let username = localStorage.getItem('username');
        return note.voters.indexOf(username) > -1 ? 'active': '';
    },
    highlight(note){
        let voters = note.voters.length;
        if (voters > 4) {
            return 'highlight--3';
        } else if(voters > 2) {
            return 'highlight--2';
        } else {
            return 'highlight--1';
        }
    }
});

Template.board.events({
    'keyup .new-note'(event, templateInstance) {
        event.preventDefault();
        if(event.which === 13){
            let text = event.target.value.trim();
            if(!text) return;
            let categoryId = event.target.attributes['category-id'].value;
            let sprintId = FlowRouter.getParam('_id');
            let username = localStorage.getItem('username');
            Meteor.call('notes.insert', categoryId, sprintId, text, username);
            event.target.value = '';
        }
    },
    'dblclick .well': function(event) {
        event.preventDefault();
        selectedNote.set(this);
        $('#modal').modal('show');
    },
    'dblclick .vote': function(event) {
        event.stopPropagation();
        event.preventDefault();
        return false;
    },
    'click .vote': function(event) {
        event.stopPropagation();
        let username = localStorage.getItem('username');
        Meteor.call('notes.vote', this, username);
    }
});

Template.modalTemplate.helpers({
    selectedNote() {
        return selectedNote.get();
    },
    moment(createdAt){
        return moment(createdAt).fromNow();
    },
    showRemove(owner){
        return owner === localStorage.getItem('username') || Meteor.user();
    }
});

Template.modalTemplate.events({
    'click .saveNote': function(event, templateInstance) {
        event.stopPropagation();
        let note = selectedNote.get();
        let newText = templateInstance.find("textarea").value.trim();
        if(!newText) return;
        let username = localStorage.getItem('username');
        Meteor.call('notes.update', note, newText, username);
        $('#modal').modal('hide');
    },
    'click .deleteNote': function(event) {
        event.stopPropagation();
        let note = selectedNote.get();
        Meteor.call('notes.remove', note);
        $('#modal').modal('hide');
    }
});
