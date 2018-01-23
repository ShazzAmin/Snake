//----- Snake object
var Snake = Snake || {};

//----- Constants
var SNAKE_HEAD = 1,
	SNAKE_BODY = 2,
	SNAKE_FOOD = 3;

Snake.canvasWidth = 800;
Snake.canvasHeight = 600;

Snake.gridWidth = 10;
Snake.gridHeight = 10;

Snake.gridCanvasWidth = Snake.canvasWidth / Snake.gridWidth - 1;
Snake.gridCanvasHeight = Snake.canvasHeight / Snake.gridHeight - 1;

Snake.colours = {
	1: "#FF0000",
	2: "#000000",
	3: "#0000FF",
};

Snake.randomColours = [
	"#000000",
	"#0000FF",
	"#00FF00",
	"#00FFFF",
	"#FF0000",
	"#FF00FF",
	"#FFFF00",
	"#FFFFFF",
];

Snake.backgroundColour = "#FFFFFF";

Snake.upKey = 38;
Snake.downKey = 40;
Snake.leftKey = 37;
Snake.rightKey = 39;

Snake.updateDelay = 80;

Snake.foodWorth = 1;

//----- Variables
Snake.head = [10, 10];
Snake.body = [[10, 11], [10, 12], [10, 13]];

Snake.xVelocity = 1;
Snake.yVelocity = 0;
Snake.isTurning = false;

Snake.score = 0;

//----- Functions
// Initialize game
Snake.main = function(){
	console.log(Snake.gridCanvasWidth);
	console.log(Snake.gridCanvasHeight);

	Snake.canvas = document.getElementById("snakeScreen");
	Snake.screen = Snake.canvas.getContext("2d");
	
	Snake.generateFood();
	Snake.timer = setInterval(Snake.update, Snake.updateDelay);
}

// Update game
Snake.update = function(){
	var oHead = Snake.head;

	if(Snake.xVelocity != 0){
		Snake.head = [Snake.head[0] + Snake.xVelocity, Snake.head[1]];

		Snake.body.pop();
		Snake.body.unshift(oHead);
	}else if(Snake.yVelocity != 0){
		Snake.head = [Snake.head[0], Snake.head[1] + Snake.yVelocity];

		Snake.body.pop();
		Snake.body.unshift(oHead);
	}

	Snake.isTurning = false;

	//
	//Snake.backgroundColour = Snake.randomColours[Math.floor(Math.random() * ((Snake.randomColours.length-1) - 0 + 1)) + 0];
	//

	// Handle collisions
	Snake.handleCollision();

	Snake.clearScreen();

	Snake.drawScore();

	Snake.drawElement(SNAKE_FOOD, Snake.food);

	Snake.drawElement(SNAKE_HEAD, Snake.head);
	
	$.each(Snake.body, function(key, value){
		Snake.drawElement(SNAKE_BODY, value);
	});
}

// Clear canvas
Snake.clearScreen = function(){
	Snake.screen.fillStyle = Snake.backgroundColour;
	Snake.screen.fillRect(0, 0, Snake.canvasWidth, Snake.canvasHeight);
}

// Draw an element
Snake.drawElement = function(type, coord){
	Snake.screen.fillStyle = Snake.colours[type];
	Snake.screen.fillRect(coord[0] * Snake.gridWidth, coord[1] * Snake.gridHeight, Snake.gridWidth, Snake.gridHeight);
}

// Draw score
Snake.drawScore = function(){
	Snake.screen.fillStyle = "#0000FF";
	Snake.screen.font = "bold 18px Arial";
	Snake.screen.fillText("Score: " + Snake.score, 15, 20);
}

// Generate and draw food
Snake.generateFood = function(){
	Snake.food = [
		Math.floor(Math.random() * (Snake.gridCanvasWidth - 0 + 1)) + 0,
		Math.floor(Math.random() * (Snake.gridCanvasHeight - 0 + 1)) + 0
	];

	Snake.drawElement(SNAKE_FOOD, Snake.food);
}

// Handle arrow keys
Snake.handleKeys = function(key){
	if(Snake.isTurning){
		return;
	}

	switch(key){
		case Snake.upKey:
			if(Snake.yVelocity == 0){
				Snake.xVelocity = 0;
				Snake.yVelocity = -1;
				Snake.isTurning = true;
			}
			break;
		case Snake.downKey:
			if(Snake.yVelocity == 0){
				Snake.xVelocity = 0;
				Snake.yVelocity = 1;
				Snake.isTurning = true;
			}
			break;
		case Snake.leftKey:
			if(Snake.xVelocity == 0){
				Snake.xVelocity = -1;
				Snake.yVelocity = 0;
				Snake.isTurning = true;
			}
			break;
		case Snake.rightKey:
			if(Snake.xVelocity == 0){
				Snake.xVelocity = 1;
				Snake.yVelocity = 0;
				Snake.isTurning = true;
			}
			break;
	}
}

// Handle collisions
Snake.handleCollision = function(){
	var x = Snake.head[0],
		y = Snake.head[1];

	$.each(Snake.body, function(key, value){
		console.log(value[0], value[1]);
		if(x == value[0] && y == value[1]){
			Snake.gameOver();
		}
	});

	if(x == Snake.food[0] && y == Snake.food[1]){
		for(var i = 0; i < Snake.foodWorth; i++){
			Snake.body.push(Snake.body[Snake.body.length-1]);
		}
		Snake.score += Snake.foodWorth;

		Snake.generateFood();
		return true;
	}else if(x < 0 || y < 0 || x > Snake.gridCanvasWidth || y > Snake.gridCanvasHeight){
		Snake.gameOver();
		return true;
	}
}

// Game over
Snake.gameOver = function(){
	clearInterval(Snake.timer);
	setTimeout(function(){
		Snake.screen.fillStyle = "#000000";
		Snake.screen.font = "bold 20px Arial";
		Snake.screen.textAlign = "center";
		Snake.screen.fillText('GAME OVER!', Snake.canvas.width / 2, Snake.canvas.height / 2);

		Snake.screen.fillStyle = "#88FF88";
		Snake.screen.font = "bold 16px Arial";
		Snake.screen.fillText('Hit F5 to restart.', Snake.canvas.width / 2, Snake.canvas.height / 2 + 16);
	}, 100);
}

//----- Event Listeners
$(document).ready(function(){
	Snake.main();
	
	$(document).keydown(function(key){
		Snake.handleKeys(key.keyCode);
	});
});