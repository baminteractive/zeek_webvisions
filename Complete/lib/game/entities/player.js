ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'impact.sound'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	
	animSheet: new ig.AnimationSheet( 'media/players/PlayerSheet.png', 149, 89 ),

	//Sounds:
	player_hurt: new ig.Sound("media/sounds/player-hurt.*", false),
	player_throw: new ig.Sound("media/sounds/throw.*", false),
	enemy_hurt: new ig.Sound("media/sounds/enemy-hurt.*", false),

	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 40, y:80},
	offset: {x: 50, y: 0},
	
	maxVel: {x: 200, y: 400},
	friction: {x: 500, y: 0},
	
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	flip: false, 
	accelGround: 800,
	accelAir: 1200,
	jump: 450,
	health: 35,
	maxHealth: 60,
	flip: false,

	killed: false,

	hasPitchfork: true,
	hasHorseshoe: false,

	crouching: false,
	attacking: false,
	horseshoe: false,

	meleeDamage: 30,

	score:0,
	
	init: function( x, y, settings ) {

		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 1, [1], true );
		this.addAnim( 'walk', .07, [2, 3, 4, 5] );
		this.addAnim( 'attack', .07, [6,7,8,9,8,9,7,6], true );
		this.addAnim( 'jump', 1, [10,11,12], true );
		this.addAnim( 'crouch', 1, [25], true );
		this.addAnim( 'crouch_walk', .07, [25,26,27,28,29] ),
		this.addAnim( 'stun', 1, [30], true );
		this.addAnim( 'death', .07, [31,32,33,34,35,36], true );
		this.addAnim( 'horseshoe', .04, [37,38,39,40,41,42,43,44,45,46], true );
		
	},

	moveEntity: function() {

		// move left or right
		var accel = this.standing ? this.accelGround : this.accelAir;

		if( ig.input.state('left') ) {

			this.accel.x = -accel;
			this.flip = true;

		} else if( ig.input.state('right') ) {

			this.accel.x = accel;
			this.flip = false;

		} else {

			this.accel.x = 0;

		}

	},

	handleActions: function() {

		// Jumping and Crouching
		if( ig.input.pressed('down') ){

			this.crouching = true;
			this.currentAnim = this.anims.crouch;

			this.setBounds('crouch');

		} else if ( ig.input.released('down') ){

			this.crouching = false;

			this.setBounds('normal');

		} else if( this.standing && ig.input.pressed('jump') ) {

			this.vel.y = -this.jump;

		}
		
		// Trigger Horseshoe
		if( ig.input.pressed('melee') && !this.attacking ){
			this.currentAnim = this.anims.attack;
			this.currentAnim.rewind();
			this.attacking = true;

			this.player_throw.play();
		}
		else if( ig.input.pressed('shoot') && this.hasHorseshoe &&  !this.crouching && !this.horseshoe ) {

			this.currentAnim = this.anims.horseshoe;
			this.currentAnim.rewind();
			this.horseshoe = true;

		} 
		else if (!this.attacking && !this.horseshoe) {

			// set the current animation, based on the player's speed
			if( this.vel.y < 0 && !this.crouching) {

				this.currentAnim = this.anims.jump;

			} else if( this.vel.x != 0 ) {

				// If we're moving, if crouching set anim to crouch_walk, otherwise use normal walk
				this.currentAnim = this.crouching ? this.anims.crouch_walk : this.anims.walk;

			} else {

				// if we're not moving and crouching, use crouch, otherwise use idle.

				this.currentAnim = this.crouching ? this.anims.crouch : this.anims.idle;
			}
		}


		//Reset Attack on animation end
		if(this.attacking && this.currentAnim.loopCount > 0){
			this.attacking = false;
		}

		//Spawns horseshoe entity at end of animation sequence
		if(this.horseshoe && this.currentAnim.loopCount > 0){
			this.horseshoe = false;
			ig.game.spawnEntity( EntityHorseshoe, this.pos.x + 16, this.pos.y + 30, {flip:this.flip} );
		}

		//reset horseshoe
		if(this.currentAnim == this.anims.horseshoe && this.currentAnim.loopCount > 0){

			this.action = false;

		}

	},

	update: function() {
		
		if(!this.killed) {

			this.moveEntity();

			this.handleActions();

		}
		
		this.currentAnim.flip.x = this.flip;
		
		// move!
		this.parent();
	},

	//Resets your collision box size and offset for standing and crouching
	setBounds: function(id) {
		switch(id) {
			case "normal":
				this.size.x = 40;
				this.size.y = 80;
				this.offset.x = 50;
				this.offset.y = 0;
				this.pos.y -= 50;
				break;
			
			case "crouch":
				this.size.x = 40;
				this.size.y = 30;
				this.offset.x = 50;
				this.offset.y = 50;
				this.pos.y += 50;
				break;
		}
	},

	receiveDamage: function(amount, from){
		if(this.attacking){
			from.receiveDamage( this.meleeDamage );
			this.enemy_hurt.play();
		} else {
			this.parent(amount, from);
			this.player_hurt.play();
		}
	},

	// Overriding the kill function to play a death animation
	kill: function() {

		if( this.currentAnim !== this.anims.death ) {

			this.killed = true;

			// Trigger the death animation
			this.currentAnim = this.anims.death;
			this.currentAnim.rewind();

			// Disable collisions
			this.collides = ig.Entity.COLLIDES.LITE;



		}

	}

});

/*************************
 Horseshoe projectile

 Note: Because horseshoe is only used here, there's no need to break it out into it's own file. 
 Only items that you need to be placeable in Weltmeister need
 to have their own file.
*************************/


EntityHorseshoe = ig.Entity.extend({

	animSheet: new ig.AnimationSheet( 'media/items/horseshoe.png', 20, 18),

	shoe_hit: new ig.Sound("media/sounds/horseshoe-hit.*", false),

	size: {x: 20, y:20},

	maxVel: {x: 225, y: 400},
	bounciness: 0.6, 

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.PASSIVE,

	bounceCounter: 0,

	horseshoeDamage: 10,

	flip: false,

	init: function( x, y, settings ){
		log("SHOE!");

		this.parent( x, y, settings );

		this.addAnim( 'idle', 1, [0], true );
		this.currentAnim = this.anims.idle;

		flip = settings.flip;

		this.vel.x = flip ? -this.maxVel.x : this.maxVel.x;
		this.vel.y = -200;



	},

	handleMovementTrace: function( res ) {
		this.parent( res );
		if( res.collision.x || res.collision.y ) {

			// only bounce 3 times
			this.bounceCounter++;
			if( this.bounceCounter > 3 ) {
				this.kill();
			}
		}
	},

	// This function is called when this entity overlaps anonther entity of the
	// checkAgainst group. I.e. for this entity, all entities in the B group.
	check: function( other ) {

		other.receiveDamage( this.horshoeDamage, this );

		this.shoe_hit.play();

		this.kill();
	},

	update: function(){
		this.currentAnim.angle += flip ? -.2 : .2;
		this.parent();
	}


});

});