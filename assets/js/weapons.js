// fireinterval is the number of frames inbetween shots

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
        // .origin("center")
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

// example weapon data
                //     name:"AutoLaser",
                //     canBeFired: true,
                //     isAuto: true,
                //     coolingRate: .5,
                //     heatingRate: 4,
                //     heat: 0,
                //     dmg:1,
                //     speed:25,
                //     speedMax:25,
                //     accel:0,
                //     // cooldownCounter:9,
                //     // fireInterval:9,
                //     fireRate:5,
                //     percent:0,
                //     statBanner:"AutoLaser"
                // },
                // {
                //     name:"MissileLauncher1",
                //     canBeFired: true,
                //     isAuto: false,
                //     dmg:3,
                //     speed:5,
                //     speedMax:20,
                //     accel:0.3,
                //     cooldownCounter:34,
                //     fireInterval:34,
                //     percent:100,
                //     statBanner:"Missile Launcher"
                // },
// Defaults w/ constructors for Weapons
Crafty.c("Weapon",{
    name:"Weapon1", //default is laser1, but should this be required field?
    canBeFired: true,
    isAuto: false,
    dmg:1,
    speed:5,
    speedMax:5,
    accel:0,
    cooldownCounter:30,
    fireInterval:30,
    percent:100,
    cooldownCounter:5,
    fireInterval:5,    
    coolingRate: 1,
    heatingRate: 4,
    statBanner:"Laser",
    Weapon:function(args){
        for (var k in args){
            if (args.hasOwnProperty(k)) {
                this[k] = args[k];
            }
        }
        return this;
    }
});

//Debug stufff
// console.log('stringify json');
// console.log(JSON.stringify([{
//             "AutoLaser":{
//                 canBeFired: true,
//                 isAuto: true,
//                 coolingRate: 1,
//                 heatingRate: 4,
//                 heat: 0,
//                 dmg:1,
//                 speed:25,
//                 speedMax:25,
//                 accel:0,
//                 fireRate:3,
//                 percent:0,
//                 statBanner:"AutoLaser"
//             }
//         },
//         {
//             "MissileLauncher1":{
//                 canBeFired: true,
//                 isAuto: false,
//                 dmg:3,
//                 speed:5,
//                 speedMax:40,
//                 accel:0.6,
//                 cooldownCounter:34,
//                 fireInterval:34,
//                 percent:100,
//                 statBanner:"Missile Launcher"
//             }
//         }
//         ]));

//Failed attempt
// var allTheWeapons = jQuery.parseJSON(
//     '{
//         "Weapon_AutoLaser": {
//             "specs": {
//                 "name": "AutoLaser",
//                 "canBeFired": true,
//                 "isAuto": true,
//                 "coolingRate": 1,
//                 "heatingRate": 4,
//                 "heat": 0,
//                 "dmg": 1,
//                 "speed": 25,
//                 "speedMax": 25,
//                 "accel": 0,
//                 "fireRate": 3,
//                 "percent": 0,
//                 "statBanner": "AutoLaser"
//             }
//         },
//         "Weapon_MissleLauncher": {
//             "specs": {
//                 "name": "MissileLauncher1",
//                 "canBeFired": true,
//                 "isAuto": false,
//                 "dmg": 3,
//                 "speed": 5,
//                 "speedMax": 40,
//                 "accel": 0.6,
//                 "cooldownCounter": 34,
//                 "fireInterval": 34,
//                 "percent": 100,
//                 "statBanner": "Missile Launcher"
//             }
//         }
//     }');
// var weaponsJson = '{
//    "AutoLaser":{
//       "name":"AutoLaser",
//       "canBeFired":true,
//       "isAuto":true,
//       "coolingRate":1,
//       "heatingRate":4,
//       "heat":0,
//       "dmg":1,
//       "speed":25,
//       "speedMax":25,
//       "accel":0,
//       "fireRate":3,
//       "percent":0,
//       "statBanner":"AutoLaser"
//    },
//    "MissileLauncher1":{
//       "name":"MissileLauncher1",
//       "canBeFired":true,
//       "isAuto":false,
//       "dmg":3,
//       "speed":5,
//       "speedMax":40,
//       "accel":0.6,
//       "cooldownCounter":34,
//       "fireInterval":34,
//       "percent":100,
//       "statBanner":"Missile Launcher"
//    }
// }';
// var allTheWeapons = jQuery.parseJSON('{"AutoLaser":{"name":"AutoLaser","canBeFired":true,"isAuto":true,"coolingRate":1,"heatingRate":4,"heat":0,"dmg":1,"speed":25,"speedMax":25,"accel":0,"fireRate":3,"percent":0,"statBanner":"AutoLaser"},"MissileLauncher1":{"name":"MissileLauncher1","canBeFired":true,"isAuto":false,"dmg":3,"speed":5,"speedMax":40,"accel":0.6,"cooldownCounter":34,"fireInterval":34,"percent":100,"statBanner":"Missile Launcher"}}');
// console.log(weaponsJson);
// console.log(weaponsJson.replace(/(\r\n|\n|\r)/gm,""));

// var allTheWeapons = jQuery.parseJSON(weaponsJson.replace(/(\r\n|\n|\r)/gm,""));

// console.log(allTheWeapons);
// // MAKE ALL THE WEAPONS!!!
// for (var k in allTheWeapons){
//     if (allTheWeapons.hasOwnProperty(k)) {
//         this[k] = args[k];
//     }
// }
// for( var i = 0; i < allTheWeapons.length; ++i){
//     console.log(allTheWeapons[i]);
//     Crafty.c(allTheWeapons[i].name,{
//         init:function(){
//             this.addComponent("Weapon")
//             .Weapon(allTheWeapons[i].specs);
//         }
//     });
// }

//REMOVE WHEN AUTOMATION WORKS
// Crafty.c("Weapon_AutoLaser",{
//     init:function(){
//         this.addComponent("Weapon")
//         .Weapon({
//             name:"AutoLaser",
//             canBeFired: true,
//             isAuto: true,
//             coolingRate: 1,
//             heatingRate: 4,
//             heat: 0,
//             dmg:1,
//             speed:25,
//             speedMax:25,
//             accel:0,
//             fireRate:3,
//             percent:0,
//             statBanner:"AutoLaser"
//         });
//     }
// });

// Crafty.c("Weapon_MissleLauncher",{
//     init:function(){
//         this.addComponent("Weapon")
//         .Weapon({
//             name:"MissileLauncher1",
//             canBeFired: true,
//             isAuto: false,
//             dmg:3,
//             speed:5,
//             speedMax:40,
//             accel:0.6,
//             cooldownCounter:34,
//             fireInterval:34,
//             percent:100,
//             statBanner:"Missile Launcher"
//         })
//     }
// });

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
            Crafty.e("RandomExplosion,SplashDamage,Collision")
            .attr({
                x:this.x-this.w*3,//FIXME why do these scalars work????
                y:this.y-this.h*1.3,
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
