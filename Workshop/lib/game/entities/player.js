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
	horshoeDamage: 10,

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


	},

	handleActions: function() {

		
		this.parent();
	},

	//Resets your collision box size and offset for standing and crouching
	setBounds: function(id) {
		
	},

	receiveDamage: function(amount, from){
		
	},

	// Overriding the kill function to play a death animation
	kill: function() {

		

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

	flip: false,

	horseshoeDamage: 10,

	init: function( x, y, settings ){
		log("SHOE!");

		this.parent( x, y, settings );




	},

	handleMovementTrace: function( res ) {
		this.parent( res );
		
	},

	// This function is called when this entity overlaps anonther entity of the
	// checkAgainst group. I.e. for this entity, all entities in the B group.
	check: function( other ) {


		this.kill();
	},

	update: function(){
		this.parent();
	}


});

});