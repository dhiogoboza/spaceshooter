var Level01 = function (config) {
    this.config = config;

    this.background = null;
    this.foreground = null;

    this.ship = null;
    this.cursors = null;
    this.wasd = null;
    this.speed = 300;

    this.weapons = [];
    this.currentWeapon = 0;
    this.weaponName = null;
    
    this.horizontalKeyPressed = false;
    this.verticalKeyPressed = false;

    this.configureShip();
    this.configureLevel();
};

Level01.prototype = {

    init: function () {
        this.game.renderer.renderSession.roundPixels = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);
    },

    preload: function() {
        var sprites = [
            ['bullet', '/assets/sprites/bullet.png'],
            ['ship', '/assets/sprites/shmup-ship2.png'],
            ['stone01', '/assets/particlestorm/particles/barkshard.png'],
            ['map01', 'assets/pics/ra_einstein.png'],
            ['background', '/assets/skies/deep-space.jpg'],
            ['foreground', '/assets/wip/karamoon.png'],
            ['enemy01', '/res/enemies/ufoRed.png']
        ];
        
        var spritesheets = [
            ['explosion', 'assets/games/invaders/explode.png', 128, 128]
        ];
        
        for (var i = 0; i < sprites.length; i++) {
            this.load.image(sprites[i][0], sprites[i][1]);
        }
        
        for (var i = 0; i < spritesheets.length; i++) {
            var sheet = spritesheets[i];
            this.load.spritesheet(sheet[0], sheet[1], sheet[2], sheet[3]);
        }

        this.load.bitmapFont('shmupfont', '/assets/fonts/shmupfont.png', '/assets/shmupfont.xml');

        for (var i = 1; i <= 11; i++) {
            this.load.image('bullet' + i, '/assets/bullets/bullet' + (i < 10 ? "0" : "") + i + '.png');
        }
    },

    create: function() {
        var ship = this.ship;
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.renderer.renderSession.roundPixels = true;
        game.time.events.loop(this.config.timerDelay, this.timer, this);

        this.background = game.add.tileSprite(0, 0, this.config.width, this.config.height, 'background');
        this.background.autoScroll(-40, 0);
        
        this.foreground = game.add.tileSprite(0, 0, this.config.width, this.config.height, 'foreground');
        this.foreground.autoScroll(-60, 0);

        // Create ship
        ship.sprite = game.add.sprite(320, 500, ship.spriteName, 2);

        game.physics.arcade.enable(ship.sprite, Phaser.Physics.ARCADE);

        var scale = ship.width / ship.sprite.width;
        ship.height = scale * ship.sprite.height;
        ship.sprite.scale.setTo(scale);

        ship.sprite.body.collideWorldBounds = true;
        ship.sprite.body.maxVelocity.set(ship.maxSpeed);
        ship.sprite.body.enable = true;
        ship.sprite.body.collideWorldBounds = true;

        this.createEnemies();
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
        this.game.physics.arcade.collide(this.ship.sprite, this.enemies);
        this.game.physics.arcade.overlap(this.weapons[this.currentWeapon], this.enemies, this.hitEnemy, null, this.game);
    },

    timer: function() {
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
            //this.ship.weapon.sprite.fire();
            this.weapons[this.currentWeapon].fire(this.ship.sprite);
        }
        
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies.children[i].timer();
        }
    },

    render: function() {

    },

    createEnemies: function () {
        // https://phaser.io/examples/v2/games/invaders
        var game = this.game;

        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

        var asteroid = new Asteroid(game, "stone01", this.config.width, this.config.height);
        this.enemies.add(asteroid);
        asteroid.start();

        var enemy01 = new RotatorEnemy(game, "enemy01", this.config.width, this.config.height);
        this.enemies.add(enemy01);
        enemy01.start();
    },

    hitEnemy: function (bullet, enemy) {
        enemy.hit(bullet.damage);
        bullet.kill();
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
            dragForce: 400,
            maxSpeed: 800,
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
            },
            weapon: {
                singleBullet: {
                    fireRate: 50,
                    bulletSpeed: 1500
                }
            }
        }
    }
}
