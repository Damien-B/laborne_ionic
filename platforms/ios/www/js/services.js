angular.module('starter.services', [])



.factory('NewsService', function($http) {
  var News = [];
  return {
    all: function() {
      var url = 'http://xibox-preprod.siplec.com/message?key=0ea78fddca2904bc4ae70f3ee5da9b01a297878&app=fr.leclerc.siplec.iphone.laborne';
      // $http.get(url).success(function(data){
      //     console.log(data);
      //     console.log(data.MESSAGE[1].ID_MESSAGE);
      //     return data.MESSAGE;
      // }).error(function(){});
      News = [{"ID_MESSAGE":152,"TITRE_MESSAGE":"News N\u00b03 du serveur de PP","RESUME_MESSAGE":"C'est la news 3","DATE_PUBLICATION":"2013-02-12T19:02:00+01:00","HTML_LINK":"http:\/\/xibox-preprod.siplec.com\/message\/view\/id\/152","THEMES":[]},{"ID_MESSAGE":151,"TITRE_MESSAGE":"NEWS N\u00b02","RESUME_MESSAGE":"NEWS N\u00b02 du serveur de PP","DATE_PUBLICATION":"2013-02-12T18:59:00+01:00","HTML_LINK":"http:\/\/xibox-preprod.siplec.com\/message\/view\/id\/151","THEMES":[]}];
      return News;
    },
    get: function(newId) {
      for (var i=0; i < News.length; i++) {
        if (News[i].ID_MESSAGE === parseInt(newId)) {
          return News[i];
        }
      }
      return null;
    }
  }
})


