var sys = require('sys')
var exec = require('child_process').exec;
var url = require('url');

var child;

var express = require('express');
var stylus = require('stylus');
var nib = require('nib');

var keys = require('./keys');

var app = express();



function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  )
})

app.get('/trace', function (req, res) {
	console.log("tracing ip! " + req.query.ip);
  res.render('trace',
  { title : 'Trace' + req.query.ip
  , address: req.query.ip
	, gmaps_key: keys.key_for('google_maps')
	}
  )
})

app.get('/trace.json', function(req, res){
  console.log("traceroute " + req.query.ip);
  child = exec("traceroute " + req.query.ip, function (error, stdout, stderr) {
  	finished_trace(res, stdout);
  });
});

function finished_trace(res, raw_trace){
	var re = /[(][0-9]*[.][0-9]*[.][0-9]*[.][0-9]*[)]/g;
	var ip_list = [];

	console.log("starting parse: \n" + raw_trace);

	var result;
	while ((result = re.exec(raw_trace)) !== null)
	{
		console.log(result[0]);
	  ip_list.push(result[0]);
	}

	console.log(ip_list.join());

	res.json(ip_list);
	res.send();
}

app.listen(3000);
console.log('Listening on port 3000');