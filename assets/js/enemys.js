/**
 * This File describes all enemies
 */
var powerUps = ["Heal","Shield"];
//Basic enemy component
Crafty.c("Enemy",{
    model:Crafty('Model'),
    //I guess this is shared??? see http://craftyjs.com/api/Crafty-c.html and https://github.com/craftyjs/Crafty/issues/327
    //is this messing up anything else >.> ??? \_(o-O)_/
    // splashedBy:[],//if splashed by a splash damage object, don't let it happen again
    init:function(){
        this.splashedBy = [];
        //All enemies will get same basic components
        this.requires("2D,Canvas,Collision")
        //Destroy all enemies if they leave the viewport
        .bind("EnterFrame",function(){
            if(this.x > Crafty.viewport.width + this.w ||
                this.x < -this.w ||
                this.y < -this.h ||
                this.y > Crafty.viewport.height +this.h){
                this.destroy();
            }
        })
        //Describe behavior on getting hit by Player Bullet
        .onHit("PlayerBullet",function(ent){
            var bullet = ent[0].obj;
            this.trigger("Hurt",bullet.dmg); //Hurt the enemy with bullet damage
            bullet.destroy(); //Destroy the bullet
        })
        //Describe behavior on getting hit by splash damage
        .onHit("SplashDamage",function(ent){
            var splash = ent[0].obj;
            if(this.splashedBy.indexOf(splash[0]) == -1 && this.hp > 0){//added check bc dead enemies were getting splashed
                this.splashedBy.push(splash[0]);
                this.trigger("Hurt",splash.dmg); //Hurt the enemy with bullet damage
            }
        })
        //Describe behavior on getting hit by Player
        .onHit("Player",function(ent){
            var player = ent[0].obj;
            //Hurt the player with my hp
            Crafty(player[0]).trigger("Hurt",this.hp);
            //Hurt enemy with all hp he has
            this.trigger("Hurt",this.hp);
        })
        //Describe behavior on getting hit by SpaceJunk
        .onHit("SpaceJunk",function(ent){
            var junk = ent[0].obj;
            if(this.has("EnemyPassableJunk") && junk.has("EnemyPassableJunk")) return;
            var dmg = 1;
            //decide the dmg done
            if(this.hp > junk.hp) dmg = junk.hp
            else dmg = this.hp
            junk.trigger("Hurt",dmg);
            this.trigger("Hurt",dmg);
        })
        //Event triggered when enemy was hurt
        .bind("Hurt",function(dmg){
            //Create a damage effect
            Crafty.e("Damage").attr({
                x:this.x,
                y:this.y
            });
            //Reduce HP
            this.hp -= dmg;
            //Die if hp is 0
            if(this.hp <= 0) this.trigger("Die");
        })
        .bind("Die",function(){
            //Create a random explosion at his position
            Crafty.e("RandomExplosion").attr({
                x:this.x-this.w,
                y:this.y-this.h
            });
            model.trigger("Scored",this.points);
            //Destroy the asteroid
            this.destroy();
            if(Crafty.math.randomInt(0, 100) > 70){
                var powerUp = powerUps[Crafty.math.randomInt(0, powerUps.length-1)];
                Crafty.e(powerUp).attr({
                    x:this.x,
                    y:this.y
                });
            }
        })

    }
});

//container class for enemies that shoot
Crafty.c("Shooter", {
    init:function(){
        this.weapon = Crafty.e("Weapon").Weapon(allTheWeapons.Laser1);
        // moved to enemy for now ... need to refactor some how
        this.bind("Shoot",function(speed){
            var dir = dir || {x: 0, y: -1};
            var bullet = Crafty.e(this.weapon.bulletName,"EnemyBullet")
            .Bullet({
                playerID: this[0],
                dmg: this.weapon.dmg,
                xspeed: this.weapon.speed * dir.x,
                xaccel: this.weapon.accel * dir.x,
                xmax: this.weapon.speedMax * dir.x,
                yspeed: this.weapon.speed * dir.y,
                yaccel: this.weapon.accel * dir.y,
                ymax: this.weapon.speedMax * dir.y
            });
            // FIXME make these adjustments more generic so they will fit well on any ship
            // May take ship by ship tinkering :(
            bullet.attr({
                x: this._x+this._w/2+bullet.w*3/4,
                y: this._y+this._h-bullet.h/2,
                rotation: this._rotation
            });
        });
    }

});

Crafty.c("SpaceJunk",{
    init:function(){
        this.requires("Collision")
        .onHit("EnemyBullet",function(ent){
            var bullet = ent[0].obj;
            this.trigger("Hurt",bullet.dmg); //Hurt the junk with bullet damage
            bullet.destroy(); //Destroy the bullet
        });
    }
});

