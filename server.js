require('dotenv').config();
var express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
app = express();
server = require('http').createServer(app);
port = process.env.PORT || 8080;
io = require('socket.io')(server);
const expressLayouts = require('express-ejs-layouts');
const { getLastPrice } = require('./services/game-logics');
const GameLogics = require('./services/game-logics');

const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
const SMS_SECRET_KEY = process.env.SMS_SECRET_KEY;


// middilewares
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors({ origin: 'https://143.110.182.130', credentials: true }));
app.use(cookieParser());

gameSocket = null;

// global variables for the server
var playerSpawnPoints = [];
var clients = []; // Store Client list

app.use("/TemplateData",express.static(__dirname + "/TemplateData"));
app.use("/Build",express.static(__dirname + "/Build"));
app.use(express.static(__dirname));

// Start server
server.listen(port, function(){
	console.log(`listening on port ${port}  \n --- server started...`);
});


// Routes
// Redirect response to serve index.html
app.get('/',function(req, res)
        {
            res.sendFile(__dirname + '/index.html');
        });   

app.use('/welcome', require('./routes/index'));		
app.use('/users', require('./routes/user'));	
app.use('/dashboard', require('./routes/dashboard'));	
app.use('/user-authenticate-service', require('./routes/otp-routes'));		


var authenticatedPlayerList = new Map();

// Implement socket functionality
gameSocket = io.on('connection', function(socket){
    
	var currentPlayer = {};
	var playerVariables = {};
	var videoPlayerVariables = {};
	var globalEventVariables = {};
	currentPlayer.name = 'unknown';
	playerVariables.name = currentPlayer.name;
    
    console.log('socket connected: ' + socket.id);

    socket.on('disconnect', function(){
        console.log('socket disconnected: ' + socket.id);
    });
    

    
    socket.on('player linked', function() {
		console.log(' recv: player linked');
        
     });
     
     socket.on('player connect', function() {
		console.log(currentPlayer.name+' recv: player connect');
		

		for(var i =0; i<clients.length;i++) {
			var playerConnected = {
				name:clients[i].name,
				position:clients[i].position,
				rotation:clients[i].position,
				health:clients[i].health
			};
		//	in your current game, we need to tell you about the other players.
			//socket.emit('other player connected', playerConnected);
			console.log(currentPlayer.name+' emit: other player connected: '+JSON.stringify(playerConnected));
		} 
        
     });
     
     socket.on('play',async function(data) {
		console.log(currentPlayer.name+' recv: play: '+JSON.stringify(data));
		// if this is the first person to join the game init the enemies
		if(clients.length === 0) {

			playerSpawnPoints = [];
			data.playerSpawnPoints.forEach(function(_playerSpawnPoint) {
				var playerSpawnPoint = {
					position: _playerSpawnPoint.position,
					rotation: _playerSpawnPoint.rotation
				};
				playerSpawnPoints.push(playerSpawnPoint);
			});
		}

		var randomSpawnPoint = playerSpawnPoints[Math.floor(Math.random() * playerSpawnPoints.length)];
		currentPlayer = {
			email:data.name,
			password: data.password,
			position: randomSpawnPoint.position,
			rotation: randomSpawnPoint.rotation,
			health: 100
		};

		var playerDetails = await GameLogics.getUserDetails(currentPlayer);
		if(playerDetails.authenticated){
			authenticatedPlayerList.set(socket.id, currentPlayer.email);
		}
		clients.push(currentPlayer);
		// in your current game, tell you that you have joined
		console.log(playerDetails.name+' emit: play: '+JSON.stringify(playerDetails));
		socket.emit('play', playerDetails);
		sendMetaData(socket);
		sendLastGameInfo(socket);
		// in your current game, we need to tell the other players about you.
		//socket.broadcast.emit('other player connected', currentPlayer);
	});
    
    socket.on('player register',async function(data) {
		console.log('recv: player register: '+JSON.stringify(data));
		var regUser = {
			fname: data.fname,
			lname: data.lname,
			dob: data.dob,
			country: data.country,
			address1: data.address1,
			address2: data.address2,
			address3: data.address3,
			postalCode: data.postalCode,
			email: data.email,
			password: data.password,
			image: data.image
		}

		var dataChunk = await GameLogics.registerUser(regUser);
		console.log("dataChunk: " +JSON.stringify(dataChunk));
		socket.emit('player register', dataChunk);
	});

	socket.on('player turn', function(data) {
		console.log('recv: turn: '+JSON.stringify(data));
		currentPlayer.rotation = data.rotation;
		socket.broadcast.emit('player turn', currentPlayer);
	});

	socket.on('player variables change', function(data) {
		console.log('recv: player variables changed: '+JSON.stringify(data));
		data.name = currentPlayer.name;
		playerVariables = data;
		console.log(JSON.stringify(playerVariables));
		socket.broadcast.emit('player variables change', playerVariables);
	});

	socket.on('videoplayer variables change', function(data) {
		console.log('recv: videoplayer variables changed: '+JSON.stringify(data));
		data.name = currentPlayer.name;
		videoPlayerVariables = data;
		console.log(JSON.stringify(videoPlayerVariables));
		socket.broadcast.emit('videoplayer variables change', videoPlayerVariables);
	});

	socket.on('globalEvents variable change', function(data) {
		console.log('recv: globalEvents variable changed: '+JSON.stringify(data));
		data.name = currentPlayer.name;
		globalEventVariables = data;
		console.log(JSON.stringify(globalEventVariables));
		socket.broadcast.emit('globalEvents variable change', globalEventVariables);
	});

	socket.on('disconnect', function() {
		console.log(currentPlayer.name+' recv: disconnect '+currentPlayer.name);
		socket.broadcast.emit('other player disconnected', currentPlayer);
		console.log(currentPlayer.name+' bcst: other player disconnected '+JSON.stringify(currentPlayer));
		for(var i=0; i<clients.length; i++) {
			if(clients[i].name === currentPlayer.name) {
				clients.splice(i,1);
			}
		}
	});


});


function sendMetaData(socket){
	var metaData = {};
	metaData = {
		connected: authenticatedPlayerList.size,
		lastPrice: GameLogics.getLastPrice(authenticatedPlayerList.get(socket.id))

	}
	socket.emit('meta data', metaData);
	socket.broadcast.emit('meta data', metaData);
	console.log(' bcst: meta data '+JSON.stringify(metaData));
}

function sendLastGameInfo(socket){
	var lastGameInfo = {};
	lastGameInfo = {
		data: GameLogics.getLastGameInfo()

	}
	socket.emit('last game info', lastGameInfo);
	//socket.broadcast.emit('meta data', metaData);
	console.log(' bcst: last game info '+JSON.stringify(lastGameInfo));
}

function guid() {
	function s4() {
		return Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}