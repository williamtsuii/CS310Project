angular.module('pageService', [])

    // super simple service
    // each function returns a promise object
    .factory('Page', function() {
        var title = 'default';
        return {
            title: function() { return title; },
            setTitle: function(newTitle) { title = newTitle }
        };
    });