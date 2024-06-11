// Importing Sound Effects
const introMusic = new Audio("./music/introSong.mp3");
const shootingSound = new Audio("./music/shoooting.mp3");
const killEnemySound = new Audio("./music/killEnemy.mp3");
const gameOverSound = new Audio("./music/gameOver.mp3");
const heavyWeaponSound = new Audio("./music/heavyWeapon.mp3");
const hugeWeaponSound = new Audio("./music/hugeWeapon.mp3");


// introMusic.play();
//basic setup
const canvas=document.createElement("canvas");
document.querySelector(".mygame").appendChild(canvas);
canvas.width=innerWidth;
canvas.height=innerHeight;
const context=canvas.getContext("2d");


const lightweapondamage=10;
const heavyweapondamage=25;
const hugeweapondamage=50;
let difficulty=2;
const form=document.querySelector("form");
const scoreBoard=document.querySelector(".scoreBoard");

let playerScore=0;

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
        return(difficulty=7);
    }
    if(userValue === "high"){
        setInterval(spawnEnemy,1000);
        return(difficulty=9);
        
    }
    if(userValue === "insane"){
        setInterval(spawnEnemy,800);
        return(difficulty=11);
        
    }
})

// end screen
const gameOver=()=>{
    //create endscreen dov ,play again button and high score element
    const gameOverBnaner=document.createElement("div");
    const gameOverBtn=document.createElement("button");
    
    const highScore=document.createElement("div");
    
    highScore.innerHTML=`High score:${localStorage.getItem("highScore")
    ?
    localStorage.getItem("highScore")
    :
    playerScore
    }`;

    const oldHighScore= localStorage.getItem("highScore") &&  localStorage.getItem("highScore");
    if(oldHighScore < playerScore){
        localStorage.setItem("highScore",playerScore);
    }
    //upadate high score

    scoreBoard.innerHTML=`Score:${playerScore}`;
    

    //adding text to playagain button
    gameOverBtn.innerText="Play again";
    gameOverBnaner.appendChild(highScore);
    gameOverBnaner.appendChild(gameOverBtn);
   
    gameOverBtn.onclick=()=>{
        window.location.reload();
    }
   gameOverBnaner.classList.add("gameOver");
   document.querySelector("body").appendChild(gameOverBnaner);
}

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
    constructor(x,y,radius,color,velocity,damage){
       this.x=x;
       this.y=y;
       this.radius=radius;
       this.color=color;
       this.velocity=velocity;
       this.damage=damage;
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

//creating Hugeweapon class
class HugeWeapon{
    constructor(x,y){
       this.x=x;
       this.y=y;
       this.color="rgba(49,255,1,1)";
    }
    draw(){
       context.beginPath();
       context.fillStyle=this.color;
      context.fillRect(this.x,this.y,200,canvas.height);
    }
    update(){
        this.draw();
        this.x+=20;
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
//particle
const fraction=0.99;
class Particle{
    constructor(x,y,radius,color,velocity){
       this.x=x;
       this.y=y;
       this.radius=radius;
       this.color=color;
       this.velocity=velocity;
       this.alpha=1;
    
    }
    draw(){
        context.save();
        context.globalAlpha=this.alpha;
       context.beginPath();
       context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
       context.fillStyle=this.color;
       
       context.fill();
       context.restore();
       
    }
    update(){
        this.draw();
        this.velocity.x*=fraction;
        this.velocity.y*=fraction;
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
        this.alpha-=0.01;
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
const particles=[]
const hugeweapons=[]
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


    //update hih score html
    scoreBoard.innerHTML=`Score:${playerScore}`;
    context.fillStyle="rgba(49, 49, 49, 0.3)";
    
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    
newPlayer.draw();

particles.forEach((particle,particleIndex)=>{
    if(particle.alpha <=0){
        particles.splice(particleIndex,1)
    }else{
        particle.update();
    }
   
})

//generating huge weapons 
hugeweapons.forEach((hugeweapon,hugeidx)=>{
    if(hugeweapon.x > canvas.width){
        hugeweapons.splice(hugeidx,1);
    }else{
        hugeweapon.update();
    }
 
})

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
    //stop game when enemy hit the player
    if( distancebetplayerandenemy - newPlayer.radius-enemy.radius < 1){
        cancelAnimationFrame(animationId);
        gameOverSound.play();
        return gameOver();
      }
      hugeweapons.forEach((hugeweapon)=>{
         const distancebetweenhugeweaponandenemy=hugeweapon.x - enemy.x;

         if(distancebetweenhugeweaponandenemy<=200 && distancebetweenhugeweaponandenemy>-200){
          //incresing scoreboard after ckilling one enemy
            playerScore+=10;

          setTimeout(()=>{
            killEnemySound.play();
            enemies.splice(enemyIndex,1);
          },0)
         }
      })
    weapon.forEach((weapons,weaponsIndex)=>{
        const distancebetweenweaponandenemy=Math.hypot(
            weapons.x - enemy.x,
            weapons.y - enemy.y,
        )
      if(distancebetweenweaponandenemy - weapons.radius-enemy.radius < 1){
       
       if(enemy.radius > weapons.damage+5){
        gsap.to(enemy,{
          radius:enemy.radius - weapons.damage,
        })
        setTimeout(()=>{
            weapon.splice(weaponsIndex,1);
        },0)
       }else{
        for(let i=0;i<enemy.radius*5;i++){
            particles.push(
                new Particle(weapons.x, weapons.y,Math.random(),enemy.color,{
                    x:(Math.random()-0.5) * (Math.random()*8),
                    y:(Math.random() -0.5) * (Math.random()*8),
                } )
            )
        }

        playerScore+=10;  //incresing scoreboard after ckilling one enemy

        //rendering playerscore in scoreboard
        scoreBoard.innerHTML=`Score:${playerScore}`;
     
        setTimeout(()=>{
            killEnemySound.play();
            enemies.splice(enemyIndex,1);
            weapon.splice(weaponsIndex,1);
           },0)
       }
      }
    }
)
})

}

//event litener for light weapon upon left click
canvas.addEventListener("click",(ele)=>{
    shootingSound.play();
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
        velocity,
        lightweapondamage
    ));
})
//eventlistener of heavy weapon upon right click
canvas.addEventListener("contextmenu",(ele)=>{
    ele.preventDefault();
    if(playerScore <=0)return;
     heavyWeaponSound.play();
    //decrease playerscore when they use heavyweapon
    playerScore-=5
      //rendering playerscore in scoreboard
      scoreBoard.innerHTML=`Score:${playerScore}`;
    const angle=Math.atan2(
        ele.clientY - canvas.height / 2,
        ele.clientX - canvas.width / 2,
    )
    const velocity={
        x:Math.cos(angle)*4,
        y:Math.sin(angle)*3,
       
    }
    weapon.push(new Weapon(
        canvas.width/2,
        canvas.height/2,
        20,
        "yellow",
        velocity,
        heavyweapondamage
    ));
})


addEventListener("keypress",(e)=>{
    if(e.key===" "){
        if(playerScore < 20)return;

        //decrease playerscore when they use huge weapon
        playerScore-=20
          //rendering playerscore in scoreboard
          scoreBoard.innerHTML=`Score:${playerScore}`;
          hugeWeaponSound.play();
        hugeweapons.push(new HugeWeapon(
            0,0,
        ));
    }

})

addEventListener("contextmenu",(e)=>{
  e.preventDefault();

})
addEventListener("resize",()=>{
    window.location.reload();
})
Animation();



