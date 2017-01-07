//
var debugshow = false;
var canvas = document.getElementById('mainCanvas');
var ctx = canvas.getContext("2d");
canvas.oncontextmenu = handler;
var tarFps = 1000 / 50; // 1 second divided by how many frames per second.
var tps = 1; // 2 descisions to each frame
//
var viewer = {
    window: { w: window.innerWidth, h: window.innerHeight, hw: 0, hh: 0 },
    tarpos: { x: 0, y: 0, z: 0 },
    actpos: { x: 0, y: 0, z: 0 },
    frame: { framecurrent: 0, frametotal: 0, framepersec: 0},
    tick: { tickcurrent: 0, ticktotal: 0, tickpersec: 0 },
};
//
var imgmap = [];
imgmap[0] = new Image();
imgmap[0].src = 'assets/img/player.png';
imgmap[1] = new Image();
imgmap[1].src = 'assets/img/sun2.png';
imgmap[2] = new Image();
imgmap[2].src = 'assets/img/enemy.png';
imgmap[3] = new Image();
imgmap[3].src = 'assets/img/planet.png';

var starfeild = [];
var universe = [];
var playerbase = [];

//
var randomnumber = function (v) {
    var tmpnum = Math.floor(Math.random() * v + 1);
    return tmpnum;
};
//
function randomFromInterval(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
};
//
function resetstarfield() {
    //MAKE the STARS.
    for (var i = 0; i < 100; i++) {
        starfeild[i] = new stardust;
        starfeild[i].setLocation(randomFromInterval(0, canvas.width), randomFromInterval(0, canvas.height));
        starfeild[i].static = true;
    };
};
//
function resizelayout() {
    viewer.window.w = window.innerWidth;
    viewer.window.h = window.innerHeight;
    viewer.window.hw = window.innerWidth / 2;
    viewer.window.hh = window.innerHeight / 2;
    canvas.width = viewer.window.w;
    canvas.height = viewer.window.h;
};
//
window.onload = function () {
    resizelayout();
    resetstarfield();
};
//
window.onresize = function () {
    resizelayout();
    resetstarfield();
};
//
function handler(event) {
    event = event || window.event;
    if (event.stopPropagation)
        event.stopPropagation();
    event.cancelBubble = true;
    return false;
};
//

var mouse = {
    X: 0,
    Y: 0,
    lastLClickX: 0,
    lastLClickY: 0,
    lastRClickX: 0,
    lastRClickY: 0,
    lastMClickX: 0,
    lastMClickY: 0,
    isdownL: false,
    isdownR: false,
    isdownM: false,
    delta: 0
};
//mouse MOVE
addEventListener('mousemove', function (evt) {
    var mousePos = getMousePos(canvas, evt);
    mouse.X = mousePos.x;
    mouse.Y = mousePos.y;
}, false);
// mouse DOWN
addEventListener("mousedown", function (evt) {
    //console.log(evt);
    if (evt.altKey == true) { console.log('alt key click'); };
    if (evt.ctrlKey == true) { console.log('ctrl key click'); };
    if (evt.shiftKey == true) { console.log('shift key click'); };
    if (evt.button == 0) { // Left CLick
        mouse.lastLClickX = mouse.X;
        mouse.lastLClickY = mouse.Y;
        clickmoveL(mouse.X, mouse.Y, 0);
        mouse.isdownL = true;
    }
    if (evt.button == 2) { // Right Click
        mouse.lastRClickX = mouse.X;
        mouse.lastRClickY = mouse.Y;
        clickmoveR(mouse.X, mouse.Y, 0);
        mouse.isdownR = true;
    }
    if (evt.button == 1) { // Middle Click
        mouse.lastMClickX = mouse.X;
        mouse.lastMClickY = mouse.Y;
        clickmoveM(mouse.X, mouse.Y, 0);
        mouse.isdownM = true;
    }

}, false);
//Mouse Wheel -1 or +1 output
addEventListener("mousewheel", function (evt) {
    // console.log(evt);
    //clickmove(mouse.X, mouse.Y, 0);
    var delta = Math.max(-1, Math.min(1, (evt.wheelDelta || -evt.detail)));
    mouse.delta = delta;
}, false);

// mouse UP
addEventListener("mouseup", function (evt) {
    if (evt.button == 0) { // Left click
        mouse.isdownL = false;
    }
    if (evt.button == 2) { // Right Click
        mouse.isdownR = false;
    }
    if (evt.button == 1) { // Middle Click
        mouse.isdownM = false;
    }

}, false);
//mouse gps tool.
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
//

