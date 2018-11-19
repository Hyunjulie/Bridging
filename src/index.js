import {KNNImageClassifier} from 'deeplearn-knn-image-classifier';
import * as dl from 'deeplearn';

// Webcam Image size. Must be 227. 
const IMAGE_SIZE = 227;
const IMAGE_HEIGHT = 227;
const IMAGE_WIDTH = 227;
// K value for KNN
const TOPK = 10;

const predictionThreshold = 0.98

var words = ["클로바", "안녕", "어때?"]
// var words = ["alexa", "hello", "what is", "the weather", "the time",
//"add","eggs","to the list","five","feet","in meters","tell me","a joke", "bye", "other"]


// words from above array which act as terminal words in a sentence
var endWords = ["안녕"]

class LaunchModal {
  constructor(){
  	// x 를 누루면 modal 없어지게 하기
    this.modalWindow = document.getElementById('launchModal')
    this.closeBtn = document.getElementById('close-modal')
    this.closeBtn.addEventListener('click', (e) => {
      this.modalWindow.style.display = "none"
    })
    // 백그라운드 눌러도 modal 없어지게 하기
    window.addEventListener('click', (e) => {
      if(e.target == this.modalWindow){
        this.modalWindow.style.display = "none"
      }
    })
    this.modalWindow.style.display = "block"
    this.modalWindow.style.zIndex = 500
  }
}

