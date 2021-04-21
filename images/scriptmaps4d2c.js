function addLocation(msgtype,addr){
        var inputvalue = addr
	jQuery.post(
	    post.ajaxurl, 
	    {
		action: 'add_locations',
		data:   [msgtype,inputvalue]
	    }, 
	    function(response){
		jQuery('body').append(response);
	    }
	);
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

var checkCookie = function() {


    return function() {

		var forcePickup = getCookie('forcePickup');
		document.cookie = "forcePickup=0;path=/"
        if (forcePickup=='1') {
			jQuery("#delivery_checkbox").trigger("click");
            addLocation(41,'forcePickup')
        }
		

    };
}();

window.setInterval(checkCookie, 100);

var mapCheckout;
var geocoderCheckout;
var markerCheckout;
var polygonCheckout;
var polygonCheckout2;
var boundsCheckout;
var showMap1=true;
var showMap2=false;
var polyOption=1

function nima_map_checkout(){

	//console.log("mapcheckout");
	initMap();
	function initMap() {
        //console.log("initmap");
		mapCheckout = new google.maps.Map(document.getElementById('map'), {
		center: center,
		zoom: 11,
		scaleControl: false,
		scrollwheel: false,
		styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
	});

	geocoder = new google.maps.Geocoder();
	boundsCheckout = new google.maps.LatLngBounds();
	google.maps.event.addListenerOnce(mapCheckout, 'tilesloaded', function(evt) { 
		bounds = mapCheckout.getBounds();
	});

 	markerCheckout = new google.maps.Marker({
			position: center
	}); 
	
	polygon = new google.maps.Polygon({
      path: area,
      geodesic: true,
      strokeColor: '#FFd000',
      strokeOpacity: 1.0,
      strokeWeight: 4,
      fillColor: '#FFd000',
      fillOpacity: 0.35
	});

	polygon2 = new google.maps.Polygon({
		path: area2,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 4,
		fillColor: '#FF0000',
		fillOpacity: 0.35
	});
	
	polygon3 = new google.maps.Polygon({
		path: area3,
		geodesic: true,
		strokeColor: '#00FF00',
		strokeOpacity: 1.0,
		strokeWeight: 4,
		fillColor: '#00FF00',
		fillOpacity: 0.35
	});
	
	//used to know what map to draw on the checkout page; this hidden element is outputed from functions.php depending on what categories of products are in the cart
	var polyType = document.getElementById('polyOption'); 
	if (polyType.value=="subscriptions") {
		polyOption=2;
		polygon2.setMap(mapCheckout);		
	} else if  (polyType.value=="cakes") {
		//alert("cucu");
		polyOption=3;
		polygon3.setMap(mapCheckout);
	} else {
		polyOption=1;
		polygon.setMap(mapCheckout);
	}
	
/* 	document.getElementById("shipping_address_1").defaultValue='';
	document.getElementById('shipping_address_1').value=''
	document.getElementById('shipping_address_2').value=1;
	document.getElementById('billing_address_1').value='';
	document.getElementById('billing_address_2').value=1; */

	
    var inputCheckout = document.getElementById('billing_address_1')
	var inputCheckout2 = document.getElementById('billing_address_2');

    var optionsCheckout = {
            componentRestrictions: {country: "ro"},
            strictBounds: true,
            types: ['address'],
    };



    var autocompleteCheckout = new google.maps.places.Autocomplete(inputCheckout, optionsCheckout);
	//autocompleteCheckout.setFields(document.getElementById("billing_address_2"));
    autocompleteCheckout.bindTo('bounds', mapCheckout);

    //google.maps.places.Autocomplete(autocompleteCheckout, 'place_changed', function() {
    	//debugger;
    //})

    /*autocompleteCheckout.addListener('place_changed', function() {
        var place = autocompleteCheckout.getPlace();
        // document.getElementById("billing_address_1").value=place.formatted_address;
    });*/
 	document.getElementById("billing_address_1").addEventListener('change',function() {
		console.log('add1!');
		google.maps.event.trigger(autocompleteCheckout, 'place_changed');
		
			
	});  
	document.getElementById("billing_address_2").addEventListener('change',function() {
		console.log('add2!');
		markerCheckout.setMap(null);
		document.getElementById("shipping_address_2").value=document.getElementById("billing_address_2").value;
		jQuery(document.body).trigger("update_checkout");
		//google.maps.event.trigger(autocompleteCheckout, 'place_changed');
	});
	
	
	autocompleteCheckout.addListener('place_changed', function() {
		markerCheckout.setMap(null);
		var addressText = document.getElementById("billing_address_1").value;
		
		if ((!addressText.includes('Bucharest')) && (!addressText.includes('Bucure')) && (addressText.length>3)) {
			addressText = addressText.concat(', Bucuresti');
			jQuery("#billing_address_1").val(addressText);
			jQuery("#billing_address_1").attr("value", addressText);
		}
		//document.getElementById('billing_address_1').value=document.getElementById('billing_address_1').value.concat(" ",document.getElementById("billing_address_2").value);
		var place = autocompleteCheckout.getPlace();
		
		jQuery("#shipping_address_1").val(document.getElementById("billing_address_1").value);
		//jQuery('#shipping_method_0_custom_distance_rate').attr('checked',true);
		//$aux=document.getElementById("billing_address_2").value;
		//document.getElementById("shipping_address_2").value=document.getElementById("billing_address_2").value+2;
		//document.getElementById("shipping_address_2").value=document.getElementById("billing_address_2").value;
		

			jQuery(document.body).trigger("update_checkout");

		

		//document.getElementById("shipping_address_1").trigger('change');

		//document.getElementById("billing_address_1").value=place.formatted_address;
		//document.getElementById("billing_address_1").value=document.getElementById("billing_address_1").value.' '.document.getElementById("billing_address_2").value;

		if (place!=null) {
		console.log(addressText);
		/* jQuery("#billing_address_1").val(place.formatted_address);
		jQuery("#billing_address_1").attr("value", place.formatted_address); */
		jQuery("#billing_address_1").val(addressText);
		jQuery("#billing_address_1").attr("value", addressText);
		}
		document.cookie = "forcePickup=0;path=/"
/* 		var forcePickup = getCookie('forcePickup');
		if (forcePickup=='1') {
			jQuery("#pickup_checkbox").prop("checked", true).trigger("click");
		} */
		//var newBounds = new google.maps.LatLngBounds(bounds.getSouthWest(), bounds.getNorthEast()); //Changed
		// removed newBounds = bounds;
/* 		if (!place.geometry) {
			geocodeAddress(document.getElementById('shipping_address_1').value.concat(",",document.getElementById("shipping_address_2").value));
			//window.alert("Autocomplete's returned place contains no geometry");
			jQuery("#shipping_address_1").val(document.getElementById("billing_address_1").value);
			jQuery(document.body).trigger("update_checkout");
			return; 
		};*/
		//markerCheckout.setPosition(place.geometry.location);
		//markerCheckout.setMap(mapCheckout);
	}); 
	

	document.getElementById('shipping_address_1').value=''
	document.getElementById('shipping_address_2').value='';
	document.getElementById('billing_address_1').value='';
	document.getElementById('billing_address_2').value='';
	//document.getElementById('billing_adress2').value='';
	google.maps.event.trigger(autocompleteCheckout, 'place_changed');

//not sure if this is used ever
function geocodeAddress(addr) {
	//window.alert("cucu");
	console.log(addr);
	geocoder.geocode({'address': addr}, function(results, status) {
	  if (status === 'OK') {
  		var newBounds = new google.maps.LatLngBounds(bounds.getSouthWest(), bounds.getNorthEast());
		  markerCheckout.setPosition(results[0].geometry.location);
		  markerCheckout.setMap(mapCheckout);
		  newBounds.extend(results[0].geometry.location);

		 /*  if (google.maps.geometry.poly.containsLocation(results[0].geometry.location, polygon) && google.maps.geometry.poly.containsLocation(results[0].geometry.location, polygon2)){
						addLocation(1*polyOption);	
		  } else if (google.maps.geometry.poly.containsLocation(results[0].geometry.location, polygon) && polyOption!=3){
			   addLocation(2);	
		  }
		  else if (google.maps.geometry.poly.containsLocation(results[0].geometry.location, polygon2) && polyOption!=2){
			   addLocation(3);	
		  }
		  else { 
			addLocation(4);
		  }; */
		  addLocation(30,addr);
	  } else {
		alert('Geocode was not successful for the following reason: ' + status);
	  }
	});
};
  }
}




var map;
var polygon;
var polygon2;
var polygon3;
var geocoder;
var marker;
var bounds;

function nima_map_homepage(){

	//console.log("maphome");
	initMap();
	function initMap() {
        //console.log("initmap");
		//console.log(area2);
		var zoomLevel=11;
		//on product pages make the zoom level smaller as the map is smaller also
		if (polyOption!=1) {
			zoomLevel=11;
		}
		map = new google.maps.Map(document.getElementById("map"), {
		center: center,
		zoom: zoomLevel,
		scaleControl: false,
		scrollwheel: false,
		styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
	});
	geocoder = new google.maps.Geocoder();
	bounds = new google.maps.LatLngBounds();
	google.maps.event.addListenerOnce(map, 'tilesloaded', function(evt) { 
		bounds = map.getBounds();
	});
/* 	var image = {
	  url: place.icon,
	  size: new google.maps.Size(71, 71),
	  scaledSize: new google.maps.Size(25, 25)
	}; */
/* 	marker = new google.maps.Marker({
			position: center,
			icon: image
	}); */
	
 	marker = new google.maps.Marker({
			position: center
	}); 
	polygon = new google.maps.Polygon({
		path: area,
		geodesic: true,
		strokeColor: '#FFd000',
		strokeOpacity: 1.0,
		strokeWeight: 4,
		fillColor: '#FFd000',
		fillOpacity: 0.35
	});

	polygon2 = new google.maps.Polygon({
		path: area2,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 4,
		fillColor: '#FF0000',
		fillOpacity: 0.35
	});
	
	polygon3 = new google.maps.Polygon({
		path: area3,
		geodesic: true,
		strokeColor: '#00FF00',
		strokeOpacity: 1.0,
		strokeWeight: 4,
		fillColor: '#00FF00',
		fillOpacity: 0.35
	});
  
   //read checkbox values to know what polygons to draw
	var optMeniuElem=document.getElementById("optMeniu");
	var optAbonamenteElem=document.getElementById("optAbonamente");
	var optTorturi=document.getElementById("optTorturi");
	if (typeof(optMeniuElem) != 'undefined' && optMeniuElem != null) {
		showMap1=optMeniuElem.checked;
	}
	if (typeof(optAbonamenteElem) != 'undefined' && optAbonamenteElem != null) {
			showMap2=optAbonamenteElem.checked;
	}
	
	if (typeof(optTorturi) != 'undefined' && optTorturi != null) {
			showMap3=optTorturi.checked;
	}

	//homepage&1st checkbox checked or a regular menu product page
	if ((showMap1 && (polyOption==1)) || (polyOption==2)) {
       polygon.setMap(map);			
	}	else {
		polygon.setMap(null);	
	};
	
	//homepage&1st checkbox checked or a subscription product page
	if ((showMap2 && (polyOption==1)) || (polyOption==3)) {
       polygon2.setMap(map);			
	} 	else  {
		polygon2.setMap(null);
	};

	//homepage&1st checkbox checked or a cakes product page
	if ((showMap3 && (polyOption==1)) || (polyOption==4)) {
       polygon3.setMap(map);			
	} 	else  {
		polygon3.setMap(null);
	};
	
	var input = document.getElementById('pac-input');
	var types = document.getElementById('type-selector');
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);
	var options = {
	  componentRestrictions: {country: "ro"},
	  strictBounds: true,
	  types: ['address']
	 };
	var autocomplete = new google.maps.places.Autocomplete(input,options);
	autocomplete.bindTo('bounds', map);
	
    autocomplete.addListener('place_changed', function() {
		marker.setMap(null);
		var place = autocomplete.getPlace();
	        var newBounds = new google.maps.LatLngBounds(bounds.getSouthWest(), bounds.getNorthEast()); //Changed
		// removed newBounds = bounds;
          if (!place.geometry) {
						geocodeAddress(input.value);        
            //window.alert("Autocomplete's returned place contains no geometry");
            return;
          };
		  //console.log(input.value);
		  $addresa_cautata=input.value;
		  marker.setPosition(place.geometry.location);
		  marker.setMap(map);
		  //if polyOption=1 (homepage) we inform the user that the address is in both polygones; otherwise, if he is on a product page we only care about that product's polygon
		  if (showMap1) {
			  if (google.maps.geometry.poly.containsLocation(place.geometry.location, polygon)) {
				  addLocation(11,$addresa_cautata);	
			  } else addLocation(10,$addresa_cautata);
		  } else if (showMap2) {
			  if (google.maps.geometry.poly.containsLocation(place.geometry.location, polygon2)) {
				  addLocation(21,$addresa_cautata);	
			  } else addLocation(20,$addresa_cautata);
		  } else if (showMap3) {
			  if (google.maps.geometry.poly.containsLocation(place.geometry.location, polygon3)) {
				  addLocation(31,$addresa_cautata);	
			  } else addLocation(30,$addresa_cautata);
		  };
	   });
}

//not sure if this is used ever
function geocodeAddress(addr) {
	//window.alert("cucu");
	//console.log(addr);
	geocoder.geocode({'address': addr}, function(results, status) {
	  if (status === 'OK') {
  		var newBounds = new google.maps.LatLngBounds(bounds.getSouthWest(), bounds.getNorthEast());
		  marker.setPosition(results[0].geometry.location);
		  marker.setMap(map);
		  newBounds.extend(results[0].geometry.location);

		 /*  if (google.maps.geometry.poly.containsLocation(results[0].geometry.location, polygon) && google.maps.geometry.poly.containsLocation(results[0].geometry.location, polygon2)){
						addLocation(1*polyOption);	
		  } else if (google.maps.geometry.poly.containsLocation(results[0].geometry.location, polygon) && polyOption!=3){
			   addLocation(2);	
		  }
		  else if (google.maps.geometry.poly.containsLocation(results[0].geometry.location, polygon2) && polyOption!=2){
			   addLocation(3);	
		  }
		  else { 
			addLocation(4);
		  }; */
		  if (showMap1) {
			  if (google.maps.geometry.poly.containsLocation(results[0].geometry.location, polygon)) {
				  addLocation(11,addr);	
			  } else addLocation(10,addr);
		  } else if (showMap2) {
			  if (google.maps.geometry.poly.containsLocation(results[0].geometry.location, polygon2)) {
				  addLocation(21,addr);	
			  } else addLocation(20,addr);
		  } else if (showMap3) {
			  if (google.maps.geometry.poly.containsLocation(results[0].geometry.location, polygon3)) {
				  addLocation(31,addr);	
			  } else addLocation(30,addr);
		  };
	  } else {
		alert('Geocode was not successful for the following reason: ' + status);
	  }
	});
}; 
}
//*************************

