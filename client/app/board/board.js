import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { Sprints } from '/imports/api/sprints.js';
import { Notes } from '/imports/api/notes.js';
import { NotesSorting } from './notesSorting'

const selectedNote = new ReactiveVar();
const notesSorter = new NotesSorting()

Template.board.onCreated(function () {
    let template = Template.instance();
    var self = this;
    self.autorun(function () {
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
        }, {
            "_id": "bad",
            "name": "What didn't go well",
            "order": 2
        }, {
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
    },
    sortIconClass(categoryId) {
        return notesSorter.sortIcon(categoryId)
    }
});

Template.notesTemplate.helpers({
    notes() {
        const notes = Notes.find({ sprintId: FlowRouter.getParam('_id') }).fetch();

        return notesSorter.sort(notes, this.categoryId)
    },
    haveVoted(note) {
        let username = localStorage.getItem('username');
        return note.voters.indexOf(username) > -1 ? 'active' : '';
    },
    showEdit() {
        return this.addedBy === localStorage.getItem('username')
    },
    highlight(note) {
        let voters = note.voters.length;
        if (voters > 4) {
            return 'highlight--3';
        } else if (voters > 2) {
            return 'highlight--2';
        } else {
            return 'highlight--1';
        }
    }
});


function submitNote(target) {
    let text = target.value.trim();
    if (!text) return;
    let categoryId = target.attributes['category-id'].value;
    let sprintId = FlowRouter.getParam('_id');
    let username = localStorage.getItem('username');
    Meteor.call('notes.insert', categoryId, sprintId, text, username);
    target.value = '';
}


Template.board.events({
    'keydown .new-note'(event) {
        if (event.which === 13 || event.which === 9) { // enter or tab
            event.preventDefault();
            submitNote(event.target)
        }
    },
    'click .submit-note button'(event) {
        event.preventDefault();
        const target = $(event.currentTarget).parent().siblings('.new-note')
        var submitEvent = $.Event("keydown", { which: 13 });
        $(target).trigger(submitEvent)
    },
    'dblclick .well': function (event) {
        event.preventDefault();
        selectedNote.set(this);
        $('#modal').modal('show');
    },
    'dblclick .vote': function (event) {
        event.stopPropagation();
        event.preventDefault();
        return false;
    },
    'click .edit': function (event) {
        event.preventDefault();
        selectedNote.set(this);
        $('#modal').modal('show');
    },
    'click .vote': function (event) {
        event.stopPropagation();
        let username = localStorage.getItem('username');
        Meteor.call('notes.vote', this, username);
    },
    'click .sort': function (event) {
        const categoryId = event.target.attributes['category-id'].value;
        notesSorter.nextSortDirection(categoryId)
    }
});

Template.modalTemplate.helpers({
    selectedNote() {
        return selectedNote.get();
    },
    moment(createdAt) {
        return moment(createdAt).fromNow();
    },
    showRemove(owner) {
        return owner === localStorage.getItem('username') || Meteor.user();
    }
});

Template.modalTemplate.events({
    'click .saveNote': function (event, templateInstance) {
        event.stopPropagation();
        let note = selectedNote.get();
        let newText = templateInstance.find("textarea").value.trim();
        if (!newText) return;
        let username = localStorage.getItem('username');
        Meteor.call('notes.update', note, newText, username);
        $('#modal').modal('hide');
    },
    'click .deleteNote': function (event) {
        event.stopPropagation();
        let note = selectedNote.get();
        Meteor.call('notes.remove', note);
        $('#modal').modal('hide');
    }
});
