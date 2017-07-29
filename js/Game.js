// Ludum Dare 39
// Author: Christopher Waite

Game = function(game) {
    this.downstairs_background = null;
    this.upstairs_background = null;
    this.vein = null;
    this.hopper = null;
    this.bin = null;
    this.furnace = null;
};

Game.prototype = {
    
    init: function() {
        this.game.input.maxPointers = 1;
        this.game.stage.disableVisibilityChange = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    },

    preload: function() {
        this.game.load.image("downstairsBG","assets/images/downstairs_background.png");
        this.game.load.image("upstairsBG","assets/images/upstairs_background.png");
        this.game.load.image("vein","assets/images/vein.png");
        this.game.load.image("coal","assets/images/coal.png");
        this.game.load.image("hopper","assets/images/hopper.png");
        this.game.load.image("bin","assets/images/bin.png");
        this.game.load.image("furnace","assets/images/furnace.png");
    },

    create: function() {
        //Textures
        var upstairs_bg_texture = this.game.cache.getImage("upstairsBG");
        var downstairs_bg_texture = this.game.cache.getImage("downstairsBG");
        var vein_texture = this.game.cache.getImage("vein");
        var hopper_texture = this.game.cache.getImage("hopper");
        var bin_texture = this.game.cache.getImage("bin");
        var furnace_texture = this.game.cache.getImage("furnace");

        //Sprites
        this.downstairs_background = this.game.add.sprite((this.game.width/2)-(downstairs_bg_texture.width/2),this.game.height/2,"downstairsBG");
        this.upstairs_background = this.game.add.sprite((this.game.width/2)-(upstairs_bg_texture.width/2),(this.downstairs_background.y-upstairs_bg_texture.height)-20,"upstairsBG");
        this.vein = this.game.add.sprite((this.upstairs_background.x+upstairs_bg_texture.width)-vein_texture.width,(this.upstairs_background.y+upstairs_bg_texture.height)-vein_texture.height,"vein");

        //Entities
        this.hopper = new Hopper(this.game, this.upstairs_background.x,(this.upstairs_background.y+this.upstairs_background.height)-hopper_texture.height);
        this.bin = new Bin(this.game, this.downstairs_background.x,(this.downstairs_background.y+this.downstairs_background.height)-bin_texture.height);
        this.furnace = new Furnace(this.game, (this.downstairs_background.x+this.downstairs_background.width)-furnace_texture.width,this.downstairs_background.y);

        //Text
        this.game.fuelLabel = this.game.add.text(this.furnace.sprite.x,this.furnace.sprite.y,this.furnace.fuel);

        //Input
        this.vein.inputEnabled = true;
        this.bin.bin_sprite.inputEnabled = true;
        this.hopper.hopper_sprite.inputEnabled = true;
        
        //Events
        this.vein.events.onInputUp.add(this.generateCoal, this);
        this.hopper.hopper_sprite.events.onInputUp.add(this.transferCoal, this);
        this.game.time.events.loop(1000,this.furnace.useFuel, this.furnace);

        /*this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.cursors = game.input.keyboard.createCursorKeys();

        cursors.left.onDown.add(doSomething, this);
        cursors.right.onDown.add(doSomething, this);
        cursors.up.onDown.add(doSomething, this);
        cursors.down.onDown.add(doSomething, this);*/
    },

    update: function() {
        /*if(this.game.input.activePointer.isDown) {
            console.log(this.game.input.activePointer.x);
        }

        if (this.game.input.activePointer.isUp) {

        }*/
    },

    generateCoal: function() {
        var coal_texture = this.game.cache.getImage("coal");
        var posX = Math.floor((Math.random() * (this.upstairs_background.width-coal_texture.width)) + this.upstairs_background.x);
        var posY = Math.floor((Math.random() * (this.upstairs_background.height-coal_texture.height)) + this.upstairs_background.y);
        var coal = new Coal(this.game, posX, posY);
        coal.coal_sprite.inputEnabled = true;
        coal.coal_sprite.input.enableDrag(true);
        coal.coal_sprite.events.onDragStop.add(function(argument) {
            if(coal.room == "upstairs") {
                if(this.insideBounds(this.game.input.activePointer, this.hopper.hopper_sprite) == true) {
                    this.hopper.inventory.push(coal);
                    coal.originalPosX = coal.coal_sprite.x;
                    coal.originalPosY = coal.coal_sprite.y;
                }
                else {
                    coal.coal_sprite.x = coal.originalPosX;
                    coal.coal_sprite.y = coal.originalPosY;
                }
            }
            else if(coal.room = "downstairs") {
                if(this.insideBounds(this.game.input.activePointer, this.furnace.sprite) == true) {
                    this.furnace.addFuel(10);
                    coal.coal_sprite.destroy();
                    this.bin.inventory.pop();
                }
                else {
                    coal.coal_sprite.x = coal.originalPosX;
                    coal.coal_sprite.y = coal.originalPosY;
                }
            }
            else {
                coal.coal_sprite.x = coal.originalPosX;
                coal.coal_sprite.y = coal.originalPosY;
            }
        }, this);
    },

    transferCoal: function() {
        var bin = this.bin;
        console.log(this.hopper.inventory);
        this.hopper.inventory.forEach(function(coal) {
            bin.inventory.push(coal);
            coal.coal_sprite.x = bin.bin_sprite.x;
            coal.coal_sprite.y = bin.bin_sprite.y;
            coal.originalPosX = bin.bin_sprite.x;
            coal.originalPosY = bin.bin_sprite.y;
            coal.room = "downstairs";
        });
        console.log(this.bin.inventory);
        this.hopper.inventory = [];
    },

    //Utility
    insideBounds: function(object, object_target) {
        if(object.x >= object_target.x && object.x <= (object_target.x + object_target.width) && object.y >= object_target.y && object.y <= (object_target.y + object_target.height)) {
            return true;
        }
        return false;
    }

};

Coal = function(game, posX, posY) {
    this.originalPosX = posX;
    this.originalPosY = posY;
    this.coal_sprite = game.add.sprite(posX,posY,"coal");
    this.room = "upstairs";
};

Hopper = function(game, posX, posY) {
    this.hopper_sprite = game.add.sprite(posX,posY,"hopper");
    this.inventory = [];
};

Bin = function(game, posX, posY) {
    this.bin_sprite = game.add.sprite(posX,posY,"bin");
    this.inventory = [];
};

Furnace = function(game, posX, posY) {
    this.game = game;
    this.sprite = this.game.add.sprite(posX,posY,"furnace");
    this.fuel = 100;
};

Furnace.prototype = {
    useFuel: function() {
        this.fuel--;
        this.game.fuelLabel.setText(this.fuel);
    },
    addFuel: function(amount) {
        this.fuel+=amount;
        this.game.fuelLabel.setText(this.fuel);
    }
};