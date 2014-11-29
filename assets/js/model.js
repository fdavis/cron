//game state saver/loader/tracker/controller ?
Crafty.c("Model",{
	init:function(){
		this.addComponents("Persist,Keyboard");
		// from the crafty docs example name loader
		// var heroname = Crafty.storage('name');
		// if(!heroname){
		//   // Maybe ask the player what their name is here
		//   heroname = 'Guest';
		// }
		// var player = Crafty.storage('player');//load player object  ?

		this.game = Crafty.storage('game');//store game progress, unlocked things, etc...
		if(game == null){
			game = {
				score: 0,
				money: 0,

			};
		}
		// var settings = Crafty.storage('settings');//store user prefs/settings


		this.bind("KeyDown", function(e) {
            // save the state
            if(e.keyCode === Crafty.keys.G){
            	save();
            }
        }
	},
	save:function(){
		Crafty.storage('game',game);
		Crafty.trigger("TempShowText","Game Saved");
	},
	getScore:function(){
		return game.score;
	},
	incrScore:function(points){
		return game.score += points;
	}

});