// Ludum Dare 39
// Author: Christopher Waite

Game = function(game) {
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
        this.game.load.image("upstairsFG","assets/images/upstairs_foreground.png");
        this.game.load.image("rock","assets/images/rock.png");
        this.game.load.image("breakableRock","assets/images/breakable_rock.png");
        this.game.load.image("rockTarget","assets/images/rock_target_bounds.png");

        this.game.load.audio("rock1", "assets/sounds/rock1.wav");
        this.game.load.audio("mineSuccess", "assets/sounds/mine_success.wav");
        this.game.load.audio("track1", "assets/music/ld39.wav");
    },

    create: function() {
        this.game.rock_sprites = [];

        //Utility
        this.game.utility = new Utility();

        //Textures
        var upstairs_bg_texture = this.game.cache.getImage("upstairsBG");
        var upstairs_fg_texture = this.game.cache.getImage("upstairsFG");
        var downstairs_bg_texture = this.game.cache.getImage("downstairsBG");
        var vein_texture = this.game.cache.getImage("vein");
        var hopper_texture = this.game.cache.getImage("hopper");
        var bin_texture = this.game.cache.getImage("bin");
        var furnace_texture = this.game.cache.getImage("furnace");
        var rock_target_texture = this.game.cache.getImage("rockTarget");

        //Sprites & Entities
        this.game.downstairs_background = this.game.add.sprite((this.game.width/2)-(downstairs_bg_texture.width/2),this.game.height/2,"downstairsBG");
        this.game.upstairs_background = this.game.add.sprite((this.game.width/2)-(upstairs_bg_texture.width/2),(this.game.downstairs_background.y-upstairs_bg_texture.height)-20,"upstairsBG");
        this.game.vein = new Vein(this.game, (this.game.upstairs_background.x+upstairs_bg_texture.width)-vein_texture.width-5,(this.game.upstairs_background.y+upstairs_bg_texture.height)-vein_texture.height-5,"vein");
        this.game.upstairs_foreground = this.game.add.sprite((this.game.width/2)-(upstairs_fg_texture.width/2),this.game.upstairs_background.y+5,"upstairsFG");
        this.game.hopper = new Hopper(this.game, this.game.upstairs_background.x,(this.game.upstairs_background.y+this.game.upstairs_background.height)-hopper_texture.height);
        this.game.bin = new Bin(this.game, this.game.downstairs_background.x,(this.game.downstairs_background.y+this.game.downstairs_background.height)-bin_texture.height);
        this.game.furnace = new Furnace(this.game, (this.game.downstairs_background.x+this.game.downstairs_background.width)-furnace_texture.width,this.game.downstairs_background.y);
        this.game.rock_target_bounds = this.game.add.sprite((this.game.upstairs_background.x+(this.game.upstairs_background.width/2))-(rock_target_texture.width/2),(this.game.upstairs_background.y+(this.game.upstairs_background.height/2))-(rock_target_texture.height/2),"rockTarget");
        this.game.rock_target_bounds.visible = false;

        //Sounds Effects & Music
        this.game.sfx_rock1 = this.game.add.audio("rock1");
        this.game.sfx_strike_success = this.game.add.audio("mineSuccess");
        this.game.music_ld39 = this.game.add.audio("track1",0.5,true);
        this.game.music_ld39.play();

        //Text
        this.game.fuelLabel = this.game.add.text(this.game.furnace.sprite.x,this.game.furnace.sprite.y,this.game.furnace.fuel);

        //Input
        this.game.vein.sprite.inputEnabled = true;
        this.game.bin.sprite.inputEnabled = true;
        this.game.hopper.sprite.inputEnabled = true;

        //Physics
        /*this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 100;

        this.game.physics.enable(this.upstairs_foreground, Phaser.Physics.ARCADE);
        this.upstairs_foreground.body.collideWorldBounds = true;
        this.upstairs_foreground.body.immovable = true;
        this.upstairs_foreground.body.allowGravity = false;

        this.game.physics.enable(this.downstairs_background, Phaser.Physics.ARCADE);
        this.downstairs_background.body.collideWorldBounds = true;
        this.downstairs_background.body.immovable = true;
        this.downstairs_background.body.allowGravity = false;*/

        //Events
        this.game.vein.sprite.events.onInputUp.add(this.usePickAxe, this);
        this.game.hopper.sprite.events.onInputUp.add(this.transferCoal, this);
        this.game.time.events.loop(1000,this.game.furnace.useFuel, this.game.furnace);
    },

    update: function() {
        //this.game.physics.arcade.collide(this.rock_sprites,this.downstairs_background);
    },

    usePickAxe: function() {
        if(this.game.vein.strikes > 2) {
            this.game.sfx_strike_success.play();
            this.game.vein.generateRock();
            this.game.vein.strikes = 0;
        }
        else {
            this.game.sfx_rock1.play();
            this.game.vein.strikes++;
        }
    },

    transferCoal: function() {
        var bin = this.game.bin;
        console.log(this.game.hopper.inventory);
        this.game.hopper.inventory.forEach(function(coal) {
            bin.inventory.push(coal);
            coal.sprite.x = bin.sprite.x;
            coal.sprite.y = bin.sprite.y;
            coal.originalPosX = bin.sprite.x;
            coal.originalPosY = bin.sprite.y;
            coal.room = "downstairs";
        });
        console.log(this.game.bin.inventory);
        this.game.hopper.inventory = [];
    }
};