/// FUNCTIONS
function clickmoveL(x, y, z) {
    // this needs to calculate the distance to the TARGET position.
    //console.log('x:' + x + ' y:' + y + ' z:' + z);
    var tt = { x: x, y: y, z: z };
    tt.x = Math.round(tt.x - viewer.window.hw); //assumes centerpoint and actpos = 0 as start.
    tt.y = Math.round(tt.y - viewer.window.hh);
    //console.log(tt);
    viewer.tarpos = tt;
    var tmpu = { x: viewer.actpos.x + tt.x, y: viewer.actpos.y + tt.y };
    //console.log(tmpu);
    socket.emit('c2muser', tmpu);
}
function clickmoveM(x, y, z) {
    // this needs to calculate the distance to the TARGET position.
    //console.log('x:' + x + ' y:' + y + ' z:' + z);
    var tt = { x: x, y: y, z: z };
    tt.x = Math.round(tt.x - viewer.window.hw); //assumes centerpoint and actpos = 0 as start.
    tt.y = Math.round(tt.y - viewer.window.hh);
    //console.log(tt);
    viewer.tarpos = tt;
    var tmpu = { x: viewer.actpos.x + tt.x, y: viewer.actpos.y + tt.y };
    //console.log(tmpu);
    socket.emit('reset2home', tmpu);
}
function clickmoveR(x, y, z) {
    // this needs to calculate the distance to the TARGET position.
    //console.log('x:' + x + ' y:' + y + ' z:' + z);
    var tt = { x: x, y: y, z: z };
    tt.x = Math.round(tt.x - viewer.window.hw); //assumes centerpoint and actpos = 0 as start.
    tt.y = Math.round(tt.y - viewer.window.hh);
    //console.log(tt);
    viewer.tarpos = tt;
    var tmpu = { x: viewer.actpos.x + tt.x, y: viewer.actpos.y + tt.y };
    //console.log(tmpu);
    socket.emit('moveship', tmpu);
}


var socket = io();// Socket.io
socket.on('connection', function (socket) {
    console.log('connected');
    console.log(socket);
});
socket.on('playerbase', function (data) {
    playerbase=[];
    for(var i=0;i<data.length;i++){
        playerbase.push(new playerObj(data[i]));
    }
        //console.log('playerbase update');
});
socket.on('playerDB', function (data) {
    console.log(data);
});

socket.on('addplayer', function (data) {
    //console.log(data);
    playerbase = data;
    //console.log('ADDED PLAYER');
});
socket.on('delplayer', function (data) {
    //console.log(data);
    //playerbase = data;
    //console.log('REMOVED PLAYER');
});
socket.on('moveplr', function (data) {
    console.log(data);
    for(var i =0; i < playerbase.length; i++){
        if(playerbase[i].name == data.name){
            playerbase[i].tarpos.x = data.tarpos.x;
            playerbase[i].tarpos.y = data.tarpos.y;
        }
    }
});
socket.on('universeupdate', function (data) {
    //console.log('UNIVERSE');
    console.log(data);
    universe = data;
});

var ls = localStorage;
if(ls.getItem('username') != null){
socket.emit('usrname', ls.getItem('username'));
}
else{
ls.setItem('username','Anonymous');
}

