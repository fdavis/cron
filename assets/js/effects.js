Crafty.c("RandomExplosion",{
    init:function(){
        var rand = Crafty.math.randomInt(1,3);
        this.addComponent("2D","Canvas","explosion"+rand,"SpriteAnimation")
        .reel("explode1",500,0,0,16)
        .reel("explode2",500,0,1,16)
        .reel("explode3",500,0,2,16)
        
        .animate("explode"+rand,0)
        .bind("AnimationEnd",function(){
            this.destroy();
        });
        

        Crafty.audio.play("explosion"+Crafty.math.randomInt(0,1),1,0.5);
    }
});
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