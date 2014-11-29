Crafty.c("PowerUp",{
    init:function(){
        this.requires("2D,Canvas,Collision")
        .onHit("Player",function(ent){

            ent[0].obj.trigger(this.effect,this.value);
            this.destroy();
        })
        .bind("EnterFrame",function(){
            this.y+=2;
        });
    }
});

Crafty.c("Heal",{
    effect:"RestoreHP",
    value:1,
    init:function(){
        this.requires("PowerUp,heal");
    }
});
Crafty.c("Shield",{
    effect:"RestoreShield",
    value:1,
    init:function(){
        this.requires("PowerUp,shield");
    }
});