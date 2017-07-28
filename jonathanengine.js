// TODO
// sprites
// different weapons
// what do we spend coins on?
// more enemies
// boss?

var gamescreen = document.getElementById('gameScreen');

var uiObjects = [];


var windowWidth = document.body.offsetWidth;
var windowHeight = document.body.offsetHeight;

gamescreen.width = windowWidth;
gamescreen.height = windowHeight;
var tools = gamescreen.getContext('2d');

var coins = 0;

var gravityForce = 0.4;
var xDirection = 0;
var yDirection = 0;
var playerSpeed = 10;
var projectileSpeed = 10;

var pausing = false;

var mousing = false;
var mouseX = 0;
var mouseY = 0;

window.addEventListener('mousedown', mouseDown);
function mouseDown(event) {
	mousing = true;

	for(var index = 0; index < uiObjects.length; index++) {
		var uiObject = uiObjects[index];

		var mouseObject = new GameObject(mouseX, mouseY, 10, 10);
		var uiButtonObject = new GameObject(uiObject.x, uiObject.y, 300, 50);

		if(checkCollision(mouseObject, uiButtonObject)) {
			pausing = false;
		}

		mouseObject.destroy();
		uiButtonObject.destroy();
	}
}

window.addEventListener('mousemove', mouseMove);
function mouseMove(event) {
	mouseX = event.clientX;
	mouseY = -event.clientY;
}

window.addEventListener('mouseup', mouseUp);
function mouseUp(event) {
	mousing = false;
}

function localToWorld(vector) {
	return new Vector2D(vector.x + player.position.x - windowWidth / 2, vector.y + player.position.y + windowHeight / 2);
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
	if(event.keyCode == 27) {
		// esc
		openPauseMenu();
	}
}

var resumeButton = new UIObject(10, -100);
resumeButton.text = 'Resume';
resumeButton.positioning = 'center';

// var optionsBullet = new UIObject();
// new UIWindow();
// resume
// 

function openPauseMenu() {
	pausing = true;
}

var gameObjects = [];

var player = new Character(0, -200, 'purple');
var rock = new GameObject(100, 10, 5, 5, 'gray');
var tree = new GameObject(50, 40, 20, 100, 'green');
// var ground1 = new GameObject(0, -525, 1000, 10, 'purple');
// ground1.static = true;
// var ground2 = new GameObject(300, -425, 1000, 10, 'blue');
// ground2.static = true;
// var ground3 = new GameObject(150, -237, 200, 10, 'red');
// ground3.static = true;
// var ground4 = new GameObject(800, -237, 200, 10, 'red');
// ground4.static = true;
// var enemy1 = new Enemy(300, 0);

generateLevel();

function generateLevel () {
	var xOffset = 0;
	var currentY = -700;
	for (var index = 0; index < 10; index++) {
		var randomWidth = 50 + Math.floor(Math.random() * 1950);
		var xRange = 325;
		var yRange = 376;
		var randomY = (currentY - yRange/2) + Math.floor(Math.random() * yRange);

		var ground1 = new GameObject(xOffset, randomY, randomWidth, 10, 'purple');
		ground1.static = true;

		xOffset += randomWidth;
		xOffset += Math.random() * xRange;
		currentY = randomY;
	}

	for (var index = 0; index < 5; index++) {
		// var randomWidth = 50 + Math.floor(Math.random() * 1950);
		// var xRange = 325;
		// var yRange = 376;
		// var randomY = (currentY - yRange/2) + Math.floor(Math.random() * yRange);

		var enemy = new Enemy(Math.random() * xOffset, -100);

		// xOffset += randomWidth;
		// xOffset += Math.random() * xRange;
		// currentY = randomY;
	}
}

function shoot() {
	var projectile = new Projectile(player.position.x, player.position.y, 'rgb(200, 200, 0)');

	var mousePosition = localToWorld(new Vector2D(mouseX, mouseY));

	var differenceVector = mousePosition.subtract(player.position);
	differenceVector.normalize();

	projectile.velocity = differenceVector.multiply(projectileSpeed);
}

