/**
 * This file describe different scenes
 */

// object for all the levelData
levelData = {
    level1: {
        name: "Level 1",
        money: 50,
        enemies: {
            Asteroid: {
                max: 3,
                freq: 90,
            },
            Kamikaze: {
                max: 1,
                freq: 120,
            },
            Level1: {
                max: 1,
                freq: 60,
            },
            Level2: {
                max: 3,
                freq: 180,
            },
        },
        goals: {
            score: 500,
        },
    },
    level2: {
        name: "Level Two",
        money: 75,
        enemies: {
            Asteroid: {
                max: 6,
                freq: 30,
            },
            Kamikaze: {
                max: 4,
                freq: 40,
                attrs: {
                    yspeed: 10,
                },
            },
            Level1: {
                max: 3,
                freq: 50,
                attrs: {
                    shotFreq: 10,
                },
            },
            Level2: {
                max: 7,
                freq: 20,
                attrs: {
                    shotFreq: 5,
                },
            },
        },
        goals: {
            score: 1000,
        },
    }
};


//Loading Scene
Crafty.scene("Loading",function(){
    var toLoad = [];
    toLoad.push(game_path + "assets/img/loading.jpg", game_path + "assets/img/bg.png");
    for(var i in Crafty.assets){
        toLoad.push(i);
    }
    //Setup background image
    Crafty.background("url("+game_path+"assets/img/loading.jpg) black");

    // ripped from crafty, need to modify so autopause happens but does not unpause if I paused...
    // Crafty.addEvent(this, window, "blur", function () {
    //     if (Crafty.settings.get("autoPause")) {
    //         if (!Crafty._paused) Crafty.pause();
    //     }
    // });
    // Crafty.addEvent(this, window, "focus", function () {
    //     if (Crafty._paused && Crafty.settings.get("autoPause")) {
    //         Crafty.pause();
    //     }
    // });

    //Select DOM elements
    var bar = $('#load');
    var button = $('#launchButton');
    var text = bar.find('.text');

    //Fixme do all UI mods/binds/inits here or else where?
    $('#closeSettings').click(function(){
        Crafty.pause(false);
        $('#settingsDiv').hide();
    });
    $('.settings.button').click(function(){
        Crafty.pause(true);
        $('#settingsDiv').show();
    })
    .mouseover(function(){
        model.playerMouseOver();
    })
    .mouseout(function(){
        model.playerMouseOut();
    });
    // $('#restartSettings').click(function(){
    //     Crafty.pause(false);
    //     $('#settingsDiv').hide();
    //     Crafty.scene("Level");
    // });
    $('#levelMenuButton').click(function(){
        Crafty.scene('LevelSelector');
    });
    $('#loadoutMenuButton').click(function(){
        Crafty.scene('LoadoutSelector');
    });
    $('#mainMenuSettings').click(function(){
        Crafty.pause(false);
        $('#settingsDiv').hide();
        Crafty.scene('MainMenu');
    });

    $('#interface').hide();
    $('#settingsDiv').hide();
    $('#mainMenuDiv').hide();
    $('#levelSelectionDiv').hide();
    //Setup progressbar
    text.text("Loading ...");

    bar.progressbar({
        value:0

    });
    //Bind click event on button
    button.live('click',function(){
        //goto main menu
        Crafty.scene("MainMenu");
    });

    $('.skip').live('click',function(){
        bar.fadeOut(1000,function(){
            button.show();
        });

    });

    model = Crafty.e("Model");

    Crafty.load(toLoad,
        function() {
            bar.fadeOut(1000, function(){
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
    //should keep playing into MainMenu Crafty.audio.stop();
    //Display loading interface
    $('#loading').hide();
});

Crafty.scene("MainMenu",
    //setup main menu
    function(){
        $('#mainMenuDiv').show();
        $('#startButton').click(function(){
            Crafty.scene('Level', levelData['level1']);
        });
        $('.settings.button').click(function(){
            Crafty.pause(true);
            $('#settingsDiv').show();
        })
        .mouseover(function(){
            model.playerMouseOver();
        })
        .mouseout(function(){
            model.playerMouseOut();
        });
    },

    //deinit mainmenu
    function(){
        $('#mainMenuDiv').hide();
    }
);

Crafty.scene("LevelSelector",
    //setup main menu
    function(){
        $('#levelSelectionDiv').show();
        // going to fill it programatically
        var myDiv = $('#levelButtonDiv').empty();
        var myKeys = Object.keys(levelData);
        // FIXME this will need to be available levels at some point, not all levels
        for(var i = 0; i < myKeys.length; ++i){
            myDiv.append('<p><input type="button" id="' + myKeys[i] + 'Button" value="' + levelData[myKeys[i]].name + '"/></p>');
            // add closure around click function i so the click function gets the value from the current iteration of the loop every loop
            (function(i){
                $('#' + myKeys[i] + 'Button').click(function(){
                    var myi = i + 0;
                    Crafty.scene('Level', levelData[myKeys[myi]]);
                }); 
            })(i);
        }
    },

    //deinit mainmenu
    function(){
        $('#levelSelectionDiv').hide();
    }
);

Crafty.scene("LoadoutSelector",
    //setup loadout menu
    function(){
        // get the backend obj
        var loadout = Crafty.e('Loadout');

        $('#loadoutSelectionDiv').show();

        // should only be populated after player ship changes, ie on load, or equip ship
        var myStoreDiv = $('#loadoutTypeSelectButtonDiv').empty();

        // setup store purchase buttons
        myStoreDiv.append('<p><input type="button" id="typeSelectButton1" value="Select Weapon Slot 1"/></p>');
        $('#typeSelectButton1').click(function(){
            console.log('select weapon slot 1');
            Crafty.trigger("ItemUpdate",{type:'weapons',position:0});
        });
        myStoreDiv.append('<p><input type="button" id="typeSelectButton2" value="Select Weapon Slot 2"/></p>');
        $('#typeSelectButton2').click(function(){
            console.log('select weapon slot 2');
            Crafty.trigger("ItemUpdate",{type:'weapons',position:1});
        });
        myStoreDiv.append('<p><input type="button" id="typeSelectButton3" value="Select Weapon Slot 3"/></p>');
        $('#typeSelectButton3').click(function(){
            console.log('select weapon slot 3');
            Crafty.trigger("ItemUpdate",{type:'weapons',position:2});
        });
        myStoreDiv.append('<p><input type="button" id="typeSelectButton4" value="Select Big Weapon"/></p>');
        $('#typeSelectButton4').click(function(){
            console.log('select bigweaopn');
            Crafty.trigger("ItemUpdate",{type:'bigWeapons'});
        });

        // should be used to display info and things... probably doesn't need auto gen html
        // just comeup with a layout and change text/highlights on the fly
        var myRolloverDiv = $('#loadoutDisplayDiv').empty();
        // show me the money
        myRolloverDiv.append('<p id="theMoney"></p>');
        $('#theMoney').text("Money:" + model.getMoney());

        //Bind ItemUpdate Event
        Crafty.bind("ItemUpdate",function(data){
            // FIXME this will need to do a lot more ...
            // like sorts, select the type, and a all the loadout UI things and such
            var myStoreDiv = $('#loadoutStoreButtonDiv').empty();
            var type = data.type;
            var position = data.position;
            var myStoreItems = loadout.getStoreInventory(type);
            var storeItemKeys = Object.keys(myStoreItems);

            // setup store purchase buttons
            for(var i = 0; i < storeItemKeys.length; ++i){
                myStoreDiv.append('<p><input type="button" id="loadoutStoreButton' + i + '" value="Purchase '
                    + myStoreItems[storeItemKeys[i]].name + '"/></p>');
                // add closure around click function i so the click function gets the value from the current iteration of the loop every loop
                (function(i){
                    $('#loadoutStoreButton' + i).click(function(){
                        loadout.purchase(type,storeItemKeys[i],position);
                    });
                })(i);
            }

            // setup inventory equip buttons
            var invDiv = $('#loadoutInvButtonDiv').empty();
            var myItems = model.getInventory(type);
            for(var i = 0; i < myItems.length; ++i){
                invDiv.append('<p><input type="button" id="loadoutInvButton' + i + '" value="Equip '
                    + myItems[i].name + '"/></p>');
                // add closure around click function i so the click function gets the value from the current iteration of the loop every loop
                (function(i){
                    $('#loadoutInvButton' + i).click(function(){
                        loadout.equipItem(type,i,position);
                    });
                })(i);
            }

        });
        Crafty.trigger("ItemUpdate",{type:'weapons',position:1});

    },

    //deinit loadout menu
    function(){
        $('#loadoutSelectionDiv').hide();
    }
);

//Level 1 Scene
Crafty.scene("Level",function(myData){
    //Display interface
    $('#interface').show();
    //Setup background of level
    Crafty.background("url(" + game_path + "/assets/img/bg.png)");

    $('.level').text('Level: 1');

    //Get the Interface elements
    var bars = {
        hp:$('#hp'),
        bigWeapon:$('#bigWeapon'),
        weapon:[$('#weapon'),
        $('#weapon2'),
        $('#weapon3')],
        shield:$('#shield')
    };
    bars.hp.addClass('red');
    bars.shield.addClass('blue');
    bars.bigWeapon.addClass('green');
    bars.weapon[0].addClass('green');
    bars.weapon[1].addClass('green');
    bars.weapon[2].addClass('green');

    var infos = {
        lives: $('.lives'),
        score: $('.score'),
        money: $('.money'),
        fps: $('.fps'),
        hp:bars.hp.find('.text'),
        weapon:[bars.weapon[0].find('.text'),
        bars.weapon[1].find('.text'),
        bars.weapon[2].find('.text')],
        bigWeapon:bars.bigWeapon.find('.text'),
        shield:bars.shield.find('.text'),
        alert:$('.alert')
    }
    var myFPS = 0;

    var spotEnemys = function(frame, enemies){
        keys = Object.keys(enemies);
        for(var x = 0; x < keys.length; ++x){
            if(frame % enemies[keys[x]].freq == 0 && Crafty(keys[x]).length < enemies[keys[x]].max){
                var tmp = Crafty.e(keys[x]);
                tmp.attr(enemies[keys[x]].attrs);
            }
        }
    };
    //Create the player
    var player = Crafty.e("Player").Player(model.getPlayer());
    //Bind Gameloop to the Scene
    this.bind("EnterFrame",function(frame){
        //Trigger Event to display enemies
        if(!player.preparing) spotEnemys(frame.frame, myData.enemies);
        //Setup Background position
        Crafty.stage.elem.style.backgroundPosition ="0px "+frame.frame+"px";

        myFPS = fps.getFPS();
        //calculate percents
        player.hp.percent = Math.round(player.hp.current/player.hp.max * 100);
        player.shield.percent = Math.round(player.shield.current/player.shield.max * 100);

        for(var i = 0; i < player.maxWeapon; ++i){
            // update the text of the weapon status bar
            // FIXME after data binding this should work a lot cleaner and allow for more modifications easier
            if (false == player.weapons[i].isAuto){
                player.weapons[i].percent = Math.round(player.weapons[i].cooldownCounter / player.weapons[i].fireInterval * 100);
                infos.weapon[i].text(
                    player.weapons[i].name + " " +
                    (
                        player.weapons[i].has("BallisticWeapon")? "(" + player.weapons[i].ammo + ") " :
                        (player.weapons[i].percent >= 100 ? "Ready" : "Charge")
                        )
                    );
            } else{
                player.weapons[i].percent = Math.round(player.weapons[i].heat);
                infos.weapon[i].text(
                    player.weapons[i].name + " " +
                    (
                        player.weapons[i].has("BallisticWeapon")? "(" + player.weapons[i].ammo + ") " :
                        (player.weapons[i].percent >= 100 ? "Cooling" : "Ready")
                        )
                    );
            }
            // update the progress fill in
            bars.weapon[i].progressbar({ value:player.weapons[i].percent });
            // update the select highlighter
            if( player.currentWeapon == i ){
                $("#weaponSlot" + (i + 1)).css({"background-image": "url(assets/img/bar_overlay.png)"});
            } else {
                $("#weaponSlot" + (i + 1)).css({"background-image": "none"});
            }
        }
        player.bigWeapon.percent = Math.round(player.bigWeapon.cooldownCounter / player.bigWeapon.fireInterval * 100);
        infos.bigWeapon.text(
            player.bigWeapon.name + " " +
            (
                player.bigWeapon.has("BallisticWeapon")? "(" + player.bigWeapon.ammo + ") " :
                (player.bigWeapon.percent >= 100 ? "Cooling" : "Ready")
                )
            );

        infos.hp.text('Hull: ' + player.hp.current + '/' + player.hp.max);
        infos.shield.text('Shield: ' + player.shield.current + '/' + player.shield.max);
        infos.score.text("Score: " + model.getScore());
        infos.money.text("Money: " + model.getMoney());
        infos.lives.text("Lives: " + player.lives);
        infos.fps.text("FPS: " + myFPS);

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
    //FIXME do these need to be cleaned up when the scene finishes?
    // Tell player to shoot this direction
    Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
        // not sure how to avoid crafty.stage.elem from receiving mousedown event when player clicks on settings button
        // so when mouseover on settings (or another button in the game scene) we disable this input via the model
        if(model.hasPlayerFocus()) {
            Crafty('Player').trigger("canvasMouseDown", e);
        }
    });
    // Also when we are not firing (auto fire weapons leave player 'firing' until this event)
    Crafty.addEvent(this, Crafty.stage.elem, "mouseup", function(e) {
        Crafty('Player').trigger("canvasMouseUp", e);
    });

    //Bind UpdateStats Event
    Crafty.bind("UpdateStats",function(){

    });

    //Bind global Event Show Text easeInExpo chosen because I'm trying to get more time where the text is there so its more readable
    
    //Play background music and repeat
    // Crafty.audio.play("space",-1);
    // Crafty.trigger("UpdateStats");

    // deinit Level scene
}, function(){
    // Crafty.unbind('ShowText');
    // Crafty.unbind('TempShowText');
    // Crafty.unbind('HideText');
    // Crafty.unbind('GameOver');
    Crafty.unbind('mousedown');
    Crafty.unbind('mouseup');
    Crafty.unbind('EnterFrame');
});