.factory('MapService', function($http){
  var myLoc;
  var map;
  var me;
  var addresses = [];
  var lookup = [];
  var markers = [];
      var myMarker;
  return{
    setMyMap: function(lat, lng){
      var Latlng = new google.maps.LatLng(lat, lng);
      var mapOptions = {
          center: Latlng,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
      };
      this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
      



    },
    setMarker: function(type, loc, marker){
      var self = this;
      if(type == 'me'){
        self.me = new google.maps.Marker({
          position: loc,
          map: self.map,
          title: 'ma position',
          icon: 'img/bluedot.png'
        });
        //clicable dot :
        //var infowindow = new google.maps.InfoWindow({content: '<p>lattitude : ' + self.myLoc.k + '</p><p>longitude : ' + self.myLoc.D + '</p>'});
        //google.maps.event.addListener(self.me, 'click', function(){
        //  infowindow.open(self.map, self.me);
        //});
      }else if(type == 'station'){
        var station = new google.maps.Marker({
          position: loc,
          map: self.map,
          title: marker.nom,
          icon: 'img/borne.png'
        });
        var infowindow = new google.maps.InfoWindow({content:  '<a href="#/tab/stations/' + marker.code + '"><div  class="markernbbornes">' + marker.bornes.nombre + '</div><div class="markertxt"><h5 class="markernom">' + marker.nom + '</h5><p class="markerlieu">' + marker.cp + ' ' + marker.ville + '</p></div></a>'});
        google.maps.event.addListener(station, 'click', function(){
          infowindow.open(self.map, station);
        });
      }
    },
    setMyMarker: function(){
      var self = this;
      navigator.geolocation.getCurrentPosition(function(pos) {
        self.myLoc = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        self.setMarker('me', self.myLoc, 'ma position');
      });
    },
    centerToMyPosition: function(){
      var self = this;
      if(window.localStorage.getItem('user.coords.latitude') != null && window.localStorage.getItem('user.coords.longitude') != null){
        self.map.panTo(new google.maps.LatLng(JSON.parse(window.localStorage.getItem('user.coords.latitude')), JSON.parse(window.localStorage.getItem('user.coords.longitude'))));
      }else{
        navigator.geolocation.getCurrentPosition(function(pos){
          console.log(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          self.map.panTo(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          window.localStorage.setItem('user.coords.latitude', JSON.stringify(pos.coords.latitude));
          window.localStorage.setItem('user.coords.longitude', JSON.stringify(pos.coords.longitude));
        });
      }
      
      // var circleOptions = {
      //     center: new google.maps.LatLng(JSON.parse(window.localStorage.getItem('user.coords.latitude')), JSON.parse(window.localStorage.getItem('user.coords.longitude'))),
      //     fillOpacity: 0.05,
      //     strokeOpacity:0.05,
      //     map: self.map,
      //     radius: parseInt(JSON.parse(window.localStorage.getItem('map.search.distance')))*1000
      // };
      // var myCircle = new google.maps.Circle(circleOptions);
      // self.map.fitBounds(myCircle.getBounds());

      self.setZoomLevel(new google.maps.LatLng(JSON.parse(window.localStorage.getItem('user.coords.latitude')), JSON.parse(window.localStorage.getItem('user.coords.longitude'))));
      self.setZoomLevel(new google.maps.LatLng(JSON.parse(window.localStorage.getItem('user.coords.latitude')), JSON.parse(window.localStorage.getItem('user.coords.longitude'))));

    },
    setZoomLevel: function(latlng){
      console.log(latlng);
      console.log('passage dans setzoomlevel');
      var self = this;
      var circleOptions = {
          center: latlng,
          fillOpacity: 0.0,
          strokeOpacity:0.0,
          map: self.map,
          radius: parseInt(JSON.parse(window.localStorage.getItem('map.search.distance')))*1000
      };
      console.log(circleOptions);
      var myCircle = new google.maps.Circle(circleOptions);
      self.map.fitBounds(myCircle.getBounds());
    },
    getDistance: function(){
      return JSON.parse(window.localStorage.getItem('map.search.distance'));
    },
    setDistance: function(value){
      window.localStorage.setItem('map.search.distance', JSON.stringify(value));
    },
    getMapBounds: function(){
      var bounds = {
        lt1: this.map.getBounds().Da.j,
        lt2: this.map.getBounds().Da.k,
        lg1: this.map.getBounds().va.j,
        lg2: this.map.getBounds().va.k
      };
      // console.log(this.map.zoom);
      // console.log(bounds);
      return bounds;
    },
    centerOnAddress: function(address){
      var self = this;
      // var myMarker;
      var GeocoderOptions = {
          'address' : address,
          'region' : 'FR'
      }
     
      // Notre fonction qui traitera le resultat
      function GeocodingResult( results , status )
      {
        if( status == google.maps.GeocoderStatus.OK ){

          if(self.myMarker != null) {
              self.myMarker.setMap(null);
          }

          self.myMarker = new google.maps.Marker({
            position: results[0].geometry.location,
            map: self.map,
            title: address
          });


          self.map.panTo(results[0].geometry.location);
          self.setZoomLevel(results[0].geometry.location);
        }else{
          console.log('NOT OK');
        }
      }
     
      var myGeocoder = new google.maps.Geocoder();
      myGeocoder.geocode( GeocoderOptions, GeocodingResult );
      window.location.href = "#/tab/stations";
    },
    setMarkersForBounds: function(bounds){
      var self = this;
      

      var urlMarkers = 'http://xibox-preprod.siplec.com/station?key=0ea78fddca2904bc4ae70f3ee5da9b01a297878&lt1=' + bounds.lt1 + '&lg1=' + bounds.lg1 + '&lt2=' + bounds.lt2 + '&lg2=' + bounds.lg2 + '&ens=LECLERC&nbmax=50&prod=ELEC';
      console.log('url map : ' + urlMarkers);
      $http.get(urlMarkers)
        .success(function(data, status, headers, config){
          // if(self.markers){
          //   for (var i = 0; i < self.markers.length; i++) {
          //     if(self.getStationLatLng(self.markers[i]).lat <= self.getMapBounds().lt1 && self.getStationLatLng(self.markers[i]).lat >= self.getMapBounds().lt2 && self.getStationLatLng(self.markers[i]).lng >= self.getMapBounds().lg1 && self.getStationLatLng(self.markers[i]).lng <= self.getMapBounds().lg2){
          //       console.log('AOKAOAKOAOKAOAOKAAOKAOKOAKAOK');
          //       self.markers[i].setMap(self.map);
          //     }
          //     //console.log(self.markers[i]);
          //   }
          // }
          self.markers = data;
          for(var i = 0, len = self.markers.length;i<len;i++){
            var lat = self.getStationLatLng(self.markers[i]).lat;
            var lng = self.getStationLatLng(self.markers[i]).lng;

            var myLatlng = new google.maps.LatLng(lat,lng);
            var search = [lat, lng];
            if(self.isLocationFree(search) == true){
              self.setMarker('station', myLatlng, self.markers[i]);
              lookup.push(search);
            }else{
              console.log(self.markers[i].nom + ' déjà enregistré');
            }
          }
        })
        .error(function(data, status, headers, config){

        });
    },
    setAddress: function(address){
      var self = this;
      if(addresses != null){
        addresses.push(address);
      }
      console.log(address);
      if(window.localStorage.getItem('address') != null){
        for(var i=0, len=JSON.parse(window.localStorage.getItem('address')).length;i<len;i++){
          if(JSON.parse(window.localStorage.getItem('address'))[i] == address){
            return;
          }
        }
      }
      window.localStorage.setItem('address', JSON.stringify(addresses));
    },
    getAddresses: function(){
      var self = this;
      if(window.localStorage.getItem('address') != null){
        addresses = JSON.parse(window.localStorage.getItem('address'));
        return addresses;
      }else{
        return;
      }
    },
    getStationLatLng: function(station){
      var ltComma = station.lt.toString().length - 5;
      var lat = station.lt.toString().substring(0, ltComma) + '.' + station.lt.toString().substring(ltComma);

      var lgComma = station.lg.toString().length - 5;
      var lng = station.lg.toString().substring(0, lgComma) + '.' + station.lg.toString().substring(lgComma);
      return {'lat': lat, 'lng': lng};
    },
    isLocationFree: function(search){
      for(var i=0, l=lookup.length;i<l;i++){
        if(lookup[i][0] == search[0] && lookup[i][1] == search[1]){
          return false;
        }
      }
        return true;
    },
    //doesn't work
    setCloseZoom: function(){
      console.log(this.map);
      this.map.setZoom(8);
    },
    getStation: function(stationId){
      var self = this;
      for(var i=0, len=self.markers.length;i<len;i++){
        if(self.markers[i].code == stationId){
          return self.markers[i];
        }
      }
    }
  }
})







.factory('FAQService', function(){
  var FAQ = [{
    Q: "Y aura-t-il des bornes dans tous les centres E.Leclerc ?",
    A: "Dès 2011, E.Leclerc s'est engagé à encourager l'usage du véhicule électrique, en installant des bornes de recharge sur les parkings de ses magasins.  A terme, tous les centres proposeront une infrastructure de recharge à leur clients."
  },{
    Q: "Où sont placées les bornes dans les centres E.Leclerc ?",
    A: "Elles sont généralement placées près de l'entrée des magasins."
  },{
    Q: "Les bornes sont-elles utilisables par tous les véhicules électriques ?",
    A: "Les bornes installées respectent la réglementation ainsi que les préconisations des fabricants. Elles sont donc adaptées pour tous les véhicules électriques qui ont été récemment mis sur le marché."
  },{
    Q: "Combien de temps faut-il pour faire un plein ?",
    A: "Le temps pour faire un plein dépend de la puissance proposée (3, 22 ou 43 kW) et de l'équipement du véhicule."
  },{
    Q: "Ma voiture peut-elle être rechargée pendant que je fais mes courses ?",
    A: "Un client fait ses courses en 50 minutes en moyenne. Un branchement en recharge lente (3 kW) permettra à l'automobiliste de récupérer l'énergie qu'il aura consommée pour le trajet aller/retour jusqu'au magasin."
  },{
    Q: "Est-ce que je peux laisser ma voiture en charge autant de temps que je veux ?",
    A: "La voiture peut rester en charge jusqu'à la charge complète de la batterie. Pour la tarification, il faut se reporter aux conditions appliquées par le magasin concerné."
  },{
    Q: "Est-il risqué de recharger son véhicule quand il pleut ?",
    A: "Il n'y a aucun risque lorsqu'il pleut. Le couple voiture électrique-borne de recharge est prévu pour fonctionner dans ces conditions."
  },{
    Q: "Puis-je téléphoner pendant la charge ?",
    A: "Téléphoner pendant la charge est autorisé et sans danger."
  },{
    Q: "Ma voiture peut-elle être débranchée pendant que je fais mes courses ?",
    A: "Les bornes sont en général équipées d'un dispositif anti-vol du câble branché."
  },{
    Q: "Les bornes sont-elles en libre-service ? Faut-il être abonné ?",
    A: "Selon les magasins E.Leclerc, vous avez accès aux bornes en libre-service ou via un abonnement."
  }];
  return {
    getFAQ: function(){
      return FAQ;
    },
    getFAQAtIndex: function(faqId){
      console.log(FAQ);
      console.log(faqId);
      console.log(FAQ[faqId]);
      return FAQ[faqId];
    }
  };

})




.factory('Infos', function() {
  var Infos = [{
    id: 0,
    title: 'Page infos 1',
    image: 'default',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Qui-vere falsone, quaerere mittimus-dicitur oculis se privasse; Cupiditates non Epicuri divisione finiebat, sed sua satietate. Verba tu fingas et ea dicas, quae non sentias? Duo Reges: constructio interrete. Dempta enim aeternitate nihilo beatior Iuppiter quam Epicurus; Stoicos roga. Primum in nostrane potestate est, quid meminerimus? Sit hoc ultimum bonorum, quod nunc a me defenditur'
  }, {
    id: 1,
    title: 'Page infos 2',
    image: 'default',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Qui-vere falsone, quaerere mittimus-dicitur oculis se privasse; Cupiditates non Epicuri divisione finiebat, sed sua satietate. Verba tu fingas et ea dicas, quae non sentias? Duo Reges: constructio interrete. Dempta enim aeternitate nihilo beatior Iuppiter quam Epicurus; Stoicos roga. Primum in nostrane potestate est, quid meminerimus? Sit hoc ultimum bonorum, quod nunc a me defenditur'
  }, {
    id: 2,
    title: 'Page infos 3',
    image: 'default',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Qui-vere falsone, quaerere mittimus-dicitur oculis se privasse; Cupiditates non Epicuri divisione finiebat, sed sua satietate. Verba tu fingas et ea dicas, quae non sentias? Duo Reges: constructio interrete. Dempta enim aeternitate nihilo beatior Iuppiter quam Epicurus; Stoicos roga. Primum in nostrane potestate est, quid meminerimus? Sit hoc ultimum bonorum, quod nunc a me defenditur'
  }, {
    id: 3,
    title: 'Page infos 4',
    image: 'default',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Qui-vere falsone, quaerere mittimus-dicitur oculis se privasse; Cupiditates non Epicuri divisione finiebat, sed sua satietate. Verba tu fingas et ea dicas, quae non sentias? Duo Reges: constructio interrete. Dempta enim aeternitate nihilo beatior Iuppiter quam Epicurus; Stoicos roga. Primum in nostrane potestate est, quid meminerimus? Sit hoc ultimum bonorum, quod nunc a me defenditur'
  }, {
    id: 4,
    title: 'Conditions d\'utilisation',
    image: '',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Qui-vere falsone, quaerere mittimus-dicitur oculis se privasse; Cupiditates non Epicuri divisione finiebat, sed sua satietate. Verba tu fingas et ea dicas, quae non sentias? Duo Reges: constructio interrete. Dempta enim aeternitate nihilo beatior Iuppiter quam Epicurus; Stoicos roga. Primum in nostrane potestate est, quid meminerimus? Sit hoc ultimum bonorum, quod nunc a me defenditur'
  }];
  return {
    all: function() {
      return Infos;
    },
    get: function(infoId) {
      for (var i = 0; i < Infos.length; i++) {
        if (Infos[i].id === parseInt(infoId)) {
          return Infos[i];
        }
      }
      return null;
    }
  }
});






