var gamescreen = document.getElementById('gameScreen');

var windowWidth = document.body.offsetWidth;
var windowHeight = document.body.offsetHeight;

gamescreen.width = windowWidth;
gamescreen.height = windowHeight;
var tools = gamescreen.getContext('2d');

var xDirection = 0;
var yDirection = 0;
var playerX = 0;
var playerY = 0;
var playerSpeed = 10;

window.addEventListener('keyup', keyUp);

function keyUp(event) {
	if(event.keyCode == 68) {
		// we hit D
		xDirection = 0;
	}

	if(event.keyCode == 65) {
		// we hit A
		xDirection = 0;
	}

	if(event.keyCode == 87) {
		// we hit W
		// yDirection = 0;
	}

	if(event.keyCode == 83) {
		// we hit S
		// yDirection = 0;
	}
}

window.addEventListener('keydown', keyDown);

function keyDown(event) {
	if(event.keyCode == 68) {
		// we hit D
		xDirection = 1;
	}

	if(event.keyCode == 65) {
		// we hit A
		xDirection = -1;
	}

	if(event.keyCode == 87) {
		// we hit W
		// yDirection = 1;
	}

	if(event.keyCode == 83) {
		// we hit S
		// yDirection = -1;
	}
}

var gameObjects = [];

var player = new GameObject(0, 0, 25, 25);
var rock = new GameObject(50, 10, 5, 5);
var tree = new GameObject(50, 40, 20, 20);
var ground = new GameObject(0, -325, 1000, 10);
ground.static = true;

function update() {
	player.x += xDirection * playerSpeed;
	player.y += yDirection * playerSpeed;

	tools.clearRect(0, 0, windowWidth, windowHeight);

	for(var index = 0; index < gameObjects.length; index++) {
		var gameObject = gameObjects[index];

		var staticCollision = false;

		for(var colliderIndex = 0; colliderIndex < gameObjects.length; colliderIndex++) {
			var colliderObject = gameObjects[colliderIndex];

			if(colliderObject == gameObject) {
				continue;
			}

			if(checkCollision(gameObject, colliderObject)) {
				if(colliderObject.static == true) {
					gameObject.grounded = true;
					staticCollision = true;
				}
			}
		}

		if(staticCollision == false) {
			gameObject.grounded = false;
		}

		if(gameObject.static == false && gameObject.grounded == false) {
			gameObject.y -= 1;
		}



		tools.fillRect(gameObject.x, -gameObject.y, gameObject.w, gameObject.h);
	}


	setTimeout(update, 15);
}

update();

function checkCollision(gameObjectA, gameObjectB) {
	// is a hitting b?
	var lxA = gameObjectA.x;
	var rxA = gameObjectA.x + gameObjectA.w;
	var tyA = gameObjectA.y;
	var byA = gameObjectA.y - gameObjectA.h;

	var lxB = gameObjectB.x;
	var rxB = gameObjectB.x + gameObjectB.w;
	var tyB = gameObjectB.y;
	var byB = gameObjectB.y - gameObjectB.h;

	if(rxA < lxB || rxB < rxA || byA > tyB || byB > tyA) {
		return false;
	} else {
		return true;
	}
}

function GameObject(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.static = false;
	this.grounded = false;
	this.color = black

	gameObjects.push(this);
}
