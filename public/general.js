import { Round} from "./round.js";

export let BGM = new Audio();
//export let closeGameDialog = document.getElementById('close-game-dialog');
export let entry = document.getElementById("entry");
export let game = document.getElementById('game');


const TITLE_SHOWING_SPEED = 200;
const TIME_TO_END_ANIMATION = 4000;
const TIME_TO_START_GAME = 2000;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const logoImage = document.getElementById("logo-image");
//const closeGameButton = document.getElementById('close-game-button');
//const closeDialogButton = document.getElementById('close-dialog-button');
//const leftGameButton = document.getElementById('left-game-button');
//const confirm = document.getElementById('confirm');
//const cancel = document.getElementById('cancel');
const gear = document.getElementById('gear');
const backToGame = document.getElementById('back-to-game');
const musicBox = document.getElementById("music-box");
const dingSFX = new Audio('sfx/ding.mp3');


let logoAnimation;
let letters = document.querySelectorAll(".letter");
let start = document.getElementById('start');
let coverImg = document.getElementById('cover-img');
let mouse = document.getElementById('mouse');
let setting = document.getElementById('setting');
let settingMusic = document.getElementById('setting-music');
let settingVolume = document.getElementById('setting-volume');
let settingFontsize = document.getElementById('setting-fontsize');

let round;
let content = document.getElementById('content');
let subject = document.getElementById('subject');



canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
BGM.volume = 0.5;
BGM.loop = true;


window.addEventListener('mousemove',function(e){
    mouse.style.left = e.pageX - 16 + 'px';
    mouse.style.top = e.pageY - 16 + 'px';
})
/* leftGameButton.addEventListener('click',function () {
    closeGameDialog.show();
    closeGameDialog.classList.add('open');
}) */
/* closeGameButton.addEventListener('click',function () {
    closeGameDialog.show();
    closeGameDialog.classList.add('open');
}) */
/* closeDialogButton.addEventListener('click',function () {
    closeGameDialog.classList.remove('open');
    setTimeout(()=>closeGameDialog.close(),500);
  }) */
/* cancel.addEventListener('click',function () {
    closeGameDialog.classList.remove('open');
    setTimeout(()=>closeGameDialog.close(),500);
  }) */
/* confirm.addEventListener('click',function () {
    let page = window.open('','_self');
    console.log(page);
    
    setTimeout(() => {
        page.close();
    }, 1000); 
  
  }) */
start.addEventListener('click',function(){
    dingSFX.pause();
    dingSFX.currentTime = 0;
    dingSFX.play(); 
    round.resetRoundSetting()
   round.randomGetProfile()
    setTimeout(()=>{
        entry.style.display = 'none';
        game.style.display = 'flex';
        BGM.play();
        settingMusic.setAttribute('checked',true)
        settingFontsize.value = 20;
        settingVolume.value = BGM.volume;
        subject.style.left = `calc(50% - ${subject.getBoundingClientRect().width/2}px)`; 
    
    },TIME_TO_START_GAME)
})
gear.addEventListener('click',function(){
    game.style.display = 'none';
    setting.style.display = 'grid';
})
backToGame.addEventListener('click',function () {
    game.style.display = 'flex';
    setting.style.display = 'none';
  })
musicBox.addEventListener('click',function(e){
   settingMusic.toggleAttribute('checked');
    toggleBGM(e);
})
settingVolume.addEventListener('change',function () {
    BGM.volume =  parseFloat(this.value);
})
settingFontsize.addEventListener('change',function () {
    content.style.fontSize = this.value + 'px';
})
//mylogo
//用來生成一個個粒子
class Particle{
    constructor(effect,x,y,color) {
        this.effect=effect;
        this.x=Math.random()*this.effect.width;
        this.y=Math.random()*this.effect.height;
        this.originX =x;
        this.originY=y;
        this.color=color;
        this.size=this.effect.gap;
        this.vx=0;
        this.vy=0;
        this.ease=0.105;
    }
    draw(ctx){
        ctx.fillStyle=this.color;
        ctx.fillRect(this.x,this.y,this.size,this.size);
    }
    update(){
        this.x+=(this.originX - this.x)*this.ease;
        this.y+=(this.originY - this.y)*this.ease;
    }
}
//用來一次同時操作所有粒子而形成效果
class Effect{
    constructor(width,height) {
        this.width=width;
        this.height=height;
        this.image = logoImage;
        this.particleArray=[];
        this.centerX = this.width * 0.5;
        this.centerY = this.height * 0.5;
        this.gap = 1;
        this.x = this.centerX - this.image.width*0.25;
        this.y = this.centerY - this.image.height*0.25;
    }
    init(ctx){
        ctx.drawImage(this.image,this.x,this.y,this.image.width*0.5,this.image.height*0.5);
        const pixels = ctx.getImageData(0,0,this.width,this.height).data;
        for(let y=0;y<this.height;y+=this.gap){
            for(let x=0;x<this.width;x+=this.gap){
                const index = (y*this.width+x)*4;
                const red = pixels[index];
                const green = pixels[index+1];
                const blue = pixels[index+2];
                const alpha = pixels[index+3];
                const color = 'rgb('+red+','+green+','+blue+')';
                if(alpha>0)this.particleArray.push(new Particle(effect,x,y,color));      
            }
        }
    }
    draw(ctx){
        this.particleArray.forEach(particle => particle.draw(ctx));
       
    }
    update(){
        this.particleArray.forEach(particle => particle.update());
    }
}

//運作開頭logo動畫
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    effect.draw(ctx);
    effect.update();
    logoAnimation = requestAnimationFrame(animate);
}

function cancelAnimationAndShowIndexPage(){
    setTimeout(function(){
        cancelAnimationFrame(logoAnimation);
        canvas.style.display='none';
      graduallyShowTitle()
      start.classList.add('in');
      coverImg.classList.add('in');
    },TIME_TO_END_ANIMATION);
}

//標題字母按順序顯示
function graduallyShowTitle(){
    setTimeout(function(){
     for(let i=0;i<letters.length;i++){
      letters[i].style.opacity='1';
    }
   },TITLE_SHOWING_SPEED);
  }

//用按鈕讓使用者控制音樂播放
function toggleBGM(event){
    if (event.cancelable) event.preventDefault();
    BGM.paused?BGM.play():BGM.pause();
}



const effect = new Effect(canvas.width,canvas.height);
effect.init(ctx);
animate();
cancelAnimationAndShowIndexPage();
round = new Round()









    
    
    
    
  
    
    
   
   
   
 

   




  



























