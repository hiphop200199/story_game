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
let lastTime = 0;
let typewriter;
let wordIndex = 0;
let icon = document.getElementById('icon')

export class Round{
    score = 50;
    profileNums = [1,3,5,6];
    pNum;
    sNum;
    eNum;
    rNum;
    resultSFXs = {
        wonderful:5,
        good:2,
        ok:1,
        normal:0,
        bad:-3
    }
    job;
    name;
    leisure;
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
            icon.src = doc.data().image
            subject.innerText = this.name+"'s day"
          });
         });
    }
    randomGetSituationDescription(sNum){
        switch(sNum){
            case 1:
            case 12:
            db.collection('situation-description').where('situation_num','==',sNum).get().then((querySnapshot) => {
               let length = querySnapshot.size
                let seq = Math.round(Math.random()*(length-1))

               });
        }
    }
    randomGetEvent(sNum){
        switch(sNum){
            case 1:
            case 12:
            db.collection('event').where('situation_num','==',sNum).get().then((querySnapshot) => {
               let length = querySnapshot.size
                let seq = Math.round(Math.random()*(length-1))

               });
        }
    }
    randomGetReact(eNum){
       
            db.collection('react').where('event_num','==',eNum).get().then((querySnapshot) => {
               let length = querySnapshot.size
                let seq = Math.round(Math.random()*(length-1))

               });
        }
        randomGetResult(rNum){
            db.collection('result').where('react_num','==',rNum).get().then((querySnapshot) => {              
                switch(querySnapshot.docs[0].score_operation){
                    case this.resultSFXs.bad:
                        badSFX.play();
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
                this.score+=querySnapshot.docs[0].score_operation
                this.situation++
                });
        }
    calculateScore(){

    }
  
}


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
 // Initialize Cloud Firestore and get a reference to the service
 const db = app.firestore();
 //const round = new Round();
 //round.randomGetSituationDescription(1)