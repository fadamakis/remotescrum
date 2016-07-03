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
                    $.bootstrapGrowl('Thank you! We will get back to you as soon as possible.',{
                        type: 'success'
                    });
                }
            });
        }
    }
});
