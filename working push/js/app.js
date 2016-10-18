
var victoryGardenKids = angular.module('victoryGardenKids',[]);


////////// ROUTING /////////////////////////

// Deffining $routeProvider for victoryGardenKids applicatiom module
//
victoryGardenKids.config(function ($routeProvider) {
	$routeProvider
		// main route
		//
		.when('/',
		{
			controller: 'RootController',
			templateUrl: 'views/RootControllerView.html'
		})
		// theaters list page
		//
		.when('/theaters',
		{
			controller: 'TheatersController',
			templateUrl: 'views/TheatersControllerView.html'

		})
		// settings page
		//
		.when('/notifications',
		{
			controller: 'NotificationsController',
			templateUrl: 'views/NotificationsControllerView.html'

		})
		.otherwise({ redirectTo: '/'});

});

victoryGardenKids.config(function ($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


///////// CONTROLERS ////////////////////////////
// RootController
victoryGardenKids.controller('RootController', function($scope,latestNotificationsFactory){
	
	$scope.latestNotifications = [];
	init();
	function init(){

		latestNotificationsFactory.getRecommended().then(function(data) {
		   //this will execute when the 
		   //AJAX call completes.
		   var res = data.split("<script type=");
		   response = angular.fromJson(res[0]);
		   
		   $scope.latestNotifications = response.wordofwisdom;
		   $scope.ready = true;		   
		});
	};
});
// allNotificationsController
//
victoryGardenKids.controller('NotificationsController', function($scope,allNotificationsFactory){
	$scope.allNotifications = [];
	init();
	function init(){

		allNotificationsFactory.getRecommended().then(function(data) {
		   //this will execute when the 
		   //AJAX call completes.
		   var res = data.split("<script type=");
		   response = angular.fromJson(res[0]);
		   
		   $scope.allNotifications = response.wordofwisdom;
		   $scope.ready = true;		   
		});
	};
});
// allNotificationsController
//
victoryGardenKids.controller('TheatersController', function($scope,theatersFactory){
	
	// This controller is going to set theaters
	// variable for the $scope object in order for view to
	// display its contents on the screen as html 
	$scope.theaters = [];

	// Just a housekeeping.
	// In the init method we are declaring all the
	// neccesarry settings and assignments
	init();

	function init(){
		$scope.theaters = theatersFactory.getTheaters();
	}	
});

///////////// FACTORIES ////////////////////////////

victoryGardenKids.factory('latestNotificationsFactory', function($http){
	var factory = {};
	factory.getRecommended = function(){
		// This is the place for performing http communication
		// with 3rd party web services.
		var url = 'http://app.victorygardenkids.com/'
		return $http.get(url).then( function(response){
			return response.data;
		})
	}
	return factory;
});

victoryGardenKids.factory('allNotificationsFactory', function($http){
	var factory = {};
	factory.getRecommended = function(){
		// This is the place for performing http communication
		// with 3rd party web services.
		var url = 'http://app.victorygardenkids.com/'
		return $http.get(url).then( function(response){
			return response.data;
		})
	}
	return factory;
});

// Defining theatersFactory factory
// In this example it has 5 movie theatres 
// but in real live application you would 
// want it to get this data from the web
// service, based on the the movie selected
// by user
//
victoryGardenKids.factory('theatersFactory', function(){
	var theaters = [
		{ name: 'Everyman Walton', address: '85-89 High Street London'},
		{ name: 'Ambassador Cinemas', address: 'Peacocks Centre Woking'},
		{ name: 'ODEON Kingston', address: 'larence Street Kingston Upon Thames'},
		{ name: 'Curzon Richmond', address: '3 Water Lane Richmond'},
		{ name: 'ODEON Studio Richmond', address: '6 Red Lion Street Richmond'}
	];

	var factory = {};
	factory.getTheaters = function(){

		// If performing http communication to receive
		// factory data, the best would be to put http
		// communication code here and return the results
		return theaters;
	}

	return factory;
});





