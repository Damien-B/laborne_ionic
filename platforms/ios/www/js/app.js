// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope, $ionicHistory) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  // $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
  //   $ionicHistory.clearCache();
  // });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.navBar.positionPrimaryButtons('left');
  $ionicConfigProvider.navBar.positionSecondaryButtons('right');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.news', {
    url: '/news',
    views: {
      'tab-news': {
        templateUrl: 'templates/tab-news.html',
        controller: 'NewsCtrl'
      }
    }
  })

  .state('tab.news-detail', {
    url: '/news/:newId',
    views: {
      'tab-news': {
        templateUrl: 'templates/news-detail.html',
        controller: 'NewsDetailCtrl'
      }
    }
  })

  .state('tab.news-alertes', {
    url: '/news/alertes',
    views: {
      'tab-news': {
        templateUrl: 'templates/news-alertes.html',
        controller: 'NewsAlertesCtrl'
      }
    }
  })

  .state('tab.stations', {
      url: '/stations',
      views: {
        'tab-stations': {
          templateUrl: 'templates/tab-stations.html',
          controller: 'StationsCtrl'
        }
      }
    })

  .state('tab.stations-liste', {
      url: '/stations/liste',
      views: {
        'tab-stations': {
          templateUrl: 'templates/stations-liste.html',
          controller: 'StationsListeCtrl'
        }
      }
    })

  .state('tab.stations-detail', {
      url: '/stations/:stationId',
      views: {
        'tab-stations': {
          templateUrl: 'templates/stations-detail.html',
          controller: 'StationsDetailCtrl'
        }
      }
    })

  .state('tab.stations-search', {
      url: '/search-stations',
      views: {
        'tab-stations': {
          templateUrl: 'templates/stations-search.html',
          controller: 'StationsSearchCtrl'
        }
      }
    })

  .state('tab.stations-search-address', {
      url: '/search-stations/address',
      views: {
        'tab-stations': {
          templateUrl: 'templates/stations-search-address.html',
          controller: 'StationsSearchAddressCtrl'
        }
      }
    })

  .state('tab.faq', {
      url: '/faq',
      views: {
        'tab-faq': {
          templateUrl: 'templates/tab-faq.html',
          controller: 'FAQCtrl'
        }
      }
    })

  .state('tab.faq-detail', {
      url: '/faq/:faqId',
      views: {
        'tab-faq': {
          templateUrl: 'templates/faq-detail.html',
          controller: 'FAQDetailCtrl'
        }
      }
    })

  .state('tab.infos', {
      url: '/infos',
      views: {
        'tab-infos': {
          templateUrl: 'templates/tab-infos.html',
          controller: 'InfosCtrl'
        }
      }
    })

  .state('tab.infos-detail', {
      url: '/infos/:infoId',
      views: {
        'tab-infos': {
          templateUrl: 'templates/infos-detail.html',
          controller: 'InfosDetailCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/stations');

});
