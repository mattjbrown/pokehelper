angular.module('PokeHelper', ['ui.router'])
  .run(
    function ($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  )
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/404');

    $stateProvider
      .state('home', {
        url: ''
      })
      .state('404', {
        url: '/404',
        templateUrl: '404.html'
      });
  });
