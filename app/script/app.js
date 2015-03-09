var pbApp = angular.module('pbApp', ['ngRoute', 'firebase','angularFileUpload']);

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

pbApp.controller('ListCtrl',['$scope', '$rootScope', '$location','firebaseFactory','redirectFactory', function ($scope,$rootScope, $location,firebaseFactory,redirectFactory ) {
	$scope.title = "Контакты";
	$scope.table = true;
	//Список всех контактов
	$scope.contacts = firebaseFactory.contactsList();


	$scope.goUser = function(id){
		redirectFactory.redirectId(id);
	}
}]);

pbApp.controller('NewCtrl',['$scope','firebaseFactory','redirectFactory','FileUploader', function ( $scope, firebaseFactory, redirectFactory,FileUploader) {
	$scope.title = "Новый контакт";
	//Добавление контакта
	$scope.contactsAdd = function(arr){
		firebaseFactory.contactsAdd(arr).then(redirectFactory.redirectMain());
	}
	//Кнопка отмена
	$scope.goBack = function(){
		redirectFactory.redirectMain();
	}

	var uploader = $scope.uploader = new FileUploader({
		url: './php/upload.php'
	});

	// FILTERS
	uploader.filters.push({
		name: 'imageFilter',
		fn: function(item /*{File|FileLikeObject}*/, options) {
			var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
			return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
		}
	});


}]);

pbApp.controller('UserCtrl',['$scope', '$routeParams', 'firebaseFactory','redirectFactory', '$location','$rootScope','FileUploader', function ($scope, $routeParams,firebaseFactory,redirectFactory,$location,$rootScope,FileUploader) {
	$scope.title = "Изменить контакт";
	//Вывод полной информации о контакте
	var id =  $routeParams.userId;
	$scope.id = id;
	$scope.user = firebaseFactory.contactsInfo(id);
	$scope.hide = true;
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

	var uploader = $scope.uploader = new FileUploader({
		url: './php/upload.php'
	});

	// FILTERS
	uploader.filters.push({
		name: 'imageFilter',
		fn: function(item /*{File|FileLikeObject}*/, options) {
			var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
			return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
		}
	});




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
	rf.redirectId = function(id) {
		return $location.path('/user/'+id);
	}
	return rf;
}]);
