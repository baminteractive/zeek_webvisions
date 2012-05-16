ig.module(
	'game.entities.hud'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityHud = ig.Entity.extend({
	
	
	lifeIndicatorPosition:{x:15,y:15},
	weaponIndicatorPosition:{x:675,y:10},
	scoreIndicatorPosition:{x:400,y:20},

	player:null,

	// Load images for the HUD
	hudHeartFull: new ig.Image('media/hud/heartFull.png'),
	hudHeartHalf: new ig.Image('media/hud/heartHalf.png'),
	weaponIndicatorBox: new ig.Image('media/hud/weaponBox.png'),
	itemSprite: new ig.Image('media/hud/itemSprite.png'),
	font: new ig.Font( 'media/fonts/04b03_12_black.png' ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.player = ig.game.getEntityByName("zeek");
	},
	
	
	update: function() {
		this.parent();
	},

	drawHealth: function() {
		
	},

	drawWeaponIndicators: function() {
		
	},

	drawScore: function() {
		
	},

	draw: function() {


		this.parent();
	}
});

});