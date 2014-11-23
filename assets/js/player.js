            //to use the showtext
            // Crafty.trigger("ShowText","Weapon Overheated!");
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
    lives:3,
    score:0,
    weapons:[
                {
                    name:"Weapon1",
                    fired: false,
                    dmg:1,
                    speed:25,
                    speedMax:25,
                    accel:0,
                    cooldownCounter:7,
                    fireInterval:9,
                    percent:100
                },
                {
                    name:"MissileLauncher1",
                    fired: false,
                    dmg:3,
                    speed:5,
                    speedMax:20,
                    accel:0.3,
                    cooldownCounter:34,
                    fireInterval:34,
                    percent:100
                },
                {
                    name:"Laser_Wave",
                    fired: false,
                    dmg:2,
                    speed:19,
                    speedMax:19,
                    bullletCollision:false,
                    accel:0,
                    cooldownCounter:22,
                    fireInterval:22,
                    percent:100
                }
            ],
    currentWeapon:0,
    maxWeapon:3,
    bigWeapon:{
        name:"Bomb",
        fired: false,
        dmg:10,
        speed:2,
        speedMax:2,
        accel:0,
        cooldownCounter:120,
        fireInterval:120,
        percent:100
    },
    powerups:{},
    ship:"ship1",
    shieldHandle:0,
    bars:{},
    infos:{},
    preparing:true,
    bounce:false,
    init:function(){
     
        var stage = $('#cr-stage');
        this.shieldHandle = Crafty.e("2D,Canvas,player_shield").origin('center');
        this.requires("2D,Canvas,"+this.ship+",Fourway,Keyboard,Mouse,Collision,Flicker")
        .fourway(10)
        .bind('Moved', function(from) {
            /*Dont allow to move the player out of Screen*/
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
                if(this.preparing) return;
                if(this.bigWeapon.fired == false){
                    this.bigWeapon.fired = true;
                    this.bigWeapon.cooldownCounter = 0;
                    this.shoot({x:0,y:1},this.bigWeapon);
                }
            }
        })
        // .bind("KeyUp", function(e) {
        //     if(e.keyCode === Crafty.keys.SPACE){
        //         keyDown = false;
        //     } 
        // })
        // .bind("Click", function() {
        //     console.log("Clicked!!");
        // })
        .bind("canvasMouseDown", function (e) {
            if(this.preparing) return;
            if(this.weapons[this.currentWeapon].fired == false) {
                this.weapons[this.currentWeapon].fired = true;
                this.weapons[this.currentWeapon].cooldownCounter = 0;

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
            if(this.shield.current > 0){
                this.shieldHandle.visible = true;
                this.shieldHandle.alpha = this.shield.current / this.shield.max;
                this.shieldHandle.x = this._x - (this.shieldHandle._w/2 - this._w/2);
                this.shieldHandle.y = this._y - (this.shieldHandle._h/2 - this._h/2);
            } else {
                this.shieldHandle.visible = false;
            }

            if(this.preparing){
                this.y--;
                if(this.y < Crafty.viewport.height-this.h-Crafty.viewport.height/4){
                    this.preparing = false;
                    this.flicker=false;
                  
                }
            }
            for(var i = 0; i < this.weapons.length; i++){
                if(this.weapons[i].fired == true ){
                    this.weapons[i].cooldownCounter++;
                    if(this.weapons[i].fireInterval == this.weapons[i].cooldownCounter ){
                        this.weapons[i].fired = false;
                    }
                }
            }
            if(this.bigWeapon.fired == true ){
                this.bigWeapon.cooldownCounter++;
                if(this.bigWeapon.fireInterval == this.bigWeapon.cooldownCounter ){
                    this.bigWeapon.fired = false;
                }
            }
            
            // this.fpsHandle.text = fps.getFPS();

        })
        .bind("Killed",function(points){
            this.score += points;
            // Crafty.trigger("UpdateStats");
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
                this.shield.current = 0;
                this.hp.current -= dmg;
            }else{
                this.shield.current -= dmg;
            } 
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
        .reset() /*Set initial points*/;
        return this;
    },
    reset:function(){
        this.hp = {
            current:10,
            max:10,
            percent:100
        };
        this.shield = {
            current:10,
            max:10,
            percent:100
        };
        this.heat = {
            current:0,
            max:100,
            percent:0
        }
        // reset all guns fireable
        for(var i = 0; i < this.maxWeapon; i++){
            this.weapons[i].fired = false;
            this.weapons[i].cooldownCounter = this.weapons[i].fireInterval;
        }
        this.bigWeapon.fired = false;
        this.bigWeapon.cooldownCounter = this.bigWeapon.fireInterval;
        // Crafty.trigger("UpdateStats");
        //Init position
        this.x = Crafty.viewport.width/2-this.w/2;
        this.y = Crafty.viewport.height-this.h-36;

        this.flicker = true;
        this.preparing = true;
    },
    shoot:function(dir, weapon){
        var dir = dir || {x: 0, y: 1};
        var weapon = weapon || this.weapons[0];//FIXME need to make default do nothing
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

        var bullet = Crafty.e(weapon.name,"PlayerBullet")//FIXME call bullet constructor
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
            Crafty.trigger("GameOver",this.score);
        }else{
            this.reset();
        }
    }
});