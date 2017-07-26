// Ludum Dare 39
// Author: Christopher Waite

Game = function(game) {
    this.logo = null;
};

Game.prototype = {
    
    init: function() {
        this.game.input.maxPointers = 1;
        this.game.stage.disableVisibilityChange = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    },

    preload: function() {
        this.game.load.image("logo","assets/images/phaser_logo.png");
    },

    create: function() {
        var logo_texture = this.game.cache.getImage("logo");
        this.logo = this.game.add.sprite((this.game.width/2)-(logo_texture.width/2),(this.game.height/2)-(logo_texture.height/2),"logo");
    },

    update: function() {

    }

};