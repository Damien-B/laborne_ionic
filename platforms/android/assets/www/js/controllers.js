angular.module('starter.controllers', [])
//['uiGmapgoogle-maps']
.controller('mainController', function() {
  this.alertes = true;
  this.news = true;
  this.logo = "<img src='img/logo.png' style='margin-top: 6px;'>";
})

.controller('NewsCtrl', function($scope, NewsService) {
  $scope.news = NewsService.all();
})

.controller('NewsDetailCtrl', function($scope, $stateParams, NewsService, $http, $sce) {
  $scope.news = NewsService.get($stateParams.newId);
  // $scope.html = $http.get($scope.news.HTML_LINK).then(function(data){
  //   return data;
  // });
  $scope.html = '<body><div class="sfTContainer">  <a href="http://www.symfony-project.org/"><img alt="symfony PHP Framework" class="sfTLogo" src="/sf/sf_default/images/sfTLogo.png" height="39" width="186" /></a>  <div class="sfTMessageContainer sfTAlert">  <img alt="page not found" class="sfTMessageIcon" src="/sf/sf_default/images/icons/cancel48.png" height="48" width="48" />  <div class="sfTMessageWrap">  <h1>Oops! Page Not Found</h1>  <h5>The server returned a 404 response.</h5> <div></div><dl class="sfTMessageInfo"> <dt>Did you type the URL?</dt> <dd>You may have typed the address (URL) incorrectly. Check it to make sure you\'ve got the exact right spelling, capitalization, etc.</dd> <dt>Did you follow a link from somewhere else at this site?</dt><dd>If you reached this page from another part of this site, please email us at <a href="mailto:[email]">[email]</a> so we can correct our mistake.</dd><dt>Did you follow a link from another site?</dt><dd>Links from other sites can sometimes be outdated or misspelled. Email us at <a href="mailto:[email]">[email]</a> where you came from and we can try to contact the other site in order to fix the problem.</dd> <dt>What\'s next</dt><dd><ul class="sfTIconList"><li class="sfTLinkMessage"><a href="javascript:history.go(-1)">Back to previous page</a></li><li class="sfTLinkMessage"><a href="/webservice.php/">Go to Homepage</a></li></ul></dd></dl><div></body>';
  $http.get('http://xibox-preprod.siplec.com/message/view/id/151').
  success(function(data){
    console.log(data);
  }).
  error(function(data){
    console.log(data);
  });
})

.controller('NewsAlertesCtrl', function($scope) {

})

.controller('StationsCtrl', function($scope, $http, MapService) {

  $scope.isLoaded = false;
  // if(MapService.getDistance() != null){
  //   $scope.distance = MapService.getDistance()*1000;
  // }else{
  //   $scope.distance = 25000;
  // }

  MapService.setMyMap(48.856614, 2.3522219000000177);
  $scope.CTMP = function(){
    MapService.centerToMyPosition();
  }
  MapService.centerToMyPosition();
  MapService.setMyMarker();

  google.maps.event.addListener(MapService.map, 'idle', function(){
  MapService.lookup = [];
    $scope.bounds = MapService.getMapBounds();
    MapService.setMarkersForBounds($scope.bounds);

    $scope.isLoaded = true;
  });



  $scope.infowindow = new google.maps.InfoWindow({
      content: 'azeazeaze'
  });

  google.maps.event.addListener(MapService.map, 'dragend', function() {
    $scope.bounds = MapService.getMapBounds();
    MapService.setMarkersForBounds($scope.bounds);
  });
  //à ajouter à la version PC car zoom molette non detecté par dragend & dblclick.
  google.maps.event.addListener(MapService.map, 'zoom_changed', function() {
    $scope.bounds = MapService.getMapBounds();
    MapService.setMarkersForBounds($scope.bounds);
  });

})
.controller('StationsListeCtrl', function($scope, MapService){
  $scope.stations = MapService.markers;
})

.controller('StationsDetailCtrl', function($scope, $stateParams, MapService){
  $scope.station = MapService.getStation($stateParams.stationId);

  // if($scope.station.tel.charAt(0) == "0"){
  //   $scope.station.tel = "+33" + $scope.station.tel.substr(1);
  // }


  //calcul de la distance (distance vol d'oiseau dispo dans marker.distance)
  var origin = MapService.myLoc;
  console.log('origine : ' + origin);
  var destination = new google.maps.LatLng(MapService.getStationLatLng(MapService.getStation($stateParams.stationId)).lat, MapService.getStationLatLng(MapService.getStation($stateParams.stationId)).lng);
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
    }, callback);
  function callback(response, status){
    $scope.distance = response.rows[0].elements[0].distance.value/1000;
  };
})

.controller('StationsSearchCtrl', function($scope, MapService){
  $scope.range = {
    min: 1,
    max: 50,
    value: 25
  };
  if(MapService.getDistance() != null){
    $scope.range.value = MapService.getDistance();
  }
  $scope.setDistance = function(){
    MapService.setDistance($scope.range.value);
  };

  $scope.searchAroundMe = function(){
    var self = this;
    window.location.href = "#/tab/stations";
    setTimeout(function(){
      MapService.centerToMyPosition();
    }, 1000);
  };


  //problems with itineraire
  // $scope.departure;
  // $scope.destination;
  // $scope.setmypos = function(a){
  //   if(a == 'from'){
  //     $scope.departure = "Ma position";
  //   }else if(a == 'to'){
  //     $scope.destination = "Ma position";
  //   }
    
  // };
})

.controller('StationsSearchAddressCtrl', function($scope, MapService){
  $scope.parent = {};
  $scope.parent.address;
  $scope.ads = MapService.getAddresses();
  if(MapService.getAddresses() != null){
    $scope.addresses = MapService.getAddresses();
  }
  $scope.searchAddress = function(){
    var bnbnbn = $scope.parent.address;
    MapService.getAddresses();
    MapService.setAddress(bnbnbn);
    MapService.centerOnAddress(bnbnbn);
  };
  $scope.searchRecAddress = function(address){
    MapService.centerOnAddress(address);
  };
})

.controller('FAQCtrl', function($scope, FAQService) {
  $scope.FAQ = FAQService.getFAQ();
})

.controller('FAQDetailCtrl', function($scope, $stateParams, FAQService) {
  $scope.FAQ = FAQService.getFAQAtIndex($stateParams.faqId);
})

.controller('InfosCtrl', function($scope, Infos) {
  $scope.infos = Infos.all();
  $scope.call = {
    image: 'img/numero.png',
    num: '0820000000'
  };
})

.controller('InfosDetailCtrl', function($scope, $stateParams, Infos) {
  $scope.infos = Infos.get($stateParams.infoId);
})