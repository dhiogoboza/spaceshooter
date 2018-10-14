var Menu = {
    init: function () {
        game.renderer.renderSession.roundPixels = true;
        this.currentPosition = 0;
        this.lastKeyTime = 0;
        this.keysTime = 100;
        this.menuAnimating = false;
        this.keysBuffer = [];
        this.maxBufferSize = 5;
    },

    create: function() {
        game.stage.backgroundColor = "#000000";
        var background = game.add.image(game.world.centerX, game.world.centerY, 'menu.background');
        background.anchor.set(0.5);
        background.alpha = 1;
        game.add.tween(background).to({ alpha: 0.6 }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);

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

        for (var prop in this.cursors) {
            if (this.cursors.hasOwnProperty(prop)) {
                this.cursors[prop].context = this;
                this.cursors[prop].onHoldCallback = function(key) {
                    key.context.onKeyPressed(key.context, key.keyCode);
                }
            }
        }

        for (var prop in this.wasd) {
            if (this.wasd.hasOwnProperty(prop)) {
                this.wasd[prop].context = this;
                this.wasd[prop].onHoldCallback = function(key) {
                    key.context.onKeyPressed(key.context, key.keyCode);
                }
            }
        }
    },
    
    createButtons: function() {
        this.buttons = game.add.group();

        var startButton = new LabelButton(this.game, 0, 0, "button", "Start game", this.startGame, this, 1, 0, 2);
        startButton.anchor.set(0.5, 0.5);
        startButton.x = game.width / 2;
        startButton.y = game.height / 2;
        startButton.alpha = 0;
        this.buttons.add(startButton);

        var configButton = new LabelButton(this.game, 0, 0, "button", "Config", this.configScreen, this, 1, 0, 2);
        configButton.anchor.set(0.5, 0.5);
        configButton.x = game.width / 2;
        configButton.y = (game.height / 2) + 50;
        configButton.alpha = 0;
        this.buttons.add(configButton);

        var aboutButton = new LabelButton(this.game, 0, 0, "button", "About", this.aboutScreen, this, 1, 0, 2);
        aboutButton.anchor.set(0.5, 0.5);
        aboutButton.x = game.width / 2;
        aboutButton.y = (game.height / 2) + 100;
        aboutButton.alpha = 0;
        this.buttons.add(aboutButton);

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

        this.halfButton = startButton.width / 2;
    },

    updateMenu: function() {
        var currentMenu = this.buttons.children[this.currentPosition];

        var rx = currentMenu.x + this.halfButton;
        var lx = currentMenu.x - this.halfButton;

        var y = currentMenu.y;

        var tween = game.add.tween(this.selectorRight);
        tween.onComplete.add(this.stopAnimation);
        tween.to({x: rx, y: y}, 100, Phaser.Easing.Linear.None, true);

        game.add.tween(this.selectorLeft).to({x: lx, y: y}, 100, Phaser.Easing.Linear.None, true);
    },

    showButtons: function(obj) {
        for (var i = 0; i < obj.scope.buttons.children.length; i++) {
            obj.scope.buttons.children[i].alpha = 1;
        }

        obj.scope.selectorRight.alpha = 1;
        obj.scope.selectorLeft.alpha = 1;
    },

    startGame: function() {
        startLevel(constants.MAP_01);
    },
    
    aboutScreen: function() {
    
    },

    configScreen: function() {
    
    },
    
    stopAnimation: function(obj) {
        obj.scope.menuAnimating = false;
    },

    onKeyPressed: function(context, keyCode) {
        var currentTime = context.game.time.time;

        if (currentTime - context.lastKeyTime >= context.keysTime &&
            context.keysBuffer.length < context.maxBufferSize) {
            context.keysBuffer.push(keyCode);
            context.lastKeyTime = currentTime;
        }
    },

    update: function() {
        if (this.select.isDown) {
            switch (this.currentPosition) {
                case 0:
                    startLevel(constants.MAP_01);
                    break;
            }
        } else {
            if (!this.menuAnimating && this.keysBuffer.length) {
                this.menuAnimating = true;
                var currentKey = this.keysBuffer.shift();
                switch (currentKey) {
                    case Phaser.KeyCode.UP:
                    case Phaser.KeyCode.W:
                        this.currentPosition--;
                        if (this.currentPosition < 0) {
                            this.currentPosition = this.buttons.length - 1;
                        }
                        break;
                    case Phaser.KeyCode.DOWN:
                    case Phaser.KeyCode.S:
                        this.currentPosition++;
                        if (this.currentPosition === this.buttons.length) {
                            this.currentPosition = 0;
                        }
                        break;
                }
                this.updateMenu();
            }
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