//Enemy type Asteroid
Crafty.c("Asteroid",{
    hp:2, //Has 2 HP
    points:5, //Give 5 points if killed
    init:function(){
        var speed =  Crafty.math.randomInt(1,2); //get Random moving speed
        var direction = Crafty.math.randomInt(-speed,speed); //Get random moving direction

        //Asteroid requires Enemy so it gets their functions and behavior
        this.requires("Enemy,asteroid64,Tween,SpaceJunk")
        .origin("center")
        .tween({rotation:this.rotation + 180}, 2000)
        .bind("TweenEnd", function (){
            this.tween({rotation:this.rotation + 180}, 2000)
        })

        .bind("EnterFrame",function(){
            //Move the Enemy in game loop
            this.y += speed;
            this.x += direction;
        })
        //Set initial attributes
        .attr({
            y:-this.h, //display asteroid over the viewport at start
            x:Crafty.math.randomInt(this.w,Crafty.viewport.width - this.w),//random position within the viewport
            rotation:Crafty.math.randomInt(0,360) //rotate it random
        })
        .onHit("SmallAsteroid",function(){
            this.trigger("Die");
        })
        //Event to die
        .bind("Die",function(){
            //Create a random explosion at his position
            Crafty.e("RandomExplosion").attr({
                x:this.x,
                y:this.y
            });
            //Create 1-4 Small asteroids
            for(var i = 0;i<Crafty.math.randomInt(1,4);i++){
                Crafty.e("SmallAsteroid").attr({
                    x:this.x,
                    y:this.y
                });
            }

        });
    }
});

//Same like Asteroid but dont create smaller asteroids
Crafty.c("SmallAsteroid",{
    hp:1,
    points:10,
    init:function(){
        speed = Crafty.math.randomInt(1,3);
        this.direction = Crafty.math.randomInt(-speed,speed);
        this.requires("Enemy,asteroid32,Tween,SpaceJunk,EnemyPassableJunk")
        .origin("center")
        .tween({rotation:this.rotation + 180}, 2000)
        .bind("TweenEnd", function (){
            this.tween({rotation:this.rotation + 180}, 2000)
        })
        .bind("EnterFrame",function(){
            this.y += speed;
            this.x += this.direction;
        })
        .attr({
            rotation:Crafty.math.randomInt(0,360)
        });

    }
});

//EnemyType Kamikaze
Crafty.c("Kamikaze",{
    hp:3,
    points:15,
    init:function(){
        // only var that needs to be priv (others may be modified externally? really? we need a better solution)
        var attacking = false;

        this.player = Crafty("Player");
        this.xspeed = 6;
        this.xattackingMultiplier = 0.5;
        this.yspeed = 1.5;
        this.yattackingMultiplier = 3;
        this.requires("Enemy,ship11")
        .origin("center")
        .attr({
            rotation:180,
            y:-this.h,
            x:Crafty.math.randomInt(this.w,Crafty.viewport.width - this.w)
        })
        .bind("EnterFrame",function(){
            if(this.y < 0)
                this.y += this.yspeed;

            // if close enough to match player.x then do it
            var xDiff = this.player.x - this.x;
            if (Math.abs(xDiff) < this.xspeed){
                this.x += xDiff;
            } else{
                if(this.x < this.player.x)
                    this.x += this.xspeed;

                if(this.x > this.player.x)
                    this.x -= this.xspeed;
            }

            if(this.x == this.player.x){
                attacking = true;
                this.xspeed = Math.round(this.xspeed * this.xattackingMultiplier); //half x adjust on descent
            }

            if(attacking)
                this.y += this.yspeed * this.yattackingMultiplier ;
        });

    }
});

Crafty.c("Level1",{
    hp:2,
    points:5,
    bulletSpeed:10,
    init:function(){
        var x = 0;

        this.player = Crafty("Player");
        this.yspeed = 1;
        this.xDiff = 80;
        this.shotFreq = 20;
        this.addComponent("Enemy","ship9","Shooter")
        .origin("center")
        .attr({
            rotation:180,
            y:-this.h,
            x:Crafty.math.randomInt(this.w, Crafty.viewport.width - this.w)
        })
        .bind("EnterFrame",function(frame){
            x = Math.abs((this.x + this._w / 2) - this.player.x);

            if((x < this.xDiff) && this._y < this.player.y && frame.frame % this.shotFreq == 0){
                this.trigger("Shoot", this.bulletSpeed);
            }
            this.y += this.yspeed;
        })
    }
});

Crafty.c("Level2",{
    hp:2,
    points:10,
    bulletSpeed:15,
    init:function(){
        var x = 0;

        this.player = Crafty("Player");
        this.yspeed = 1;
        this.xspeed = 2;
        this.xDiff = 80;
        this.shotFreq = 15;

        this.addComponent("Enemy","ship10","Shooter")
        .origin("center")
        .attr({
            rotation:180,
            y:-this.h,
            x:Crafty.math.randomInt(this.w,Crafty.viewport.width - this.w)
        })
        .bind("EnterFrame",function(frame){
            x = Math.abs((this.x + this._w / 2) - this.player.x);
            if(this.x < this.player.x)
                this.x += this.xspeed;
            if(this.x > this.player.x)
                this.x -= this.xspeed;

            if((x < this.xDiff) && this._y < this.player.y && frame.frame % this.shotFreq == 0){
                this.trigger("Shoot", this.bulletSpeed);
            }
            this.y += this.yspeed;
        });
    }
});
