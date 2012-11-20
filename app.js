var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

//our app will be running on http://localhost:8999
app.listen(8999);

//stuffs required to serve the initial request from the client
//we just need to serve the home page of the app here..
function handler ( req, res ) {
  fs.readFile( __dirname + '/index.html' ,
  function ( err, data ) {
    if ( err ) {
      console.log( err );
      res.writeHead(500);
      return res.end( 'Error loading index.html' );
    }
    res.writeHead( 200 );
    res.end( data );
  });
};

//mother of all Socket.IO events
//'connection' event is executed automatically when a client connects or a socket instance is created 
//at the client side
io.sockets.on( 'connection', function ( socket ) {

	var secondsCounter=0;
	//we emit the custom events to the client side
	//this function executes every single second
	setInterval(function() {
		secondsCounter++;
		//create an object to be sent across..
		var result = {};
		//get current timestamp and assign it to a key 
		result.time = new Date();
		//check if 10 secs is up 
		if(secondsCounter % 10 == 0){
			result.alertMsg = secondsCounter +' seconds up!';
			console.log('sending tenSecondNotification');
			socket.volatile.emit( 'tenSecondNotification' , result );
		}
		console.log('sending singleSecondNotification');
		socket.volatile.emit( 'singleSecondNotification' , result );
	},1000);
  
});