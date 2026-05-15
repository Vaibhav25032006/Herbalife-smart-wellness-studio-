function populateData(user){
  document.getElementById('user-name').innerText=user.name;
  document.getElementById('user-id-display').innerText=`Herbalife Official ID: ${user.id}`;
  document.getElementById('user-weight').innerText=`${user.weight} kg`;
  document.getElementById('user-bmi').innerText=user.bmi;
  document.getElementById('user-ideal').innerText=`${user.ideal} kg`;

  const bmiLabel=document.getElementById('bmi-label');
  bmiLabel.innerText=user.category;
  bmiLabel.className=`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${user.category==='Normal Weight'?'bg-green-500/20 text-green-400 border border-green-500/30':'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`;

  const feedback=user.category==='Overweight'?`नमस्ते ${user.name}! BMI ${user.bmi} है। आप 2-Way Shake Protocol और PPP फॉलो करें।`:`नमस्ते ${user.name}! आपका BMI normal range में है। Formula 1 shake और stamina routines जारी रखें।`;
  document.getElementById('ai-feedback').innerText=feedback;

  const dietView=document.getElementById('view-diet');
  appState.currentPlan=(user.category==='Overweight')?getWeightLossPlan():getHealthPlan();
  dietView.innerHTML=appState.currentPlan.map(item=>`<div class='bg-white p-6 rounded-[2rem] border border-slate-100 card-shadow'><p class='text-xs font-bold text-slate-400'>${item.time}</p><h4 class='text-sm font-bold text-slate-800'>${item.title}</h4><p class='text-[11px] text-slate-500'>${item.desc}</p></div>`).join('');

  renderTasks('daily');
  renderCalendar();
  renderChart();
  speakFullReport();
}

function showTab(tab){
  document.getElementById('view-diet').classList.add('hidden');
  document.getElementById('view-habits').classList.add('hidden');
  document.getElementById(`view-${tab}`).classList.remove('hidden');
}

function addWater(){
  if(appState.waterCount<4){
    appState.waterCount+=0.25;
    document.getElementById('water-text').innerText=appState.waterCount.toFixed(2);
    document.getElementById('water-progress-bar').style.width=`${(appState.waterCount/4)*100}%`;
  }
}
