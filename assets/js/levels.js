/**
 * This file describe different scenes
 */
//Loading Scene
Crafty.scene("Loading",function(){
    var toLoad = [];
    toLoad.push(game_path + "assets/img/loading.jpg", game_path + "assets/img/bg.png");
    for(var i in Crafty.assets){
        toLoad.push(i);
    }
    //Setup background image
    Crafty.background("url("+game_path+"assets/img/loading.jpg) black");
    
    //Select DOM elements
    var bar = $('#load');
    var button = $('.button');
    var text = bar.find('.text');
    
    $('#interface').hide();
    //Setup progressbar
    text.text("Loading ...");

    bar.progressbar({
        value:0
   
    });
    //Bind click event on button
    button.live('click',function(){
        //Start scene level 1
        Crafty.scene("Level1");  
    });
  
    $('.skip').live('click',function(){
        bar.fadeOut(1000,function(){
            button.show();
        });
            
    });
    
    Crafty.load(toLoad,
        function() {
            //Everything is loaded
            bar.fadeOut(1000,function(){
                button.show();
            });
            
        },
        function(e) {
            var src = e.src ||"";
          
            //update progress
            text.text("Loading "+src.substr(src.lastIndexOf('/') + 1).toLowerCase()+" Loaded: "+~~e.percent+"%");
            bar.progressbar({
                value:~~e.percent
            });
       
      
        },
        function(e) {
            //uh oh, error loading
            var src = e.src ||"";
            console.log("Error on loading: "+src.substr(src.lastIndexOf('/') + 1).toLowerCase());
        }
        );
    Crafty.audio.play("intro",-1);
},
//Uninit Scene
function(){
    Crafty.audio.stop();
    //Display loading interface
    $('#loading').hide();
});
function chargeOrReady(perc){
    if (perc == 100){ return 'Ready'}
    return 'Charge'; 
}
//Level 1 Scene
Crafty.scene("Level1",function(){
    //Display interface
    $('#interface').show();
    //Setup background of level
    Crafty.background("url(" + game_path + "/assets/img/bg.png)");
    
    $('.level').text('Level: 1');

    //Get the Interface elements
    var bars = {
        hp:$('#hp'),
        bigWeapon:$('#bigWeapon'),
        weapon:$('#weapon'),
        weapon2:$('#weapon2'),
        weapon3:$('#weapon3'),
        shield:$('#shield')
    };
    bars.hp.addClass('red');
    bars.shield.addClass('blue');
    bars.bigWeapon.addClass('green');
    bars.weapon.addClass('green');
    bars.weapon2.addClass('green');
    bars.weapon3.addClass('green');
    
    var infos = {
        lives: $('.lives'),
        score: $('.score'),
        fps: $('.fps'),
        hp:bars.hp.find('.text'),
        weapon:bars.weapon.find('.text'),
        weapon2:bars.weapon2.find('.text'),
        weapon3:bars.weapon3.find('.text'),
        bigWeapon:bars.bigWeapon.find('.text'),
        shield:bars.shield.find('.text'),
        alert:$('.alert')
    }
    var myFPS = 0;

   
        
        
    var spotEnemys = function(frame){   
        //Spot each 50th Fram one Asteroid
 
        if(frame % 50 == 0 && Crafty("Asteroid").length < 2 && Crafty("SmallAsteroid").length < 8){
            Crafty.e("Asteroid"); 
        }
        
        if(frame % 70 == 0 && Crafty("Kamikaze").length < 1){
            Crafty.e("Kamikaze");   
        }
        if(frame % 80 == 0  && Crafty("Level1").length < 1){
            Crafty.e("Rookie");
        }
        if(frame % 90 == 0  && Crafty("Level2").length < 1){
            Crafty.e("Level2");
        }
    };
    //Create the player
    var player = Crafty.e("Player");
    //Bind Gameloop to the Scene
    Crafty.bind("EnterFrame",function(frame){
        //Trigger Event to display enemies
        spotEnemys(frame.frame);
        //Setup Background position
        Crafty.stage.elem.style.backgroundPosition ="0px "+frame.frame+"px";

        myFPS = fps.getFPS();
        //calculate percents
        player.hp.percent = Math.round(player.hp.current/player.hp.max * 100);
        player.shield.percent = Math.round(player.shield.current/player.shield.max * 100);
        
        player.weapons[0].percent = Math.round(player.weapons[0].cooldownCounter / player.weapons[0].fireInterval * 100);
        player.weapons[1].percent = Math.round(player.weapons[1].cooldownCounter / player.weapons[1].fireInterval * 100);
        player.weapons[2].percent = Math.round(player.weapons[2].cooldownCounter / player.weapons[2].fireInterval * 100);
        player.bigWeapon.percent = Math.round(player.bigWeapon.cooldownCounter / player.bigWeapon.fireInterval * 100);

        //display the values
        infos.weapon.text('Weapon 1 ' + chargeOrReady(player.weapons[0].percent) + ': '+ player.weapons[0].percent + '%');
        infos.weapon2.text('Weapon 2 ' + chargeOrReady(player.weapons[1].percent) + ': '+ player.weapons[1].percent + '%');
        infos.weapon3.text('Weapon 3 ' + chargeOrReady(player.weapons[2].percent) + ': '+ player.weapons[2].percent + '%');
        infos.bigWeapon.text('Bomb ' + chargeOrReady(player.bigWeapon.percent) + ': '+ player.bigWeapon.percent + '%');

        infos.hp.text('HP: ' + player.hp.current + '/' + player.hp.max);
        infos.shield.text('Shield: ' + player.shield.current + '/' + player.shield.max);
        infos.score.text("Score: " + player.score);
        infos.lives.text("Lives: " + player.lives);
        infos.fps.text("FPS: " + myFPS);
        
        //Update progressbars
        bars.weapon.progressbar({
            value:player.weapons[0].percent
        });
        bars.weapon2.progressbar({
            value:player.weapons[1].percent
        });
        bars.weapon3.progressbar({
            value:player.weapons[2].percent
        });
        // selected weapon highlighter
        $("#weaponSlot1").css({"background-image": "url(assets/img/bar_overlay.png)"});

        bars.bigWeapon.progressbar({
            value:player.bigWeapon.percent
        });
        bars.hp.progressbar({
            value:player.hp.percent
        });
        bars.shield.progressbar({
            value:player.shield.percent
        });
    });
    // Tell player to shoot this direction
    Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
            Crafty.trigger("canvasMouseDown", e);
    });
    
    //Bind UpdateStats Event
    Crafty.bind("UpdateStats",function(){
        

    });
    //Bind global Event Show Text
    Crafty.bind("ShowText",function(text){
        infos.alert.text(text).show().effect('pulsate',500)
    });
    Crafty.bind("HideText",function(){
        infos.alert.text("").hide(); 
    });
    //Global Event for Game Over
    Crafty.bind("GameOver",function(score){
        Crafty.trigger("ShowText","Game Over!");
        Crafty.audio.stop();
        Crafty.audio.play("gameover",-1);
            
    });
    //Play background music and repeat
    // Crafty.audio.play("space",-1);
    Crafty.trigger("UpdateStats");
  
});
