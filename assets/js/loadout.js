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
		this.inventory = this.model.getInventory(); //FIXME do not get anything from the model by reference

		//again I'm just doing weapons for something to work with...
		this.storeInventory = this.loadStoreInventory();
	},
	loadStoreInventory:function(){
		// this should interact with progress in order to say what things are unlocked
		return {
			weapons: allTheWeapons,
			bigWeapons: allTheBigWeapons,
			pilots: allThePilots,
			ships: allTheShips,
		};
	},
	getStoreInventory:function(type){
		return this.storeInventory[type];
	},
	getInventory:function(type){
		return this.inventory[type];
	},
	purchase:function(type, storeItem, position){
		// can buy?
		var item = this.storeInventory[type][storeItem];
		var price = item.cost;
		if(!model.canAfford(price)){
			console.log('you cannot afford that schwag')
			return false;
		}
		// purchase
		model.subtractMoney(price);
		this.addItem(type, item);
		// call equipItem
		model.equipItem(type, model.getLastItemIndex(type), position);

		//FIXME force user to remove/sell an item if item.type.length > item.max.length

		return true;
	},
	equipItem:function(type, index, position){
		model.equipItem(type, index, position);
	},
	addItem:function(type, item){
		newItem = jQuery.extend({}, item);
		model.acquireItem(type, newItem);
	},
});