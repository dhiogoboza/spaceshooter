var Menu = function(gameConfig) {
    this.gameConfig = gameConfig;
    this.background = null;
} 

Menu.prototype = {
    init: function () {
        game.renderer.renderSession.roundPixels = true;
    },

    loadSprites: function(game) {
        this.game.load.bitmapFont('myfont', 'assets/font/font.png', 'assets/font/font.fnt');

        var sprites = [
            ['menu.background', '/res/bgs/menu.jpg'],
            ['menu.redButton', '/res/ui/buttonRed.png'],
            ['menu.yellowButton', '/res/ui/buttonYellow.png']
        ];
        
        game.load.spritesheet('button', '/res/ui/buttons.png', 222, 39);
        
        for (var i = 0; i < sprites.length; i++) {
            game.load.image(sprites[i][0], sprites[i][1]);
        }
    },

    create: function() {
        console.log("menu create");

        game.stage.backgroundColor = "#000000";
        game.add.image(game.world.centerX, game.world.centerY, 'menu.background').anchor.set(0.5);

        var graphics = game.add.graphics(0, 0);
        graphics.alpha= 0.5;
        // set a fill style
        graphics.beginFill(0x000000);
        // draw a rectangle
        graphics.drawRect(0, 0, game.width, game.height);

        var style = {fill: '#ffffff', 'font': '80px KenvectorFuture'};
        var text = game.add.text(game.width / 2, (game.height / 2) - 100, 'Intercelular', style);
        text.anchor.set(0.5, 0.5);
        text.alpha = 0;
        
        
        var tween = game.add.tween(text).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
        tween.onComplete.add(this.createButtons);
    },

    createButtons: function() {
        console.log("createButtons");
        this.startGameButton = new LabelButton(this.game, 0, 0, "button", "Start game", this.startGame, this, 1, 0, 2);
        this.startGameButton.anchor.set(0.5, 0.5);
        this.startGameButton.x = game.width / 2;
        this.startGameButton.alpha = 1;
        this.startGameButton.y = game.height / 2;
        //this.startGameButton.y = -this.startGameButton.height;

        //game.add.tween(this.startGameButton).to({ y: game.height / 2, alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
    },

    startGame: function() {
        startLevel(constants.MAP_01);
    },

    update: function() {
        
    },

    timer: function() {
        
    },

    render: function() {
        
    }
}

var LabelButton = function(game, x, y, key, label, callback, callbackContext, overFrame, outFrame, downFrame, upFrame) {
    Phaser.Button.call(this, game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);
    //Style how you wish...
    this.style = {
        'font': '20px KenvectorFuture',
        'fill': 'black'
    };
    this.anchor.setTo(0.5, 0.5);
    this.label = new Phaser.Text(game, 0, 0, label, this.style); //puts the label in the center of the button
    this.label.anchor.setTo(0.5, 0.5);
    this.addChild(this.label);
    this.setLabel(label); //adds button to game
    game.add.existing(this);
};

LabelButton.prototype = Object.create(Phaser.Button.prototype);
LabelButton.prototype.constructor = LabelButton;
LabelButton.prototype.setLabel = function(label) {
    this.label.setText(label);
};
