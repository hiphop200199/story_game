import { BGM,entry,game } from "./general.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyfGwiJCmZ8eZJQ29sonxdiuxYkPI5BGg",
  authDomain: "story-game-d12f3.firebaseapp.com",
  projectId: "story-game-d12f3",
  storageBucket: "story-game-d12f3.firebasestorage.app",
  messagingSenderId: "1046002716405",
  appId: "1:1046002716405:web:1b30842da3df3688f0ffbc"
};
const wonderfulSFX = new Audio('sfx/wonderful.mp3');
const goodSFX = new Audio('sfx/good.mp3');
const okSFX = new Audio('sfx/ok.mp3');
const normalSFX = new Audio('sfx/normal.mp3');
const badSFX = new Audio('sfx/bad.mp3');
const awfulSFX = new Audio('sfx/awful.mp3');
const PROFILE_END_AND_START_LOADING_SITUATION = 10000 
const TIME_BETWEEN = 4000;
const SHOW_REACT = 4000;
const WAIT_TYPING =2000;
const TIME_TO_START_GAME = 2200;
const START_NEXT_SITUATION = 3000;
const APPEND_BUTTONS = 3000;
const SHOW_BUTTONS = 500;
let lastTime = 0;
let timer = 0
let timeMax = 20
let typewriter;
let wordIndex = 0;
let storyString = '';
let events = document.getElementById('events');
let eventBtns = document.querySelectorAll('.event');
let icon = document.getElementById('icon')

