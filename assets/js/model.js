//game state saver/loader/tracker/controller ?

var playerInit = function () {
	return {
		hp:{
			current:10,
			max:10,
			percent:100
		},
		shield:{
			current:10,
			max:10,
			percent:100
		},
		weapons: [
		    Crafty.e("Weapon").Weapon(allTheWeapons.AutoLaser),
		    Crafty.e("Weapon").Weapon(allTheWeapons.Laser_Wave),
		    Crafty.e("Weapon").Weapon(allTheWeapons.MissileLauncher1)
		],
	};
};

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

		this.game = Crafty.storage('game');//store game progress, unlocked things, etc...
		if(this.game == null){
			this.game = this.newGame();
		}

		// FIXME debug things should be removed later
		this.bind("KeyDown", function(e) {
			// save the state
			if(e.keyCode === Crafty.keys.G){
				this.save();
				console.log('game saved');
			} else if(e.keyCode === Crafty.keys.H){
				this.game = this.newGame();
				this.save();
				console.log('new game started');
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
				player: playerInit(),
				levels: null,
			};
	},
	// Model:function(){
	// 	var this.game = null;
	// },
	save:function(){
		Crafty.storage('game',this.game);
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
		return this.game.score;
	},
	addScore:function(points){
		return this.game.score += points;
	},
	getMoney:function(){
		return this.game.money;
	},
	addMoney:function(dollas){
		return this.game.money += dollas;
	},
	subMoney:function(dollas){
		return this.game.money -= dollas;
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
	getPlayer:function(){
		return this.game.player;
	},
	swapWeapon:function(newWeapon, index){
		var oldWeapon = this.game.player.weapons[index];
		this.game.player.weapons[index] = newWeapon;
		return oldWeapon;
	},
});