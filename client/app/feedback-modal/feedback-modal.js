Template.feedbackModal.events({
    'submit .feedbackModalForm': function(event, templateInstance) {
        event.preventDefault();
        let text = templateInstance.find(".feedback-textarea").value;
        if(text){
            $('#feedbackModal').modal('hide');
            Meteor.call('sendEmail', 'remotescrum@gmail.com', 'Feedback form', text, function(err){
                if(err){
                    $.bootstrapGrowl('Ooops. Please try contacting us directly remotescrum@gmail.com',{
                        type: 'danger'
                    });
                }else{
                    templateInstance.find(".feedback-textarea").value = '';
                    $.bootstrapGrowl('We highly appreciate your feedback. Thank you!',{
                        type: 'success'
                    });
                }
            });
        }
    }
});
