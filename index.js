const canvas=document.createElement("canvas");
document.querySelector(".mygame").appendChild(canvas);
canvas.width=innerWidth;
canvas.height=innerHeight;
const context=canvas.getContext("2d");

playerPosition={
    x:canvas.width/2,
    y:canvas.height/2,
}

class Player{
     constructor(x,y,radius,color){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
     
     }
     draw(){
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        context.fillStyle=this.color;
        
        context.fill();
     }
}
//weapon
class Weapon{
    constructor(x,y,radius,color){
       this.x=x;
       this.y=y;
       this.radius=radius;
       this.color=color;
    
    }
    draw(){
       context.beginPath();
       context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
       context.fillStyle=this.color;
       
       context.fill();
    }
}
//player
const newPlayer=new Player(
    playerPosition.x,
    playerPosition.y,
    8,
    `rgb(${Math.random()*250},${Math.random()*250},${Math.random()*250})`
);
const weapon=[]
function Animation(){
    requestAnimationFrame(Animation);
    
newPlayer.draw();

weapon.forEach((el)=>{
    el.draw();
})
}
canvas.addEventListener("click",(ele)=>{
    weapon.push(new Weapon(
        ele.clientX,
        ele.clientY,
        8,
        `rgb(${Math.random()*250},${Math.random()*250},${Math.random()*250})`
    ));
})
Animation();

//bullet

