angular.module('starter.controllers', [])
//['uiGmapgoogle-maps']
.controller('mainController', function() {
  this.alertes = true;
  this.news = true;
  this.logo = "<img src='img/logo.png' style='margin-top: 6px;'>";
})

.controller('NewsCtrl', function($scope, NewsService) {
  $scope.news = "blblblblblbblb";
  $scope.news = NewsService.all();
})

.controller('NewsDetailCtrl', function($scope, $stateParams, NewsService, $http, $sce) {
  $scope.news = NewsService.get($stateParams.newId);
  console.log($scope.news.HTML_LINK);

  $http.get('http://xibox-preprod.siplec.com/message/view/id/141')//$http.get($scope.news.HTML_LINK)
  .success(function(data){
    $scope.html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' + he.decode(data);//trying to decode html
  })
  .error(function(data){
    console.log(data);
  });

})

.controller('NewsAlertesCtrl', function($scope) {

})

.controller('StationsCtrl', function($scope, $http, MapService) {

  $scope.isLoaded = false;
  if(MapService.getDistance() != null){
    $scope.distance = MapService.getDistance()*1000;
  }else{
    $scope.distance = 25000;
  }

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

  setTimeout(function(){
    
    var origin = new google.maps.LatLng(JSON.parse(window.localStorage.getItem('user.coords.latitude')), JSON.parse(window.localStorage.getItem('user.coords.longitude')));
    console.log('origine : ' + origin);

    for(var i=0, len=$scope.stations.length;i<len;i++){
      (function(index){
      var destination = new google.maps.LatLng(MapService.getStationLatLng(MapService.getStation($scope.stations[i].code)).lat, MapService.getStationLatLng(MapService.getStation($scope.stations[i].code)).lng);
      var service = new google.maps.DistanceMatrixService();
      
      service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      function(response, status){
        $scope.$apply(function(){
          if(response.rows[0].elements[0].status == "OK"){
            $scope.stations[index].distance = response.rows[0].elements[0].distance.value/1000;
          }else{
            $scope.stations[index].distance = "???";
          }
        });
      });
    })(i);
    }

  }, 500);


})

.controller('StationsDetailCtrl', function($scope, $stateParams, MapService){
  $scope.station = MapService.getStation($stateParams.stationId);

  // if($scope.station.tel.charAt(0) == "0"){
  //   $scope.station.tel = "+33" + $scope.station.tel.substr(1);
  // }


  
})

.controller('StationsSearchCtrl', function($scope, MapService){
  $scope.itinerary = {};
  $scope.itinerary.departure;
  $scope.itinerary.destination;
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
    console.log(MapService.myMarker);
    if(typeof MapService.myMarker != "undefined"){
      MapService.myMarker.setMap(null);
    }
    window.location.href = "#/tab/stations";
    setTimeout(function(){
      MapService.centerToMyPosition();
    }, 1000);
  };

  $scope.searchItineraire = function(){
    console.log($scope.itinerary.destination);
    MapService.searchItineraire($scope.itinerary.departure, $scope.itinerary.destination);
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
  // $scope.address = MapService.getAddresses();
  
  

  $scope.searchAddress = function(){
    var bnbnbn = $scope.parent.address;
    // MapService.getAddresses();
    // MapService.setAddress(bnbnbn);
    MapService.centerOnAddress(bnbnbn);
  };

  $scope.searchRecAddress = function(address){
    MapService.centerOnAddress(address);
  };

  $scope.removeAddress = function(address){
    MapService.removeAddress(address);
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