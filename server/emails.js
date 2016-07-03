import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Accounts.emailTemplates.resetPassword.from = function () {
   return "Remotescrum team <remotescrum@gmail.com>";
};

Meteor.methods({
    sendEmail: function (to, subject, text) {
        check(to, String);
        check(subject, String);
        check(text, String);

        this.unblock();

        Email.send({
            to: to,
            from: 'remotescrum@gmail.com',
            subject: subject,
            text: text
        });
    }
});
