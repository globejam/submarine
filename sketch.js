const Engine=Matter.Engine;
const World=Matter.World;
const Body=Matter.Body;
const Bodies=Matter.Bodies;

let engine;
let world;

var backgroundimg;
var sub;
var subimg;
var wall1;
var wall2;
var wall3;
var wall4;
var hunter;
var hunters=[];
var specialhunter;
var specialhunters=[];
var nhunters=0;
var destroyedhunters=0;
var launcher;
var missile;
var nmissiles=0;
var missiles=[];
var explosionimg;
var gamestate="play";
var angle = 0;
var ship
var torpedo
function preload() {
  backgroundimg=loadImage("sea3.png");
  subimg=loadImage("sub.png");
  explosionimg=loadImage("explosion.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  engine=Engine.create();
  world=engine.world;
//angle = -PI / 4;
  sub=createSprite(190, height-300, 50, 50);
  sub.addImage(subimg);
  sub.scale=0.8;
sub.tint = "lightblue";
  wall1=createSprite(0, height/2, 1, height*2);
  wall2=createSprite(width/2, height/2, 1, height*2);
  wall3=createSprite(width/2, 0, width*2, 1);
  wall4=createSprite(width/2, height, width*2, 1);
  wall1.visible=false;
  wall2.visible=false;
  wall3.visible=false;
  wall4.visible=false;
  launcher=new Launcher(sub.x+50, sub.y-50, 130, 50,angle);
  ship=new Ship(width,230,1000,1000);

  rectMode(CENTER);
  ellipseMode(RADIUS);
}

function draw() {
  Engine.update(engine);

  background(backgroundimg);
  
  if (gamestate=="play") {
    subcontrols();
    createhunters();
    missilehuntercollison();
    subhuntercollision();
    createspecialhunters();
    missilespecialhuntercollision();
    subspecialhuntercollision();
    missilecount();
    huntercount();
    Crash();
    drawSprites();
    ship.display();
    ship.move();
    launcher.display();
    Matter.Body.setPosition(launcher.body, {x:sub.x+44, y:sub.y-50});
    if(ship.body.position.x<0){
      ship.body.position.x = width;
      ship.body.position.y=230
    }
    ship.body.position.y=230
  }
//functions
//controls submarine
function subcontrols() {
  if (keyDown(RIGHT_ARROW)) {
    sub.x+=3.6;
  }
  
  if (keyDown(LEFT_ARROW)) {
    sub.x-=3.6;
  }
  
  if (keyDown(UP_ARROW)) {
    sub.y-=3.6;
  }
  
  if (keyDown(DOWN_ARROW)) {
    sub.y+=3.6;
  }
  

  sub.bounceOff(wall1);
  sub.bounceOff(wall2);
  sub.bounceOff(wall3);
  sub.bounceOff(wall4);
}
//creating mines
function createhunters() {
  if (nhunters<50) {
    if (frameCount%60==0) {
      hunter=new Hunter(width, random(height-300, height), 90, 60);
      hunters.push(hunter);
      nhunters+=1;
    }
  }
  for (let i=0; i<hunters.length; i++) {
    hunters[i].display();
    hunters[i].move();
    if (hunters[i].body.position.x<=10) {
      gamefail();
      gamestate="fail";
    }
  }
}
//creating shieled mines
function createspecialhunters() {
  if (nhunters<50) {
    if (frameCount%300==0) {
      specialhunter=new Specialhunter(width, random(height-300, height), 90, 60);
      specialhunters.push(specialhunter);
      nhunters+=1;
    }
    for (let i=0; i<specialhunters.length; i++) {
      specialhunters[i].display();
      specialhunters[i].move();
      if (specialhunters[i].body.position.x<=10) {
        gamefail();
        gamestate="fail";
      }
    }
  }
}
//checking the amount of missiles
function missilecount() {
  if (nmissiles<66) {
    stroke("black");
    fill("black");
    if (nmissiles>=40) {
      stroke("orange");
      fill("orange");
    }
    if (nmissiles>=50) {
      stroke("red");
      fill("red");
    }
    textSize(20);
    text(65-nmissiles+" missiles left", 15, 30);
  }
  else{
    gamefail();
    gamestate="fail";
  }
}



//checking amout of mines
function huntercount() {
  if (destroyedhunters<50) {
    stroke("red");
    fill("red");
    if (destroyedhunters>=15) {
      stroke("orange");
      fill("orange");
    }
    if (destroyedhunters>=30) {
      stroke("black");
      fill("black");
    }
    textSize(20);
    text(50-destroyedhunters+ " hunters left", 15, 50);
  }
  else {
     gamepass();
     gamestate="pass";
  }
}






//collision detecting missiles and mines
function subhuntercollision() {
  for (let i=0; i<hunters.length; i++) {
    var d1=dist(hunters[i].body.position.x, hunters[i].body.position.y, launcher.body.position.x, launcher.body.position.y);
    var d2=dist(hunters[i].body.position.x, hunters[i].body.position.y, sub.x, sub.y);
    if (d1<=100||d2<=180) {
      nmissiles+=2;
      var explosion=createSprite(hunters[i].body.position.x, hunters[i].body.position.y, 50, 50);
      explosion.addImage(explosionimg);
      explosion.scale=0.4;
      explosion.lifetime=10;
      Matter.World.remove(world, hunters[i].body);
      hunters.splice(i, 1);
      destroyedhunters+=1;
    }
  }
}
//collision detecting missiles and special mines
function subspecialhuntercollision() {
  for (let i=0; i<specialhunters.length; i++) {
    var d1=dist(specialhunters[i].body.position.x, specialhunters[i].body.position.y, launcher.body.position.x, launcher.body.position.y);
    var d2=dist(specialhunters[i].body.position.x, specialhunters[i].body.position.y, sub.x, sub.y);
    if (d1<=100||d2<=180) {
      if (specialhunters[i].shield==true) {
        nmissiles+=4;
      }
      else {
        nmissiles+=2;
      }
      var explosion=createSprite(specialhunters[i].body.position.x, specialhunters[i].body.position.y, 50, 50);
      explosion.addImage(explosionimg);
      explosion.scale=0.4;
      explosion.lifetime=10;
      Matter.World.remove(world, specialhunters[i].body);
      specialhunters.splice(i, 1);
      destroyedhunters+=1;
    }
  }
}
//exploding missiles and special mines
function missilespecialhuntercollision() {
  for(let i=0; i<missiles.length; i++) {
    var loopBreak=false;
    for(let j=0; j<specialhunters.length; j++) {
      var d=dist(missiles[i].body.x, missiles[i].body.y, specialhunters[j].body.x, specialhunters[j].body.y);
      if (missiles.length<=0) {
        loopBreak=true;
        break;
      }
      if (specialhunters[j].shield==true) {
        if (d<150) {
          var explosion=createSprite(missiles[i].body.position.x, missiles[i].body.position.y, 50, 50);
          explosion.addImage(explosionimg);
          explosion.scale=0.4;
          explosion.lifetime=5;
          specialhunters[j].shield=false;
          Matter.World.remove(world, missiles[i].body);
          missiles.splice(i, 1);
        }
      }
      else {
        if (d<120) {
          var explosion=createSprite(specialhunters[j].body.position.x, specialhunters[j].body.position.y, 50, 50);
          explosion.addImage(explosionimg);
          explosion.scale=0.4;
          explosion.lifetime=10;
          Matter.World.remove(world, specialhunters[j].body);
          specialhunters.splice(j, 1);
          destroyedhunters+=1;
          Matter.World.remove(world, missiles[i].body);
          missiles.splice(i, 1);
          if (missiles.length<=0) {
            loopBreak=true;
            break;
          }
        }
      }
    }
    if (loopBreak==true) {
      break;
    }
  }
}
//expolsion with mine
function missilehuntercollison() {
  if (hunters.length>0&&missiles.length>0) {
    var loopBreak=false;
    for (let i=0; i<missiles.length; i++) {
      missiles[i].display();
      for (let j=0; j<hunters.length; j++) {
        var d=dist(missiles[i].body.position.x, missiles[i].body.position.y, hunters[j].body.position.x, hunters[j].body.position.y);
        if (missiles.length<=0) {
          loopBreak=true;
          break;
        }
        if (d<=120) {         
          var explosion=createSprite(hunters[j].body.position.x, hunters[j].body.position.y, 50, 50);
          explosion.addImage(explosionimg);
          explosion.scale=0.4;
          explosion.lifetime=10;         
          Matter.World.remove(world, missiles[i].body);
          missiles.splice(i, 1);
          Matter.World.remove(world, hunters[j].body);
          hunters[j].body=null;
          hunters.splice(j, 1);
          destroyedhunters+=1;
        }
        if (missiles.length<=0) {
          loopBreak=true;
          break;
        }
      }
      if (loopBreak==true) {
        break;
      }
      if (missiles[i].body.position.x>=width||missiles[i].body.position.y>=height||missiles[i].body.position.x<=0||missiles[i].body.position.y<=0) {
        Matter.World.remove(world, missiles[i].body);
        missiles.splice(i, 1);
        if (loopBreak==true) {
          break;
        }
      }
      if (loopBreak==true) {
        break;
      }
    }
  }
}
//when you win
function gamepass() {
  swal(
    {
      title: `You win :)`,
      imageUrl:"sub.png",
      imageSize: "222x222",
      confirmButtonText: 'Play again'
    },
    function (isConfirm) {
      if (isConfirm) {
        location.reload();
        gamestate="play";
      }
    }
  );  
}
//when you loose
function gamefail() {
  swal(
    {
      title: `You lose :(`,
      imageUrl:"mine!.png",
      imageSize: "222x222",
      confirmButtonText: 'Play again'
    },
    function (isConfirm) {
      if (isConfirm) {
        location.reload();
        gamestate="play";
      }
    }
  );
}
//collison between bodies and sprites
function collide(body,sprite,v)
{
  if(body!=null)
        {
         var d = dist(body.x,body.y,sprite.x,sprite.y);
          if(d<=v)
            {
               return true; 
            }
            else{
              return false;
            }
         }
}
//check if the submarine crashes
function Crash(){
  if(collide(hunter,sub,10)== true){
    gamefail();
  }
}
}

//create and launch missile
function keyPressed() {
  if (gamestate=="play"&&missiles.length<1&&hunters.length>0) {
    if (nmissiles<=70) {
      if (keyCode==32) {
        missile=new Missile(sub.x+44, sub.y-50, 100, 30, launcher.body.angle);
        missiles.push(missile);
        nmissiles+=1;
        missile.launch(launcher.angle);
      }
    }
  }
  if (gamestate=="fail") {
    if (keyCode==32) {
      location.reload();
    }
  }
  if (gamestate=="pass") {
    if (keyCode==32) {
      location.reload();
    }
  }
}
