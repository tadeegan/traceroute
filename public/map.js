function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);


function getJsonForIp(ip){
	console.log("getting: " + ip)
	$.get( "/trace.json?ip='" + ip + "'", function( data ) {
		console.log(data);
	  //var data = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
    $.each(data, function(i) {
      if(!(i%1)) tRow = $('<tr>');
      
      var ip = data[i].replace(/\)/,"").replace(/\(/,"")
      tCell = $('<td>').html(ip);
    	tCell_loc = $('<td>').html("pulling..");
    	getLocationForIp(ip, tCell_loc);
      $('table#result').append(tRow.append(tCell).append(tCell_loc));
    });
	});
}
function getLocationForIp(ip, cell){
	$.get("http://freegeoip.net/json/" + ip, function( data) {
		console.log(data);
		cell.html(data.city + " " + data.region_name + "(" + data.latitude + "," + data.longitude + ")");
	});
}