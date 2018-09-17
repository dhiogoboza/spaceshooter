var Menu = {
    init: function () {
        game.renderer.renderSession.roundPixels = true;
        this.currentPosition = 0;
        this.lastKeyTime = 0;
        this.keysTime = 100;
        this.menuAnimating = false;
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
        this.updateMenu();

        this.select = game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
        this.cursors = game.input.keyboard.createCursorKeys();
        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A)
        };
    },
    
    createButtons: function() {
        this.buttons = game.add.group();

        this.startButton = new LabelButton(this.game, 0, 0, "button", "Start game", this.startGame, this, 1, 0, 2);
        this.startButton.anchor.set(0.5, 0.5);
        this.startButton.x = game.width / 2;
        this.startButton.y = game.height / 2;
        this.startButton.alpha = 0;
        this.buttons.add(this.startButton);

        this.aboutButton = new LabelButton(this.game, 0, 0, "button", "About", this.about, this, 1, 0, 2);
        this.aboutButton.anchor.set(0.5, 0.5);
        this.aboutButton.x = game.width / 2;
        this.aboutButton.y = (game.height / 2) + 50;
        this.aboutButton.alpha = 0;
        this.buttons.add(this.aboutButton);

        var style = {fill: '#ffffff', 'font': '80px KenvectorFuture'};
        var text = game.add.text(game.width / 2, (game.height / 2) - 100, 'Intercelular', style);
        text.anchor.set(0.5, 0.5);
        text.alpha = 0;
        text.scope = this;

        var tween = game.add.tween(text).to({alpha: 1}, 1500, Phaser.Easing.Linear.None, true, 0, 0, false);
        tween.onComplete.add(this.showButtons);
        
        this.selectorRight = game.add.image(0, 0, 'menu.selectorRight');
        this.selectorRight.alpha = 0;
        this.selectorRight.scope = this;
        this.selectorRight.anchor.set(0.5, 0.5);

        this.selectorLeft = game.add.image(0, 0, 'menu.selectorLeft');
        this.selectorLeft.alpha = 0;
        this.selectorLeft.scope = this;
        this.selectorLeft.anchor.set(0.5, 0.5);
    },

    updateMenu: function() {
        var currentMenu = this.buttons.children[this.currentPosition];

        var rx = currentMenu.x + (currentMenu.width / 2);
        var lx = currentMenu.x - (currentMenu.width / 2);

        var y = currentMenu.y;

        var tween = game.add.tween(this.selectorLeft).to({x: lx, y: y}, 100, Phaser.Easing.Linear.None, true);

        var tween = game.add.tween(this.selectorRight).to({x: rx, y: y}, 100, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.stopAnimation);
    },

    showButtons: function(obj) {
        obj.scope.aboutButton.alpha = 1;
        obj.scope.startButton.alpha = 1;
        obj.scope.selectorRight.alpha = 1;
        obj.scope.selectorLeft.alpha = 1;
    },

    startGame: function() {
        startLevel(constants.MAP_01);
    },
    
    about: function() {
    
    },
    
    stopAnimation: function(obj) {
        obj.scope.menuAnimating = false;
    },

    update: function() {
        if (this.select.isDown) {
            switch (this.currentPosition) {
                case 0:
                    startLevel(constants.MAP_01);
                    break;
            }
        } else if (!this.menuAnimating) {
            this.menuAnimating = true;
            if (this.cursors.up.isDown || this.wasd.up.isDown) {
                this.currentPosition--;

                if (this.currentPosition < 0) {
                    this.currentPosition = this.buttons.length - 1;
                }
            } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
                this.currentPosition++;

                if (this.currentPosition === this.buttons.length) {
                    this.currentPosition = 0;
                }
            }
            this.updateMenu();
        }
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
