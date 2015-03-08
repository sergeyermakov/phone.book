var pbApp = angular.module('pbApp', ['ngRoute', 'firebase']);

pbApp.value({
	'fbURL': 'https://torrid-fire-9572.firebaseio.com/'
});

pbApp.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl:'all.html',
			controller:'ListCtrl'
		})
		.when('/new',{
			templateUrl:'contact.html',
			controller:'newCtrl'
		})
		.when('/user/:userId',{
			templateUrl:'user.html',
			controller:'userInfoCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);


//Controllers

pbApp.controller('ListCtrl',['$scope','$location','firebaseFactory', function ($scope, $location,firebaseFactory) {
	$scope.title = "Контакты";
	$scope.contacts = firebaseFactory.contactsList();
}]);

pbApp.controller('newCtrl',['$scope','$location', function ($scope, $http, $location) {
	$scope.title = "Новый контакт";
}]);

pbApp.controller('userInfoCtrl',['$scope', '$routeParams', 'firebaseFactory', function ($scope, $routeParams,firebaseFactory) {
	$scope.title = "Изменить контакт";

	var id =  $routeParams.userId;
	$scope.id = id;
	$scope.user = firebaseFactory.contactsEdit(id);
}]);


//Factory


pbApp.factory('firebaseFactory', ['fbURL','$firebaseObject','$firebaseArray', function(fbURL, $firebaseObject, $firebaseArray){
	var fb = {};

	fb.contactsList = function(){
		var ref = new Firebase(fbURL);
		return $firebaseArray(ref);
	}
	fb.contactsEdit = function(id){
		var url = fbURL+id;
			ref = new Firebase(url);
		return $firebaseObject(ref);
	}

	return fb;
}]);
