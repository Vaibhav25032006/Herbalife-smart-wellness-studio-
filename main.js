const appState={waterCount:0,currentUser:null,currentPlan:[],voices:[],recognition:null,isListening:false,lastSpeechText:'',lastUtterance:null};

async function analyzeUser(){
  const errorBox=document.getElementById('error-box');const errorMsg=document.getElementById('error-msg');
  let input=document.getElementById('member-id-input').value.trim();
  if(!input){input=await extractIdFromCard();if(input)document.getElementById('member-id-input').value=input;}
  const user=sheetData.find(u=>u.id===input);
  if(!user){errorMsg.innerText='Herbalife ID invalid or not found.';errorBox.classList.remove('hidden');return;}
  errorBox.classList.add('hidden');
  document.getElementById('auth-section').classList.add('hidden');document.getElementById('hero-section').classList.add('hidden');document.getElementById('loading-ai').classList.remove('hidden');
  setTimeout(()=>{document.getElementById('loading-ai').classList.add('hidden');document.getElementById('dashboard').classList.remove('hidden');appState.currentUser=user;populateData(user);startAssistant();},1200);
}

async function extractIdFromCard(){
  const file=document.getElementById('id-card-upload').files[0];if(!file)return '';
  const status=document.getElementById('ocr-status');status.innerText='ID card OCR running...';
  try{const {data}=await Tesseract.recognize(file,'eng');const found=(data.text.match(/\d{10}/)||[])[0]||'';status.innerText=found?`Detected ID: ${found}`:'Could not detect ID.';return found;}catch(e){status.innerText='OCR failed.';return '';}
}
