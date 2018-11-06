var Level01 = {
    init: function () {
        this.game.renderer.renderSession.roundPixels = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.weapons = [];

        this.levelFinished = false;

        this.lives = config.lives;

        this.configureLevel();
        this.configureShip();
    },

    updateDimensions: function() {
        this.totalHeight = game.height + this.map.verticalPadding * 2;
        this.totalWidth = game.width + this.map.horizontalPadding * 2;

        game.world.setBounds(0, 0, this.totalWidth, this.totalHeight);
        
        this.background.width = this.totalWidth;
        this.background.height = this.totalHeight;
    },

    create: function() {
        this.background = new Phaser.TileSprite(game, 0, 0, game.width, game.height, 'level01.background');
        this.background.autoScroll(-40, 0);

        this.updateDimensions();

        this.scene = game.add.group();
        this.scene.x = 0;
        this.scene.y = 0;

        this.scene.add(this.background);

        var fh = 1150;
        this.foreground = game.add.tileSprite(0,
                this.totalHeight - fh, this.totalWidth, this.totalHeight, 'foreground');
        this.foreground.autoScroll(-60, 0);

        // Create ship
        this.ship.sprite = game.add.sprite(320, this.totalHeight / 2, this.ship.spriteName, 2);
        game.physics.arcade.enable(this.ship.sprite, Phaser.Physics.ARCADE);

        var scale = config.shipWidth / this.ship.sprite.width;
        this.ship.width = config.shipWidth;
        this.ship.height = scale * this.ship.sprite.height;
        this.ship.sprite.scale.setTo(scale);

        this.ship.sprite.body.collideWorldBounds = true;
        this.ship.sprite.body.maxVelocity.set(this.ship.maxSpeed);
        this.ship.sprite.body.enable = true;
        this.ship.sprite.body.collideWorldBounds = true;
        game.camera.follow(this.ship.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        // Create ship turbine
        this.ship.turbine = game.add.sprite(0, 0, this.ship.turbineSpriteName, 3);
        this.ship.turbine.x = -this.ship.turbine.width;
        this.ship.turbine.y = (this.ship.turbine.height / 2) + (this.ship.sprite.height / 2) + 2;
        this.ship.turbine.animations.add('fire', [0, 1]);
        this.ship.turbine.animations.play('fire', 2, true);

        this.ship.sprite.addChild(this.ship.turbine);

        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        this.scene.add(this.enemies);

        this.createWeapons();

        this.cursors = game.input.keyboard.createCursorKeys();
        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            fire: game.input.keyboard.addKey(Phaser.Keyboard.K),
        };
        this.fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        this.foreground.bringToTop();

        game.time.events.loop(config.timerDelay, this.timer, this);
        game.time.events.loop(1000, this.scriptTimer, this);

        this.createHud();
        
        this.startTime = this.game.time.totalElapsedSeconds();
    },

    onResize: function() {
        this.updateDimensions();
    },

    createHud: function() {
        // create hud group
        this.hud = game.add.group();
        this.hud.x = 0;
        this.hud.y = 0;
        this.hud.fixedToCamera = true;

        // lives
        this.hudLives = game.add.group();
        for (var i = 0; i < this.lives; i++) {
            var live = game.add.sprite(game.width - (50 + (40 * i)), 20, "hud.life");
            this.hudLives.add(live);
        }

        this.hud.add(this.hudLives);
    },
    
    createWeapons: function() {
        var wc = this.map.weapon;

        this.weapons.push(new Weapon.SingleBullet(game, wc.singleBullet.bulletSpeed, wc.singleBullet.fireRate));
        this.weapons.push(new Weapon.FrontAndBack(game));
        this.weapons.push(new Weapon.ThreeWay(game));
        this.weapons.push(new Weapon.EightWay(game));
        this.weapons.push(new Weapon.ScatterShot(game));
        this.weapons.push(new Weapon.Beam(game));
        this.weapons.push(new Weapon.SplitShot(game));
        this.weapons.push(new Weapon.Pattern(game));
        this.weapons.push(new Weapon.Rockets(game));
        this.weapons.push(new Weapon.ScaleBullet(game));
        this.weapons.push(new Weapon.Combo1(game));
        this.weapons.push(new Weapon.Combo2(game));

        this.currentWeapon = 1;

        for (var i = 1; i < this.weapons.length; i++) {
            this.weapons[i].visible = false;
        }

        this.weapons[this.currentWeapon].visible = true;
    },

    changeWeapon: function (newWeapon) {
        //  Tidy-up the current weapon
        if (this.currentWeapon > 9) {
            this.weapons[this.currentWeapon].reset();
        } else {
            this.weapons[this.currentWeapon].visible = false;
            this.weapons[this.currentWeapon].callAll('reset', null, 0, 0);
            this.weapons[this.currentWeapon].setAll('exists', false);
        }

        //  Activate the new one
        this.currentWeapon = newWeapon;

        /*if (this.currentWeapon === this.weapons.length) {
            this.currentWeapon = 0;
        }*/

        this.weapons[this.currentWeapon].visible = true;
        //this.weaponName.text = this.weapons[this.currentWeapon].name;
    },

    update: function() {
        // ---> http://jsbin.com/pinone/1/edit?js,output
        this.game.physics.arcade.overlap(this.ship.sprite, this.enemies, this.hitShip, null, this);
        this.game.physics.arcade.overlap(this.weapons[this.currentWeapon], this.enemies, this.hitEnemy, null, this);

        for (var i = 0; i < this.map.actionsRunning.length; i++) {
            if (this.map.actionsRunning[i].onUpdate) {
                this.map.actionsRunning[i].onUpdate(this);
            }
        }
    },

    timer: function() {
        if (this.levelFinished) {
            return;
        }
        var ship = this.ship;
        var cursors = this.cursors;
        var wasd = this.wasd;

        if (cursors.left.isDown || wasd.left.isDown) {
            this.ship.sprite.body.velocity.x -= this.ship.acceleration;
            this.verticalKeyPressed = true;
        } else if (cursors.right.isDown || wasd.right.isDown) {
            this.ship.sprite.body.velocity.x += this.ship.acceleration;
            this.verticalKeyPressed = true;
        } else if (ship.sprite.body.velocity.x) {
            if (ship.sprite.body.velocity.x < -200) {
                ship.sprite.body.velocity.x += ship.dragForce;
            } else if (ship.sprite.body.velocity.x > 200) {
                ship.sprite.body.velocity.x -= ship.dragForce;
            } else {
                ship.sprite.body.velocity.x = 0;
            }
        }

        if (cursors.up.isDown || wasd.up.isDown) {
            this.ship.sprite.body.velocity.y -= this.ship.acceleration;
            this.horizontalKeyPressed = true;
        } else if (cursors.down.isDown || wasd.down.isDown) {
            this.ship.sprite.body.velocity.y += this.ship.acceleration;
            this.horizontalKeyPressed = true;
        } else if (ship.sprite.body.velocity.y) {
            if (ship.sprite.body.velocity.y < -200) {
                ship.sprite.body.velocity.y += ship.dragForce;
            } else if (ship.sprite.body.velocity.y > 200) {
                ship.sprite.body.velocity.y -= ship.dragForce;
            } else {
                ship.sprite.body.velocity.y = 0;
            }
        }

        if (this.fireButton.isDown || wasd.fire.isDown) {
            this.weapons[this.currentWeapon].fire(this.ship.sprite);
        }
    },

    scriptTimer: function() {
        var currentTime = parseInt(this.game.time.totalElapsedSeconds() - this.startTime);

        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies.children[i].timer(currentTime);
        }

        for (var i = 0; i < this.map.actionsRunning.length; i++) {
            if (this.map.actionsRunning[i].onTimer) {
                this.map.actionsRunning[i].onTimer(currentTime);
            }
        }

        if (this.map.scripts.length) {
            var next = this.map.scripts[0];

            if (currentTime >= next.start) {
                this.map.actionsRunning.push(next);
                this.map.scripts.shift();
                next.onStart(this);
            }
        }

        if (this.map.actionsRunning.length) {
            var next = this.map.actionsRunning[0];
            if (next.end > 0 && currentTime >= next.end) {
                this.map.actionsRunning.shift();
                next.onFinish(this);
            }
        }
    },

    render: function() {

    },

    startBoss: function() {
        
    },

    finishLevel: function() {
        this.levelFinished = true;
        this.ship.sprite.body.velocity.set(0, 0);

        var targetX = this.ship.sprite.x - 100;
        if (targetX <= this.ship.sprite.width) {
            targetX = this.ship.sprite.width + 10;
        }

        this.ship.sprite.scope = this;
        var tween = game.add.tween(this.ship.sprite);
        tween.onComplete.add(this.shipStoppedBack);
        tween.to({x: targetX}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);

        completeLevel(0, 0);
    },

    shipStoppedBack: function(shipSprite) {
        var tween = game.add.tween(shipSprite);
        tween.onComplete.add(shipSprite.scope.shipStoppedFront);
        tween.to({x: shipSprite.scope.totalWidth + shipSprite.x}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
    },

    shipStoppedFront: function() {
        startLevel(constants.MAP_01);
    },

    hitShip: function(ship, enemy, state) {
        if (enemy.powerUp) {
            // is a power up
            enemy.powerUp(this);
        } else {
            enemy.hit(-1);
            if (this.levelFinished) {
                return;
            }

            if (this.lives) {
                this.lives--;
                this.hudLives.children[this.lives].kill();
            } else {
                this.gameOver();
            }
        }
    },

    hitEnemy: function (bullet, enemy) {
        if (!enemy.powerUp) {
            enemy.hit(bullet.damage);
            bullet.kill();
        }
    },

    hitTarget: function(target, bullet) {
        bullet.kill();
    },

    gameOver: function() {
        startLevel(constants.MAP_01);
    },

    configureShip: function() {
        var weapon = {
            spriteName: 'bullet',
            maxBullets: 40,
            bulletAngleOffset: 90,
            bulletSpeed: 1500,
            fireRate: 100,
            fireAngle: Phaser.ANGLE_RIGHT,
            sprite: undefined
        }

        this.ship = {
            spriteName: 'ship01',
            turbineSpriteName: 'ship01.turbine',
            acceleration: 200,
            dragForce: 400,
            maxSpeed: 800,
            mass: 100,
            width: 0,
            height: 0,
            sprite: undefined,
            weapon: weapon
        }
    },

    destroyEnemy: function(enemy) {
        enemy.parent.remove(this);
        enemy.kill();
        enemy.destroy();
    },

    configureLevel: function() {
        var hp = 200;
        this.map = {
            verticalPadding: 250,
            horizontalPadding: hp,
            target: {
                speed: -2,
                scale: 1
            },
            stones: {
                count: 10,
                lesser: {mass: 50, size: 10},
                greatter: {mass: 200, size: 150}
            },
            weapon: {
                singleBullet: {
                    fireRate: 50,
                    bulletSpeed: 1500
                }
            },
            scripts: [Level01.ActionSimpleEnemies, Level01.ActionPowerUps, Level01.ActionTarget],
            actionsRunning: []
        }
    },

    ActionSimpleEnemies: {
        start: 2,
        end: 40,
        finished: false,
        asteroids: [],
        rotators: [],
        rotatorsMaxCount: 4,
        asteroidsMaxCount: 8,
        lastGeneration: 0,

        removeAsteroid: function() {
            this.context.asteroids.pop(this);
            this.context.currentLevel.destroyEnemy(this);
        },

        removeRotator: function() {
            this.context.rotators.pop(this);
            this.context.currentLevel.destroyEnemy(this);
        },

        addAsteroid: function() {
            // https://phaser.io/examples/v2/games/invaders
            var asteroid = new Asteroid(game, "stone01", this.currentLevel.totalWidth,
                    this.currentLevel.totalHeight, this.removeAsteroid);
            asteroid.context = this;
            this.currentLevel.enemies.add(asteroid);
            asteroid.start();

            this.asteroids.push(asteroid);
        },

        addRotator: function() {
            var rotator = new RotatorEnemy(game, "virusGreen", this.currentLevel.totalWidth,
                    this.currentLevel.totalHeight, this.removeRotator);
            rotator.context = this;
            this.currentLevel.enemies.add(rotator);
            rotator.start();

            this.rotators.push(rotator);
        },

        onStart: function (currentLevel) {
            this.currentLevel = currentLevel;
            this.addAsteroid();
            this.addRotator();
        },

        onUpdate: undefined,

        onTimer: function (currentTime) {
            // generate mobs only in 5 seconds
            if (currentTime - this.lastGeneration >= 5) {
                if (this.asteroids.length < this.asteroidsMaxCount) {
                    this.addAsteroid();
                    this.lastGeneration = currentTime;
                }

                if (this.rotators.length < this.rotatorsMaxCount) {
                    this.addRotator();
                    this.lastGeneration = currentTime;
                }
                console.log("gerando em: " + currentTime + ", lg: " + this.lastGeneration);
            }
        },

        onFinish: function (currentLevel) {

        }
    },

    ActionPowerUps: {
        start: 8,
        end: 40,
        finished: false,
        lastGeneration: 0,

        addPowerUp: function() {
            var powerUp = new PowerUp(game, "weapon02", this.currentLevel.totalWidth, this.currentLevel.totalHeight);
            powerUp.context = this;
            this.currentLevel.enemies.add(powerUp);
            powerUp.start();
        },

        onStart: function (currentLevel) {
            this.currentLevel = currentLevel;
            this.addPowerUp();
        },

        onUpdate: undefined,

        onTimer: function (currentTime) {
            
        },

        onFinish: function (currentLevel) {

        }
    },
    
    ActionTarget: {
        start: 41,
        end: 46,
        finished: false,

        onStart: function (level01) {
            this.target = game.add.sprite(level01.totalWidth + 1000, level01.totalHeight / 2, "map01.boss");
            this.target.anchor.set(0.5, 0.5);
            this.target.x = currentLevel.totalWidth + this.target.width;

            game.physics.arcade.enable(this.target, Phaser.Physics.ARCADE);
            this.target.body.setCircle(this.target.width / 2);
            this.target.body.immovable = true;
            this.target.body.moves = false;
            this.target.width *= currentLevel.map.target.scale;
            this.target.height *= currentLevel.map.target.scale;

            currentLevel.scene.add(this.target);
        },

        onUpdate: function(currentLevel) {
            currentLevel.game.physics.arcade.collide(currentLevel.ship.sprite, this.target);
            currentLevel.game.physics.arcade.overlap(currentLevel.weapons[currentLevel.currentWeapon],
                    this.target, currentLevel.hitTarget, null, currentLevel);
        },

        onTimer: undefined,

        onFinish: function (currentLevel) {
            currentLevel.finishLevel();
        }
    }
};
