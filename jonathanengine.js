var gamescreen = document.getElementById('gameScreen');

var windowWidth = document.body.offsetWidth;
var windowHeight = document.body.offsetHeight;

gamescreen.width = windowWidth;
gamescreen.height = windowHeight;
var tools = gamescreen.getContext('2d');

var gravityForce = 0.4;
var xDirection = 0;
var yDirection = 0;
var playerSpeed = 10;

window.addEventListener('mousedown', mouseDown);
function mouseDown(event) {
	var projectile = new GameObject(player.position.x, player.position.y, 5, 5, 'rgb(200, 200, 0)');
	var mousePosition = new Vector2D(event.clientX, -event.clientY);

	var differenceVector = mousePosition.subtract(player.position);
	differenceVector.normalize();
	projectile.velocity = differenceVector;
}

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
		yDirection = 0;
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
		xDirection = 0.75;
	}
	if(event.keyCode == 65) {
		// we hit A
		xDirection = -0.75;
	}

	if(event.keyCode == 87) {
		// we hit W
		// yDirection = 1;
		if(player.grounded) {
			player.velocity.y = 10;
			// player.position.y += 1;
			player.grounded = false;
		}
	}

	if(event.keyCode == 83) {
		// we hit S
		// yDirection = -1;
	}
}

var gameObjects = [];

var player = new Character(0, 0, 'purple');
var rock = new GameObject(100, 10, 5, 5, 'gray');
var tree = new GameObject(50, 40, 20, 100, 'green');
var ground1 = new GameObject(0, -525, 1000, 10, 'black');
ground1.static = true;
var ground2 = new GameObject(300, -425, 1000, 10, 'black');
ground2.static = true;
var enemy1 = new Enemy(300, 0);

function update() {
	player.position.x += xDirection * playerSpeed;
	player.position.y += yDirection * playerSpeed;

	tools.clearRect(0, 0, windowWidth, windowHeight);

	for(var index = 0; index < gameObjects.length; index++) {
		var gameObject = gameObjects[index];

		if(gameObject.tags.indexOf('enemy') != -1) {
			gameObject.think();
		}

		gameObject.position = gameObject.position.add(gameObject.velocity);

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
					gameObject.velocity.y = 0;
					gameObject.position.y = colliderObject.position.y + gameObject.h;
				}
			}
		}

		// If not "grounded", let gravity do its thing
		if(gameObject.static == false && gameObject.grounded == false) {
			gameObject.velocity.y -= gravityForce;
		}

		var drawX = gameObject.position.x;
		var drawY = gameObject.position.y;

		if(gameObject.relative != null) {
			drawX += gameObject.relative.position.x;
			drawY += gameObject.relative.position.y;
		}

		// Actually do the move
		tools.fillStyle = gameObject.color;
		tools.fillRect(drawX, -drawY, gameObject.w, gameObject.h);

		// Reset staticCollision so that "grounded" doesn't last forever
		if(staticCollision == false) {
			gameObject.grounded = false;
		}
	}


	setTimeout(update, 10);
}

update();

function checkCollision(gameObjectA, gameObjectB) {
	// is a hitting b?
	var lxA = gameObjectA.position.x;
	var rxA = gameObjectA.position.x + gameObjectA.w;
	var tyA = gameObjectA.position.y;
	var byA = gameObjectA.position.y - gameObjectA.h;

	var lxB = gameObjectB.position.x;
	var rxB = gameObjectB.position.x + gameObjectB.w;
	var tyB = gameObjectB.position.y;
	var byB = gameObjectB.position.y - gameObjectB.h;

	if(rxA < lxB || rxB < lxA || byA > tyB || byB > tyA) {
		return false;
	} else {
		return true;
	}
}

function Vector2D(x, y) {
	var me = this;
	me.x = x;
	me.y = y;

	me.add = function(otherVector) {
		return new Vector2D(me.x + otherVector.x, me.y + otherVector.y);
	}

	me.subtract = function(otherVector) {
		return new Vector2D(me.x - otherVector.x, me.y - otherVector.y);
	}

	me.getMagnitude = function() {
		// 
	}

	me.normalize = function() {

	}
}

function GameObject(x, y, w, h, color) {
	var me = this;
	me.position = new Vector2D(x, y);
	me.velocity = new Vector2D(0, 0);
	me.w = w;
	me.h = h;
	me.tags = [];
	me.static = false;
	me.grounded = false;
	me.color = color;
	me.relative = null;

	gameObjects.push(me);
}

function Character(x, y, color) {
	GameObject.call(this, x, y, 50, 50, color);

	var me = this;

	me.health = 100;
	me.healthBar = new GameObject(0, 20, 100, 10, 'green');
	me.healthBar.relative = this;
	me.healthBar.static = true;
}

function Enemy(x, y) {
	Character.call(this, x, y, 'rgba(200, 0, 0, 0.5)');

	var me = this;

	me.tags.push('enemy');

	me.speed = 1;

	me.think = function() {
		if(me.position.x > player.position.x) {
			me.position.x -= me.speed;
		} else if(me.position.x < player.position.x) {
			me.position.x += me.speed;
		}

		// where's the player's y? is it above us? are they grounded? if so, jump to them maybe if we're a dog.
		// or if we're a gunner, keep a distance
	}
}
