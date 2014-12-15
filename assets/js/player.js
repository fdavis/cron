Crafty.c("Player",{
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
    heat:{
        current:0,
        max:100,
        percent:0
    },
    firing:false,
    lives:3,
    weapons:[],
    currentWeapon:0,
    maxWeapon:3,
    bigWeapon:{},
    powerups:{},
    ship:"ship1",
    shieldHandle:0,
    preparing:true,
    bounce:false,
    init:function(){
        var stage = $('#cr-stage');
        this.weapons = [
                Crafty.e("Weapon").Weapon(allTheWeapons.Laser1),
                Crafty.e("Weapon").Weapon(allTheWeapons.Laser1),
                Crafty.e("Weapon").Weapon(allTheWeapons.Laser1)
            ];
        this.bigWeapon = Crafty.e("Weapon").Weapon(allTheBigWeapons.Bomb);
        this.shieldHandle = Crafty.e("2D,Canvas,player_shield").origin('center');
        this.requires("2D,Canvas,"+this.ship+",Fourway,Keyboard,Mouse,Collision,Flicker")
        .fourway(10)
        .bind('Moved', function(from) {
            // Don't allow to move the player out of Screen
            if(this.x+this.w > Crafty.viewport.width ||
                this.x+this.w < this.w ||
                this.y+this.h-35 < this.h ||
                this.y+this.h+35 > Crafty.viewport.height || this.preparing){
                this.attr({
                    x:from.x,
                    y:from.y
                });
            }

        })
        .bind("KeyDown", function(e) {
            // cycle the active weapon
            if(e.keyCode === Crafty.keys.SHIFT){
                this.currentWeapon++;
                if (this.currentWeapon >= this.maxWeapon){
                    this.currentWeapon = 0;
                }
            // or select active weapon
            } else if(e.keyCode === Crafty.keys[1]){
                this.currentWeapon = 0;
            } else if(e.keyCode === Crafty.keys[2]){
                this.currentWeapon = 1;
            } else if(e.keyCode === Crafty.keys[3]){
                this.currentWeapon = 2;

            // or use the space bomb
            } else if(e.keyCode === Crafty.keys.SPACE){
                if(!this.canFire()) return;
                if(this.bigWeapon.canBeFired == true){
                    //if no ammo then quit now
                    if(this.bigWeapon.has("BallisticWeapon") && this.bigWeapon.ammo == 0) {
                        Crafty.trigger("TempShowText",this.bigWeapon.name + " is out of ammo!");
                        return;
                    }
                    // WARNING: this does not call canvasMouseDown event, will break auto fire if it does
                    // if we need to refactor something make another abstraction so that logic can be left alone
                    this.bigWeapon.canBeFired = false;
                    this.bigWeapon.cooldownCounter = 0;
                    this.shoot({x:0,y:1},this.bigWeapon);
                }
            }
        })
        .bind("canvasMouseUp", function (e) {
            this.firing = false;
        })
        .bind("canvasMouseDown", function (e) {
            if(!this.canFire()) return;
            this.firing = true;
            if(this.weapons[this.currentWeapon].canBeFired == true) {
                //if no ammo then quit now
                if(this.weapons[this.currentWeapon].has("BallisticWeapon") && this.weapons[this.currentWeapon].ammo == 0) {
                    Crafty.trigger("TempShowText",this.weapons[this.currentWeapon].name + " is out of ammo!");
                    return;
                }
                // if auto then call heat weapon
                if(false == this.weapons[this.currentWeapon].isAuto){
                    this.weapons[this.currentWeapon].canBeFired = false;
                    this.weapons[this.currentWeapon].cooldownCounter = 0;
                } else{
                    this.heatWeapon(this.weapons[this.currentWeapon]);
                }

                // get canvas for reference offsets
                var canvas = $("#cr-stage");//FIXME use stage var?
                var canvasOffsetx = canvas[0].offsetLeft;
                var canvasOffsety = canvas[0].offsetTop;
                // calculate direction of shot
                var vectx = e.x - this.x - this.w / 2 - canvasOffsetx;
                var vecty = e.y - this.y - this.h / 2 - canvasOffsety;
                // normalize
                var magnitude = Crafty.math.distance(vectx, vecty, 0, 0);
                var dir = {x: vectx / magnitude, y: - vecty / magnitude};
                // fire
                this.shoot(dir, this.weapons[this.currentWeapon]);
            }
        })
        .bind("EnterFrame",function(frame){
            if(this.preparing){
                this.y--;
                if(this.y < Crafty.viewport.height - this.h - Crafty.viewport.height / 4){
                    this.preparing = false;
                    this.flicker=false;

                }
                // FIXME clean this up for post init empty array nonsense on this.weapons
            } else if(this.weapons[this.currentWeapon].isAuto && frame.frame % this.weapons[this.currentWeapon].fireRate == 0){

                if(this.firing
                    && Crafty.lastEvent
                    && this.weapons[this.currentWeapon].canBeFired
                    && this.canFire()){
                    //fire if mouse is down and current weapon is auto fire
                    this.trigger("canvasMouseDown", Crafty.lastEvent);
                } else {
                    // do auto weapon cooling
                    this.coolWeapon(this.weapons[this.currentWeapon]);
                }
            }
            // handle cooling other auto weapons (if any)
            for(var i = 0; i < this.maxWeapon; ++i) {
                if(i == this.currentWeapon) continue;
                if(true == this.weapons[i].isAuto && frame.frame % this.weapons[i].fireRate == 0){
                    this.coolWeapon(this.weapons[i]);
                }
            }
            // FIXME this should be done with data binding >.<
            if(this.shield.current > 0){
                this.shieldHandle.visible = true;
                this.shieldHandle.alpha = this.shield.current / this.shield.max;
                this.shieldHandle.x = this._x - (this.shieldHandle._w/2 - this._w/2);
                this.shieldHandle.y = this._y - (this.shieldHandle._h/2 - this._h/2);
            } else {
                this.shieldHandle.visible = false;
            }

            for(var i = 0; i < this.weapons.length; i++){
                if(false == this.weapons[i].isAuto && false == this.weapons[i].canBeFired){
                    ++this.weapons[i].cooldownCounter;
                    if(this.weapons[i].fireInterval == this.weapons[i].cooldownCounter ){
                        this.weapons[i].canBeFired = true;
                    }
                }
            }
            if(false == this.bigWeapon.canBeFired){
                ++this.bigWeapon.cooldownCounter;
                if(this.bigWeapon.fireInterval == this.bigWeapon.cooldownCounter ){
                    this.bigWeapon.canBeFired = true;
                }
            }

        })
        .bind("Hurt",function(dmg){
            if(this.flicker) return;
            if(this.bounce == false) {
                this.bounce = true;
                var t = this;
                stage.effect('highlight',{
                    color:'#990000'
                },100,function(){
                    t.bounce = false;
                });
            }
            Crafty.e("Damage").attr({
                x:this.x,
                y:this.y
            });

            if(this.shield.current <= 0){
                this.hp.current -= dmg;
            }else{
                this.shield.current -= dmg;
                // if shield < 0, transfer that dmg to hp
                if(this.shield.current < 0){
                    this.hp.current += this.shield.current;
                    this.shield.current = 0;
                }
            }
            if(this.hp.current <= this.hp.max * 0.3) Crafty.trigger("TempShowText","Hull Breach Imminent!");
            // Crafty.trigger("UpdateStats");
            if(this.hp.current <= 0) this.die();
        })
        .onHit("EnemyBullet",function(ent){
            var bullet = ent[0].obj;
            this.trigger("Hurt",bullet.dmg);
            bullet.destroy();
        })
        .bind("RestoreHP",function(val){
            if(this.hp.current < this.hp.max){
                this.hp.current += val;
                // Crafty.trigger("UpdateStats");
            }

        })
        .bind("RestoreShield",function(val){
            if(this.shield.current < this.shield.max){
                this.shield.current += val;
                // Crafty.trigger("UpdateStats");
            }
        })
        .reset();// init some stats with reset
        return this;
    },
    reset:function(){
        this.hp = {
            current:this.hp.max,
            max:this.hp.max,
            percent:100
        };
        this.shield = {
            current:this.shield.max,
            max:this.shield.max,
            percent:100
        };
        // reset all guns
        for(var i = 0; i < this.maxWeapon; i++){
            if(false == this.weapons[i].isAuto){
                this.weapons[i].canBeFired = true;
                this.weapons[i].cooldownCounter = this.weapons[i].fireInterval;
            } else {
                // auto weapons reset logic
                this.weapons[i].canBeFired = true;
                this.weapons[i].heat = 0;
            }
        }
        this.bigWeapon.canBeFired = true;
        this.bigWeapon.cooldownCounter = this.bigWeapon.fireInterval;

        // Crafty.trigger("UpdateStats");
        //Init position
        this.x = Crafty.viewport.width/2-this.w/2;
        this.y = Crafty.viewport.height-this.h-36;

        this.firing = false;
        this.flicker = true;
        this.preparing = true;
    },
    shoot:function(dir, weapon){
        if(arguments.length < 2) return;
        var dir = dir;
        var weapon = weapon;//could use more validation... ?

        // want bullet to face direction of travel
        var myrot = Math.atan(dir.x / dir.y)/(Math.PI/180);
        if( dir.y < 0){
            // atan only defined from -90 to 90
            if (dir.x > 0) {
                myrot += 180;
            } else {
                myrot -= 180;
            }
            // don't let them shoot straight back +/- 48 degs 180-48=132
            if(myrot > 132) {
                myrot = 132;
                dir = {x: 0.74314482547, y: -0.66913060635};
            } else if (myrot < -132) {
                myrot = -132;
                dir = {x: -0.74314482547, y: -0.66913060635};
            }
        }

        var bullet = Crafty.e(weapon.bulletName,"PlayerBullet")//FIXME call bullet constructor
        .Bullet({
            playerID: this[0],
            dmg: weapon.dmg,
            rotation: myrot,
            xspeed: weapon.speed * dir.x,
            xaccel: weapon.accel * dir.x,
            xmax: weapon.speedMax * dir.x,
            yspeed: weapon.speed * dir.y,
            yaccel: weapon.accel * dir.y,
            ymax: weapon.speedMax * dir.y
        });

        //center bullet starting position on player's ship
        bullet.attr({
            x: this._x+this._w/2-bullet.w/2,
            y: this._y+this._h/2-bullet.h/2
        });
        //decrement the weapon ammo
        if(weapon.has("BallisticWeapon")) weapon.shot();
    },
    die:function(){
        Crafty.e("RandomExplosion").attr({
            x:this.x,
            y:this.y
        });
        this.lives--;
        // Crafty.trigger("UpdateStats");
        if(this.lives <= 0){
            this.destroy();
            Crafty.trigger("GameOver",model.getScore);
        }else{
            this.reset();
        }
    },
    coolWeapon:function(weapon){
        weapon.heat -= weapon.coolingRate;
        if (weapon.heat < 0) weapon.heat = 0;
        if (weapon.heat < 100) weapon.canBeFired = true;
    },
    heatWeapon:function(weapon){
        weapon.heat += weapon.heatingRate;
        if (weapon.heat > 100) {
            weapon.canBeFired = false;
            Crafty.trigger("TempShowText","Weapon Overheated!");
        }
    },
    // saving only the data we need to recreate the player obj
    saveObj:function(){
        state = {
            hp: this.hp,
            shield: this.shield,
            weapons: this.weapons,
            bigWeapon: this.bigWeapon,
            ship: this.ship,
        };
    },
    //AKA player load - dumb/trusting for now... do we need protection here? maybe?
    Player:function(data){
        if(data == null) return;
        keys = Object.keys(data);
        for(var keyIndex = 0; keyIndex < keys.length; ++keyIndex){
            // need crafty entity clone of weapons
            if(keys[keyIndex] == 'weapons') {
                this[keys[keyIndex]] = []; //clear the array
                for(var dataIndex = 0; dataIndex < data[keys[keyIndex]].length; ++dataIndex){
                    this[keys[keyIndex]].push(Crafty.e("Weapon").Weapon(data[keys[keyIndex]][dataIndex]));
                }
            } else if(keys[keyIndex] == 'bigWeapon') {
                this.bigWeapon = Crafty.e("Weapon").Weapon(data[keys[keyIndex]]);
            } else {
                this[keys[keyIndex]] = data[keys[keyIndex]];
            }
        }
        this.reset();
        return this;
    },
    canFire:function(){
        return !this.preparing && model.hasPlayerFocus();
    }
});