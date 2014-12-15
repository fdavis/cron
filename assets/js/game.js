//Enable Console log in opera
if(window.opera){ console = {log:window.opera.postError} }
/**
 * This is the Main JS File
 */

$(function(){

    //Init Crafty
    Crafty.init(800,600);
    //going for 30 fps so a slower cpu can keep up *crosses fingers*
    Crafty.timer.FPS(30);
    //Add Canvas Element
    Crafty.canvas.init();
    //Set canvas under interface
    Crafty.canvas._canvas.style.zIndex = '1';
    //play the loading scene
    Crafty.scene("Loading");

    //fixme this may cause a race condition for different .alert divs if we have multiple... ?
    Crafty.bind("ShowText",function(text){
        $('.alert').text(text).show().effect('pulsate','easeInExpo',500)
    });
    Crafty.bind("TempShowText",function(text){
        // infos.alert.text(obj.text).show().effect('pulsate','easeInExpo',500,obj.func);
        $('.alert').text(text).show().effect('pulsate','easeInExpo',500,function(){
            Crafty.trigger("HideText");
        });
    });
    Crafty.bind("HideText",function(){
        $('.alert').text("").hide();
    });
    //Global Event for Game Over
    Crafty.bind("GameOver",function(score){
        Crafty.trigger("ShowText","Game Over!");
        Crafty.audio.stop();
        Crafty.audio.play("gameover",-1);
    });
});