class Main {
  constructor(){
    // variable 정의하
    this.infoTexts = [];
    this.training = -1; // -1 when no class is being trained
    this.videoPlaying = false;

    this.previousPrediction = -1
    this.currentPredictedWords = []

    // variables to restrict prediction rate
    this.now;
    this.then = Date.now()
    this.startTime = this.then;
    this.fps = 5; // 1초에 몇 frame? 
    this.fpsInterval = 1000/(this.fps); 
    this.elapsed = 0;

    this.trainingListDiv = document.getElementById("training-list")
    this.exampleListDiv = document.getElementById("example-list")
    
    this.knn = null

    this.textLine = document.getElementById("text")
    
    // Get video element that will contain the webcam image
    this.video = document.getElementById('video');

    this.addWordForm = document.getElementById("add-word")

    this.statusText = document.getElementById("status-text")

    this.video.addEventListener('mousedown', () => {
      // click on video to go back to training buttons
      main.pausePredicting();
      this.trainingListDiv.style.display = "block"
    })

    // add word to training example set
    this.addWordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let word = document.getElementById("new-word").value.trim().toLowerCase();
      let checkbox = document.getElementById("is-terminal-word")

      if(word && !words.includes(word)){
      	// 맺는말이 아니면 : 단어 array 의 뒤에서 2번째에 더하기
        words.splice(words.length-1,0,word) 
        this.createButtonList(false)
        this.updateExampleCount()

        //맺는 말이라면 단어 array 의 뒤에 더하기 --> push 
        if(checkbox.checked){
          endWords.push(word)
        }

        document.getElementById("new-word").value = ''
        checkbox.checked = false;

      } else {
        alert("벌써 입력한 단어거나 단어를 입력하지 않았습니다.")
      }
      return
    })

    // show modal window
    let modal = new LaunchModal()

    //단어 개수 업데이트 하기
    this.updateExampleCount()

    document.getElementById("status").style.display = "none"

    this.createTrainingBtn()
    
    this.createButtonList(false)
    
    // load text to speech
    this.tts = new TextToSpeech()
  }

  createPredictBtn(){
    var div = document.getElementById("action-btn")
    div.innerHTML = ""
    const predButton = document.createElement('button')

    predButton.innerText = "예측하기 >>>"
    div.appendChild(predButton);

    predButton.addEventListener('mousedown', () => {
      console.log("start predicting")
      const exampleCount = this.knn.getClassExampleCount()

      // check if training has been done
      if(Math.max(...exampleCount) > 0){

        // 호출어의 예시가 있는지 확인하기
        if(exampleCount[0] == 0){
          alert(
            `호출어 (클로바)의 예시를 추가하지 않았습니다. 예시를 추가해주세요.`
            )
          return
        }

        // if the catchall phrase other hasnt been trained
        if(exampleCount[words.length-1] == 0){
          alert(
            `[그 외]의 예시를 추가하지 않았습니다. 두 손을 내리고 쉬고있는 자세의 예시를 추가해주세요`)
          return
        }

        // check if atleast one terminal word has been trained
        if(!this.areTerminalWordsTrained(exampleCount)){
          alert(
            ` 맺음말의 예시를 추가하지 않았습니다. 맺음말: ${endWords} 의 예시를 추가해주세`
            )
          return
        }

        //단어가 있는 div 안보이게 하기 
        this.trainingListDiv.style.display = "none"
        this.textLine.classList.remove("intro-steps")
        this.textLine.innerText = "무엇을 도와드릴까요?"
        this.startPredicting()
      } else {
        alert(
          `단어의 예시를 더하지 않았습니다. 각 단어별로 [예시 더하기] 버튼을 누른 상태로 예시를 더해주세요.`
          )
      }
    })
  }

  createTrainingBtn(){
    var div = document.getElementById("action-btn")
    div.innerHTML = ""

    const trainButton = document.createElement('button')
    trainButton.innerText = "학습시키기 >>"
    div.appendChild(trainButton);


    trainButton.addEventListener('mousedown', () => {

      // check if user has added atleast one terminal word
      if(words.length > 3 && endWords.length == 1){
        console.log('no terminal word added')
        alert('맺음말을 더하지 않았습니다. \n 맺음말을 더해서 문장이 언제 끝나는지 알려주세요.')
        return
      }

      if(words.length == 3 && endWords.length ==1){
        var proceed = confirm("다른 단어를 더하지 않았습니다. 지금 할 수 있는 명령은 클로바 어때? 밖에 없습니다. \n 단어를 더 더해서 다양한 명령을 만들어 보세요 :) ")

        if(!proceed) return
      }

      this.startWebcam()

      console.log("ready to train")
      this.createButtonList(true)
      this.addWordForm.innerHTML = ''
      let p = document.createElement('p')
      p.innerText = ` 각 단어 옆에있는 [예시 더하기] 버튼을 누른 상태로 단어에 해당하는 모션을 여러번 취해주세요. 각 단어당 적어도 30개 이상의 예시를 만들어주세요! \n [그 외] 단어에는 두 손을 내리고 편하게 
      쉬고있는 자세를 취해주세요.`
      this.addWordForm.appendChild(p)
      
      this.loadKNN()

      this.createPredictBtn()

      this.textLine.innerText = "2 단계: 학습시키기"

      let subtext = document.createElement('span')
      subtext.innerHTML = "<br/>단어와 모션을 연결할 시간입니다!" 
      subtext.classList.add('subtext')
      this.textLine.appendChild(subtext)
    })
  }

  areTerminalWordsTrained(exampleCount){
    var totalTerminalWordsTrained = 0
    for(var i=0;i<words.length;i++){
      if(endWords.includes(words[i])){
        if(exampleCount[i] > 0){
          totalTerminalWordsTrained+=1
        }
      }
    }
    return totalTerminalWordsTrained
  }

  startWebcam(){
    // Setup webcam
    navigator.mediaDevices.getUserMedia({video: {facingMode: 'user'}, audio: false})
    .then((stream) => {
      this.video.srcObject = stream;
      this.video.width = IMAGE_WIDTH;
      this.video.height = IMAGE_HEIGHT;

      this.video.addEventListener('playing', ()=> this.videoPlaying = true);
      this.video.addEventListener('paused', ()=> this.videoPlaying = false);
    })
  }

  loadKNN(){
    this.knn = new KNNImageClassifier(words.length, TOPK);
    // Load knn model
    this.knn.load()
    .then(() => this.startTraining()); 
  }

  updateExampleCount(){
    var p = document.getElementById('count')
    p.innerText = `입력 단어: ${words.length} 개`
  }

  createButtonList(showBtn){
    //true: 예시 더하기 버튼을 나타낸다

    // Clear List
    this.exampleListDiv.innerHTML = ""

    // 각 단어별로 예시 더하기 버튼을 만들기    
    for(let i=0;i<words.length; i++){
      this.createButton(i, showBtn)
    }
  }

  createButton(i, showBtn){
    const div = document.createElement('div');
    this.exampleListDiv.appendChild(div);
    div.style.marginBottom = '10px';
    
    // Create Word Text
    const wordText = document.createElement('span')

    if(i==0 && !showBtn){
      wordText.innerText = words[i].toUpperCase()+" (호출어) "
    } else if(i==words.length-1 && !showBtn){
      wordText.innerText = words[i].toUpperCase()+" (그 외) "
    } else {
      wordText.innerText = words[i].toUpperCase()+" "
      wordText.style.fontWeight = "bold"
    }
    
    div.appendChild(wordText);

    if(showBtn){
      // 예시 더하기 버튼 만들기 
      const button = document.createElement('button')
      button.innerText = "예시 더하기"//"Train " + words[i].toUpperCase()
      div.appendChild(button);

      // Listen for mouse events when clicking the button
      button.addEventListener('mousedown', () => this.training = i);
      button.addEventListener('mouseup', () => this.training = -1);

      // Create clear button to emove training examples
      const btn = document.createElement('button')
      btn.innerText = "예시 지우기"//`Clear ${words[i].toUpperCase()}`
      div.appendChild(btn);

      btn.addEventListener('mousedown', () => {
        console.log("clear training data for this label")
        this.knn.clearClass(i)
        this.infoTexts[i].innerText = " 0 개"
      })
      
      // Create info text
      const infoText = document.createElement('span')
      infoText.innerText = " 0 개";
      div.appendChild(infoText);
      this.infoTexts.push(infoText);
    }
  }
  
  startTraining(){
    if (this.timer) {
      this.stopTraining();
    }
    var promise = this.video.play();

    if(promise !== undefined){
      promise.then(_ => {
        console.log("Autoplay started")
      }).catch(error => {
        console.log("Autoplay prevented")
      })
    }
    this.timer = requestAnimationFrame(this.train.bind(this));
  }
  
  stopTraining(){
    this.video.pause();
    cancelAnimationFrame(this.timer);
  }
  
  train(){
    if(this.videoPlaying){
      // Get image data from video element
      const image = dl.fromPixels(this.video);
      
      // Train class if one of the buttons is held down
      if(this.training != -1){
        // Add current image to classifier
        this.knn.addImage(image, this.training)
      }

      const exampleCount = this.knn.getClassExampleCount()

      if(Math.max(...exampleCount) > 0){
        for(let i=0; i<words.length; i++){
          if(exampleCount[i] > 0){
            this.infoTexts[i].innerText = ` ${exampleCount[i]} 개`
          }
        }
      }
    }
    this.timer = requestAnimationFrame(this.train.bind(this));
  }

  startPredicting(){
    // stop training
    if(this.timer){
      this.stopTraining();
    }

    document.getElementById("status").style.background = "deepskyblue"
    this.setStatusText("준비 됐습니다!")

    this.video.play();

    this.pred = requestAnimationFrame(this.predict.bind(this))
  }

  pausePredicting(){
    console.log("pause predicting")
    this.setStatusText("Status: Paused Predicting")
    cancelAnimationFrame(this.pred)
  }

  predict(){
    this.now = Date.now()
    this.elapsed = this.now - this.then

    if(this.elapsed > this.fpsInterval){

      this.then = this.now - (this.elapsed % this.fpsInterval)

      if(this.videoPlaying){
        const exampleCount = this.knn.getClassExampleCount();

        const image = dl.fromPixels(this.video);

        if(Math.max(...exampleCount) > 0){
          this.knn.predictClass(image)
          .then((res) => {
            for(let i=0;i<words.length;i++){

              // if matches & is above threshold & isnt same as prev prediction
              // and is not the last class which is a catch all class
              if(res.classIndex == i 
                && res.confidences[i] > predictionThreshold 
                && res.classIndex != this.previousPrediction
                && res.classIndex != words.length-1){

                this.tts.speak(words[i])

                // set previous prediction so it doesnt get called again
                this.previousPrediction = res.classIndex;


              }
            }
          })
          .then(() => image.dispose())
        } else {
          image.dispose()
        }
      }
    }

    this.pred = requestAnimationFrame(this.predict.bind(this))
  }

  setStatusText(status){
    document.getElementById("status").style.display = "block"
    this.statusText.innerText = status
  }

}

