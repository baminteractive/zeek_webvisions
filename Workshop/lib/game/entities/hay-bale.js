ig.module(
	'game.entities.hay-bale'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityHayBale = ig.Entity.extend({
	
	
	
	init: function( x, y, settings ) {
		
		this.parent( x, y, settings );
		
	
	},
	
	update: function() {
		
		this.parent();

	}
});

});