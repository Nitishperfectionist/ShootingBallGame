
//basic setup
const canvas=document.createElement("canvas");
document.querySelector(".mygame").appendChild(canvas);
canvas.width=innerWidth;
canvas.height=innerHeight;
const context=canvas.getContext("2d");


let difficulty=2;
const form=document.querySelector("form");
const scoreBoard=document.querySelector(".scoreBoard");


//eventlitener for difficult frame
document.querySelector("input").addEventListener("click",(e)=>{
    e.preventDefault();
                              
    form.style.display="none"; //making form invisible

    scoreBoard.style.display="block"; //making scoreboard visible

    const userValue = document.getElementById("difficulty").value;//gett difficulty selected by user
    if(userValue === "easy"){
      setInterval(spawnEnemy,2000)
      return(difficulty=5);
    }
    if(userValue === "medium"){
        setInterval(spawnEnemy,1500);
        return(difficulty=8);
    }
    if(userValue === "high"){
        setInterval(spawnEnemy,1000);
        return(difficulty=11);
        
    }
    if(userValue === "insane"){
        setInterval(spawnEnemy,800);
        return(difficulty=15);
        
    }
})

//creating players,enemy ,weapon

//setting player position to centre
playerPosition={
    x:canvas.width/2,
    y:canvas.height/2,
}

//creting player class
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
//creating weapon class
class Weapon{
    constructor(x,y,radius,color,velocity){
       this.x=x;
       this.y=y;
       this.radius=radius;
       this.color=color;
       this.velocity=velocity;
    
    }
    draw(){
       context.beginPath();
       context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
       context.fillStyle=this.color;
       
       context.fill();
    }
    update(){
        this.draw();
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
    }
}
//creating enemy class
class Enemy{
    constructor(x,y,radius,color,velocity){
       this.x=x;
       this.y=y;
       this.radius=radius;
       this.color=color;
       this.velocity=velocity;
    
    }
    draw(){
       context.beginPath();
       context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
       context.fillStyle=this.color;
       
       context.fill();
    }
    update(){
        this.draw();
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
    }
}

class Enemy{
    constructor(x,y,radius,color,velocity){
       this.x=x;
       this.y=y;
       this.radius=radius;
       this.color=color;
       this.velocity=velocity;
    
    }
    draw(){
       context.beginPath();
       context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
       context.fillStyle=this.color;
       
       context.fill();
    }
    update(){
        this.draw();
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
    }
}

//main logic statrt from here
//creating player object,weapon array,enemy array

const newPlayer=new Player(
    playerPosition.x,
    playerPosition.y,
    14,
    "white"
);
const weapon=[]
const enemies=[]
//function to spawn enemy at random location
const spawnEnemy=()=>{
    const enemySize=Math.random()*(40-5)+5;//generating random size for enemy
    const enemyColor=`hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`; //random color

    let random;//random is enemy spawn location

    //making enemey location random but from outside screen
    if(Math.random()<0.5){
     random={
        x:Math.random()<0.5 ? canvas.width + enemySize : 0-enemySize,
        y:Math.random()*canvas.height,
     }
    }else{
        random={
            x:Math.random() * canvas.width,
            y:Math.random()<0.5 ? canvas.height + enemySize : 0-enemySize,
           
         }
    }
    const angle=Math.atan2(
        canvas.height / 2 - random.y,
        canvas.width / 2 - random.x
    )
    const velocity={
        x:Math.cos(angle)*difficulty,
        y:Math.sin(angle)*difficulty,
       
    }
    enemies.push(new Enemy(random.x,random.y,enemySize,enemyColor,velocity))
}
let animationId;

function Animation(){
    animationId=requestAnimationFrame(Animation);
    context.fillStyle="rgba(49, 49, 49, 0.3)";
    
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    
newPlayer.draw();

weapon.forEach((weapons,weaponsIndex)=>{
    weapons.update();

    if(weapons.x + weapons.radius < 1 || weapons.y + weapons.radius < 1 || 
        weapons.x - weapons.radius > canvas.width || weapons.y - weapons.radius > canvas.height
    ){
        weapon.splice(weaponsIndex,1);
    }
})
enemies.forEach((enemy,enemyIndex)=>{
    enemy.update();

    const distancebetplayerandenemy=Math.hypot(
        newPlayer.x - enemy.x,
        newPlayer.y - enemy.y,
    )
    if( distancebetplayerandenemy - newPlayer.radius-enemy.radius < 1){
        cancelAnimationFrame(animationId);
      }
    weapon.forEach((weapons,weaponsIndex)=>{
        const distancebetweenweaponandenemy=Math.hypot(
            weapons.x - enemy.x,
            weapons.y - enemy.y,
        )
      if(distancebetweenweaponandenemy - weapons.radius-enemy.radius < 1){
       if(enemy.radius > 18){
        gsap.to(enemy,{
          radius:enemy.radius - 10,
        })
        setTimeout(()=>{
            weapon.splice(weaponsIndex,1);
        },0)
       }else{
        setTimeout(()=>{
            enemies.splice(enemyIndex,1);
            weapon.splice(weaponsIndex,1);
           },0)
       }
      }
    }
)
})

}


canvas.addEventListener("click",(ele)=>{
    const angle=Math.atan2(
        ele.clientY - canvas.height / 2,
        ele.clientX - canvas.width / 2,
    )
    const velocity={
        x:Math.cos(angle)*5,
        y:Math.sin(angle)*6,
       
    }
    weapon.push(new Weapon(
        canvas.width/2,
        canvas.height/2,
        5,
        "white",
        velocity
    ));
})
Animation();



