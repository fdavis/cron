//game state saver/loader/tracker/controller ?
Crafty.c("Model",{
	playerCanShoot:true,
	_paused:false,
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
			game = this.newGame();
		}

		// FIXME debug things should be removed later
		this.bind("KeyDown", function(e) {
			// save the state
			if(e.keyCode === Crafty.keys.G){
				this.save();
			} else if(e.keyCode === Crafty.keys.H){
				game = this.newGame();
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
			this.addScore(points);
		});
	},
	newGame:function(){
		return {
				score: 0,
				money: 0,
				player: null,
				levels: null,
			};
	},
	Model:function(){
		var game = null;
	},
	save:function(){
		Crafty.storage('game',game);
	},
	pause:function(){
		Crafty.resetKeyDown();
		Crafty.pause(true);
		this._pause = true;
	},
	unPause:function(){
		resetKeyDown
	},
	getScore:function(){
		return game.score;
	},
	addScore:function(points){
		return game.score += points;
	},
	getMoney:function(){
		return game.money;
	},
	addMoney:function(dollas){
		return game.money += dollas;
	},
	hasPlayerFocus:function(){
		return this.playerCanShoot && !Crafty.isPaused();
	},
	// when there is a clicky thing in the level we want the player to click (like menus)
	// but don't want to force them to shoot when this happens
	playerMouseOver:function(){
		this.playerCanShoot = false;
	},
	playerMouseOut:function(){
		this.playerCanShoot = true;
	},
	playerLoad:function(){
		return this.game.player;
	},
});