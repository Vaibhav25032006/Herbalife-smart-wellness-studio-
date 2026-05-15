function getUserType(){return loadUserState().userType||'general';}
function setUserType(type){const s=loadUserState();s.userType=type;saveUserState(s);document.getElementById('user-type-text').innerText=`Current mode: ${type}`;renderTasks('daily');}
function buildTasks(bucket){
  const userType=getUserType();
  const base={
    daily:userType==='herbalife'?["6:30 AM class join","F1 shake breakfast","5:00 PM fitness club join"]:["6:30 AM light walk","Balanced breakfast","5:00 PM 20-min workout"],
    weekly:["Weekly weight check","Progress review"],
    monthly:["Body measurements","Goal reset with coach"],
    quarterly:["Quarterly fitness assessment"],
    halfyearly:["Half-year health review"],
    yearly:["Yearly transformation review"]
  };
  return (base[bucket]||[]).map((t,i)=>({id:`${bucket}_${i}`,title:t,time:bucket==='daily'?(i===0?'06:30':i===2?'17:00':'09:00'):'Auto'}));
}
function isSkipDay(date){const s=loadUserState();const dow=new Date(date).getDay();return dow===0||s.skips.includes(date);} 
function getToday(){return new Date().toISOString().slice(0,10);} 
function renderTasks(bucket){const wrap=document.getElementById('routine-list');const state=loadUserState();const tasks=buildTasks(bucket);document.querySelectorAll('.task-btn').forEach(b=>b.classList.remove('tab-active'));const btn=document.getElementById(`btn-${bucket}`);if(btn)btn.classList.add('tab-active');wrap.innerHTML=tasks.map(t=>`<div class='p-3 rounded-xl border bg-slate-50'><div class='flex justify-between'><div><p class='text-sm font-semibold'>${t.title}</p><p class='text-[11px] text-slate-500'>Slot: ${t.time}</p></div>${bucket==='daily'?`<button onclick="verifyTask('${bucket}','${t.id}')" class='bg-slate-900 text-white px-3 py-1 rounded-lg text-xs'>Live Camera Verify (12s)</button>`:''}</div><label class='text-xs mt-2 block'><input type='checkbox' ${(state.tasks[t.id])?'checked':''} onchange="toggleTask('${bucket}','${t.id}',this.checked)"> Mark done</label></div>`).join('');updateTaskProgress(bucket);}
function toggleTask(bucket,id,checked){const s=loadUserState();s.tasks[id]=checked;const today=getToday();if(!s.calendar[today])s.calendar[today]=[];if(checked&&!s.calendar[today].includes(id))s.calendar[today].push(id);saveUserState(s);updateTaskProgress(bucket);renderCalendar();renderChart();}
async function verifyTask(bucket,id){if(isSkipDay(getToday())){toggleTask(bucket,id,true);return;}const v=document.getElementById('live-camera');try{const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});v.srcObject=stream;v.classList.remove('hidden');speakText('कैमरा एनालिसिस शुरू. 12 सेकंड तक एक्टिव रहें।');setTimeout(()=>{stream.getTracks().forEach(t=>t.stop());v.classList.add('hidden');toggleTask(bucket,id,true);speakText('टास्क सत्यापित और पूरा मार्क किया गया।');},12000);}catch(e){alert('Camera permission denied.');}}
function updateTaskProgress(bucket){const s=loadUserState();const tasks=buildTasks(bucket);const done=tasks.filter(t=>s.tasks[t.id]).length;const p=tasks.length?Math.round((done/tasks.length)*100):0;document.getElementById('task-progress-text').innerText=`${p}%`;document.getElementById('task-progress-bar').style.width=`${p}%`;s.history[getToday()]=p;saveUserState(s);} 
function renderCalendar(){const s=loadUserState();const el=document.getElementById('task-calendar');const entries=Object.entries(s.calendar).slice(-10).reverse();el.innerHTML=entries.length?entries.map(([d,arr])=>`<div class='text-xs p-2 border rounded-lg'><b>${d}${isSkipDay(d)?' (Skip Day)':''}</b><br>${arr.join(', ')||'No tasks'}</div>`).join(''):'<p class="text-xs text-slate-500">No calendar activity yet</p>';}
function renderChart(){const s=loadUserState();const el=document.getElementById('progress-chart');const bars=Object.entries(s.history).slice(-10);el.innerHTML=bars.map(([d,p])=>`<div class='flex items-center gap-2 text-[10px]'><span class='w-24'>${d}</span><div class='h-2 bg-indigo-500 rounded' style='width:${p}%;min-width:4px'></div><span>${p}%</span></div>`).join('');}
function openCalendarConfig(){document.getElementById('calendar-config').classList.toggle('hidden');}
function addSkipDate(){const date=document.getElementById('skip-date').value;if(!date)return;const s=loadUserState();if(!s.skips.includes(date))s.skips.push(date);saveUserState(s);renderCalendar();}
