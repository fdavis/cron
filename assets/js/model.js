//game state saver/loader/tracker/controller ?
Crafty.c("Model",{
	playerCanShoot:true,
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
			} else if(e.keyCode === Crafty.keys.P){
				if(Crafty.isPaused()) {
					Crafty.trigger("HideText");//FIXME would hide any text... not great solution?
				} else {
					Crafty.trigger("ShowText","PAUSED!");
				}
				Crafty.pause();
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
	},
	hasPlayerFocus:function(){
		console.group('model');
		console.debug(this.playerCanShoot && !Crafty.isPaused());
		console.groupEnd();
		// console.log('Crafty paused var?:' + Crafty.isPaused());
		// if(Crafty.isPaused()) console.log('the durn thang is PAUSEESSDDDDD');
		return this.playerCanShoot && !Crafty.isPaused();
	},
	// when there is a clicky thing in the level we want the player to click (like menus)
	// but don't want to force them to shoot when this happens
	playerMouseOver:function(){
		this.playerCanShoot = false;
	},
	playerMouseOut:function(){
		this.playerCanShoot = true;
	}
});