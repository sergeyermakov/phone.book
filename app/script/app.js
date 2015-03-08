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

pbApp.controller('NewCtrl',['$scope','firebaseFactory', function ($scope, firebaseFactory) {
	$scope.title = "Новый контакт";
	//Добавление контакта
	$scope.contactsAdd = function(arr){
		firebaseFactory.contactsAdd(arr);
	}

}]);

pbApp.controller('UserCtrl',['$scope', '$routeParams', 'firebaseFactory', function ($scope, $routeParams,firebaseFactory) {
	$scope.title = "Изменить контакт";
	//Вывод полной информации о контакте
	var id =  $routeParams.userId;
	$scope.id = id;
	$scope.user = firebaseFactory.contactsInfo(id);
	//Удаление контакта
	$scope.contactsDel = function(obj){
		firebaseFactory.contactsDel();
	}
	//Изменение контакта
	$scope.contactsEdit = function(obj){
		firebaseFactory.contactsEdit(obj);
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
	fb.contactsDel= function(obj){
		return $firebaseObject(ref).$remove(obj);
	}
	//Изменение контакта
	fb.contactsEdit= function(obj){
		return obj.$save();
	}


	return fb;
}]);
