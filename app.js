angular.module('JwtDemoApp', ['angular-jwt'])

  .config(function ($httpProvider, jwtInterceptorProvider, tokenProvider) {
    jwtInterceptorProvider.tokenGetter = function (token) {
        return token.getToken();
    };

    $httpProvider.interceptors.push('jwtInterceptor');
  })

  .provider('token', function(){
    var token = false;

    function tokenHandler() {
      this.getToken = function(){
        return token;
      }
      
      this.setToken = function(newToken){
        token = newToken;
      }
    }
  
    this.$get = function() {
      return new tokenHandler();
    };
  })

  
  .controller('DemoController', function ($scope, $http, jwtHelper, token) {
    $scope.pathname = window.location.pathname;
    $scope.responseSuccess = null;
    
    $scope.fullPath = function(endpoint) {
      return $scope.pathname + endpoint; 
    };
  
    $scope.strToken = function () {
      if(token.getToken()){
        return token.getToken();
      } else {
        return "";
      }
    };
  
    $scope.strDecodedToken = function() {
      if(token.getToken()) {
        return JSON.stringify(jwtHelper.decodeToken(token.getToken()));
      } else {
        return null;
      }
    };

    $scope.responseDataAsString = function() {
      if($scope.response && $scope.response.data) {
        return JSON.stringify($scope.response.data, null, 2);
      } else {
        return "";
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
                              token.setToken(response.data.data.token);
                            },
        function (response) { $scope.response = null;
                              $scope.token = null;
                              $scope.responseSuccess = false;
                              token.setToken(false);                             
                            }
        );
    };

    $scope.getAdminToken = function () {
      $http.get($scope.fullPath('admintoken')).then(
        function (response) { console.log(response);
                               $scope.response = response;
                               $scope.token = response.data.data.token;
                               $scope.responseSuccess = true;
                               token.setToken(response.data.data.token);
                             },
        function (response) { $scope.response = null;
                               $scope.token = null;
                               $scope.responseSuccess = false;
                               token.setToken(false);                             
                             }
      );
    };

    $scope.deleteToken = function () {
      token.setToken(false);
      $scope.token  = null;
      $scope.response = null;
    };
  });
