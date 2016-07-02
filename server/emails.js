import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
    sendEmail: function (to, from, subject, text) {
        check(to, String);
        check(from, String);
        check(subject, String);
        check(text, String);

        this.unblock();

        Email.send({
            to: to,
            from: from,
            subject: subject,
            text: text
        });
    }
});
