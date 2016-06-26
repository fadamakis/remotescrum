Template.boardFooter.helpers({
    currentRoute() {
        return window.location.origin + FlowRouter.current().path;
    }
});
