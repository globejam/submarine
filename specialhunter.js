class Specialhunter {
    constructor(x, y, w, h) {
        this.width=w;
        this.height=h;
        this.shield=true;
        this.body=Bodies.rectangle(x, y, this.width, this.height);
        World.add(world, this.body);

        this.image=loadImage("hunter.png");
    }
    display() {
        var pos=this.body.position;
        var angle=this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        image(this.image, 0, 0, this.width, this.height);
        if (this.shield==true) {
            noFill();
            stroke("red");
            strokeWeight(4);
            ellipseMode(RADIUS);
            ellipse(45, 28, this.width-30, this.height-20);
        }
        pop();
    }
    move() {
        Matter.Body.setVelocity(this.body, {x:-5, y:-0.3});
    }
}