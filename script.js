//變數宣告
const TITLE_SHOWING_SPEED = 200;
const TIME_TO_END_ANIMATION = 4000;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const logoImage = document.getElementById("logo-image");
let logoAnimation;
let letters = document.querySelectorAll(".letter");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
  
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
    },TIME_TO_END_ANIMATION);
}

//標題字母按順序顯示
function graduallyShowTitle(){
    setTimeout(function(){
     for(i=0;i<letters.length;i++){
      letters[i].style.opacity='1';
    }
   },TITLE_SHOWING_SPEED);
  }


const effect = new Effect(canvas.width,canvas.height);
effect.init(ctx);
animate();
cancelAnimationAndShowIndexPage();










    
    
    
    
  
    
    
   
   
   
 

   




  



























