var pbApp = angular.module('pbApp', ['ngRoute', 'firebase']);

pbApp.value({
	'fbURL': 'https://torrid-fire-9572.firebaseio.com/'
});

pbApp.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl:'list.html',
			controller:'ListCtrl'
		})
		.when('/new',{
			templateUrl:'new.html',
			controller:'NewCtrl'
		})
		.when('/user/:userId',{
			templateUrl:'user.html',
			controller:'UserCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);


//Controllers

pbApp.controller('ListCtrl',['$scope', '$rootScope', '$location','firebaseFactory', function ($scope,$rootScope, $location,firebaseFactory ) {
	$scope.title = "Контакты";
	//Список всех контактов
	$scope.contacts = firebaseFactory.contactsList();
}]);

pbApp.controller('NewCtrl',['$scope','firebaseFactory','redirectFactory', function ($scope, firebaseFactory, redirectFactory) {
	$scope.title = "Новый контакт";
	//Добавление контакта
	$scope.contactsAdd = function(arr){
		firebaseFactory.contactsAdd(arr).then(redirectFactory.redirectMain());
	}
	//Кнопка отмена
	$scope.goBack = function(){
		redirectFactory.redirectMain();
	}

}]);

pbApp.controller('UserCtrl',['$scope', '$routeParams', 'firebaseFactory','redirectFactory', '$location','$rootScope', function ($scope, $routeParams,firebaseFactory,redirectFactory,$location,$rootScope) {
	$scope.title = "Изменить контакт";
	//Вывод полной информации о контакте
	var id =  $routeParams.userId;
	$scope.id = id;
	$scope.user = firebaseFactory.contactsInfo(id);
	//Удаление контакта
	$scope.contactsDel = function(){
		firebaseFactory.contactsDel().then(redirectFactory.redirectMain());
	}
	//Изменение контакта
	$scope.contactsEdit = function(obj){
		firebaseFactory.contactsEdit(obj).then(redirectFactory.redirectMain());
	}

	//Кнопка отмена
	$scope.goBack = function(){
		redirectFactory.redirectMain();
	}



}]);


//Factory


pbApp.factory('firebaseFactory', ['fbURL','$firebaseObject','$firebaseArray', function(fbURL, $firebaseObject, $firebaseArray){
	var fb = {};
		refBase = new Firebase(fbURL);
	//Список всех контактов
	fb.contactsList = function(){
		return $firebaseArray(refBase);
	}
	//Добавление контакта
	fb.contactsAdd = function(arr){
		return $firebaseArray(refBase).$add(arr);
	}
	//Вывод полной информации о контакте
	fb.contactsInfo = function(id){
		var url = fbURL+id;
			ref = new Firebase(url);
		return $firebaseObject(ref);
	}
	//Удаление контакта
	fb.contactsDel= function(){
		return $firebaseObject(ref).$remove();
	}
	//Изменение контакта
	fb.contactsEdit= function(obj){
		return obj.$save();
	}


	return fb;
}]);

pbApp.factory('redirectFactory', ['$location', function($location){
	var rf = {};
	rf.redirectMain = function() {
		return $location.path('/');
	}
	return rf;
}]);
