// TODO
// sprites
// different weapons
// what do we spend coins on?
// shop items
// more enemies
	// enemies shooting
// boss?

var gamescreen = document.getElementById('gameScreen');

var uiObjects = [];
var buyButtons = [];

var windowWidth = document.body.offsetWidth;
var windowHeight = document.body.offsetHeight;

var gameMode = 'editing';

gamescreen.width = windowWidth;
gamescreen.height = windowHeight;
var tools = gamescreen.getContext('2d');

var coins = 50;
var difficulty = 'normal';

var shopItemXOffset = -300;
var gravityForce = 0.4;
var xDirection = 0;
var yDirection = 0;
var projectileSpeed = 10;

var pausing = false;

var mousing = false;
var mouseX = 0;
var mouseY = 0;

window.addEventListener('mousedown', mouseDown);
function mouseDown(event) {
	mousing = true;

	for(var uiIndex = 0; uiIndex < uiObjects.length; uiIndex++) {
		var uiObject = uiObjects[uiIndex];

		if(!uiObject.active) {
			continue;
		}

		var mouseObject = new GameObject(mouseX, mouseY, 10, 10);
		var uiButtonObject = new GameObject(uiObject.x, uiObject.y, 300, 36);

		if(uiObject.positioning == 'center') {
			uiButtonObject.position.x += (gamescreen.width / 2) - (uiObject.textMeasurement / 2);
		}

		if(checkCollision(mouseObject, uiButtonObject)) {
			for(var callbackIndex = 0; callbackIndex < uiObject.clickCallbacks.length; callbackIndex++) {
				var clickCallback = uiObject.clickCallbacks[callbackIndex];
				clickCallback();
			}
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
resumeButton.active = false;
resumeButton.clickCallbacks.push(function() {
	pausing = false;
	resumeButton.active = false;
	shopButton.active = false;
});

var shopButton = new UIObject(10, -150);
shopButton.text = 'Shop';
shopButton.active = false;
shopButton.positioning = 'center';
shopButton.clickCallbacks.push(function(){
	for(var buttonIndex = 0; buttonIndex < buyButtons.length; buttonIndex++) {
		var buyButton = buyButtons[buttonIndex];
		buyButton.active = true;
	}
});

// var optionsBullet = new UIObject();
// new UIWindow();
// resume

function openPauseMenu() {
	pausing = true;
	resumeButton.active = true;
	shopButton.active = true;
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

var pixelPistol = new Weapon("Pixel Pistol", 100, 10, 0, 2);
var uzi = new Weapon('UZI', 50, 10, 100, 4);
var launcher = new Weapon('Launcher', 100, 50, 50, 5);
launcher.kinematic = false;
launcher.projectileSpeed = 30;
player.activeWeapon = launcher;

generateLevel();

function generateLevel() {
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

	var numberOfEnemies = 5;
	if(difficulty == 'easy') {
		numberOfEnemies = 3;
	} else if(difficulty == 'hard') {
		numberOfEnemies = 8;
	}
	for (var index = 0; index < numberOfEnemies; index++) {
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
	var currentTime = new Date();

	if(currentTime - player.lastShot > 1000 / player.activeWeapon.fireRate) {
		switch(player.activeWeapon) {
			case pixelPistol:
			case uzi: {
				var projectile = new Projectile(player.position.x, player.position.y, 5, 5, 'rgb(200, 200, 0)');

				var mousePosition = localToWorld(new Vector2D(mouseX, mouseY));

				var spread = 100 - player.activeWeapon.accuracy;
				mousePosition.x += spread - Math.random() * spread * 2;
				mousePosition.y += spread - Math.random() * spread * 2;

				var differenceVector = mousePosition.subtract(player.position);
				differenceVector.normalize();

				projectile.velocity = differenceVector.multiply(player.activeWeapon.projectileSpeed);
			} break;

			case launcher: {
				var projectile = new Projectile(player.position.x, player.position.y, 25, 25, 'rgb(0, 0, 200)');
				projectile.kinematic = player.activeWeapon.kinematic;
				projectile.tags.push('launcherProjectile');

				var mousePosition = localToWorld(new Vector2D(mouseX, mouseY));

				var spread = 100 - player.activeWeapon.accuracy;
				mousePosition.x += spread - Math.random() * spread * 2;
				mousePosition.y += spread - Math.random() * spread * 2;

				var differenceVector = mousePosition.subtract(player.position);
				differenceVector.normalize();

				projectile.velocity = differenceVector.multiply(player.activeWeapon.projectileSpeed);
			} break;
		}

		player.lastShot = currentTime;
	}


}

function update() {
	tools.clearRect(0, 0, windowWidth, windowHeight);

	tools.fillStyle = 'black';
	tools.font = '36px Arial';
	tools.fillText(coins, 0, 36);
	for(var index = 0; index < uiObjects.length; index++) {
		var uiObject = uiObjects[index];

		if (!uiObject.active) {
			continue;
		}

		if(uiObject.text != null) {
			if(uiObject.positioning == 'center') {
				var measurement = tools.measureText(uiObject.text);
				uiObject.textMeasurement = measurement.width;
				tools.fillText(uiObject.text, (windowWidth / 2 - measurement.width / 2) + (uiObject.x), -uiObject.y);
			} else {
				tools.fillText(uiObject.text, uiObject.x, -uiObject.y);
			}
		}
	}


	if(pausing) {
		setTimeout(update, 10);
		return;
	}

	player.velocity.x += xDirection * player.acceleration;
	// player.position.y += yDirection * player.speed;

	var currentTime = new Date();

	if(mousing) {
		shoot();
	}

	for(var index = 0; index < gameObjects.length; index++) {
		var gameObject = gameObjects[index];

		if(gameObject.tags.indexOf('enemy') != -1) {
			gameObject.think();
		}

		if(gameObject.tags.indexOf('projectile') != -1) {
			var differenceVector = player.position.subtract(gameObject.position);
			var distance = differenceVector.getMagnitude();
			if(distance >= 10000) {
				gameObject.destroy();
				index--;
			}
		}

		if(gameObject.velocity.x > 0) {
			if((gameObject.grounded || xDirection == -1) && xDirection != 1) {
				gameObject.velocity.x -= gameObject.friction;
			}
		}

		if(gameObject.velocity.x < 0) {
			if((gameObject.grounded || xDirection == 1) && xDirection != -1) {
				gameObject.velocity.x += gameObject.friction;
			}
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
					if(gameObject.tags.indexOf('launcherProjectile') != -1) {
						/// bounciness maybe bigger magnitude == bigger bounce
						gameObject.velocity.y *= -0.6 ;
						gameObject.velocity.x *= 0.9;
						if(gameObject.velocity.getMagnitude() < 0.1) {
							gameObject.destroy();
						}
					} else {
						gameObject.grounded = true;
						staticCollision = true;
						gameObject.velocity.y = 0;
						gameObject.position.y = colliderObject.position.y + gameObject.h;
					}
					// }
				}


				if(gameObject == player && colliderObject.tags.indexOf('coin') != -1) {
					colliderObject.destroy();
					coins++;
				}
				
				if(gameObject == player && colliderObject.tags.indexOf('enemyProjectile') != -1) {
					gameObject.changeHealth(-10);
					colliderObject.destroy();
				}

				if(gameObject.tags.indexOf('enemy') != -1) {
					if(colliderObject.tags.indexOf('playerProjectile') != -1) {
						gameObject.changeHealth(-player.activeWeapon.damage);
						colliderObject.destroy();
					}

					if(colliderObject == player) {
						colliderObject.changeHealth(-100);
					}
				}
			}
		}

		if (gameObject.tags.indexOf('projectile') != -1 && staticCollision) {
			gameObject.destroy();
			index--;
			continue;
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
	this.active = true;
	this.textMeasurement = 0;
	this.positioning = null;
	this.clickCallbacks = [];
	uiObjects.push(this);
}

// function ShopItem() {
// 	var me = this;
// }


function Weapon(name, accuracy, damage, price, fireRate) {
	var me = this;
	me.name = name;
	me.accuracy = accuracy;
	me.damage = damage;
	me.price = price;
	me.fireRate = fireRate;
	me.kinematic = true;
	me.purchased = false;
	me.projectileSpeed = 10;

	if(me.price > 0) {
		var buyButton = new UIObject(shopItemXOffset, -200);
		buyButton.text = me.name;
		buyButton.active = false;
		buyButton.positioning = 'center';
		buyButtons.push(buyButton);

		buyButton.clickCallbacks.push(function() {
			if (me.purchased){
				player.activeWeapon = me;

			} else {
				if(coins >= me.price) {
					console.log('somethin bought');
					coins -= me.price;
					me.purchased = true;
					buyButton = me.name + ' (purchased)';
				}
			}
		});

		shopItemXOffset += 150;
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
	me.kinematic = false;
	me.grounded = false;
	me.color = color;
	me.relative = null;

	me.destroy = function() {
		gameObjects.splice(gameObjects.indexOf(me), 1);
	}

	gameObjects.push(me);
}

function Projectile(x, y, width, height, color) {
	GameObject.call(this, x, y, width, height, "purple");

	var me = this;
	me.kinematic = true;
	me.tags.push('playerProjectile');
	me.tags.push('projectile');

	// me.static = true;
	// me.grounded = true;
}

function EnemyProjectile(x, y, width, height, color) {
	GameObject.call(this, x, y, width, height, "red");

	var me = this;
	me.kinematic = true;
	me.tags.push('enemyProjectile');
	me.tags.push('projectile');

	// me.static = true;
	// me.grounded = true;
}

function Character(x, y, color) {
	GameObject.call(this, x, y, 50, 50, color);

	var me = this;

	me.activeWeapon = null;
	me.speed = 4;
	me.friction = 0.5;
	me.acceleration = 0.2;
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
	
	me.fireRate = 0.75;

	me.visionRadius = 500;
	
	me.agroRadius = 750;
	
	me.following = false;

	me.spread = 25;

	if(difficulty == 'easy') {
		me.spread *= 1.5;
		me.visionRadius = 400;
		me.agroRadius = 500;
	}

	if(difficulty == 'hard') {
		me.spread = 0;
		me.visionRadius = 600;
		me.agroRadius = 1000;
	}

	me.tags.push('enemy');
 
	me.grounded = false;

	me.enemyShoot = function() {
		var projectile = new EnemyProjectile(me.position.x, me.position.y, 10, 10, 'rgb(200, 0, 0)');

		var offsetVector = new Vector2D(me.spread - Math.random() * me.spread * 2, me.spread - Math.random() * me.spread * 2);
		var targetVector = player.position.add(offsetVector)
		var differenceVector = targetVector.subtract(me.position);

		differenceVector.normalize();

		projectile.velocity = differenceVector.multiply(projectileSpeed);
	}

	me.think = function() {
		var differenceVector = me.position.subtract(player.position);

		var distance = differenceVector.getMagnitude();

		if(difficulty == 'easy') {
			// less likely to attack player?
			// slower 
		} else if(difficulty == 'normal') {
			// 
		} else if(difficulty == 'hard') {

		}

		if(distance < me.visionRadius) {
			me.following = true;
		}
		
		var enemyTime = new Date();

		if(me.following == true && enemyTime - me.lastShot > 1000 / me.fireRate) {
			me.enemyShoot();
			me.lastShot = enemyTime;
		}
		
		if (me.following == true) {
			if (me.position.x > player.position.x) {
				me.position.x -= me.speed;
			} else if (me.position.x < player.position.x) {
				me.position.x += me.speed;
			}

			if (me.position.y < player.position.y && player.grounded && me.grounded) {
				me.velocity.y = 10;
				// player.position.y += 1;
				me.grounded = false;
			}
		}

		if (distance > me.agroRadius) {
			me.following = false;
		}
	}
}