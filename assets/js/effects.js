var myExplosions = [
    {
        name:"RandomExplosion",
        sprite:"explosion"
    },
    {
        name:"RandomLargeExplosion",
        sprite:"explosionLarge"
    }
];

for (var i = 0; i < myExplosions.length; ++i) {

    Crafty.c(myExplosions[i].name,{
        spriteName: myExplosions[i].sprite,
        init:function(){
            var reelName = "reel" + this.spriteName;
            var rand = Crafty.math.randomInt(1,3);
            this.addComponent("2D","Canvas",this.spriteName+rand,"SpriteAnimation")
            .reel(reelName+rand,500,0,0,16)
            .reel(reelName+rand,500,0,1,16)
            .reel(reelName+rand,500,0,2,16)

            .animate(reelName+rand,0)
            .bind("AnimationEnd",function(){
                this.destroy();
            });

            // explosion assumes the responsibility of centering on the given location
            // FIXME most of the time?? (see crafty.c bomb ...)
            this.x -= this.w/2;
            this.y -= this.h/2;

            Crafty.audio.play("explosion"+Crafty.math.randomInt(0,1),1,0.5);
        }
    });
}
Crafty.c("Damage",{
    init:function(){
        this.addComponent("2D","Canvas","dmg","Delay");
        this.delay(function(){this.destroy()},100);

    }
});
Crafty.c("Flicker",{
    flicker:true,
    init:function(){
        this.flicker = true;

        this.bind("EnterFrame",function(frame){
            if(frame.frame % 5 == 0 && this.flicker){
                if(this.alpha == 0.0){
                    this.alpha = 1.0;
                }else{
                    this.alpha = 0.0;
                }
            }
            if(!this.flicker){
                this.alpha = 1.0;
            }
        });
    }

});