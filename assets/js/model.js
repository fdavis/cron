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
		weapons:[
		    Crafty.e("Weapon").Weapon(allTheWeapons.AutoLaser),
		    Crafty.e("Weapon").Weapon(allTheWeapons.Laser_Wave),
		    Crafty.e("Weapon").Weapon(allTheWeapons.MissileLauncher1)
		],
		ship:allTheShips.ship1,
		bigWeapon:Crafty.e("Weapon").Weapon(allTheBigWeapons.Bomb),
		pilot:allThePilots.pilot1,
	};
};

Crafty.c("Model",{
	playerCanShoot:true,
	_paused:false,
	init:function(){
		this.requires("Persist,Keyboard");

		//store game progress, unlocked things, etc...
		this.game = Crafty.storage('game');
		if(this.game == null){
			this.game = this.newGame();
		}

		// FIXME debug things should be removed later
		this.bind("KeyDown", function(e) {
			// save the state
			if(e.keyCode === Crafty.keys.G){
				this.save();
				console.log('game saved');
			} else if(e.keyCode === Crafty.keys.N){
				this.game = this.newGame();
				this.save();
				console.log('new game obj inited');
			} else if(e.keyCode === Crafty.keys.M){
				this.addMoney(5000);
				console.log('added 50k monies');
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
				money: 1000,
				player: playerInit(),
				levels: null,
				inventory:{
					weapons:[
						Crafty.e("Weapon").Weapon(allTheWeapons.AutoLaser),
						Crafty.e("Weapon").Weapon(allTheWeapons.Laser_Wave),
					],
					bigWeapons:[
						Crafty.e("Weapon").Weapon(allTheBigWeapons.Bomb2),
					],
					ships:[
						allTheShips.ship2,
					],
					pilots:[
						allThePilots.pilot2,
					],
				},
			};
	},
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
	canAfford:function(dollars){
		return this.game.money >= dollars;
	},
	addMoney:function(dollars){
		return this.game.money += dollars;
	},
	subtractMoney:function(dollars){
		if (dollars > this.game.money) {
			// Crafty.trigger("TempShowText","Insufficient Funds");
			console.log('Insufficient Funds');
			return false;
		}
		this.game.money -= dollars;
		return true
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
	equipItem:function(type, invSlot, position){
		// select the items to swap (from player to inventory)
		var temp;
		switch(type){
			case 'weapons':
				temp = this.game.player.weapons[position];
				this.game.player.weapons[position] = this.game.inventory.weapons[invSlot];
				this.game.inventory.weapons[invSlot] = temp;
				break;
			case 'ships':
				temp = this.game.player.ship;
				this.game.player.ship = this.game.inventory.ships[invSlot];
				this.game.inventory.ships[invSlot] = temp;
				break;
			case 'pilots':
				temp = this.game.player.pilot;
				this.game.player.pilot = this.game.inventory.pilots[invSlot];
				this.game.inventory.pilots[invSlot] = temp;
				break;
			case 'bigWeapons':
				temp = this.game.player.bigWeapon;
				this.game.player.bigWeapon = this.game.inventory.bigWeapons[invSlot];
				this.game.inventory.bigWeapons[invSlot] = temp;
				break;
			default: 
				console.error("you should not have come this way... Ring B-error");
				return false;
		}

		return true;
	},
	acquireItem:function(type, item){
		this.game.inventory[type].push(item);
		//FIXME if too many items make player sell/drop
	},
	getLastItemIndex:function(type){
		return this.game.inventory[type].length - 1;
		//FIXME if too many items make player sell/drop
	},
	getInventory:function(type){
		console.log(this.game.inventory[type]);
		return (type == null)? this.game.inventory : this.game.inventory[type];
	},
});