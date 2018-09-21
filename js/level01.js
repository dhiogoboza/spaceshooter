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

    create: function() {
        this.totalHeight = game.height + this.map.verticalPadding * 2;
        this.totalWidth = game.width + this.map.horizontalPadding * 2;

        game.world.setBounds(0, 0, this.totalWidth, this.totalHeight);

        this.scene = game.add.group();
        this.scene.x = 0;
        this.scene.y = 0;

        this.background = new Phaser.TileSprite(game, 0, 0, this.totalWidth, this.totalHeight, 'background');
        this.background.autoScroll(-40, 0);
        this.scene.add(this.background);

        var fh = 1150;
        this.foreground = game.add.tileSprite(0,
                this.totalHeight - fh, this.totalWidth, this.totalHeight, 'foreground');
        this.foreground.autoScroll(-60, 0);

        var mh = 200;
        this.target = new Phaser.Sprite(game, this.map.target.x, this.totalHeight / 2, "map01.membrane");
        this.target.anchor.set(0.5, 0.5);

        game.physics.arcade.enable(this.target, Phaser.Physics.ARCADE);
        this.target.body.immovable = true;
        this.target.body.moves = false;
        this.scene.add(this.target);

        this.target.width *= 1.5;
        this.target.height *= 1.5;

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

        // Create ship group
        //this.ship.group = game.add.group();
        //this.ship.group.add(this.ship.sprite);
        //this.ship.group.add(this.ship.turbine);

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

        this.currentWeapon = 0;

        for (var i = 1; i < this.weapons.length; i++) {
            this.weapons[i].visible = false;
        }
    },
    
    nextWeapon: function () {

        //  Tidy-up the current weapon
        if (this.currentWeapon > 9) {
            this.weapons[this.currentWeapon].reset();
        } else {
            this.weapons[this.currentWeapon].visible = false;
            this.weapons[this.currentWeapon].callAll('reset', null, 0, 0);
            this.weapons[this.currentWeapon].setAll('exists', false);
        }

        //  Activate the new one
        this.currentWeapon++;

        if (this.currentWeapon === this.weapons.length) {
            this.currentWeapon = 0;
        }

        this.weapons[this.currentWeapon].visible = true;
        this.weaponName.text = this.weapons[this.currentWeapon].name;
    },

    update: function() {
        // ---> http://jsbin.com/pinone/1/edit?js,output
        var weapon = this.weapons[this.currentWeapon];
        this.game.physics.arcade.collide(this.ship.sprite, this.target);

        this.game.physics.arcade.overlap(this.ship.sprite, this.enemies, this.hitShip, null, this);
        this.game.physics.arcade.overlap(weapon, this.enemies, this.hitEnemy, null, this);
        this.game.physics.arcade.overlap(weapon, this.target, this.hitTarget, null, this);
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
        
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies.children[i].timer();
        }

        this.target.x += this.map.target.speed;
        if (this.target.x < this.map.target.targetX) {
            this.finishLevel();
        }
    },

    scriptTimer: function() {
        var currentTime = this.game.time.totalElapsedSeconds() - this.startTime;
        if (this.map.scripts.length) {
            var next = this.map.scripts[0];

            if (next.start >= currentTime) {
                this.map.actionsRunning.push();
                this.map.scripts.shift();
                next.onStart(this);
            }
        }

        if (this.map.actionsRunning.length) {
            var next = this.map.actionsRunning[0];

            if (next.end >= currentTime) {
                this.map.actionsRunning.shift();
                next.onFinish(this);
            }
        }
    },

    render: function() {

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
        tween.to({x: (shipSprite.scope.totalWidth - shipSprite.x) + 100}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
    },

    shipStoppedFront: function() {
        startLevel(constants.MAP_01);
    },

    hitShip: function(ship, enemy, state) {
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
    },

    hitEnemy: function (bullet, enemy) {
        enemy.hit(bullet.damage);
        bullet.kill();
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

    destroyEnemy: function() {
        this.parent.remove(this);

        this.kill();
        this.destroy();
    },

    configureLevel: function() {
        this.map = {
            verticalPadding: 200,
            horizontalPadding: 200,
            target: {
                speed: -2,
                targetX: config.width + (config.width * 0.2),
                x: 3000
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
            scripts: [Level01.Action01],
            actionsRunning: [Level01.Action01]
        }
    },

    Action01: {
        start: 5,

        end: 8,

        executed: false,

        onStart: function (level01) {
            // https://phaser.io/examples/v2/games/invaders
            this.asteroid = new Asteroid(game, "stone01", level01.totalWidth, level01.totalHeight, level01.destroyEnemy);
            level01.enemies.add(this.asteroid);
            this.asteroid.start();

            this.rotator = new RotatorEnemy(game, "enemy01", level01.totalWidth, level01.totalHeight, level01.destroyEnemy);
            level01.enemies.add(this.rotator);
            this.rotator.start();
        },

        onFinish: function (level01) {
            // https://phaser.io/examples/v2/games/invaders
            this.asteroid.mustRestart = false;
            this.rotator.mustRestart = false;
        }
    }
};
