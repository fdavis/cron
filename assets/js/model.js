//game state saver/loader/tracker/controller ?
Crafty.c("Model",{
	init:function(){
		this.requires("Persist,Keyboard");
		// from the crafty docs example name loader
		// var heroname = Crafty.storage('name');
		// if(!heroname){
		//   // Maybe ask the player what their name is here
		//   heroname = 'Guest';
		// }
		// var player = Crafty.storage('player');//load player object  ?

		game = Crafty.storage('game');//store game progress, unlocked things, etc...
		if(game == null){
			game = {
				score: 0,
				money: 0,

			};
		}
		// var settings = Crafty.storage('settings');//store user prefs/settings


		// FIXME debug things should be removed later
		this.bind("KeyDown", function(e) {
            // save the state
            if(e.keyCode === Crafty.keys.G){
            	this.save();
            }
        })
        .bind("Scored", function(points){
        	this.incrScore(points);
        });
	},
	Model:function(){
		var game = null;
	},
	save:function(){
		Crafty.storage('game',game);
	},
	getScore:function(){
		return game.score;
	},
	incrScore:function(points){
		return game.score += points;
	}

});