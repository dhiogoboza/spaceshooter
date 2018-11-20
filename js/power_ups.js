var PowerUp = function(game, spriteName, mapWidth, mapHeight) {
    Phaser.Sprite.call(this, game,
        game.rnd.integerInRange(mapWidth, mapWidth + 100),
        game.rnd.integerInRange(0, mapHeight),
        spriteName
    );

    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    
    this.mass = 100;
    this.velocity = -100;

    this.name = "power_up";
    this.visible = false;
}

PowerUp.prototype = Object.create(Phaser.Sprite.prototype);
PowerUp.prototype.constructor = PowerUp;

PowerUp.prototype.start = function() {
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.body.immovable = false;
    this.body.mass = this.mass;
    this.body.velocity.x = this.velocity;
    this.visible = true;
};

PowerUp.prototype.update = function() {
    
};

PowerUp.prototype.hit = function(damage) {
    this.kill();
};

PowerUp.prototype.timer = function() {
    if (this.body.position.x < 0) {
        this.kill();
    }
};

PowerUp.prototype.powerUp = function(level) {
    level.changeWeapon(2);
    this.kill();
}
