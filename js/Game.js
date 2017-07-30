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
        //Sprite Textures
        this.game.load.image("downstairsBG","assets/images/downstairs_background.png");
        this.game.load.image("upstairsBG","assets/images/upstairs_background.png");
        this.game.load.image("vein","assets/images/vein.png");
        this.game.load.image("coal","assets/images/coal.png");
        this.game.load.image("hopper","assets/images/hopper.png");
        this.game.load.image("hopperLevel","assets/images/hopper_level.png");
        this.game.load.image("hopperFull","assets/images/hopper_full.png");
        this.game.load.image("bin","assets/images/bin_target_bounds.png");
        this.game.load.image("furnace","assets/images/furnace.png");
        this.game.load.image("upstairsFG","assets/images/upstairs_foreground.png");
        this.game.load.image("rock","assets/images/rock.png");
        this.game.load.image("breakableRock","assets/images/breakable_rock.png");
        this.game.load.image("rockTarget","assets/images/rock_target_bounds.png");
        this.game.load.image("chute","/assets/images/chute.png");
        this.game.load.image("flame","/assets/images/flame.png");
        this.game.load.image("upstairsPipe","/assets/images/pipe_upstairs.png");
        this.game.load.image("lever","/assets/images/lever.png");
        this.game.load.image("leverBG","/assets/images/lever_bg.png");
        this.game.load.image("leverCover","/assets/images/lever_cover.png");
        this.game.load.image("toolBlank","/assets/images/tool_blank.png");
        this.game.load.image("toolSelected","/assets/images/tool_slected.png");
        this.game.load.image("pickaxe","/assets/images/pickaxe.png");
        this.game.load.image("hand","/assets/images/hand.png");
        this.game.load.image("hammer","/assets/images/hammer.png");
        this.game.load.image("trapdoor","/assets/images/trapdoor.png");
        this.game.load.image("slime","/assets/images/slime.png");

        //SFX
        this.game.load.audio("rock1", "assets/sounds/rock1.wav");
        this.game.load.audio("mineSuccess", "assets/sounds/mine_success.wav");
        this.game.load.audio("stoke", "assets/sounds/stoke.wav");
        this.game.load.audio("switch", "assets/sounds/switch.wav");
        this.game.load.audio("rocksFalling", "assets/sounds/rocks_falling.wav");
        this.game.load.audio("rejected", "assets/sounds/rejected.wav");
        this.game.load.audio("slimeHit", "assets/sounds/slime_hit.wav");
        this.game.load.audio("slimeDead", "assets/sounds/slime_dead.wav");
        this.game.load.audio("hopperAccept", "assets/sounds/hopper.wav");

        //Music
        this.game.load.audio("track1", "assets/music/ld39.wav");
    },

    create: function() {
        //this.game.rock_sprites = [];
        this.game.slimes = [];
        this.game.tools = ["pickaxe","hand","hammer"];
        this.game.selected_tool = "pickaxe";

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
        var chute_texture = this.game.cache.getImage("chute");
        var flame_texture = this.game.cache.getImage("flame");
        var upstairs_pipe_texture = this.game.cache.getImage("upstairsPipe");
        var lever_cover_texture = this.game.cache.getImage("leverCover");
        var tool_blank_texture = this.game.cache.getImage("toolBlank");

        //Sprites & Entities
        this.game.downstairs_background = this.game.add.sprite((this.game.width/2)-(downstairs_bg_texture.width/2),this.game.height/2,"downstairsBG");
        this.game.upstairs_background = this.game.add.sprite((this.game.width/2)-(upstairs_bg_texture.width/2),(this.game.downstairs_background.y-upstairs_bg_texture.height)-20,"upstairsBG");
        this.game.vein = new Vein(this.game, (this.game.upstairs_background.x+upstairs_bg_texture.width)-vein_texture.width-5,(this.game.upstairs_background.y+upstairs_bg_texture.height)-vein_texture.height-5,"vein");
        this.game.upstairs_foreground = this.game.add.sprite((this.game.width/2)-(upstairs_fg_texture.width/2),this.game.upstairs_background.y+5,"upstairsFG");
        this.game.hopper = new Hopper(this.game, this.game.upstairs_background.x+100,(this.game.upstairs_background.y+this.game.upstairs_background.height)-hopper_texture.height-15);
        this.game.bin = new Bin(this.game, this.game.downstairs_background.x+20,(this.game.downstairs_background.y+this.game.downstairs_background.height)-bin_texture.height-10);
        this.game.furnace = new Furnace(this.game, (this.game.downstairs_background.x+this.game.downstairs_background.width)-furnace_texture.width-95,this.game.downstairs_background.y+15);
        this.game.rock_target_bounds = this.game.add.sprite((this.game.upstairs_background.x+(this.game.upstairs_background.width/2))-(rock_target_texture.width/2),(this.game.upstairs_background.y+(this.game.upstairs_background.height/2))-(rock_target_texture.height/2),"rockTarget");
        this.game.chute = this.game.add.sprite(this.game.downstairs_background.x+120,this.game.downstairs_background.y+15,"chute");
        this.game.flame = this.game.add.sprite(this.game.furnace.sprite.x+80,this.game.furnace.sprite.y+215,"flame");
        this.game.upstairs_pipe = this.game.add.sprite(this.game.vein.sprite.x+85,this.game.vein.sprite.y+55,"upstairsPipe");
        this.game.lever_background = this.game.add.sprite(this.game.chute.x+40,(this.game.chute.y+this.game.chute.height)-80,"leverBG");
        this.game.lever = this.game.add.sprite(this.game.lever_background.x+17,(this.game.lever_background.y+this.game.lever_background.height)-8,"lever");
        this.game.lever_cover = this.game.add.sprite(this.game.lever_background.x+(this.game.lever_background.width/2)-lever_cover_texture.width/2,this.game.lever_background.y+(this.game.lever_background.height/2)-lever_cover_texture.height/2,"leverCover");
        this.game.trapdoor = this.game.add.sprite((this.game.downstairs_background.x+this.game.downstairs_background.width)-210,(this.game.downstairs_background.y+this.game.downstairs_background.height)-75,"trapdoor");

        this.game.tool_pickaxe = this.game.add.sprite((this.game.upstairs_background.x-tool_blank_texture.width)-10,this.game.upstairs_background.y,"toolBlank");
        this.game.tool_pickaxe_selected = this.game.add.sprite(this.game.tool_pickaxe.x+5,this.game.tool_pickaxe.y+5,"toolSelected");
        this.game.pickaxe = this.game.add.sprite(this.game.tool_pickaxe_selected.x+5,this.game.tool_pickaxe_selected.y+5,"pickaxe");

        this.game.tool_hand = this.game.add.sprite((this.game.upstairs_background.x-tool_blank_texture.width)-10,this.game.tool_pickaxe.y+this.game.tool_pickaxe.height+10,"toolBlank");
        this.game.tool_hand_selected = this.game.add.sprite(this.game.tool_hand.x+5,this.game.tool_hand.y+5,"toolSelected");
        this.game.hand = this.game.add.sprite(this.game.tool_hand_selected.x+5,this.game.tool_hand_selected.y+5,"hand");

        this.game.tool_hammer = this.game.add.sprite((this.game.upstairs_background.x-tool_blank_texture.width)-10,this.game.tool_hand.y+this.game.tool_pickaxe.height+10,"toolBlank");
        this.game.tool_hammer_selected = this.game.add.sprite(this.game.tool_hammer.x+5,this.game.tool_hammer.y+5,"toolSelected");
        this.game.hammer = this.game.add.sprite(this.game.tool_hammer_selected.x+5,this.game.tool_hammer_selected.y+5,"hammer");

        this.game.tool_cursor = this.game.add.sprite(this.game.input.activePointer.x,this.game.input.activePointer.y,"pickaxe");

        this.game.rock_target_bounds.visible = false;
        this.game.bin.sprite.visible = false;
        this.game.tool_pickaxe_selected.visible = true;
        this.game.tool_hand_selected.visible = false;
        this.game.tool_hammer_selected.visible = false;

        this.game.flame.anchor.x = 0.5;
        this.game.flame.anchor.y = 1;
        this.game.lever.anchor.x = 0.5;
        this.game.lever.anchor.y = 1;
        this.game.lever.angle += -45;

        //Sounds Effects & Music
        this.game.sfx_rock1 = this.game.add.audio("rock1");
        this.game.sfx_strike_success = this.game.add.audio("mineSuccess");
        this.game.sfx_stoke = this.game.add.audio("stoke");
        this.game.sfx_switch = this.game.add.audio("switch");
        this.game.sfx_falling_rocks = this.game.add.audio("rocksFalling");
        this.game.sfx_rejected = this.game.add.audio("rejected");
        this.game.sfx_slime_hit = this.game.add.audio("slimeHit");
        this.game.sfx_slime_dead = this.game.add.audio("slimeDead");
        this.game.sfx_hopper_accept = this.game.add.audio("hopperAccept");
        this.game.music_ld39 = this.game.add.audio("track1",0.5,true);
        
        //this.game.music_ld39.play();

        //Text
        //this.game.fuelLabel = this.game.add.text(this.game.furnace.sprite.x,this.game.furnace.sprite.y,this.game.furnace.fuel);

        //Input
        this.game.vein.sprite.inputEnabled = true;
        this.game.bin.sprite.inputEnabled = true;
        this.game.lever.inputEnabled = true;
        this.game.tool_pickaxe.inputEnabled = true;
        this.game.tool_hand.inputEnabled = true;
        this.game.tool_hammer.inputEnabled = true;
        
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
        this.game.add.tween(this.game.flame).to({alpha: 0.7}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        this.game.vein.sprite.events.onInputUp.add(this.mine, this);
        this.game.time.events.loop(1000,this.game.furnace.useFuel, this.game.furnace);
        
        this.game.tool_pickaxe.events.onInputUp.add(function() {
            this.game.selected_tool = "pickaxe";
            this.game.tool_hand_selected.visible = false;
            this.game.tool_hammer_selected.visible = false;
            this.game.tool_pickaxe_selected.visible = true;
            this.game.tool_cursor.destroy();
            this.game.tool_cursor = this.game.add.sprite(this.game.input.activePointer.x,this.game.input.activePointer.y,"pickaxe");
        }, this);
        
        this.game.tool_hand.events.onInputUp.add(function() {
            this.game.selected_tool = "hand";
            this.game.tool_pickaxe_selected.visible = false;
            this.game.tool_hammer_selected.visible = false;
            this.game.tool_hand_selected.visible = true;
            this.game.tool_cursor.destroy();
            this.game.tool_cursor = this.game.add.sprite(this.game.input.activePointer.x,this.game.input.activePointer.y,"hand");
        }, this);
        
        this.game.tool_hammer.events.onInputUp.add(function() {
            this.game.selected_tool = "hammer";
            this.game.tool_pickaxe_selected.visible = false;
            this.game.tool_hand_selected.visible = false;
            this.game.tool_hammer_selected.visible = true;
            this.game.tool_cursor.destroy();
            this.game.tool_cursor = this.game.add.sprite(this.game.input.activePointer.x,this.game.input.activePointer.y,"hammer");
        }, this);

        this.game.lever.events.onInputUp.add(function() {
            var rotate_right = this.game.add.tween(this.game.lever).to({angle: 45}, 500, Phaser.Easing.Linear.None);
            var rotate_left = this.game.add.tween(this.game.lever).to({angle: -45}, 250, Phaser.Easing.Linear.None);
            rotate_right.chain(rotate_left);
            rotate_right.start();
            var switch_sfx = this.game.sfx_switch;
            var falling_rocks_sfx = this.game.sfx_falling_rocks;
            switch_sfx.onStop.add(function() {
                falling_rocks_sfx.play();
            });
            switch_sfx.play();
            this.transferCoal();
        }, this);

        this.game.input.addMoveCallback(function(pointer,x,y) {
            this.game.tool_cursor.x = x;
            this.game.tool_cursor.y = y;
        }, this);

        this.game.time.events.loop(5000, this.slimeGenerator, this);
    },

    update: function() {
        this.game.slimes.forEach(function(slime) {
            slime.update();
        });
        //this.game.physics.arcade.collide(this.rock_sprites,this.downstairs_background);
    },

    slimeGenerator: function() {
        //must be items in the bin
        //cant be more than 1 slime out
        if(this.game.bin.inventory.length > 0 && this.game.slimes.length < 1) {
            var slime = new Slime(this.game, this.game.trapdoor.x - 50, this.game.trapdoor.y + 20);
            this.game.slimes.push(slime);
        }
        else {
            //console.log("slime conditions not met");
        }
    },

    mine: function() {
        if(this.game.selected_tool == "pickaxe") {
            if(this.game.vein.strikes > 2) {
                this.game.sfx_strike_success.play();
                this.game.vein.generateRock();
                this.game.vein.strikes = 0;
            }
            else {
                this.game.sfx_rock1.play();
                this.game.vein.strikes++;
            }
        }
    },

    transferCoal: function() {
        if(this.game.selected_tool == "hand") {
            var bin = this.game.bin;
            //console.log(this.game.hopper.inventory);
            this.game.hopper.inventory.forEach(function(coal) {
                bin.inventory.push(coal);

                var posX = Math.floor((Math.random() * bin.sprite.width) + bin.sprite.x);
                var posY = Math.floor((Math.random() * bin.sprite.height) + bin.sprite.y);
                coal.sprite.x = posX;
                coal.sprite.y = posY;
                coal.sprite.visible = true;

                coal.originalPosX = posX;
                coal.originalPosY = posY;
                coal.room = "downstairs";
            });
            //console.log(this.game.bin.inventory);
            this.game.hopper.reset();
            //this.game.hopper.inventory = [];
            //this.game.hopper.level_sprite.scale.y = 0;
        }
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
            if(this.game.utility.insideBounds(this.game.input.activePointer, this.game.hopper.sprite) == true && this.game.hopper.inventory.length < this.game.hopper.capacity && this.game.selected_tool == "hand" && this.type != "breakableRock") {
                this.game.sfx_hopper_accept.play();
                this.game.hopper.inventory.push(this);
                this.game.hopper.level_sprite.scale.y = this.game.hopper.inventory.length * (1/this.game.hopper.capacity);
                this.sprite.visible = false;
                this.originalPosX = this.sprite.x;
                this.originalPosY = this.sprite.y;
                if(this.game.hopper.inventory.length == this.game.hopper.capacity) {
                    this.game.hopper.full_sprite.visible = true;
                }
            }
            else {
                this.sprite.x = this.originalPosX;
                this.sprite.y = this.originalPosY;
            }
        }
        else if(this.room = "downstairs") {
            if(this.game.utility.insideBounds(this.game.input.activePointer, this.game.furnace.sprite) == true && this.game.selected_tool == "hand") {
                if(this.type == "coal") {
                    this.game.furnace.addFuel(10);
                }
                else if(this.type == "rock") {
                    this.game.sfx_rejected.play();
                }
                this.sprite.destroy();
                var index = this.game.bin.inventory.indexOf(this);
                this.game.bin.inventory.splice(index,1);
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
        if(this.game.selected_tool == "hammer") {
            if(this.type == "breakableRock") {
                if(this.strikes > 2) {
                    this.game.sfx_strike_success.play();
                    this.split();
                    this.strikes = 0;
                }
                else {
                    this.game.sfx_rock1.play();
                    this.strikes++;
                }
            }
        }
    },
    split: function() {
        //var split_into = Math.floor((Math.random() * 2)+1);
        for(var x=0; x<2; x++) {
            this.game.vein.generateRock(["coal","rock"]);
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
    generateRock: function(types) {
        var posX = Math.floor((Math.random() * this.game.rock_target_bounds.width) + this.game.rock_target_bounds.x);
        var posY = Math.floor((Math.random() * this.game.rock_target_bounds.height) + this.game.rock_target_bounds.y);
        
        var rock_types = this.rock_types;
        if(types) {
            rock_types = types;
        }

        var type = Math.floor(Math.random() * rock_types.length);
        //console.log(type);
        var rock = new Rock(this.game, rock_types[type], posX, posY);
        //this.rock_sprites.push(coal.coal_sprite);
        //this.game.physics.enable(coal.coal_sprite, Phaser.Physics.ARCADE);
        //coal.coal_sprite.body.collideWorldBounds = true;
    }
};

Hopper = function(game, posX, posY) {
    this.game = game;
    this.sprite = game.add.sprite(posX,posY,"hopper");
    this.level_sprite = game.add.sprite(posX+36,posY+49,"hopperLevel");
    this.full_sprite = game.add.sprite(posX+15,posY+5,"hopperFull");
    this.level_sprite.anchor.y = 1;
    this.level_sprite.scale.y = 0;
    this.full_sprite.visible = false;
    this.capacity = 5;
    this.inventory = [];
};

Hopper.prototype = {
    reset: function() {
        this.level_sprite.scale.y = 0;
        this.full_sprite.visible = false;
        this.inventory = [];
    }
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
    this.max_flame_scale = 1.5;
};

Furnace.prototype = {
    useFuel: function() {
        if(this.fuel > 1) {
            this.fuel--;
            //excess fuel can be stored but the sprite should never exceed a scale of max_flame_scale
            if(this.fuel <= (this.max_flame_scale * 100)) {
                this.game.flame.scale.setTo(this.fuel/100,this.fuel/100);
            }
        }
        else {
            //game over
        }
    },
    addFuel: function(amount) {
        this.fuel+=amount;
        //excess fuel can be stored but the sprite should never exceed a scale of max_flame_scale
        if(this.fuel <= (this.max_flame_scale * 100)) {
            this.game.flame.scale.setTo(this.fuel/100,this.fuel/100);
        }
        this.game.sfx_stoke.play();
    }
};

Slime = function(game, posX, posY) {
    this.game = game;
    this.sprite = this.game.add.sprite(posX,posY,"slime");
    this.inventory = [];
    this.direction = "left";
    this.strikes = 0;

    this.sprite.inputEnabled = true;
    this.sprite.events.onInputUp.add(this.strike, this);
};

Slime.prototype = {
    update: function() {
        if(this.sprite) {
            if(this.game.utility.insideBounds(this.sprite, this.game.bin.sprite) == true && this.direction == "left") {
                //steal stuff
                if(this.inventory.length < 1) {
                    if(this.game.bin.inventory.length > 0) {
                        var rock = this.game.bin.inventory[Math.floor(Math.random() * this.game.bin.inventory.length)];
                        this.inventory.push(rock);
                        //console.log(this.inventory.length);
                        var index = this.game.bin.inventory.indexOf(rock);
                        this.game.bin.inventory.splice(index,1);
                        rock.sprite.visible = false;
                        this.direction = "right";
                    }
                    else {
                        this.direction = "right";
                    }
                }
                else {
                    this.direction = "right";
                }
            }
            else if(this.game.utility.insideBounds(this.sprite, this.game.trapdoor) == true && this.direction == "right") {
                if(this.inventory.length >= 1) {
                    var index = this.game.slimes.indexOf(this);
                    this.game.slimes.splice(index,1);
                    this.sprite.destroy();
                }
                else {
                    this.direction = "left";
                }
            }
            else {
                if(this.direction == "left") {
                    this.sprite.x=this.sprite.x-0.5;
                }
                else {
                    this.sprite.x=this.sprite.x+0.5;
                }
            }
        }
    },
    strike: function() {
        if(this.game.selected_tool == "hammer") {
            if(this.strikes > 3) {
                if(this.inventory.length > 0) {
                    var slime_x = this.sprite.x;
                    var slime_y = this.sprite.y;
                    this.inventory.forEach(function(rock) {
                        rock.sprite.x = slime_x;
                        rock.sprite.y = slime_y;
                        rock.originalPosX = slime_x;
                        rock.originalPosY = slime_y;
                        rock.sprite.visible = true;
                    });
                }
                this.game.sfx_slime_dead.play();
                this.strikes = 0;
                var index = this.game.slimes.indexOf(this);
                this.game.slimes.splice(index,1);
                this.sprite.destroy();
            }
            else {
                this.game.sfx_slime_hit.play();
                this.strikes++;
            }
        }
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