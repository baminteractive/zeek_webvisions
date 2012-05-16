ig.module(
	'game.entities.horseshoe-powerup'
	)
.requires(
    'game.entities.powerup'
)
.defines(function () {

    EntityHorseshoePowerup = EntityPowerup.extend({


        init: function( x, y, settings ) {


        	this.parent( x, y, settings );

        },

        update: function() {

        	this.currentAnim = this.anims.idle;

        	this.parent();

        },

    	check: function( other ) {


    		this.parent( other );

    	}

    });

});