var pbApp = angular.module('pbApp', ['ngRoute']);

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

pbApp.controller('ListCtrl',['$scope','$http','$location', function ($scope, $http, $location) {
	$scope.title = "Контакты"
	$http.get('../../contacts.json').success(function(data,status,headers,config){
		$scope.contacts = data;
	});
}]);

pbApp.controller('newCtrl',['$scope','$http','$location', function ($scope, $http, $location) {
	$scope.title = "Новый контакт"

	$http.get('../../contacts.json').success(function(data,status,headers,config){
		$scope.contacts = data;
	});
}]);

pbApp.controller('userInfoCtrl',['$scope','$http','$location','$routeParams', function ($scope, $http, $location, $routeParams) {
	$scope.title = "Изменить контакт";
	$scope.userId = $routeParams.userId;
	$http.get('../../contacts.json').success(function(data,status,headers,config){
		$scope.contacts = data;
	});
}]);