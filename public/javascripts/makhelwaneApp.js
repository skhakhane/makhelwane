var app = angular.module('makhelwaneApp', ['ngRoute', 'ui.bootstrap', 'ngResource', 'ng-fusioncharts']).run(function($http, $rootScope){

   $rootScope.authenticated = false;
    $rootScope.current_user = '';

    
    $rootScope.signout = function(){
      $http.get('auth/signout');''
      $rootScope.authenticated = false;
      $rootScope.current_user = '';
    };
 
  });


app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/main', {
      templateUrl: 'main.html',
      controller: 'mainController'
    })
    
    .when('/dashboard', {
      templateUrl: 'dash.html',
      controller: 'mainController'
    })
      //the signup display
    .when('/', {
      templateUrl: 'signin.html',
      controller: 'mainController'
    });
});


app.controller('mainController', function($scope, $rootScope, $http, $location){

  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

 

 $scope.getMaintain = function(){

  $http.get('/api/users').then(function(data){
       if(!data){
          /* Implement an error function */
       }
       else{
          $scope.data = {
            model: null,
            availableOptions: data.data
           };
       }
     
     });
  
  };

$scope.assign = function(assignee){

//alert("option");
//$http.put('/api/incidents/'+assignee).then(function(data){
  //     if(data){
//
  //         alert(data.data.comment);
    //      }
      // else
       //{   
        //  alert("ntokoz");
      // }
//});
};

$scope.getIncidents1 = function(){

      var incs1 = [];

      $http.get('/api/incidents/').then(function(data){
       if(data.data.state == 'success'){
           alert(data.data);
          }
       else
       {         
           $scope.incs1 = data.data;
          //alert(data.data[1].comment);
        }
      }
    )};

//Get all incidents and plot them.
$scope.getIncidents = function(){

      var incidents = [];

      $http.get('/api/incidents/').then(function(data){
       if(data.data.state == 'success'){
           alert(data.data);
          }
       else
       {         
          incidents = data.data;
          
          var mapOptions = {
          zoom: 13,
          center: new google.maps.LatLng(-26.312383,31.125903),
          mapTypeId: google.maps.MapTypeId.hybrid,
          /*styles:
          [
            {
              "stylers":[
                {
                  "color": "#755f5d"
                }
              ]
            }
          ]*/
          }

          $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

          $scope.incs = [];
          
          var infoWindow = new google.maps.InfoWindow();
          
          var createMarker = function (info, image){
          var marker = new google.maps.Marker({
              map: $scope.map,
              position: new google.maps.LatLng(info.latitude, info.longitude),
              title: info.capture,
              //icon: icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_AZURE)),
              icon: image,
              id:info._id
          });
          marker.content = '<img src="'+info.picture+'" alt="..."  style="height:150px; width:200px;"><br>' + info.comment + '<br />' + info.latitude + ' E,' + info.longitude +  ' N, <br /><strong>'+info.createdAt+'</strong></div>';
          
          google.maps.event.addListener(marker, 'click', function(){
              infoWindow.setContent('<div class="infoWindowContent" align="center" style="height:220px; width:300px;"><h2>' + marker.title + '</h2><br>' + 
                marker.content);
                $scope.getLocations(marker.id);  
               
               infoWindow.open($scope.map, marker);

              });
          //infoWindow.click(alert('window ckicked'));
          $scope.incs.push(marker);
          
          }  
          var image = "";
          for (i = 0; i < incidents.length; i++){
              
              //console.log (incidents[i].capture);

              if (incidents[i].status == 'Not assigned')
              {
                  image = 'http://www.googlemapsmarkers.com/v1/U/0099FF/';
                   createMarker(incidents[i], image);

              }
              else if (incidents[i].status == 'Resolved')
              {
                   image = 'http://www.googlemapsmarkers.com/v1/A/009900/';
                    createMarker(incidents[i], image);
              }
              else if (incidents[i].status == 'Assigned')
              {
                   image = 'http://www.googlemapsmarkers.com/v1/ffc266/';
                    createMarker(incidents[i], image);
              }
               else if (incidents[i].status == 'Not attended')
              {
                   image = 'http://www.googlemapsmarkers.com/v1/FF0000/';
                    createMarker(incidents[i], image);
              }
              
             
              //image = "";*/
          }

          $scope.openInfoWindow = function(e, selectedMarker){
              e.preventDefault();
              google.maps.event.trigger(selectedMarker, 'click');
          }
            

     }
 });
};

////get user detailes from the DB
$scope.login = function(){
  //$http.post('/auth/login', $scope.user).then(function(data){
      if($scope.user.password == 'password'){
        $rootScope.authenticated = true;
        $rootScope.current_user = $scope.user.username;
        $location.path('/main');
      }
      else
      {
         $scope.error_message = "please ender correct password";
         $location.path('/');
      }     
   //});
};

//Locate one clicked incident
$scope.getLocations = function(id){
    $http.get('/api/incidents/'+id).then(function(data){
       if(data.data.state == 'success'){
          alert(data.data);
       }
       else{
          $scope.incs = data.data;
       }
     });
  };

  


  $scope.respond = function(){

      //$scope.user = this.post;

       $('#responseModal').modal('show');
       

  } ;

   $scope.assign= function(){

      //$scope.user = this.post;

       $('#assignModal').modal('show');
       

  } ;
//Refresh incidents Map every two minutes.
/*setInterval(function(){
  $scope.getMaintain();
  $scope.getIncidents();
}, 120000);*/

  $scope.getMaintain();
  $scope.getIncidents();
  $scope.getIncidents1();
 
});

 app.controller('MyController', function ($scope, $http) {



              $scope.getdata = function(){

                $http.get('/api/statistics').then(function(data){
                     if(data){
                        
                        //$scope.data = data.data;
                         //alert(data.data);
                        //console.log(JSON.stringify(data.data,null,2));
                     }
                     else{

                        /* Implement an error function */
                         //alert(data.data);

                         return res.json(data);
                        //console.log("Pass"+ JSON.stringify(data.data,null,2))
                     }
                   
                   });
                
                };
               

var data = $scope.getdata();


              $scope.myDataSource = {
                chart: {
                    caption: "Incidents",
                    bgcolor: "#FFFFFF",
                    pieyscale: "70",
                    showpercentvalues: "0",
                    showpercentintooltip: "1",
                    palettecolors: "#1096a3, #91AF64, #B0BF92,#D0DFA3, #E0F0E0",
                    showborder: "0"
                },
                data: data
              };
            

            $scope.myDataSource1 = {
                chart: {
                    caption: "Incoming SMS",
                    bgcolor: "#FFFFFF",
                    pieyscale: "70",
                    showpercentvalues: "0",
                    showpercentintooltip: "1",
                    palettecolors: "#91AF64,#B0BF92,#D0DFA3,#E0F0E0, #1096a3",
                    showborder: "0"
                },
                data:[{
                    label: "Mbabane",
                    value: "880"
                },
                {
                    label: "eZulwini",
                    value: "730"
                },
                {
                    label: "Manzini",
                    value: "590"
                },
                {
                    label: "Nhlangano",
                    value: "520"
                },
                {
                    label: "Simunye",
                    value: "330"
                }]
              };
            });