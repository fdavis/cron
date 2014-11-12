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
                    fired: false
                },
                {
                    name:"MissileLauncher1",
                    fired: false
                },
                {
                    name:"Weapon2",
                    fired: false
                }
            ],
    currentWeapon:0,
    maxWeapon:3,
    bigWeapon:{
        name:"Bomb",
        fired: false,
    },
    powerups:{},
    ship:"ship1",
    bars:{},
    infos:{},
    preparing:true,
    bounce:false,
    init:function(){
     
        var stage = $('#cr-stage');
        this.requires("2D,Canvas,"+this.ship+",Fourway,Keyboard,Mouse,Collision,Flicker") /*Add needed Components*/
        .fourway(10)
        .bind('Moved', function(from) { /*Bind a function which is triggered if player is moved*/
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
                    this.shoot({x:0,y:1},this.bigWeapon);
                    this.bigWeapon.fired = true;
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

                // get canvas for reference offsets
                var canvas = $("#cr-stage");
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
                this.weapons[this.currentWeapon].fired = true;
            }
        })
        .bind("EnterFrame",function(frame){
            if(this.preparing){
                this.y--;
                if(this.y < Crafty.viewport.height-this.h-Crafty.viewport.height/4){
                    this.preparing = false;
                    this.flicker=false;
                  
                }
            }
         
            
        })
        .bind("Killed",function(points){
            this.score += points;
            Crafty.trigger("UpdateStats");
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
            Crafty.trigger("UpdateStats");
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
                Crafty.trigger("UpdateStats");
            }
        
        })
        .bind("RestoreShield",function(val){
            if(this.shield.current < this.shield.max){
                this.shield.current += val;
                Crafty.trigger("UpdateStats");
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
        }
        Crafty.trigger("UpdateStats");
        //Init position
        this.x = Crafty.viewport.width/2-this.w/2;
        this.y = Crafty.viewport.height-this.h-36;

        
        this.flicker = true;
        this.preparing = true;
    },
    shoot:function(dir, weapon){
        var dir = dir || {x: 0, y: 1};
        var weapon = weapon || this.weapons[0];
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

        var bullet = Crafty.e(weapon.name,"PlayerBullet");
        bullet.attr({
            playerID:this[0],
            x: this._x+this._w/2-bullet.w/2, //center on ship
            y: this._y+this._h/2-bullet.h/2,
            rotation: myrot,
            xspeed: bullet.speed * dir.x,
            yspeed: bullet.speed * dir.y
        });
        // reset 'fired' on weapon after cooldown, so it can be fired again
        setTimeout(this.clearFired,bullet.firerate, weapon);
    },
    clearFired:function(weapon){
        if (weapon.hasOwnProperty("fired")){
            weapon.fired = false;
        }
    },
    die:function(){
        Crafty.e("RandomExplosion").attr({
            x:this.x,
            y:this.y
        });
        this.lives--;
        Crafty.trigger("UpdateStats");
        if(this.lives <= 0){
            this.destroy();
            Crafty.trigger("GameOver",this.score);
        }else{
            this.reset();
        }
    }
});