Rock = function(game, type, posX, posY) {
    this.game = game;
    this.type = type;
    this.originalPosX = posX;
    this.originalPosY = posY;
    this.sprite = game.add.sprite(posX,posY,this.type);
    this.room = "upstairs";
    this.strikes = 0;

    this.sprite.inputEnabled = true;
    this.sprite.events.onInputUp.add(this.strike, this);
    this.sprite.input.enableDrag(true);
    this.sprite.events.onDragStop.add(function(argument) {
        if(this.room == "upstairs") {
            if(this.game.utility.insideBounds(this.game.input.activePointer, this.game.hopper.sprite) == true) {
                this.game.hopper.inventory.push(this);
                this.originalPosX = this.sprite.x;
                this.originalPosY = this.sprite.y;
            }
            else {
                this.sprite.x = this.originalPosX;
                this.sprite.y = this.originalPosY;
            }
        }
        else if(this.room = "downstairs") {
            if(this.game.utility.insideBounds(this.game.input.activePointer, this.game.furnace.sprite) == true) {
                if(this.type == "coal") {
                    this.game.furnace.addFuel(10)
                };
                this.sprite.destroy();
                this.game.bin.inventory.pop();
            }
            else {
                this.sprite.x = this.originalPosX;
                this.sprite.y = this.originalPosY;
            }
        }
        else {
            this.sprite.x = this.originalPosX;
            this.sprite.y = this.originalPosY;
        }
    }, this);
};

Rock.prototype = {
    strike: function() {
        if(this.type == "breakableRock") {
            if(this.strikes > 2) {
                this.game.sfx_strike_success.play();
                this.split();
                this.strikes = 0
            }
            else {
                this.game.sfx_rock1.play();
                this.strikes++;
            }
        }
    },
    split: function() {
        //var split_into = Math.floor((Math.random() * 2)+1);
        for(var x=0; x<2; x++) {
            this.game.vein.generateRock();
            //this.game.generateCoal();
        }
        this.sprite.input.disableDrag();
        this.sprite.destroy();
        //need to remove from global coals array too for physics
    }
};

Vein = function(game, posX, posY) {
    this.game = game;
    this.sprite = game.add.sprite(posX,posY,"vein");
    this.strikes = 0;
    this.rock_types = ["coal","rock","breakableRock"];
};

Vein.prototype = {
    generateRock: function() {
        var posX = Math.floor((Math.random() * this.game.rock_target_bounds.width) + this.game.rock_target_bounds.x);
        var posY = Math.floor((Math.random() * this.game.rock_target_bounds.height) + this.game.rock_target_bounds.y);
        var type = Math.floor(Math.random() * this.rock_types.length);
        console.log(type);
        var rock = new Rock(this.game, this.rock_types[type], posX, posY);
        //this.rock_sprites.push(coal.coal_sprite);
        //this.game.physics.enable(coal.coal_sprite, Phaser.Physics.ARCADE);
        //coal.coal_sprite.body.collideWorldBounds = true;
    }
};

Hopper = function(game, posX, posY) {
    this.game = game;
    this.sprite = game.add.sprite(posX,posY,"hopper");
    this.inventory = [];
};

Bin = function(game, posX, posY) {
    this.game = game;
    this.sprite = game.add.sprite(posX,posY,"bin");
    this.inventory = [];
};

Furnace = function(game, posX, posY) {
    this.game = game;
    this.sprite = this.game.add.sprite(posX,posY,"furnace");
    this.fuel = 100;
};

Furnace.prototype = {
    useFuel: function() {
        if(this.fuel > 0) {
            this.fuel--;
            this.game.fuelLabel.setText(this.fuel);
        }
        else {
            //game over
        }
    },
    addFuel: function(amount) {
        this.fuel+=amount;
        this.game.fuelLabel.setText(this.fuel);
    }
};

Utility = function() {

};

Utility.prototype = {
    insideBounds: function(object, object_target) {
        if(object.x >= object_target.x && object.x <= (object_target.x + object_target.width) && object.y >= object_target.y && object.y <= (object_target.y + object_target.height)) {
            return true;
        }
        return false;
    }
};