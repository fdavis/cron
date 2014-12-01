Crafty.c("Bullet",{
    dmg:0,
    firerate:0,
    xspeed:1,
    xaccel:0,
    xmax:1,
    yspeed:1,
    yaccel:0,
    ymax:1,
    bulletCollision:true,
    init:function(){
        this.addComponent("2D","Canvas","Collision")
        .bind("EnterFrame",function(){
            if(this.x > Crafty.viewport.width+this.w ||
                this.x < -this.w ||
                this.y < -this.h ||
                this.y > Crafty.viewport.height+this.h){
                this.destroy();
            }
        })
        .bind("EnterFrame", function() {
            this.xspeed += this.xaccel;
            if( Math.abs(this.xspeed) >= Math.abs(this.xmax) ){
                this.xspeed = this.xmax;
                this.xaccel = 0;
            }
            this.yspeed += this.yaccel;
            if( Math.abs(this.yspeed) >= Math.abs(this.ymax) ){
                this.yspeed = this.ymax;
                this.yaccel = 0;
            }
            this.x += this.xspeed;
            this.y -= this.yspeed;
        })
        .onHit("Bullet",function(ent){
            var that = ent[0].obj;
            if(this.has("PlayerBullet") && that.has("PlayerBullet")
                || this.has("EnemyBullet") && that.has("EnemyBullet")){
                return; //don't let friendly bullets kill each other
            }
            // some bullets don't die when they hit other bullets
            if(this.bulletCollision) this.destroy();
            if(that.bulletCollision) that.destroy();
        });
    },
    Bullet:function(args){
        for (var k in args){
            if (args.hasOwnProperty(k)) {
                this[k] = args[k];
            }
        }
        return this;
    }
});

Crafty.c("Weapon1",{
    init:function(){
        this
        .addComponent("Bullet","laser1")
        Crafty.audio.play("laser1",1,0.8);
    }
});

Crafty.c("AutoLaser",{
    init:function(){
        this
        .addComponent("Bullet","laser1")
        Crafty.audio.play("laser1",1,0.8);
    }
});

Crafty.c("MissileLauncher1",{
    init:function(){
        this
        .addComponent("Bullet","missile1")
        Crafty.audio.play("laser1",1,0.8);
    }
});


Crafty.c("Bomb",{
    init:function(){
        this
        .addComponent("Bullet","missile2")
        .bind("Remove",function(dmg){
            //Create a random explosion at it's position
            Crafty.e("RandomLargeExplosion,SplashDamage,Collision")
            .attr({
                //FIXME make this work nicer
                // these "random" magic numbers (which are half height/half widths) make the explosion appear
                // in about the location the tip of the bomb impacts
                x:this.x-384/2,
                y:this.y-384/2,
                dmg:5
            });
        });
        Crafty.audio.play("laser1",1,0.8);
    }
});

Crafty.c("Weapon2",{
    init:function(){
        this
        .addComponent("Bullet","laser2");
        Crafty.audio.play("laser2",1,0.8);
    }
});

Crafty.c("Laser_Wave",{
    init:function(){
        this
        .addComponent("Bullet","laser_wave");
        this.bulletCollision = false;
        Crafty.audio.play("laser2",1,0.8);
    }
});
