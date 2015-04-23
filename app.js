angular.module('JwtDemoApp', ['angular-jwt'])

  .config(function ($httpProvider, jwtInterceptorProvider) {
    jwtInterceptorProvider.tokenGetter = function () {
      return localStorage.getItem('jwt_token');
    };

    $httpProvider.interceptors.push('jwtInterceptor');
  })

  .controller('DemoController', function ($scope, $http, jwtHelper) {
    $scope.output = '';

    $scope.getPublicData = function () {
      loadData('/public');
    };

    $scope.getPrivateData = function () {
      loadData('/secured');
    };

    $scope.getPrivateAdminData = function () {
      loadData('/secured/admin');
    };

    $scope.getToken = function () {
      loadData('/token')
        .success(function (response) {
          $scope.output = JSON.stringify(jwtHelper.decodeToken(response.token), null, 2);
          localStorage.setItem('jwt_token', response.token);
        });
    };

    $scope.getAdminToken = function () {
      loadData('/admintoken')
        .success(function (response) {
          $scope.output = JSON.stringify(jwtHelper.decodeToken(response.token), null, 2);
          localStorage.setItem('jwt_token', response.token);
        });
    };

    $scope.deleteToken = function () {
      localStorage.removeItem('jwt_token');
    }

    function loadData(endpoint) {
      return $http.get(endpoint)
        .success(function (response) {
          $scope.output = response.data;
        })
        .error(function (data, status) {
          $scope.output = 'Error! ' + JSON.stringify({
            responseData: data,
            responseStatus: status
          }, null, 2);
        });
    }
  });
