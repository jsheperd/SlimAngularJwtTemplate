angular.module('JwtDemoApp', ['angular-jwt'])

  .config(function ($httpProvider, jwtInterceptorProvider) {
    jwtInterceptorProvider.tokenGetter = function () {
      return localStorage.getItem('jwt_token');
    };

    $httpProvider.interceptors.push('jwtInterceptor');
  })

  .controller('DemoController', function ($scope, $http, $window, jwtHelper) {
    $scope.token = null;
    $scope.pathname = window.location.pathname;
    $scope.responseSuccess = null;

    $scope.fullPath = function(endpoint) {
      return $scope.pathname + endpoint; 
    };
  
  
    $scope.tokenFromStorage = function () {
      return $window.localStorage.getItem('jwt_token');  
    };
  
    $scope.tokenFromStorageAsString = function() {
      var token = $scope.tokenFromStorage();
      if(token) {
        return JSON.stringify(jwtHelper.decodeToken(token));
      } else {
        return null;
      }
    };

    $scope.responseAsString = function() {
      if($scope.response) {
        return JSON.stringify($scope.response, null, 2);
      } else {
        return "";
      }
    };

    // Connect to the API
    $scope.getPublicData = function () {
      $http.get($scope.fullPath('public')).then(
        function (response) { $scope.response = response; $scope.responseSuccess = true;},
        function (response) { $scope.response = response; $scope.responseSuccess = false;}
      );
    };
        
    $scope.getSecuredData = function () {
      $http.get($scope.fullPath('secured')).then(
        function (response) { $scope.response = response; $scope.responseSuccess = true;},
        function (response) { $scope.response = response; $scope.responseSuccess = false;}
      );
    };

    $scope.getSecuredAdminData = function () {
      $http.get($scope.fullPath('secured/admin')).then(
        function (response) { $scope.response = response; $scope.responseSuccess = true;},
        function (response) { $scope.response = response; $scope.responseSuccess = false;}
      );
    };

    // Token handling
    $scope.getToken = function () {
      $http.get($scope.fullPath('token')).then(
        function (response) { console.log(response);
                              $scope.response = response;
                              $scope.token = response.data.data.token;
                              $scope.responseSuccess = true;
                              $window.localStorage.setItem('jwt_token', response.data.data.token);
                            },
        function (response) { $scope.response = null;
                              $scope.token = null;
                              $scope.responseSuccess = false;
                              $window.localStorage.removeItem('jwt_token');
                            }
        );
    };

    $scope.getAdminToken = function () {
      $http.get($scope.fullPath('admintoken')).then(
        function (response) { console.log(response);
                               $scope.response = response;
                               $scope.token = response.data.data.token;
                               $scope.responseSuccess = true;
                               $window.localStorage.setItem('jwt_token', response.data.data.token);
                             },
        function (response) { $scope.response = null;
                               $scope.token = null;
                               $scope.responseSuccess = false;
                               $window.localStorage.removeItem('jwt_token');
                             }
      );
    };

    $scope.deleteToken = function () {
      localStorage.removeItem('jwt_token');
      $scope.token  = null;
      $scope.response = null;
    };
  });
