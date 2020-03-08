var http = require('http');
var sys = require('sys');
var fs = require('fs');

http.createServer(function(req, res) {
  debugHeaders(req);

  if (req.headers.accept && req.headers.accept == 'text/event-stream') {
    if (req.url == '/events') {
      sendSSE(req, res);
    } else {
      res.writeHead(404);
      res.end();
    }
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(fs.readFileSync(__dirname + '/sse-node.html'));
    res.end();
  }
}).listen(8000);

var names = ['Amit', 'Sumit', 'Akash', 'Rohit', 'Josh', 'Samba'];
var messages = [' is awesome programmer', ' is great programmer', ' is marvellous programmer', ' is prominent programmer']


function sendSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  var id = Math.random();

  setInterval(function() {
    constructSSE(res, id, getMessage());
  }, 5000);

  constructSSE(res, id, 'Time is '+ (new Date()).toLocaleTimeString());
  //res.end();
}


function constructSSE(res, id, data) {
  res.write('id: ' + id + '\n');
  res.write("data: " + data + '\n\n');
}

function debugHeaders(req) {
  sys.puts('URL: ' + req.url);
  for (var key in req.headers) {
    sys.puts(key + ': ' + req.headers[key]);
  }
  sys.puts('\n\n');
}

function getMessage(){
	return names[Math.floor(Math.random() * names.length)]+ messages[Math.floor(Math.random() * messages.length)];
}
