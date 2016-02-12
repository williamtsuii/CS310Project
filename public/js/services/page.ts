/// <reference path="../../../types/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../../types/DefinitelyTyped/angularjs/angular-route.d.ts" />
//module comicSans{
//
//    export interface IpageService{
//        getTitle():string;
//        setTitle(newTitle : string):void;
//    }
//
//    class pageService implements IpageService{
//        static $inject = ['$http'];
//        private title : string;
//        constructor(){
//            this.title = 'default';
//        }
//        getTitle():string{
//            return this.title;
//        }
//        setTitle(newTitle:string){
//            this.title = newTitle;
//        }
//    }
//
//    angular
//        .module('comicSans',['ngRoute'])
//        .service('pageService', pageService);
//}



//angular.module('pageService', [])
//
//    // super simple service
//    // each function returns a promise object
//    .factory('Page', function() {
//        var title = 'default';
//        return {
//            title: function() { return title; },
//            setTitle: function(newTitle) { title = newTitle }
//        };
//    });