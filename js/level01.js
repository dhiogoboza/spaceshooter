var Level01 = function (gameConfig) {
    this.gameConfig = gameConfig;

    this.background = null;
    this.foreground = null;

    this.ship = null;
    this.cursors = null;
    this.speed = 300;

    this.weapons = [];
    this.currentWeapon = 0;
    this.weaponName = null;
    
    this.keyPressed = false;

    this.configureShip();
    this.configureLevel();
};

Level01.prototype = {
    create: function() {
        var game = this.gameConfig.game;
        var ship = this.ship;

        this.background = game.add.tileSprite(0, 0, this.gameConfig.config.width, this.gameConfig.config.height, 'background');
        this.background.autoScroll(-40, 0);
        
        this.foreground = game.add.tileSprite(0, 0, this.gameConfig.config.width, this.gameConfig.config.height, 'foreground');
        this.foreground.autoScroll(-60, 0);

        // Create ship
        ship.sprite = game.add.sprite(320, 500, ship.spriteName, 2);

        //this.stone = game.add.sprite(380, 500, "stone01", 3);
        //var stone = this.stone;

        game.physics.arcade.enable(ship.sprite, Phaser.Physics.ARCADE);

        var scale = ship.width / ship.sprite.width;
        ship.height = scale * ship.sprite.height;
        ship.sprite.scale.setTo(scale);

        //game.physics.arcade.enable(ship.sprite);
        //game.physics.arcade.gravity.y = 200;

        ship.sprite.body.collideWorldBounds = true;
        ship.sprite.body.maxVelocity.set(ship.maxSpeed);
        //ship.sprite.body.mass = ship.mass;
        ship.sprite.body.enable = true;
        
        this.createEnemies();
        
        //game.physics.arcade.enable(stone);
        //stone.body.collideWorldBounds = true;
        //stone.body.maxVelocity.set(ship.maxSpeed);
        //stone.body.mass = ship.mass * 100;
        //stone.body.enable = true;
        
        
        //ship.sprite.body.bounce.y = 0.95;
	    ship.sprite.body.collideWorldBounds = true;
        
        //stone.body.allowGravity = false;
	    //stone.body.immovable = true;

        //game.physics.arcade.enable([ship.sprite, stone]);


        /*var weapon = ship.weapon;

        // Creates 30 bullets, using the 'bullet' graphic
        weapon.sprite = game.add.weapon(weapon.maxBullets, weapon.spriteName);

        weapon.sprite.fireAngle = weapon.fireAngle;

        // The bullet will be automatically killed when it leaves the world bounds
        weapon.sprite.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        // Because our bullet is drawn facing up, we need to offset its rotation:
        weapon.sprite.bulletAngleOffset = weapon.bulletAngleOffset;

        // The speed at which the bullet is fired
        weapon.sprite.bulletSpeed = weapon.bulletSpeed;

        // Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        weapon.sprite.fireRate = weapon.fireRate;

        // Tell the Weapon to track the 'player' ship, offset by 14px horizontally, 0 vertically
        weapon.sprite.trackSprite(ship.sprite, 43, 9);
        
        //game.physics.arcade.enable(weapon.sprite, Phaser.Physics.ARCADE);
        //weapon.sprite.enableBody = true;
        
        weapon.sprite.bullets.forEach(function(bullet) {
            game.physics.arcade.enable(bullet, Phaser.Physics.ARCADE);
            bullet.body.enable = true;
            bullet.body.collideWorldBounds = true;
            bullet.body.bounce.set(1)
            
            console.log(bullet)
        });*/
      

        this.weapons.push(new Weapon.SingleBullet(game));
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

        for (var i = 1; i < this.weapons.length; i++)
        {
            this.weapons[i].visible = false;
        }

        this.cursors = game.input.keyboard.createCursorKeys();
        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            fire: game.input.keyboard.addKey(Phaser.Keyboard.K),
        };
        this.fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    },
    