export class Round{
    score = 50;
    profileNums = [1,3,5,6];
    pNum;
    sdNum;
    eNum;
    rNum;
    resultSFXs = {
        wonderful:5,
        good:2,
        ok:1,
        normal:0,
        bad:-1,
        awful:-3
    }
    job;
    name;
    leisure;
    characteristic;
    situation = 1;
    constructor(){
      
    }
    resetRoundSetting(){
        this.score = 50
        this.pNum = null
        this.sdNum = null
        this.eNum = null
        this.rNum = null
        this.job = null
        this.name = null
        this.leisure = null
        this.characteristic = null
        this.situation = 1
    }
    randomGetProfile(){
        this.pNum = this.profileNums[Math.round(Math.random()*(this.profileNums.length-1))]
        db.collection('profile').where('seq','==',this.pNum).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            this.name = doc.data().name
            this.job = doc.data().job
            this.leisure = doc.data().leisure
            this.characteristic = doc.data().characteristic
            icon.src = doc.data().image
            BGM.src = doc.data().music
            subject.innerText = this.name+"'s day"
            storyString = `Hi.我是${this.name}，平常是一個${this.job}，大家都說我是一個${this.characteristic}的人🤠，我對${this.leisure}有興趣，如果你也剛好對${this.leisure}有興趣的話那太好了~😄今天也是一個平凡的日子吧,大概🤔，看看今天會碰到哪些事吧🫢`;
            resetTypewritingSetting()
            setTimeout(() => {
                typewriting(0)
            }, TIME_TO_START_GAME);
            setTimeout(() => {
                this.randomGetSituationDescription(this.situation)
            }, PROFILE_END_AND_START_LOADING_SITUATION);
          });
         });
    }
    randomGetSituationDescription(sNum){
        switch(sNum){
            case 13:
            this.getFinal()
            break;
            default:
                db.collection('situation-description').where('situation_num','==',sNum).where('profile_num','==',this.pNum).get().then((querySnapshot) => {
                   
                    
                    let length = querySnapshot.size
                     let seq = Math.round(Math.random()*(length-1))
                     this.sdNum = querySnapshot.docs[seq].data().seq
                  
                     console.log('這次選到的情境是',querySnapshot.docs[seq].data(),'sdNum變成',this.sdNum);
                     content.innerHTML = '';
                     storyString = querySnapshot.docs[seq].data().description
                     resetTypewritingSetting()
                     typewriting(0)
                     let img = document.createElement('img')
                     let br = document.createElement('br')
                     let br2 = document.createElement('br')
                     img.src = querySnapshot.docs[seq].data().image
                    setTimeout(() => {
                        content.append(br,img,br2)
                    }, WAIT_TYPING);
                    /*  let htmlString = `<img src="${querySnapshot.docs[seq].data().image}"/><br>`;
                     content.innerHTML+=htmlString; */
                    
                   /*   resetTypewritingSetting()
                     typewriting(0) */
                     setTimeout(() => {
                        this.randomGetEvent()
                       }, TIME_BETWEEN);
                    });
                break;
        }
    }
    randomGetEvent(){
    
                db.collection('event').where('sd_num','==',this.sdNum).get().then((querySnapshot) => {
                
                   
                    let length = querySnapshot.size
                     let seq = Math.round(Math.random()*(length-1))
                     console.log('這次選到的事件是',querySnapshot.docs[seq].data());
                     this.eNum = querySnapshot.docs[seq].data().seq
                     storyString = querySnapshot.docs[seq].data().description
                     resetTypewritingSetting()
                     typewriting(0)
                     let img = document.createElement('img')
                     let br1 = document.createElement('br')
                     let br2 = document.createElement('br')
                     img.src = querySnapshot.docs[seq].data().image
                     setTimeout(() => {
                        content.append(br1,img,br2)
                    }, WAIT_TYPING);
                  
                    
                    /*  let htmlString = `<img src="${querySnapshot.docs[seq].data().image}"/><br>`;
                     content.innerHTML+=htmlString; */
                    
                   /*   resetTypewritingSetting()
                     typewriting(0) */
                     setTimeout(() => {
                        this.randomGetReact(this.eNum)
                    }, SHOW_REACT);
                    });
          
    }
    randomGetReact(eNum){
       
            db.collection('react').where('event_num','==',eNum).get().then((querySnapshot) => {
           
              
              for(let i=0;i<eventBtns.length;i++){
                eventBtns[i].innerText = querySnapshot.docs[i].data().description 
                eventBtns[i].onclick = ()=>{
                    this.randomGetResult(querySnapshot.docs[i].data().seq)
                }
              }
              events.style.opacity = '1';
               });
        }
        randomGetResult(rNum){
            db.collection('result').where('react_num','==',rNum).get().then((querySnapshot) => {      
                resetTypewritingSetting()
                storyString = querySnapshot.docs[0].data().description
                switch(querySnapshot.docs[0].data().score_operation){
                   case this.resultSFXs.awful:
                        awfulSFX.play();
                        break;
                    case this.resultSFXs.bad:
                        badSFX.play();
                    break;
                    case this.resultSFXs.normal:
                        normalSFX.play();
                    break;
                    case this.resultSFXs.ok:
                        okSFX.play();
                    break;
                    case this.resultSFXs.good:
                        goodSFX.play();
                    break;
                    case this.resultSFXs.wonderful:
                        wonderfulSFX.play();
                    break;
                }
                this.score+=Number(querySnapshot.docs[0].data().score_operation) 
                this.situation++
                events.style.opacity = '0'
                //let htmlString = `<br>~~~~~~~~~~<br>`;
               // content.innerHTML+=htmlString;
                let br1 = document.createElement('br')
                let br2 = document.createElement('br')
                let string = document.createTextNode('~~~~~~~~')
                content.append(br1,string,br2)

                typewriting(0)
                setTimeout(() => {
                    this.randomGetSituationDescription(this.situation)
                }, START_NEXT_SITUATION);
                });
        }
        getFinal(){
            let level;
            if(this.score < 40){
                level = 1;
            }else if(this.score >=40 && this.score <65){
                level = 2;
            }else{
                level = 3;
            }
            db.collection('final').where('level','==',level).get().then((querySnapshot)=>{
              
                
                let length = querySnapshot.size
                let seq = Math.round(Math.random()*(length-1))
                console.log('這次的結局是',querySnapshot.docs[seq].data());
                content.innerHTML = ''
                storyString = querySnapshot.docs[seq].data().description
                let img = document.createElement('img')
                let br1 = document.createElement('br')
                let br2 = document.createElement('br')
                let string = document.createTextNode('噢!你的得分是')
                let strong = document.createElement('strong')
                strong.innerHTML = this.score
                let string2 = document.createTextNode('分唷!')
                resetTypewritingSetting()
                img.src = querySnapshot.docs[seq].data().image
                content.append(string,strong,string2,br1)
                typewriting(0)
                setTimeout(() => {
                    content.append(br2,img)
                }, WAIT_TYPING);
               /*  let htmlString = `<img src="${querySnapshot.docs[seq].data().image}"/><br>`;
                content.innerHTML+=htmlString; */
               
              /*   resetTypewritingSetting()
                typewriting(0) */
              /*   let htmlString = `<img src="${querySnapshot.docs[seq].data().image}"/><br>噢!你的得分是<strong>${this.score}</strong>分唷!<br>`;
                content.innerHTML+=htmlString;
                storyString = querySnapshot.docs[seq].data().description
                resetTypewritingSetting()
                typewriting(0) */
                setTimeout(() => {
                    let buttons = document.createElement('section')
                    buttons.id = 'final-btns'
                    let backToTitle = document.createElement('button')
                    backToTitle.innerText = '回到標題'
                    backToTitle.classList.add('final-btn')
                    backToTitle.addEventListener('click',function () {
                        BGM.pause()
                        entry.style.display = 'block'
                        game.style.display = 'none'
                        content.innerHTML = ''
                      })
                  /*   let leaveGame = document.createElement('button')
                    leaveGame.innerText = '結束遊戲'
                    leaveGame.classList.add('final-btn')
                    leaveGame.addEventListener('click',function(){
                        closeGameDialog.show();
                        closeGameDialog.classList.add('open');
                    }) */
                    buttons.append(backToTitle)
                    content.appendChild(buttons)
                    setTimeout(() => {
                        buttons.classList.add('show')
                    }, SHOW_BUTTONS);
                }, APPEND_BUTTONS);
            })
        }
    
  
}

export function typewriting(timeStamp){
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp
  
    if(timer>=timeMax){
        if(wordIndex == storyString.length){
         
        cancelAnimationFrame(typewriter)
       
    }else{
        content.innerHTML+=storyString[wordIndex]
        wordIndex++
        timer = 0
    }

    }else{
        timer+=deltaTime
    }
    typewriter= requestAnimationFrame(typewriting)
}

function resetTypewritingSetting(){
    wordIndex = 0
    lastTime = 0
    timer = 0
  
}


 


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
 // Initialize Cloud Firestore and get a reference to the service
 const db = app.firestore();
 //const round = new Round();
 //round.randomGetSituationDescription(1)