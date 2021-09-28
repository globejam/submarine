class Launcher {
  constructor(x, y, w, h,angle) {
    var options={isStatic:true};
      this.width=w;
      this.height=h;
      this.image=loadImage("launcher.png");

      this.body=Bodies.rectangle(x, y, this.width, this.height,options);
      Matter.Body.setAngle(this.body, -18);
    
      World.add(world, this.body);
  }

  display(){
      
     
      var pos=this.body.position;
     

      push();
      translate(pos.x, pos.y);
      rotate(-20);
      imageMode(CENTER);
     
      image(this.image,0, 0, this.width, this.height);

      pop();
  }
}