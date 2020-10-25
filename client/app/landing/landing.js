import Typed from 'typed.js';
Template.landing.onRendered(function () {

    var options = {
        strings: [
            'Retrospectives', 
            'Planning',
            'Collaboration',
            'Scrum',
        ],
        loop: true,
        typeSpeed: 120,
        backDelay: 1500
    };

    new Typed('.typewriting', options);
});