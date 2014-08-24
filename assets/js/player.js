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
    movementSpeed:8,
    lives:3,
    score:0,
    weapon:{
        firerate:5,
        name:"Weapon1",
        overheated:false
    },
    powerups:{},
    ship:"ship1",
    bars:{},
    infos:{},
    preparing:true,
    bounce:false,
    init:function(){
     
        var stage = $('#cr-stage');
        var firedThisFrame = false;
        this.requires("2D,Canvas,"+this.ship+",Multiway,Keyboard,Mouse,Collision,Flicker") /*Add needed Components*/
        .multiway(this.movementSpeed, { /*Enable Movement Control*/
            UP_ARROW: -90, 
            DOWN_ARROW: 90, 
            RIGHT_ARROW: 0, 
            LEFT_ARROW: 180
        })
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
            if(firedThisFrame == false) {
                this.shoot();
                firedThisFrame = true;
            }
            // if(e.keyCode === Crafty.keys.SPACE){
            //     keyDown = true;
            // } 
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
             if(firedThisFrame == false) {

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
                this.shoot(dir);
                firedThisFrame = true;
            }
        })
        .bind("EnterFrame",function(frame){
            if(frame.frame % this.weapon.firerate == 0){
               
                if(firedThisFrame){
                    firedThisFrame = false;
                }else{
                    if(this.heat.current > 0) //Cooldown the weapon
                        this.heat.current = ~~(this.heat.current*29/30); 
                }

                Crafty.trigger("UpdateStats");
                
                if(this.weapon.overheated && this.heat.percent < 85){
                    this.weapon.overheated = false;
                    Crafty.trigger("HideText");
                }
                    
            }
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
        Crafty.trigger("UpdateStats");
        //Init position
        this.x = Crafty.viewport.width/2-this.w/2;
        this.y = Crafty.viewport.height-this.h-36;
        
        this.flicker = true;
        this.preparing = true;
    },
    shoot:function(dir){ 
        if(this.preparing) return;
        var dir = dir || {x: 0, y: 1};
        var myrot = Math.atan(dir.x/dir.y)/(Math.PI/180);
        console.log(myrot);
        console.log(dir);
        // don't let them shoot straight back +/- 48 degs
        if( dir.y < 0){
            if(myrot > 0 && myrot < 48) {
                myrot = 48;
                dir = {x: -0.74314482547, y: -0.66913060635};
            } else if(myrot <= 0 && myrot > -48) {
                myrot = -48;
                dir = {x: 0.74314482547, y: -0.66913060635};
            }
        }


        var bullet = Crafty.e(this.weapon.name,"PlayerBullet");
        bullet.attr({
            playerID:this[0],
            x: this._x+this._w/2-bullet.w/2, //helps center on ship
            y: this._y+this._h/2-bullet.h/2,
            rotation: myrot,
            xspeed: 20 * dir.x,
            yspeed: 20 * dir.y
        }); 
     
        if(this.heat.current < this.heat.max)
            this.heat.current ++;
         
        if(this.heat.current >= this.heat.max){
            Crafty.trigger("ShowText","Weapon Overheated!");
            this.weapon.overheated = true;
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
