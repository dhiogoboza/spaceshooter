var Menu = {
    init: function () {
        game.renderer.renderSession.roundPixels = true;
    },

    create: function() {
        game.stage.backgroundColor = "#000000";
        game.add.image(game.world.centerX, game.world.centerY, 'menu.background').anchor.set(0.5);

        var graphics = game.add.graphics(0, 0);
        graphics.alpha = 0.5;
        // set a fill style
        graphics.beginFill(0x000000);
        // draw a rectangle
        graphics.drawRect(0, 0, game.width, game.height);

        this.createButtons();
    },
    
    createButtons: function() {
        this.startButton = new LabelButton(this.game, 0, 0, "button", "Start game", this.startGame, this, 1, 0, 2);
        this.startButton.anchor.set(0.5, 0.5);
        this.startButton.x = game.width / 2;
        this.startButton.y = game.height / 2;
        this.startButton.alpha = 0;

        this.aboutButton = new LabelButton(this.game, 0, 0, "button", "About", this.about, this, 1, 0, 2);
        this.aboutButton.anchor.set(0.5, 0.5);
        this.aboutButton.x = game.width / 2;
        this.aboutButton.y = (game.height / 2) + 50;
        this.aboutButton.alpha = 0;

        var style = {fill: '#ffffff', 'font': '80px KenvectorFuture'};
        var text = game.add.text(game.width / 2, (game.height / 2) - 100, 'Intercelular', style);
        text.anchor.set(0.5, 0.5);
        text.alpha = 0;
        text.scope = this;

        var tween = game.add.tween(text).to({alpha: 1}, 1500, Phaser.Easing.Linear.None, true, 0, 0, false);
        tween.onComplete.add(this.showButtons);
    },

    showButtons: function(obj) {
        obj.scope.aboutButton.alpha = 1;
        obj.scope.startButton.alpha = 1;
    },

    startGame: function() {
        startLevel(constants.MAP_01);
    },
    
    about: function() {
    
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
