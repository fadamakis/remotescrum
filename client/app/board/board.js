import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { Retros } from '/imports/api/retros.js';
import { Notes } from '/imports/api/notes.js';
import { Categories } from '/imports/api/categories.js';

let selectedNote = new ReactiveVar();

Template.board.onCreated( function() {
    let template = Template.instance();
    template.subscribe('categories');
    template.subscribe('notes');

    var self = this;
    self.autorun(function() {
        let retroId = FlowRouter.getParam('_id');
        self.subscribe('currentRetro', retroId);
    });
});

Template.board.helpers({
    categories() {
        return Categories.find({});
    },
    notes() {
        return Notes.find({});
    },
    retro() {
        return Retros.find({});
    }
});

Template.notesTemplate.helpers({
    notes() {
        return Notes.find({retroId : FlowRouter.getParam('_id')});
    }
});

Template.board.events({
    'keyup .new-note'(event, templateInstance) {
        event.preventDefault();
        if(event.which === 13){
            let text = event.target.value.trim();
            if(!text) return;
            let categoryId = event.target.attributes['category-id'].value;
            let retroId = FlowRouter.getParam('_id');
            let username = localStorage.getItem('username');
            Meteor.call('notes.insert', categoryId, retroId, text, username);
            event.target.value = '';
        }
    },
    'dblclick .well': function(event) {
        event.preventDefault();
        selectedNote.set(this);
        $('#modal').modal('show');
    },
    'click .vote': function(event) {
        event.stopPropagation();
        Meteor.call('notes.vote', this);
    }
});

Template.modalTemplate.helpers({
    selectedNote() {
        return selectedNote.get();
    },
    moment(createdAt){
        return moment(createdAt).fromNow();
    }
});

Template.modalTemplate.events({
    'click .saveNote': function(event, templateInstance) {
        event.stopPropagation();
        let note = selectedNote.get();
        let newText = templateInstance.find("textarea").value.trim();
        if(!newText) return;
        Meteor.call('notes.update', note, newText);
        $('#modal').modal('hide');
    },
    'click .deleteNote': function(event) {
        event.stopPropagation();
        let note = selectedNote.get();
        Meteor.call('notes.remove', note);
        $('#modal').modal('hide');
    }
});