nextWeapon: function () {

        //  Tidy-up the current weapon
        if (this.currentWeapon > 9)
        {
            this.weapons[this.currentWeapon].reset();
        }
        else
        {
            this.weapons[this.currentWeapon].visible = false;
            this.weapons[this.currentWeapon].callAll('reset', null, 0, 0);
            this.weapons[this.currentWeapon].setAll('exists', false);
        }

        //  Activate the new one
        this.currentWeapon++;

        if (this.currentWeapon === this.weapons.length)
        {
            this.currentWeapon = 0;
        }

        this.weapons[this.currentWeapon].visible = true;

        this.weaponName.text = this.weapons[this.currentWeapon].name;

    },

    update: function() {
        // ---> http://jsbin.com/pinone/1/edit?js,output
        var cursors = this.cursors;
        var wasd = this.wasd;

        if (cursors.left.isDown || wasd.left.isDown) {
            this.ship.sprite.body.velocity.x -= this.ship.acceleration;
            this.keyPressed = true;
        } else if (cursors.right.isDown || wasd.right.isDown) {
            this.ship.sprite.body.velocity.x += this.ship.acceleration;
            this.keyPressed = true;
        }

        if (cursors.up.isDown || wasd.up.isDown) {
            this.ship.sprite.body.velocity.y -= this.ship.acceleration;
            this.keyPressed = true;
        } else if (cursors.down.isDown || wasd.down.isDown) {
            this.ship.sprite.body.velocity.y += this.ship.acceleration;
            this.keyPressed = true;
        }

        if (this.fireButton.isDown || wasd.fire.isDown) {
            //this.ship.weapon.sprite.fire();
            this.weapons[this.currentWeapon].fire(this.ship.sprite);
        }

        this.gameConfig.game.physics.arcade.collide(this.ship.sprite, this.enemies);
        this.gameConfig.game.physics.arcade.collide(this.ship.weapon.bullets, this.enemies, this.hitEnemy);

        this.gameConfig.game.physics.arcade.overlap(this.ship.weapon.bullets, this.enemies, this.hitEnemy, null, this.gameConfig.game);
    },

    timer: function() {
        var ship = this.ship;


        if (ship.dragForce) {
            if (!this.keyPressed) {
                if (ship.sprite.body.velocity.x < 10 && ship.sprite.body.velocity.x > -10) {
                    ship.sprite.body.velocity.x = 0;
                } else if (ship.sprite.body.velocity.x < 0) {
                    ship.sprite.body.velocity.x += ship.dragForce;
                } else if (ship.sprite.body.velocity.x > 0) {
                    ship.sprite.body.velocity.x -= ship.dragForce;
                }

                if (ship.sprite.body.velocity.y < 10 && ship.sprite.body.velocity.y > -10) {
                    ship.sprite.body.velocity.y = 0;
                } else if (ship.sprite.body.velocity.y < 0) {
                    ship.sprite.body.velocity.y += ship.dragForce;
                } else if (ship.sprite.body.velocity.y > 0) {
                    ship.sprite.body.velocity.y -= ship.dragForce;
                }
            }
            
            this.keyPressed = false;
        }
    },

    render: function() {
        //this.ship.weapon.sprite.debug();    
    },

    createEnemies: function () {
        // https://phaser.io/examples/v2/games/invaders
        var game = this.gameConfig.game;
        
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

        var asteroid = this.enemies.create(380, 500, "stone01");
        asteroid.enableBody = true;
        //game.physics.arcade.enable(asteroid, Phaser.Physics.ARCADE);

        asteroid.physicsBodyType = Phaser.Physics.ARCADE;
        asteroid.name = "asteroid";
        asteroid.body.immovable = true;
    },

    hitEnemy: function (bullet, enemy) {
        console.log("Hit");
        console.log(enemy);
        
        enemy.kill();
        bullet.kill;
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
            spriteName: 'ship',
            acceleration: 200,
            dragForce: 200,
            maxSpeed: 1000,
            mass: 100,
            width: 50,
            height: 0,
            sprite: undefined,
            weapon: weapon
        }
    },

    configureLevel: function() {
        this.map = {
            stones: {
                count: 10,
                lesser: {mass: 50, size: 10},
                greatter: {mass: 200, size: 150}
            }
        }
    }
}
