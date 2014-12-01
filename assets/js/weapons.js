// fireinterval is the number of frames inbetween shots

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
    hasAmmo:false,
    ammo:10,
    statBanner:"Laser",
    Weapon:function(args){
        for (var k in args){
            if (args.hasOwnProperty(k)) {
                this[k] = args[k];
            }
        }
        if(this.hasAmmo) this.requires("BallisticWeapon");
        return this;
    }
});

Crafty.c("BallisticWeapon",{
    init:function(){
        this.requires("Weapon");
    },
    load:function(bullets){
        this.ammo += bullets;
    },
    shot:function(){
        --this.ammo;
    }
});

// Container for all the weapon datas
var allTheWeapons = {
    AutoLaser:{
        name:"AutoLaser",
        canBeFired: true,
        isAuto: true,
        coolingRate: 1,
        heatingRate: 4,
        heat: 0,
        dmg:1,
        speed:25,
        speedMax:25,
        accel:0,
        fireRate:5,
        percent:0,
        statBanner:"AutoLaser"
    },
    MissileLauncher1:{
        name:"MissileLauncher1",
        canBeFired: true,
        isAuto: false,
        dmg:3,
        speed:5,
        speedMax:20,
        accel:0.3,
        cooldownCounter:34,
        fireInterval:34,
        percent:100,
        hasAmmo:true,
        ammo:10,
        statBanner:"Missile Launcher"
    },
    Laser_Wave:{
        name:"Laser_Wave",
        canBeFired: true,
        isAuto: false,
        dmg:2,
        speed:19,
        speedMax:19,
        bullletCollision:false,
        accel:0,
        cooldownCounter:22,
        fireInterval:22,
        percent:100,
        statBanner:"Laser Wave"
    },
    Laser1:{
        name:"Weapon1",
        canBeFired: true,
        isAuto: false,
        dmg:1,
        speed:15,
        speedMax:15,
        bulletCollision:true,
        accel:0,
        cooldownCounter:7,
        fireInterval:7,
        percent:100,
        statBanner:"Laser"
   },
   Bomb:{
        name:"Bomb",
        canBeFired: true,
        isAuto: false,
        dmg:10,
        speed:2,
        speedMax:2,
        accel:0,
        cooldownCounter:120,
        fireInterval:120,
        hasAmmo:true,
        ammo:50,
        percent:100,
        statBanner:"Bomb"
   }
}