class TextToSpeech{
  constructor(){
    this.synth = window.speechSynthesis
    this.voices = []
    this.pitch = 1.0
    this.rate = 0.9

    this.textLine = document.getElementById("text")
    this.ansText = document.getElementById("answerText")
    this.loader = document.getElementById("loader")

    this.selectedVoice = 48 // this is Google-US en. Can set voice and language of choice

    this.currentPredictedWords = []
    this.waitTimeForQuery = 5000


    this.synth.onvoiceschanged = () => {
      this.populateVoiceList()
    }
    
  }

  populateVoiceList(){
    if(typeof speechSynthesis === 'undefined'){
      console.log("no synth")
      return
    }
    this.voices = this.synth.getVoices()

    if(this.voices.indexOf(this.selectedVoice) > 0){
      console.log(`${this.voices[this.selectedVoice].name}:${this.voices[this.selectedVoice].lang}`)
    } else {
      //alert("Selected voice for speech did not load or does not exist.\nCheck Internet Connection")
    }
    
  }

  clearPara(queryDetected){
    this.textLine.innerText = '';
    this.ansText.innerText = ''
    if(queryDetected){
      this.loader.style.display = "block"
    } else {
      this.loader.style.display = "none"
      this.ansText.innerText = "No query detected"
      main.previousPrediction = -1
    }
    this.currentPredictedWords = []
  }

