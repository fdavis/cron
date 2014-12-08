// handles loadout transactions (backend object for loadout scene ?)
Crafty.c("Loadout",{
	init:function(){
		// it talks to the model a lot... might be creating a lot of unnecessary work there
		this.model = Crafty('Model');
		this.loadItems();


		// FIXME need to trigger cool sounds and maybe some flashes and stuff
	},
	loadItems:function(){
		//get the player's inventory of weapons
		// probably should split up inventories by type, weapons, ships, pilots, etc...
		// right now I'm just giving it a static laser
		// FIXME I'm storing position because I'm not sure if javascript can preserve object order
		// writing this out I'm realizing that this is a poor way to store this I think because two will conflict
		// this needs more thought obviously...
		this.inventory = [ allTheWeapons.AutoLaser, allTheWeapons.MissileLauncher1, ];

		//again I'm just doing weapons for something to work with...
		this.store = this.getStoreInventory();
	},
	getStoreInventory:function(){
		// this should interact with progress in order to say what things are unlocked
		return allTheWeapons;
	},
	getStore:function(type){
		//fixme this should depend on the type
		return this.store;
	},
	getInventory:function(type){
		//fixme this should depend on the type
		return this.inventory;
	},
	purchase:function(thing, type){
		var item = this.store[thing];
		model.subMoney(item.cost); // check that we have enough money
		this.addItem(thing, type);
		this.equip(this.inventory.length - 1);
		return true; //fixme should return false or reason why failed when failed?
	},
	equip:function(arrayIndex, type){
		var oldWeapon = model.swapWeapon(this.inventory[arrayIndex], 1);
		this.inventory[arrayIndex] = oldWeapon;
		// var item = jQuery.extend({}, this.inventory[thing]);
		//herpus derpus
	},
	addItem:function(thing, type){
		newItem = jQuery.extend({}, allTheWeapons[thing]);
		this.inventory.push(newItem);
	},

//var newObject = jQuery.extend({}, oldObject);
});