var center = new google.maps.LatLng(44.4436608, 26.0858543);
var area = [];
var area2 = [];
var area3 = [];

function getFirstPolygon() {
	//console.log("first");
	return jQuery.post(
	    post.ajaxurl, 
	    {
		action: 'nima_get_poly_coords',
	    }, 
	    function(response){
		//console.log(response);
		area = JSON.parse(response);
	    }
	);
 }

function getSecondPolygon() {
	return jQuery.post(
	    post.ajaxurl, 
	    {
		action: 'nima_get_poly_coords2',
	    }, 
	    function(response){
		//console.log(response);
		area2 = JSON.parse(response);
	    }
	);
 }
 
function getThirdPolygon() {
	return jQuery.post(
	    post.ajaxurl, 
	    {
		action: 'nima_get_poly_coords3',
	    }, 
	    function(response){
		//console.log(response);
		area3 = JSON.parse(response);
	    }
	);
 }

//depending on the class, it runs different functions and sets some global variables; the variables are used to know what polygon to draw
function showMap() {
	if(jQuery('.mapcheckout').length){
                    nima_map_checkout();
                } else if(jQuery('.maphomepage').length){
                    nima_map_homepage(); //polyOption here is 1 by default
                } else if(jQuery('.meniu').length){
					//console.log("meniu");
					polyOption=2; //regular menu polygon; used in product page
                    nima_map_homepage();
                } else if(jQuery('.abonamente').length){
					//console.log("abonamente");
					polyOption=3; //subscriptions polygon; used in product page
                    nima_map_homepage();
                } 
/* 				else {
					nima_map_homepage();
				} */
}

//possibly not used
function showPoly(categOption) {
	if (categOption==3) {
		polygonCheckout.setMap(mapCheckout);
		
	}
}

//method called when a checkbox is checked/unchecked in home page; depending on the checkbox it shows/hides polygon
function polyChange(){
	
	showMap1=document.getElementById("optMeniu").checked;
	showMap2=document.getElementById("optAbonamente").checked;
	showMap3=document.getElementById("optTorturi").checked;
	
	if (showMap1) {
	   polygon.setMap(map);			
	}	else {
		polygon.setMap(null);	
	}
	
	if (showMap2) {
	   polygon2.setMap(map);			
	} 	else  {
		polygon2.setMap(null);
	}
	
	if (showMap3) {

	   polygon3.setMap(map);			
	} 	else  {
		polygon3.setMap(null);
	}
	
}

jQuery.when(getFirstPolygon(), getSecondPolygon(), getThirdPolygon())
    .then(function () {

        showMap();
	
    });