  speak(word){

    if(word == '클로바'){
      console.log("clear para")
      this.clearPara(true);

      setTimeout(() => {
        // if no query detected after alexa is signed
        if(this.currentPredictedWords.length == 1){
          this.clearPara(false)
        }
      }, this.waitTimeForQuery)
    } 

    if(word != '클로바' && this.currentPredictedWords.length == 0){
      console.log("첫 단어는 클로바여야 합니다")
      console.log(word)
      return
    }

    // if(endWords.includes(word) && this.currentPredictedWords.length == 1 && (word != "hello" && word != "bye")){
    //   console.log("end word detected early")
    //   console.log(word)
    //   return;
    // }

    if(this.currentPredictedWords.includes(word)){
      // prevent word from being detected repeatedly in phrase
      console.log("word already been detected in current phrase")
      return
    }


    this.currentPredictedWords.push(word)


    this.textLine.innerText += ' ' + word;


    var utterThis = new SpeechSynthesisUtterance(word)

    utterThis.onend = (evt) => {
      if(endWords.includes(word)){
         //if last word is one of end words start listening for transcribing
        console.log("this was the last word")

        main.setStatusText("Status: Waiting for Response")

        let stt = new SpeechToText()
      }
    }

    utterThis.onerror = (evt) => {
      console.log("Error speaking")
    }

    utterThis.voice = this.voices[this.selectedVoice]

    utterThis.pitch = this.pitch
    utterThis.rate = this.rate

    this.synth.speak(utterThis)

  }


}

class SpeechToText{
  constructor(){
    this.interimTextLine = document.getElementById("interimText")
    this.textLine = document.getElementById("answerText")
    this.loader = document.getElementById("loader")
    this.finalTranscript = ''
    this.recognizing = false

    this.recognition = new webkitSpeechRecognition();

    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.lang = 'en-US'

    this.cutOffTime = 15000 // cut off speech to text after

    this.recognition.onstart = () => {
      this.recognizing = true;
      console.log("started recognizing")
      main.setStatusText("Status: Transcribing")
    }

    this.recognition.onerror = (evt) => {
      console.log(evt + " recogn error")
    }

    this.recognition.onend = () => {
      console.log("stopped recognizing")
      if(this.finalTranscript.length == 0){
        this.type("No response detected")

      }
      this.recognizing = false;

      main.setStatusText("Status: Finished Transcribing")
      // restart prediction after a pause
      setTimeout(() => {
        main.startPredicting()
      }, 1000)
    }

    this.recognition.onresult = (event) => {
      var interim_transcript = ''
      if(typeof(event.results) == 'undefined'){
        return;
      }
   

      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          this.finalTranscript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }


      this.interimType(interim_transcript)
      this.type(this.finalTranscript)
    }

    setTimeout(()=>{
      this.startListening();
    },0)
    

    setTimeout(()=>{
      this.stopListening()
    },this.cutOffTime)
  }

  startListening(){
    if(this.recognizing){
      this.recognition.stop()
      return
    }

    console.log("listening")

    main.pausePredicting()

    this.recognition.start()
  }

  stopListening(){
    console.log("STOP LISTENING")
    if(this.recognizing){
      console.log("stop speech to text")
      this.recognition.stop()

      //restart predicting
      main.startPredicting()
      return
    }
  }

  interimType(text){
    this.loader.style.display = "none"
    this.interimTextLine.innerText = text
  }

  type(text){
    this.loader.style.display = "none"
    this.textLine.innerText = text;
  }
}

var main = null;

window.addEventListener('load', () => {

  var ua = navigator.userAgent.toLowerCase()

  if(!(ua.indexOf("chrome") != -1 || ua.indexOf("firefox")!= -1)){
    alert("Please visit in the latest Chrome or Firefox")
    return
  } 


  main = new Main()

});
