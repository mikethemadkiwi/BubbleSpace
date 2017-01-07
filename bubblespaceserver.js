//bubblespace Engine 0.0.3
//mikethemadkiwi
//nom
var bigBang = new Date(Date.now());
console.log(bigBang);
//

var fs = require("fs");
var $ = require('jquery');
var util = require('util');
var http = require('http');
var https = require('https');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser'); //COOOKIES!! NOM
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var webport = 12345;
var port = process.env.PORT || webport;

var tps = {
    total: 0,
    current: 0
};
var updatetps = 10; //1000 / 100
//
var maxdebugspawndist = 5000;
var playerbase = [];
var universe = [];
//
//
playerDB = {};
function playerOBJ(socketid){
    playerDB[socketid] = this;
    this.id = socketid;
    this.name = socketid;
    this.actpos = {x: 0, y: 0, z: 0};
    this.tarpos = this.actpos;
    this.homepos = this.actpos;
    this.size = 20;
};
// Main Code
function add_player(socketname) {
    playerbase.push(new playerProto(socketname));
    console.log('added: ' + socketname);
    console.log('users: ' + playerbase.length);
    //
    io.emit('playerbase', playerbase);

};

function remove_player(socketname) {
    for (var i = 0; i < playerbase.length; i++) {
        if (playerbase[i].name == socketname) {
            playerbase.splice(i, 1);
            console.log('removed: ' + socketname);
            console.log('users: ' + playerbase.length);
            io.emit('delplayer', socketname);
            //
            io.emit('playerbase', playerbase);
        }
    }
};
//random number generator supplied v
var randomnumber = function (v) {
    var tmpnum = Math.floor(Math.random() * v + 1);
    return tmpnum;
};
function randomFromInterval(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
};
//// HTTP

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/www/'));
//
server.listen(port, function () {
    console.log('Server listening at port :' + webport);
});

io.on('connection', function (socket) {
    socket.name = socket.id;
    socket.emit('universeupdate', universe);
    socket.emit('playerbase', playerbase);
    add_player(socket.name);
    //
    new playerOBJ(socket.name);
    socket.emit('playerDB', playerDB);
    //



    // OTHER CALLS
    socket.on('c2muser', function (data) {
        for (var i = 0; i < playerbase.length; i++) {
            if (playerbase[i].name == socket.name) {
                playerbase[i].moveME(data.x,data.y);
            }
        }
    });
    socket.on('usrname', function (data) {
        playerDB[socket.name].name = data;
        io.emit('playerDB',playerDB);
    });
    //

    //
    socket.on('disconnect', function () {
        //remove the player on disconnect
        remove_player(socket.name);
        io.emit('playerbase', playerbase);
        //
        delete playerDB[socket.name];
        io.emit('playerDB', playerDB);
        //
    });
});

var playerProto = function (socketname) {
    var that = this;
    //
    that.type = 0;
    that.name = socketname;
    that.socketid = socketname;
    that.actpos = { x: 0, y: 0, z: 0 };
    that.tarpos = { x: 0, y: 0, z: 0 };
    that.size = 20;
    //
    that.moveME = function(x,y){
        that.tarpos.x = x;
        that.tarpos.y = y;
        console.log('POS: ' + that.name +': '+ that.tarpos.x + ':' + that.tarpos.y);
        io.emit('moveplr', {name: that.name, tarpos: that.tarpos});
    }
    that.updateME = function () {

        if (that.tarpos.x == that.actpos.x && that.tarpos.y == that.actpos.y) {

        }
        else {
            if (Math.round(that.tarpos.x) == that.actpos.x) {
                that.tarpos.x = that.actpos.x;
            }
            if (Math.round(that.tarpos.y) == that.actpos.y) {
                that.tarpos.y = that.actpos.y;
            }
            // there is a more elegant way of ddoing this, if vara < varb x2 move 2 not 1;
            if (that.tarpos.x > that.actpos.x) {
                that.actpos.x += 1;
            }
            if (that.tarpos.x < that.actpos.x) {
                that.actpos.x += -1;
            }
            if (that.tarpos.y > that.actpos.y) {
                that.actpos.y += 1;
            }
            if (that.tarpos.y < that.actpos.y) {
                that.actpos.y += -1;
            }
            //console.log(that.actpos.x + '/'+that.actpos.y+' || '+ that.tarpos.x + '/' + that.tarpos.y);
        }
        
    };
    //
    return that;
}

var starObj = function (name, x, y, z, size) {
    var that = this;
    that.type = 1;
    that.name = name;
    that.actpos = { x: x, y: y, z: z };
    that.tarpos = { x: x, y: y, z: z };
    that.size = size;
    that.updateME = function () {

    };
    console.log('Star ' + that.name + ' Created.')
    return that;
};
var planetObj = function (name, x, y, z, size) {
    var that = this;
    that.type = 3;
    that.name = name;
    that.actpos = { x: x, y: y, z: z };
    that.tarpos = { x: x, y: y, z: z };
    that.size = size;
    that.updateME = function () {

    };
    console.log('Planet ' + that.name + ' Created.')
    return that;
};





//update loop
var update = setInterval(function () {

    //update universe
    for (var i = 0; i < universe.length; i++) {
        universe[i].updateME();
    };
    //update players
    for (var i = 0; i < playerbase.length; i++) {
        playerbase[i].updateME();
    };

}, updatetps);

universe.push(new starObj('Proxima', 0, 0, 0, 600));
universe.push(new planetObj('Proxima Alpha', 275, 0, 0, 100));