//
var stardust = function () {
    var that = this;
    that.Type = 'stardust';
    that.X = 0;
    that.Y = 0;
    that.Z = Math.random() * 1 + 0.3;
    that.speeddiff = Math.random() * 1 + 0.3;
    that.size = 1.2;
    that.opacity = Math.random() * 0.8 + 0.1;
    that.offsetx = 0;
    that.offsety = 0;
    that.outsidex = false;
    that.outsidey = false;
    that.static = false;
    that.twinkle = function () {

    }
    that.updateME = function () {
        //
        if (viewer.tarpos.x > 0) {
            that.X += -0.01 - that.speeddiff;
        }
        if (viewer.tarpos.x < 0) {
            that.X += 0.01 + that.speeddiff;
        }
        if (viewer.tarpos.y > 0) {
            that.Y += -0.01 - that.speeddiff;
        }
        if (viewer.tarpos.y < 0) {
            that.Y += 0.01 + that.speeddiff;
        }

        if (that.X > viewer.window.w) {
            that.opacity = Math.random() * 0.8 + 0.1;
            that.Y = randomFromInterval(0, viewer.window.h);
            that.X = 0;
        }
        if (that.X < 0) {
            that.opacity = Math.random() * 0.8 + 0.1;
            that.Y = randomFromInterval(0, viewer.window.h);
            that.X = viewer.window.w;
        }
        if (that.Y > viewer.window.h) {
            that.opacity = Math.random() * 0.8 + 0.1;
            that.X = randomFromInterval(0, viewer.window.w);
            that.Y = 0;
        }
        if (that.Y < 0) {
            that.opacity = Math.random() * 0.8 + 0.1;
            that.X = randomFromInterval(0, viewer.window.w);
            that.Y = viewer.window.h;
        }


        //
    }
    that.setLocation = function (x, y, z) {
        that.X = x;
        that.Y = y;
    }
    that.debugShow = function () {
        ctx.font = '10px Arial';
        ctx.fillStyle = 'White';
        ctx.fillText('Type: ' + that.Type, that.X + 1, that.Y + 10);
        ctx.fillText('Loc: ' + that.X + '|' + that.Y + '|' + that.Z, that.X + 1, that.Y + 20);
    }
    that.drawMEPLZ = function () {
        ctx.fillStyle = 'rgba(226,219,226,' + that.opacity + ')';
        ctx.beginPath();
        ctx.arc(that.X, that.Y, that.Z * that.size, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
    return that;
};

var starObj = function (data) {
    var that = this;
    that.type = data.type;
    that.name = data.name;
    that.actpos = { x: data.actpos.x, y: data.actpos.y, z: data.actpos.z };
    that.tarpos = { x: data.actpos.x, y: data.actpos.y, z: data.actpos.z };
    that.size = data.size;
    that.hsize = that.size / 2;
    that.updateME = function () {

    };
    that.renderME = function () {

    }
    return that;
};

var playerObj = function (data) {
    var that = this;
    that.type = data.type;
    that.name = data.name;
    that.actpos = { x: data.actpos.x, y: data.actpos.y, z: data.actpos.z };
    that.tarpos = { x: data.actpos.x, y: data.actpos.y, z: data.actpos.z };
    that.size = data.size;
    that.hsize = that.size / 2;
    that.updateME = function() {

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

    }
    that.renderME = function() {
    var offsetx = viewer.window.hw - viewer.actpos.x;
    var offsety = viewer.window.hh - viewer.actpos.y;
        
            var radius = that.size / 2;
            ctx.font = '10px Arial';
            ctx.fillStyle = 'White';
            ctx.fillText(that.name + '|' + that.actpos.x + ':' + that.actpos.y + '|', offsetx + that.actpos.x - radius, offsety + that.actpos.y - radius - 15);
            ctx.drawImage(imgmap[that.type], offsetx + that.actpos.x - radius, offsety + that.actpos.y - radius, that.size, that.size);

    }
    return that;
};



















//
var update = setInterval(function () {

    if (Math.round(viewer.tarpos.x) == 0) {
        viewer.tarpos.x = 0;
    }
    if (Math.round(viewer.tarpos.y) == 0) {
        viewer.tarpos.y = 0;
    }
    // there is a more elegant way of ddoing this, if vara < varb x2 move 2 not 1;
    if (viewer.tarpos.x > 0) {
        viewer.actpos.x += 1;
        viewer.tarpos.x += -1;
    }
    if (viewer.tarpos.x < 0) {
        viewer.actpos.x += -1;
        viewer.tarpos.x += 1;
    }
    if (viewer.tarpos.y > 0) {
        viewer.actpos.y += 1;
        viewer.tarpos.y += -1;
    }
    if (viewer.tarpos.y < 0) {
        viewer.actpos.y += -1;
        viewer.tarpos.y += 1;
    }
    //starfeild
    if (starfeild[0] != null) {
        for (var i = 0; i < starfeild.length; i++) {
            starfeild[i].updateME();
        }
    }
    if (playerbase[0] != null) {
        for (var i = 0; i < playerbase.length; i++) {
            playerbase[i].updateME();
        }
    }
/////
// Debug Objects
/////
        for (var i = 0; i < dbOBJSIndex; i++) {
            if(dbOBJS[i] != null){
            dbOBJS[i].update();                
            }
        }
////
    viewer.tick.tickcurrent++;
    viewer.tick.ticktotal++;
}, tps);

//
var render = setInterval(function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var offsetx = viewer.window.hw - viewer.actpos.x;
    var offsety = viewer.window.hh - viewer.actpos.y;

    if (starfeild != null) {
        for (var i = 0; i < starfeild.length; i++) {
            starfeild[i].drawMEPLZ();
        }
    }
//
   

    if (universe[0] != null) {
        for (var i = 0; i < universe.length; i++) {
            var radius = universe[i].size / 2;
            ctx.font = '10px Arial';
            ctx.fillStyle = 'White';
            ctx.fillText(universe[i].name + '|' + universe[i].actpos.x + ':' + universe[i].actpos.y + '|', offsetx + universe[i].actpos.x - radius, offsety + universe[i].actpos.y - radius - 15);
            ctx.drawImage(imgmap[universe[i].type], offsetx + universe[i].actpos.x - radius, offsety + universe[i].actpos.y - radius, universe[i].size, universe[i].size);

        }
    }

    if (playerbase[0] != null) {
        for (var i = 0; i < playerbase.length; i++) {
            playerbase[i].renderME();
        }
    }


    /////
    // Debug Objects
    /////
            for (var i = 0; i < dbOBJSIndex; i++) {
                if(dbOBJS[i] != null){
                dbOBJS[i].draw();                
                }
            }
    ////

    ctx.font = '12px Lucida Console';
    ctx.fillStyle = 'green';
    ctx.fillText('Bubblespace 0.0.3', 10, 22);
    if (debugshow == true) {
        ctx.font = '12px Lucida Console';
        ctx.fillStyle = 'white';
        ctx.fillText('TPS| av:' + viewer.tick.tickpersec + ' current:' + viewer.tick.tickcurrent + ' total:' + viewer.tick.ticktotal, 10, 40);
        ctx.fillText('Res|' + viewer.window.w + 'x' + viewer.window.h + ' (Midpoint:' + viewer.window.hw + 'x' + viewer.window.hh + ')| FPS| av:' + viewer.frame.framepersec + ' current: ' + viewer.frame.framecurrent + ' total: ' + viewer.frame.frametotal + ' | ', 10, 58);
        ctx.fillText('MOUSE| pos:' + mouse.X + '/' + mouse.Y + ' Pressed| l:' + mouse.isdownL + ' m:' + mouse.isdownM + ' r:' + mouse.isdownR + '| Scroll|' + mouse.delta + '|', 10, 76);
        ctx.fillText(ls.getItem('username')+': GPS| Actual: ' + viewer.actpos.x + '/' + viewer.actpos.y + '/' + viewer.actpos.z + ' Target: ' + viewer.tarpos.x + '/' + viewer.tarpos.y + '/' + viewer.tarpos.z, 10, 94);
    }
   viewer.frame.framecurrent++;
   viewer.frame.frametotal++;
}, tarFps);
//
var persec = setInterval(function () {
    viewer.frame.framepersec = viewer.frame.framecurrent;
    viewer.frame.framecurrent = 0;
    viewer.tick.tickpersec = viewer.tick.tickcurrent;
    viewer.tick.tickcurrent = 0;
}, 1000);



var maxdebugspawndist = 5000;

var dbOBJSIndex = 0;
var dbOBJS = {};
function debugOBJ(){
    dbOBJSIndex++;
    dbOBJS[dbOBJSIndex] = this;
    this.id = dbOBJSIndex;
    this.name = 'Ship_' + dbOBJSIndex;
    this.type = 2;// type 2 enemy?
    this.gamestate = 0; //0=idle,1=moving,2=loading,3=unloading,4=attacking,5=defending,6=mining
    this.actpos = {x: randomFromInterval(-maxdebugspawndist, maxdebugspawndist), y: randomFromInterval(-maxdebugspawndist, maxdebugspawndist), z: randomFromInterval(-maxdebugspawndist, maxdebugspawndist)};
    this.tarpos = this.actpos;
    this.isOnReturn = true;
    this.cargo = 0;
    this.cargolimit = randomFromInterval(1000,2000);
    this.returnpos = {x: 500, y: 0, z: 0};
    this.velocity = Math.floor(randomFromInterval(1, 3));
    this.size = randomFromInterval(10, 20);
};
debugOBJ.prototype.update = function () {
    var isarrivedx = false;
    var isarrivedy = false;
    if(this.actpos.x != this.tarpos.x){
        this.gamestate = 1
    }
    if(this.actpos.y != this.tarpos.y){
        this.gamestate = 1
    }


    switch(this.gamestate){
    case 0://idle
        if(debugshow == true){
            console.log(this.id+' idle');            
        }
   // this.autotarget(); // this is a terrible function, clean it up.
    
    
    if(universe[0] != null){
        var tmpu = randomnumber(universe.length -1);
        this.tarpos = universe[tmpu].actpos;
        if(debugshow == true){
        console.log(this.id + ' TAR: '+universe[tmpu].name+' {'+this.tarpos.x+':'+ this.tarpos.y+'}');             
        }
    }
    break;

    case 1://moving
    if(this.actpos.x < this.tarpos.x){
        this.actpos.x += 1;
    }    
    if(this.actpos.x > this.tarpos.x){
        this.actpos.x += -1;
    }
    if(this.actpos.y < this.tarpos.y){
        this.actpos.y += 1;
    }    
    if(this.actpos.y > this.tarpos.y){
        this.actpos.y += -1;
    }
    if(this.actpos.x == this.tarpos.x){
        isarrivedx = true;
    }
    if(this.actpos.y == this.tarpos.y){   
        isarrivedy = true;
    }
    if(isarrivedx == true && isarrivedy == true){
        if(debugshow == true){
        console.log(this.id +' arrived at destination');
        }
        this.gamestate = 2;
    }
    break;

    case 2://unloading

    //note: loading unloading is meant to inteact with planetary objects. make it so...

        
        if(this.cargo > 0){
            this.cargo--;
        }
        if(this.cargo == 0) {
        if(debugshow == true){
        console.log(this.id+' unloaded');            
        }
        this.gamestate = 3;
        }
    break;

    case 3://loading
        //console.log(this.id+' loading');
        if(this.cargo < this.cargolimit){//resourceavail
            this.cargo++;
        }
        if(this.cargo == this.cargolimit) {
        if(debugshow == true){
        console.log(this.id+' loaded');
        }
        this.gamestate = 0;
        }
    break;

    default: console.log('lol, gamestate needs an int.'); //technically this should NEVER fire.
    }    
}
debugOBJ.prototype.draw = function (){    
    var offsetx = viewer.window.hw - viewer.actpos.x;
    var offsety = viewer.window.hh - viewer.actpos.y;        
    var radius = this.size / 2;
    ctx.font = '10px Arial';
    ctx.fillStyle = 'White';
    var tmpstr = this.name;
    if(debugshow == true){
        tmpstr +=  ' | '+ this.gamestate + ' | ' + this.actpos.x + ':' + this.actpos.y + ' / '+ this.tarpos.x + ':' + this.tarpos.y + ' | '+ this.cargo;
    }
    ctx.fillText(tmpstr, offsetx + this.actpos.x - radius, offsety + this.actpos.y - radius - 15);
    if(this.gamestate == 1 ) {
    ctx.drawImage(imgmap[this.type], offsetx + this.actpos.x - radius, offsety + this.actpos.y - radius, this.size, this.size);
    }
}
debugOBJ.prototype.autotarget = function () {
            if(this.isOnReturn == false){        
                var tmpu = randomnumber(universe.length -1);
                if (universe[tmpu].type == 3){
                    this.tarpos = universe[tmpu].actpos;
                    console.log(this.id + ' TAR: '+universe[tmpu].name+' {'+this.tarpos.x+':'+ this.tarpos.y+'}');                
                    this.isOnReturn = true;   
                }
            }
            else if(this.isOnReturn == true){                    
                this.tarpos = {x:275, y: 0, z: 0};
                console.log(this.id + ' TAR: HOME {'+this.tarpos.x+':'+ this.tarpos.y+'}');           
                this.isOnReturn = false;  
            }

};
//
for(var i=0; i< 100; i++){
    new debugOBJ();
}



///
//kiwi special objects
var enemyid = 0;
var enemyDB = {};
function enemyObj(){
    enemyDB[enemyid] = this;
    this.id = enemyid;
    this.name = 'ENEMY_' + enemyid;
    this.type = 2;// type 2 enemy?
    this.gamestate = 0; //0=idle,1=moving,2=loading,3=unloading,4=attacking,5=defending,6=mining
    this.actpos = {x: 0, y: 0, z: 0};
    this.tarpos = this.actpos;
    this.isOnReturn = true;
    this.cargo = 0;
    this.cargolimit = randomFromInterval(1000,2000);
    this.returnpos = {x: 500, y: 0, z: 0};
    this.velocity = Math.floor(randomFromInterval(1, 3));
    this.size = randomFromInterval(10, 20);
};