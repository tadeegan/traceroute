var google_map;
var locationArray = [];
var num_locations = 0;
var locations_collected = 0;
function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  google_map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);


}
google.maps.event.addDomListener(window, 'load', initialize);


function getJsonForIp(ip){
	console.log("getting: " + ip)
	$.get( "/trace.json?ip='" + ip + "'", function( data ) {
		num_locations = data.length;
		console.log(data);
	  //var data = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
    $.each(data, function(i) {
      if(!(i%1)) tRow = $('<tr>');
      
      var ip = data[i].replace(/\)/,"").replace(/\(/,"")
      tCell = $('<td>').html(ip);
    	tCell_loc = $('<td>').html("pulling..");
    	getLocationForIp(ip, tCell_loc, locationArray[i] = {});
      $('table#result').append(tRow.append(tCell).append(tCell_loc));
    });
	});
}
function getLocationForIp(ip, cell, location_obj){
	$.get("http://freegeoip.net/json/" + ip, function( data) {
		console.log(data);
		cell.html(data.city + " " + data.region_name + "(" + data.latitude + "," + data.longitude + ")");
		location_obj.data = data;
		locations_collected ++;
		if(locations_collected == num_locations) drawPath(locationArray, google_map);
	});
}
function drawPath(locations, map){
  console.log("drawing new path");
	var path = [];
	$.each(locations, function(i){
    if(locations[i].data.country_name != "Reserved")
		  path.push(new google.maps.LatLng(locations[i].data.latitude, locations[i].data.longitude));
	});
	var flightPath = new google.maps.Polyline({
	  path: path,
	  strokeColor: "#FF0000",
	  strokeOpacity: 1.0,
	  strokeWeight: 2
	});
  flightPath.setMap(map);
}
