ig.module(
	'game.entities.powerup'
	)
.requires(
    'impact.entity',
    'impact.timer'
)
.defines(function () {

    EntityPowerup = ig.Entity.extend({

        type: ig.Entity.TYPE.B,

        checkAgainst: ig.Entity.TYPE.A, // Only collide against players
        
        collides: ig.Entity.COLLIDES.PASSIVE, // Do not cause a "bouncy" collision

        expirationTimer: null,

        expiration: 20,

        init: function (x, y, settings) {


            this.parent(x, y, settings);
        },

        update: function() {

            // Remove after a certain period of time
            
            
            this.parent();
        }

    });

});