function update() {
	if(pausing) {
		return;
	}

	tools.clearRect(0, 0, windowWidth, windowHeight);

	player.position.x += xDirection * playerSpeed;
	player.position.y += yDirection * playerSpeed;

	var currentTime = new Date();

	if(mousing && currentTime - player.lastShot > 1000 / player.fireRate) {
		shoot();
		player.lastShot = currentTime;
	}

	for(var index = 0; index < uiObjects.length; index++) {
		var uiObject = uiObjects[index];
		if(uiObject.text != null) {
			if(uiObject.positioning == 'center') {
				var measurement = tools.measureText(uiObject.text);
				;

				tools.fillText(uiObject.text, windowWidth / 2 - measurement.width / 2, -uiObject.y);
			} else {
				tools.fillText(uiObject.text, uiObject.x, -uiObject.y);
			}
		}
	}

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
				if(!gameObject.static && colliderObject.static == true) {
					// if(!gameObject.grounded) {
						gameObject.grounded = true;
						staticCollision = true;
						gameObject.velocity.y = 0;
						gameObject.position.y = colliderObject.position.y + gameObject.h;
					// }
				}

				if(gameObject == player && colliderObject.tags.indexOf('coin') != -1) {
					colliderObject.destroy();
					coins++;
				}

				if(gameObject.tags.indexOf('enemy') != -1) {
					if(colliderObject.tags.indexOf('projectile') != -1) {
						gameObject.changeHealth(-10);
						colliderObject.destroy();
					}

					if(colliderObject == player) {
						colliderObject.changeHealth(-100);
					}
				}
			}
		}

		// If not "grounded", let gravity do its thing
		if(gameObject.static == false && gameObject.grounded == false && gameObject.kinematic == false) {
			gameObject.velocity.y -= gravityForce;
		}

		var drawX = gameObject.position.x;
		var drawY = gameObject.position.y;

		if(gameObject.relative != null) {
			drawX += gameObject.relative.position.x;
			drawY += gameObject.relative.position.y;
		}

		var offsetX = windowWidth / 2;
		var offsetY = windowHeight / 2;

		if(gameObject != player) {
			drawX -= player.position.x - offsetX;
			drawY -= player.position.y + offsetY;
		} else {
			drawX = offsetX;
			drawY = -offsetY;
		}

		// Actually do the move
		tools.fillStyle = gameObject.color;
		tools.fillRect(drawX, -drawY, gameObject.w, gameObject.h);

		// Reset staticCollision so that "grounded" doesn't last forever
		if(staticCollision == false) {
			gameObject.grounded = false;
		}
	}

	tools.fillStyle = 'black';
	tools.font = '36px Arial';
	tools.fillText(coins, 0, 36);

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

	if (rxA < lxB || rxB < lxA || byA > tyB || byB > tyA) {
		return false;
	} 
	else {
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

	me.multiply = function(multiplier) {
		return new Vector2D(me.x * multiplier, me.y * multiplier);
	}

	me.getMagnitude = function() {
		return Math.sqrt(Math.pow(me.x,2) + Math.pow(me.y,2));
	}

	me.normalize = function() {
		var magnitude = me.getMagnitude();

		me.x /= magnitude;
		me.y /= magnitude;
	}
}

function UIObject(x, y, type) {
	// GameObject.call(this, x, y, 5, 5, "purple");
	this.x = x;
	this.y = y;
	this.positioning = null;
	uiObjects.push(this);
}

function GameObject(x, y, w, h, color) {
	var me = this;
	me.position = new Vector2D(x, y);
	me.velocity = new Vector2D(0, 0);
	me.w = w;
	me.h = h;
	me.tags = [];
	me.static = false;
	me.kinematic = false;
	me.grounded = false;
	me.color = color;
	me.relative = null;

	me.destroy = function() {
		gameObjects.splice(gameObjects.indexOf(me), 1);
	}

	gameObjects.push(me);
}

function Projectile(x, y, color) {
	GameObject.call(this, x, y, 5, 5, "purple");

	var me = this;
	me.kinematic = true;
	me.tags.push('projectile');

	// me.static = true;
	// me.grounded = true;
}

function Character(x, y, color) {
	GameObject.call(this, x, y, 50, 50, color);

	var me = this;

	me.speed = 1;
	me.fireRate = 2;
	me.lastShot = new Date();

	me.health = 100;
	me.maxHealth = me.health;
	me.healthBarBackground = new GameObject(0, 20, me.w, 10, 'red');
	me.healthBarBackground.relative = this;
	me.healthBarBackground.static = true;
	me.healthBar = new GameObject(0, 20, me.w, 10, 'green');
	me.healthBar.relative = this;
	me.healthBar.static = true;

	me.tags.push('character');

	me.changeHealth = function(amount) {
		me.health += amount;
		me.healthBar.w = (me.health / me.maxHealth) * me.w;

		if(me.health <= 0) {
			if(me.tags.indexOf('enemy') != -1) {
				var coin = new GameObject(me.position.x, me.position.y + 25, 25, 25, 'yellow');
				coin.tags.push('coin');
			}

			me.destroy();
		}
	}

	me.destroy = function() {
		gameObjects.splice(gameObjects.indexOf(me), 1);
		me.healthBar.destroy();
		me.healthBarBackground.destroy();
	}
}

function Enemy(x, y) {
	Character.call(this, x, y, 'rgba(200, 0, 0, 0.5)');

	var me = this;

	me.tags.push('enemy');

	me.grounded = false;

	me.think = function() {
		if (me.position.x > player.position.x) {
			me.position.x -= me.speed;
		} 
		else if (me.position.x < player.position.x) {
			me.position.x += me.speed;
		}
		if (me.position.y < player.position.y && player.grounded && me.grounded) {
			me.velocity.y = 10;
			// player.position.y += 1;
			me.grounded = false;
		}

		// where's the player's y? is it above us? are they grounded? if so, jump to them maybe if we're a dog.
		//or if we're a gunner, keep a distance
	}
}