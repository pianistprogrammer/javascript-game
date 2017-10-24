 

var myGameArea;
var myGamePiece;
var myObstacles = [];
var myscore;
var levels = [200,500,1000,3000,7000,10000]; 


function restartGame() {
    //location.reload()
     document.getElementById("myfilter").style.display = "none";
     document.getElementById("myrestartbutton").style.display = "none";
     myGameArea.stop();
     myGameArea.clear();
     myGameArea = {};
     myGamePiece = {};
     myObstacles = [];
     myscore = {};
     document.getElementById("canvascontainer").innerHTML = "";
     startGame();
}
function startGame() {
    myGameArea = new gamearea();
    myGamePiece = new component(30, 30, "red", 10, 75);
    myscore = new component("15px", "Consolas", "black", 220, 25, "text");         
    myGameArea.start();
}

function gamearea() {

	this.refreshSpeed = 35; 
    this.canvas = document.createElement("canvas");
	this.stopped = true; 
    this.canvas.width = 320;
    this.canvas.height = 180; 
	if( document.getElementById("canvascontainer"))
    document.getElementById("canvascontainer").appendChild(this.canvas);
    this.context = this.canvas.getContext("2d");    
    this.pause = false;
    this.frameNo = 0;
    this.start = function() {
		this.stopped = false;
        updateGameArea()
    }
    this.stop = function() {
        this.pause = true;
		this.stopped = true;
    }
    this.clear = function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
	//this.stop(); 
}

function component(width, height, color, x, y, type) {

    this.type = type;
    if (type == "text") {
        this.text = color;
    }
    this.score = 0;    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
	if (myGameArea.stopped){ return; }
    var x, y, min, max, height, gap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
           
            myGameArea.stop();
            document.getElementById("myfilter").style.display = "block";
            document.getElementById("myrestartbutton").style.display = "block";
            return;
        } 
    }
    if (myGameArea.pause == false) {
        myGameArea.clear();
        myGameArea.frameNo += 1;
        myscore.score +=1;        
        if (myGameArea.frameNo == 1 || everyinterval(150)) {
            x = myGameArea.canvas.width;
            y = myGameArea.canvas.height - 100;
            min = 20;
            max = 100;
            height = Math.floor(Math.random()*(max-min+1)+min);
            min = 50;
            max = 100;
            gap = Math.floor(Math.random()*(max-min+1)+min);
            myObstacles.push(new component(10, height, "green", x, 0));
            myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
        }
        for (i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].x += -1;
            myObstacles[i].update();
        }
        myscore.text="SCORE: " + myscore.score;
        
        if ( levels.indexOf(myscore.score) != -1){
                myGameArea.refreshSpeed -= 5 ;
				console.log( 'level '+levels.indexOf(myscore.score) + '; refreshRate: '+ myGameArea.refreshSpeed);
                
        }

         myscore.update();
         myGamePiece.x += myGamePiece.speedX;
         myGamePiece.y += myGamePiece.speedY;    
         myGamePiece.update();

		 setTimeout(updateGameArea, myGameArea.refreshSpeed);			 
		 

    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function moveup(e) {
    myGamePiece.speedY = -1; 
}

function movedown() {
    myGamePiece.speedY = 1; 
}

function moveleft() {
    myGamePiece.speedX = -1.5; 
}

function moveright() {
    myGamePiece.speedX = 1; 
}

function clearmove(e) {
    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
}
$(document).keydown(function(e){
     switch(e.keyCode){
		 case 37: moveleft(e); break;
		 case 38: moveup(e); break;
		 case 39: moveright(e); break;
		 case 40: movedown(e); break;
	 }
     return false;
});
$(document).keyup(function(e){
     
  switch(e.keyCode){
		 case 37: 
		 case 38:
		 case 39:
		 case 40:  clearmove(e); break;
	 }
       return false;
    
});
//startGame(); 
