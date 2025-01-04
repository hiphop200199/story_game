import { SHOW_REACT, TIME_BETWEEN } from "./general.js";


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
const START_NEXT_SITUATION = 5000;
let lastTime = 0;
let timer = 0
let timeMax = 50
let typewriter;
let wordIndex = 0;
let storyString = '';
let events = document.getElementById('events');
let eventBtns = document.querySelectorAll('.event');
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
        this.randomGetProfile()
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
            subject.innerText = this.name+"'s day"
            storyString = `Hi.我是${this.name}，平常是一個${this.job}，大家都說我是一個${this.characteristic}的人🤠，我對${this.leisure}有興趣，如果你也剛好對${this.leisure}有興趣的話那太好了~😄今天也是一個平凡的日子吧,大概🤔，看看今天會碰到哪些事吧🫢`;
        
          });
         });
    }
    randomGetSituationDescription(sNum){
        switch(sNum){
            case 1:
            case 12:
            db.collection('situation-description').where('situation_num','==',sNum).get().then((querySnapshot) => {
                console.log(querySnapshot);
                
               let length = querySnapshot.size
                let seq = Math.round(Math.random()*(length-1))
                content.innerHTML = '';
                let img = document.createElement('img');
                img.src = querySnapshot.docs[seq].data().image
                let breakline = document.createElement('br')
                content.append(img,breakline)
                storyString = querySnapshot.docs[seq].data().description
                resetTypewritingSetting()
                typewriting(0)
               setTimeout(() => {
                this.randomGetEvent(this.situation)
               }, TIME_BETWEEN);
               });
            break;
            case 13:
            this.getFinal()
            break;
            default:
                db.collection('situation-description').where('situation_num','==',sNum).where('profile_num','==',this.pNum).get().then((querySnapshot) => {
                    console.log(querySnapshot);
                    
                    let length = querySnapshot.size
                     let seq = Math.round(Math.random()*(length-1))
                     this.sdNum = querySnapshot.docs[seq].data().seq
                     content.innerHTML = '';
                     let img = document.createElement('img');
                     img.src = querySnapshot.docs[seq].data().image
                     let breakline = document.createElement('br')
                     content.append(img,breakline)
                     storyString = querySnapshot.docs[seq].data().description
                     resetTypewritingSetting()
                     typewriting(0)
                     setTimeout(() => {
                        this.randomGetEvent(this.situation)
                       }, TIME_BETWEEN);
                    });
                break;
        }
    }
    randomGetEvent(sNum){
        switch(sNum){
            case 1:
            case 12:
            db.collection('event').where('situation_num','==',sNum).get().then((querySnapshot) => {
                console.log(querySnapshot);
                
               let length = querySnapshot.size
                let seq = Math.round(Math.random()*(length-1))
                this.eNum = querySnapshot.docs[seq].data().seq
                let img = document.createElement('img');
                img.src = querySnapshot.docs[seq].data().image
                let breakline = document.createElement('br')
                content.append(breakline,img,breakline)
                storyString = querySnapshot.docs[seq].data().description
                resetTypewritingSetting()
                typewriting(0)
                setTimeout(() => {
                    this.randomGetReact(this.eNum)
                }, SHOW_REACT);
               });
               break;
               default:
                db.collection('event').where('sd_num','==',this.sdNum).where('profile_num','==',this.pNum).get().then((querySnapshot) => {
                   console.log(querySnapshot);
                   
                    let length = querySnapshot.size
                     let seq = Math.round(Math.random()*(length-1))
                     this.eNum =  querySnapshot.docs[seq].data().seq
                     let img = document.createElement('img');
                     img.src = querySnapshot.docs[seq].data().image
                     let breakline = document.createElement('br')
                    content.append(breakline,img,breakline)
                     storyString = querySnapshot.docs[seq].data().description
                     resetTypewritingSetting()
                     typewriting(0)
                     setTimeout(() => {
                        this.randomGetReact(this.eNum)
                    }, SHOW_REACT);
                    });
                break;
        }
    }
    randomGetReact(eNum){
       
            db.collection('react').where('event_num','==',eNum).get().then((querySnapshot) => {
              console.log(querySnapshot.docs[0].data().seq);
              
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
                console.log(querySnapshot.docs[0].data());
                        
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
                this.score+=querySnapshot.docs[0].data().score_operation
                this.situation++
                events.style.opacity = '0'
                let breakline = document.createElement('br')
                let separateString = '~~~~~~~~~~'
                content.append(breakline,separateString,breakline)
                storyString = querySnapshot.docs[0].data().description
                resetTypewritingSetting()
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
            }else if(this.score >=40 && this.score <60){
                level = 2;
            }else{
                level = 3;
            }
            db.collection('final').where('level','==',level).get().then((querySnapshot)=>{
                console.log(querySnapshot);
                
                let length = querySnapshot.size
                let seq = Math.round(Math.random()*(length-1))
                content.innerHTML = ''
                storyString = querySnapshot.docs[seq].data().description
                resetTypewritingSetting()
                typewriting(0)
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