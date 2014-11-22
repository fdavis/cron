// fireinterval is the number of frames inbetween shots

Crafty.c("Bullet",{
    dmg:0,
    firerate:0,
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
        .onHit("Bullet",function(ent){
            myId = this.playerID;
            theirId = ent[0].obj.playerID;
            if ( myId == theirId ){
                return; //don't let friendly bullets kill each other
            }
            this.destroy();
            ent[0].obj.destroy();
        });
    }
});

Crafty.c("Weapon1",{
    init:function(){
        this
        .addComponent("Bullet","laser1")
        .origin("center")
        .bind("EnterFrame", function() {
            this.x += this.xspeed;
            this.y -= this.yspeed; 
        })
        .attr({
            dmg:1,
            speed:25,
            firerate:200
        });
        Crafty.audio.play("laser1",1,0.8);
    } 
});

Crafty.c("MissileLauncher1",{
    init:function(){
        this
        .addComponent("Bullet","missile1")
        .origin("center")
        .bind("EnterFrame", function() {
            this.x += this.xspeed;
            this.y -= this.yspeed; 
        })
        .attr({
            dmg:3,
            speed:10,
            firerate:675
        });
        Crafty.audio.play("laser1",1,0.8);
    } 
});


Crafty.c("Bomb",{
    init:function(){
        this
        .addComponent("Bullet","missile2")
        .origin("center")
        .bind("EnterFrame", function() {
            this.x += this.xspeed;
            this.y -= this.yspeed; 
        })
        .attr({
            dmg:30,
            speed:5,
            firerate:675
        })
        //Event triggered when this bullet is destroyed
        .bind("Remove",function(dmg){
        //Create a random explosion at his position
            Crafty.e("RandomExplosion,SplashDamage")
            .attr({
                x:this.x-this.w*3,//FIXME why do these scalars work????
                y:this.y-this.h*1.3
            });
        });
        Crafty.audio.play("laser1",1,0.8);
    } 
});

Crafty.c("SplashDamage",{
    dmg:5,
    init:function(){
        this.addComponent("Collision");
        // .onHit("Enemy",function(ent){
        //     console.log('splash damage triggered');
        //     console.log(this);
        //     ent[0].obj.trigger("Hurt",1);
        // });
    }

});

Crafty.c("Weapon2",{
    init:function(){
        this
        .addComponent("Bullet","laser2")
        .origin("center")
        .bind("EnterFrame", function() {
            this.x += this.xspeed;
            this.y -= this.yspeed;  
        }).attr({
            dmg:2,
            speed:17,
            firerate:450
        });
        Crafty.audio.play("laser2",1,0.8);
    } 
});
