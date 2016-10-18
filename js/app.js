
var victoryGardenKids = angular.module('victoryGardenKids',[], function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
    for(name in obj) {
      value = obj[name];
        
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
      
    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
});



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
		.when('/register',
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
		.when('/web/:picture_url',
		{
			controller: 'WebController',
			templateUrl: 'views/WebControllerView.html'

		})
		.otherwise({ redirectTo: '/'});

});

victoryGardenKids.config(function ($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


///////// CONTROLERS ////////////////////////////
// RootController
victoryGardenKids.controller('RootController', function($scope,latestNotificationsFactory,$location){
	
	var infoSaved = window.localStorage.getItem("infoSaved");
	if(infoSaved != 'yes')
	{
		$location.path( "/register" );
	}
	window.localStorage.setItem("infoSaved", "yes");
	
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
victoryGardenKids.controller('TheatersController', function($scope,$http,$location){
	
	$scope.saveInfo = function(user) {
		var deviceId = window.localStorage.getItem("deviceId");
		var android_push = '';
		var ios_push = '';
		
		if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos' ) {
			android_push = deviceId;
		}else
		{
			ios_push = deviceId;
		}
		if(user == undefined)
		{
			return;
		}
		var request = $http({
				method: "post",
				url: "http://app.victorygardenkids.com/create_users.php",
				data: {
					firstname: user.firstname,
					lastname: user.lastname,
					email: user.email,
					android_push: android_push,
					ios_push:ios_push
				}
			});
			 
			// Store the data-dump of the FORM scope.
			request.success(
			function( html ) {
				$scope.cfdump = html;
				$location.path( "/" );
			}
			);
		/*$.post(
            "http://app.victorygardenkids.com/create_users.php",
            {firstname: user.firstname,lastname: user.lastname,email: user.email,android_push: android_push,ios_push: ios_push},
            function(responseText){
                $scope.cfdump = responseText;
				$location.path( "/" );
            },
            "html"
        );*/
		
    }
	
});

victoryGardenKids.controller('WebController', function($scope,$routeParams){
	
	$scope.picture_url = $routeParams.picture_url;
	$scope.urlArray = {1: 'http://blog.victorygardenkids.com/', 2: 'http://victorygardenkids.com/app/apronstring.html', 3: 'http://victorygardenkids.com/app/samepageparenting.html', 4: 'http://victorygardenkids.com/app/LoveGrowsHere.php', 5: 'http://victorygardenkids.com/app/ParentingSeminar.php'};
});

///////////// FACTORIES ////////////////////////////

victoryGardenKids.factory('latestNotificationsFactory', function($http){
	var factory = {};
	factory.getRecommended = function(){
		// This is the place for performing http communication
		// with 3rd party web services.
		var url = 'http://app.victorygardenkids.com/?notification=one'
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

