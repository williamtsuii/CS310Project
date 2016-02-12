/// <reference path="../../../types/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../../types/DefinitelyTyped/angularjs/angular-route.d.ts" />

//module comicSans{
//
//
//	export interface IuserService{
//		signup(userData :any):ng.IPromise<any>;
//		login(user :any): ng.IPromise<any>;
//		view(id:string): ng.IPromise<any>;
//	}
//
//	class userService{
//		static $inject = ['$http'];
//		constructor(private $http: ng.IHttpService){
//		}
//
//		signup(userData:any) :ng.IPromise<any>{
//			return this.$http.post('/user/createuser', userData);
//		}
//
//		login(user:any):ng.IPromise<any>{
//			return this.$http.put('/user/login', user);
//		}
//
//		view(id: string): ng.IPromise<any>{
//			return this.$http.get('/user/profile'+ "/" + id);
//		}
//
//	}
//
//	angular
//		.module('comicSans',['ngRoute'])
//		.service('userService', userService);
//}

//angular.module('userService', [])
//
//	// super simple service
//	// each function returns a promise object
//	.factory('User', ['$http',function($http) {
//		return {
//			signup : function(userData) {
//				return $http.post('/user/createuser', userData);
//			},
//			login : function(user){
//				return $http.put('/user/login', user);
//			},
//			view : function(id){
//				return $http.get('/user/profile'+ "/" + id);
//			}
//		}
//	}]);