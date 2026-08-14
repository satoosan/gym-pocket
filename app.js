
const STORAGE_KEY = "gym-pocket-v1";
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const defaultData = {
  workouts: [
    {
      id: crypto.randomUUID(),
      name: "Push",
      days: ["Seg", "Qui"],
      exercises: [
        { id: crypto.randomUUID(), name:"Supino reto", sets:3, reps:"8-12", weight:0 },
        { id: crypto.randomUUID(), name:"Desenvolvimento", sets:3, reps:"8-12", weight:0 },
        { id: crypto.randomUUID(), name:"Tríceps corda", sets:3, reps:"10-15", weight:0 }
      ]
    }
  ],
  sessions: [],
  body: [],
  settings: { goalWeight: 80 }
};

let state = load();
let currentView = "home";
let deferredPrompt = null;

function load(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(defaultData); }
  catch { return structuredClone(defaultData); }
}
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function fmtDate(d){ return new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(d)); }
function todayISO(){ return new Date().toISOString().slice(0,10); }
function toast(msg){
  let el = $(".toast");
  if(!el){ el=document.createElement("div"); el.className="toast"; document.body.appendChild(el); }
  el.textContent=msg; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),1800);
}
function escapeHtml(v=""){ return String(v).replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])); }

function render(){
  const app=$("#app");
  const titles={home:"Hoje",workouts:"Treinos",history:"Histórico",body:"Corpo",progress:"Progresso"};
  $("#pageTitle").textContent=titles[currentView];
  $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===currentView));
  if(currentView==="home") renderHome(app);
  if(currentView==="workouts") renderWorkouts(app);
  if(currentView==="history") renderHistory(app);
  if(currentView==="body") renderBody(app);
  if(currentView==="progress") renderProgress(app);
}

function renderHome(app){
  const lastBody = [...state.body].sort((a,b)=>b.date.localeCompare(a.date))[0];
  const month = new Date().toISOString().slice(0,7);
  const monthSessions = state.sessions.filter(s=>s.date.startsWith(month));
  const todayName = ["Dom","Seg","Ter","Qua","Qui","Sex","Sab"][new Date().getDay()];
  const planned = state.workouts.find(w=>w.days.includes(todayName)) || state.workouts[0];

  const weekDays=["Seg","Ter","Qua","Qui","Sex","Sab","Dom"];
  const weekHtml = weekDays.map(d=>{
    const done = state.sessions.some(s=>new Date(s.date+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"short"}).slice(0,3).toLowerCase()===d.toLowerCase());
    return `<div class="day ${done?"done":""}"><small>${d}</small><b>${done?"✓":"•"}</b></div>`;
  }).join("");

  app.innerHTML=`
    <section class="card hero">
      <div class="row">
        <div>
          <span class="pill">${planned ? "Treino sugerido" : "Sem treino"}</span>
          <h2 style="font-size:28px;margin:12px 0 6px">${planned ? escapeHtml(planned.name) : "Crie seu primeiro treino"}</h2>
          <p class="muted">${planned ? `${planned.exercises.length} exercícios` : "Comece montando sua ficha."}</p>
        </div>
      </div>
      <button class="primary" id="startWorkout">${planned ? "INICIAR TREINO" : "CRIAR TREINO"}</button>
    </section>

    <div class="section-title"><h2>Esta semana</h2></div>
    <section class="card"><div class="week">${weekHtml}</div></section>

    <div class="grid-2">
      <div class="stat"><span class="muted">Treinos no mês</span><strong>${monthSessions.length}</strong></div>
      <div class="stat"><span class="muted">Peso atual</span><strong>${lastBody?.weight ? lastBody.weight+" kg" : "—"}</strong></div>
    </div>

    <div class="section-title"><h2>Últimos treinos</h2></div>
    <section class="card">
      ${state.sessions.length ? [...state.sessions].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4).map(s=>`
        <div class="list-item"><div><b>${escapeHtml(s.workoutName)}</b><div class="meta">${fmtDate(s.date)} · ${s.exercises.length} exercícios</div></div><span class="accent">✓</span></div>
      `).join("") : $("#emptyTemplate").innerHTML}
    </section>
  `;
  $("#startWorkout").onclick=()=> planned ? openSession(planned.id) : openWorkoutEditor();
}

function renderWorkouts(app){
  app.innerHTML=`
    <button class="primary" id="newWorkout">＋ NOVO TREINO</button>
    <div class="section-title"><h2>Suas fichas</h2></div>
    <section class="card">
      ${state.workouts.length ? state.workouts.map(w=>`
        <div class="list-item">
          <div><b>${escapeHtml(w.name)}</b><div class="meta">${w.exercises.length} exercícios · ${w.days.join(", ")||"sem dias"}</div></div>
          <button class="small-btn" data-edit-workout="${w.id}">Editar</button>
        </div>`).join("") : $("#emptyTemplate").innerHTML}
    </section>`;
  $("#newWorkout").onclick=()=>openWorkoutEditor();
  $$("[data-edit-workout]").forEach(b=>b.onclick=()=>openWorkoutEditor(b.dataset.editWorkout));
}

function openWorkoutEditor(id){
  const workout = id ? state.workouts.find(w=>w.id===id) : {id:crypto.randomUUID(),name:"",days:[],exercises:[]};
  openModal(id ? "Editar treino" : "Novo treino", `
    <div class="form-group"><label>Nome</label><input id="wName" value="${escapeHtml(workout.name)}" placeholder="Ex.: Pull, Pernas, Full Body"></div>
    <div class="form-group"><label>Dias da semana</label>
      <div class="grid-2">${["Seg","Ter","Qua","Qui","Sex","Sab","Dom"].map(d=>`
        <label class="secondary" style="display:flex;gap:8px;align-items:center">
          <input style="width:auto" type="checkbox" value="${d}" class="dayCheck" ${workout.days.includes(d)?"checked":""}>${d}
        </label>`).join("")}</div>
    </div>
    <hr>
    <div id="exerciseEditor">
      ${workout.exercises.map((e,i)=>exerciseEditorRow(e,i)).join("")}
    </div>
    <button class="secondary" type="button" id="addExercise">＋ Adicionar exercício</button>
  `, `
    <button class="primary" type="button" id="saveWorkout">Salvar treino</button>
    ${id ? '<button class="danger" type="button" id="deleteWorkout">Excluir treino</button>' : ""}
  `);
  $("#addExercise").onclick=()=>{
    $("#exerciseEditor").insertAdjacentHTML("beforeend", exerciseEditorRow({id:crypto.randomUUID(),name:"",sets:3,reps:"8-12",weight:0}, $("#exerciseEditor").children.length));
  };
  $("#saveWorkout").onclick=()=>{
    const name=$("#wName").value.trim();
    if(!name) return toast("Dê um nome ao treino.");
    const exercises=$$(".exercise-edit").map(row=>({
      id:row.dataset.id,
      name:$(".eName",row).value.trim(),
      sets:+$(".eSets",row).value||1,
      reps:$(".eReps",row).value.trim()||"8-12",
      weight:+$(".eWeight",row).value||0
    })).filter(e=>e.name);
    const next={...workout,name,days:$$(".dayCheck:checked").map(x=>x.value),exercises};
    if(id) state.workouts=state.workouts.map(w=>w.id===id?next:w); else state.workouts.push(next);
    save(); closeModal(); currentView="workouts"; render(); toast("Treino salvo.");
  };
  if(id) $("#deleteWorkout").onclick=()=>{
    state.workouts=state.workouts.filter(w=>w.id!==id); save(); closeModal(); render(); toast("Treino excluído.");
  };
}

function exerciseEditorRow(e,i){
  return `<div class="card exercise-edit" data-id="${e.id}">
    <div class="form-group"><label>Exercício ${i+1}</label><input class="eName" value="${escapeHtml(e.name)}" placeholder="Nome do exercício"></div>
    <div class="inline-fields">
      <div class="form-group"><label>Séries</label><input class="eSets" type="number" min="1" value="${e.sets}"></div>
      <div class="form-group"><label>Reps</label><input class="eReps" value="${escapeHtml(e.reps)}"></div>
    </div>
    <div class="form-group"><label>Peso sugerido (kg)</label><input class="eWeight" type="number" step="0.5" value="${e.weight||0}"></div>
  </div>`;
}


let restTimerInterval=null;
function startRestTimer(seconds=90){
  clearInterval(restTimerInterval);
  let remaining=seconds;
  const box=$("#restTimer");
  if(!box) return;
  const draw=()=>{
    const m=String(Math.floor(remaining/60)).padStart(2,"0");
    const s=String(remaining%60).padStart(2,"0");
    $("#restTime").textContent=`${m}:${s}`;
    if(remaining<=0){
      clearInterval(restTimerInterval);
      box.classList.add("timer-done");
      if(navigator.vibrate) navigator.vibrate([150,80,150]);
      toast("Descanso finalizado!");
      return;
    }
    remaining--;
  };
  box.classList.remove("timer-done");
  draw();
  restTimerInterval=setInterval(draw,1000);
}
function stopRestTimer(){
  clearInterval(restTimerInterval);
  const el=$("#restTime"); if(el) el.textContent="01:30";
}

function openSession(workoutId){
  const workout=state.workouts.find(w=>w.id===workoutId);
  if(!workout) return;
  const previous=[...state.sessions].reverse().find(s=>s.workoutId===workoutId);
  const body=workout.exercises.map(ex=>{
    const prevEx=previous?.exercises.find(x=>x.exerciseId===ex.id);
    return `<section class="card session-ex" data-id="${ex.id}">
      <div class="row"><div><h3>${escapeHtml(ex.name)}</h3><div class="meta">Meta: ${ex.sets} × ${escapeHtml(ex.reps)}</div></div><span class="pill">${prevEx ? "Último treino disponível" : "Primeira vez"}</span></div>
      <div class="meta" style="margin:8px 0">Série · Peso (kg) · Reps</div>
      ${Array.from({length:ex.sets},(_,i)=>{
        const prevSet=prevEx?.sets?.[i];
        return `<div class="set-row">
          <div class="set-num">${i+1}</div>
          <input class="set-weight" type="number" step="0.5" value="${prevSet?.weight ?? ex.weight ?? 0}">
          <input class="set-reps" type="number" min="0" value="${prevSet?.reps ?? (parseInt(ex.reps) || 0)}">
          <button type="button" class="check-set">✓</button>
        </div>`;
      }).join("")}
    </section>`;
  }).join("");
  openModal(workout.name, `
    <section class="card" id="restTimer">
      <div class="row">
        <div>
          <div class="meta">DESCANSO</div>
          <strong id="restTime" style="font-size:34px;letter-spacing:.04em">01:30</strong>
        </div>
        <div style="display:flex;gap:8px">
          <button class="small-btn" type="button" id="minusTimer">−15s</button>
          <button class="small-btn" type="button" id="plusTimer">+15s</button>
        </div>
      </div>
      <div class="grid-2" style="margin-top:12px">
        <button class="secondary" type="button" id="startTimer">Iniciar 1:30</button>
        <button class="secondary" type="button" id="stopTimer">Parar</button>
      </div>
      <p class="meta" style="margin:10px 0 0">Ao concluir uma série, o descanso inicia automaticamente.</p>
    </section>
    ${body}`, `<button class="primary" type="button" id="finishSession">FINALIZAR TREINO</button>`);
  let timerSeconds=90;
  const refreshTimerLabel=()=>{ const m=String(Math.floor(timerSeconds/60)).padStart(2,"0"),s=String(timerSeconds%60).padStart(2,"0"); $("#restTime").textContent=`${m}:${s}`; $("#startTimer").textContent=`Iniciar ${m}:${s}`; };
  $("#minusTimer").onclick=()=>{timerSeconds=Math.max(15,timerSeconds-15);stopRestTimer();refreshTimerLabel();};
  $("#plusTimer").onclick=()=>{timerSeconds=Math.min(600,timerSeconds+15);stopRestTimer();refreshTimerLabel();};
  $("#startTimer").onclick=()=>startRestTimer(timerSeconds);
  $("#stopTimer").onclick=()=>{stopRestTimer();refreshTimerLabel();};
  $$(".check-set").forEach(b=>b.onclick=()=>{ b.classList.toggle("checked"); if(b.classList.contains("checked")) startRestTimer(timerSeconds); });
  $("#finishSession").onclick=()=>{
    const exercises=$$(".session-ex").map(exEl=>({
      exerciseId:exEl.dataset.id,
      name:workout.exercises.find(e=>e.id===exEl.dataset.id)?.name || "",
      sets:$$(".set-row",exEl).map(r=>({
        weight:+$(".set-weight",r).value||0,
        reps:+$(".set-reps",r).value||0,
        done:$(".check-set",r).classList.contains("checked")
      }))
    }));
    state.sessions.push({id:crypto.randomUUID(),workoutId,workoutName:workout.name,date:todayISO(),exercises});
    save(); stopRestTimer(); closeModal(); currentView="history"; render(); toast("Treino registrado. Boa!");
  };
}

function renderHistory(app){
  const sessions=[...state.sessions].sort((a,b)=>b.date.localeCompare(a.date));
  app.innerHTML=`<section class="card">
    ${sessions.length ? sessions.map(s=>`
      <div class="list-item">
        <div><b>${escapeHtml(s.workoutName)}</b><div class="meta">${fmtDate(s.date)} · ${s.exercises.length} exercícios · ${sessionVolume(s).toFixed(0)} kg de volume</div></div>
        <button class="small-btn" data-session="${s.id}">Ver</button>
      </div>`).join("") : $("#emptyTemplate").innerHTML}
  </section>`;
  $$("[data-session]").forEach(b=>b.onclick=()=>showSession(b.dataset.session));
}
function sessionVolume(s){ return s.exercises.flatMap(e=>e.sets).reduce((sum,x)=>sum+(x.done?x.weight*x.reps:0),0); }
function showSession(id){
  const s=state.sessions.find(x=>x.id===id); if(!s)return;
  openModal(`${s.workoutName} · ${fmtDate(s.date)}`, s.exercises.map(e=>`
    <div class="card"><h3>${escapeHtml(e.name)}</h3>${e.sets.map((set,i)=>`<div class="list-item"><span>Série ${i+1}</span><b>${set.weight} kg × ${set.reps} ${set.done?"✓":""}</b></div>`).join("")}</div>
  `).join(""), `<button class="danger" id="deleteSession" type="button">Excluir registro</button>`);
  $("#deleteSession").onclick=()=>{ state.sessions=state.sessions.filter(x=>x.id!==id); save(); closeModal(); render(); };
}

function renderBody(app){
  const records=[...state.body].sort((a,b)=>b.date.localeCompare(a.date));
  const latest=records[0];
  const badge = r => r.method==="estimated" ? '<span class="pill" style="color:var(--warning);background:rgba(255,209,102,.1)">Estimado</span>' : '<span class="pill">Medido</span>';
  const bodyValue = (r,key,suffix="") => r?.[key] != null ? `${r[key]}${suffix}` : "—";
  app.innerHTML=`
    <button class="primary" id="newBody">＋ NOVA AVALIAÇÃO</button>
    ${latest?`
      <div class="section-title"><h2>Atual</h2>${badge(latest)}</div>
      <div class="grid-2">
        <div class="stat"><span class="muted">Peso</span><strong>${latest.weight||"—"} kg</strong></div>
        <div class="stat"><span class="muted">Gordura</span><strong>${latest.bodyFat||"—"}%</strong></div>
        <div class="stat"><span class="muted">Massa livre</span><strong>${latest.leanMass||latest.muscleMass||"—"} kg</strong></div>
        <div class="stat"><span class="muted">IMC</span><strong>${latest.bmi||"—"}</strong></div>
      </div>`:""}
    <div class="section-title"><h2>Avaliações</h2></div>
    <section class="card">
      ${records.length?records.map(r=>`<div class="list-item"><div><div class="row" style="justify-content:flex-start"><b>${fmtDate(r.date)}</b>${badge(r)}</div><div class="meta">${r.weight||"—"} kg · ${r.bodyFat||"—"}% gordura · ${r.leanMass||r.muscleMass||"—"} kg massa livre</div></div></div>`).join(""):$("#emptyTemplate").innerHTML}
    </section>`;
  $("#newBody").onclick=openBodyChoice;
}

function openBodyChoice(){
  openModal("Nova avaliação", `
    <p class="muted">Escolha como deseja fazer sua avaliação.</p>
    <div class="stack">
      <button class="secondary" type="button" id="estimatedChoice" style="text-align:left;padding:18px">
        <b style="font-size:17px">✨ Fazer avaliação guiada</b><br>
        <span class="meta">Eu vou perguntando uma medida de cada vez e calculo sua estimativa no final.</span>
      </button>
      <button class="secondary" type="button" id="measuredChoice" style="text-align:left;padding:18px">
        <b>Tenho uma bioimpedância</b><br>
        <span class="meta">Cadastrar manualmente os valores de uma balança ou exame.</span>
      </button>
    </div>
  `);
  $("#estimatedChoice").onclick=startEstimateWizard;
  $("#measuredChoice").onclick=()=>openBodyEditor();
}

function calculateNavy(sex,heightCm,neckCm,waistCm,hipCm){
  if(sex==="male"){
    const diff=waistCm-neckCm;
    if(diff<=0) return null;
    return 495/(1.0324-0.19077*Math.log10(diff)+0.15456*Math.log10(heightCm))-450;
  }
  const diff=waistCm+hipCm-neckCm;
  if(diff<=0) return null;
  return 495/(1.29579-0.35004*Math.log10(diff)+0.22100*Math.log10(heightCm))-450;
}

function startEstimateWizard(){
  const answers={date:todayISO(),sex:"male"};
  let steps=[
    {key:"sex", title:"Primeiro, qual sexo a fórmula deve usar?", type:"choice", choices:[["male","Masculino"],["female","Feminino"]]},
    {key:"age", title:"Qual é a sua idade?", subtitle:"Usamos a idade para estimar o metabolismo basal.", type:"number", unit:"anos", min:14, max:100},
    {key:"height", title:"Qual é a sua altura?", type:"number", unit:"cm", min:120, max:230, step:"0.1"},
    {key:"weight", title:"Quanto você pesa hoje?", type:"number", unit:"kg", min:30, max:300, step:"0.1"},
    {key:"neck", title:"Meça seu pescoço", subtitle:"Passe a fita ao redor do pescoço, sem apertar.", type:"number", unit:"cm", min:20, max:70, step:"0.1"},
    {key:"waist", title:"Agora meça sua cintura/abdômen", subtitle:"Mantenha a fita horizontal e sem apertar a pele.", type:"number", unit:"cm", min:40, max:220, step:"0.1"},
    {key:"arm", title:"Quer registrar seu braço?", subtitle:"Opcional — você pode pular.", type:"number", unit:"cm", min:15, max:80, step:"0.1", optional:true},
    {key:"chest", title:"E a medida do peito?", subtitle:"Opcional — ajuda a acompanhar sua evolução.", type:"number", unit:"cm", min:40, max:200, step:"0.1", optional:true},
    {key:"thigh", title:"Por último, a coxa", subtitle:"Opcional — você pode pular.", type:"number", unit:"cm", min:20, max:120, step:"0.1", optional:true}
  ];
  let index=0;

  function activeSteps(){
    const list=[...steps];
    if(answers.sex==="female" && !list.some(s=>s.key==="hip")){
      const waistIndex=list.findIndex(s=>s.key==="waist");
      list.splice(waistIndex+1,0,{key:"hip",title:"Agora meça seu quadril",subtitle:"Passe a fita na região mais larga do quadril.",type:"number",unit:"cm",min:50,max:220,step:"0.1"});
    }
    return list;
  }

  function draw(){
    const list=activeSteps();
    const step=list[index];
    if(!step) return showResult();
    const progress=Math.round((index/list.length)*100);
    const input = step.type==="choice"
      ? `<div class="stack">${step.choices.map(([v,label])=>`<button class="secondary wizard-choice" data-value="${v}" type="button" style="padding:18px">${label}</button>`).join("")}</div>`
      : `<div style="display:flex;align-items:center;gap:10px"><input id="wizardInput" type="number" inputmode="decimal" min="${step.min||0}" max="${step.max||999}" step="${step.step||1}" value="${answers[step.key]??""}" style="font-size:28px;text-align:center;padding:18px"><b class="muted">${step.unit||""}</b></div>`;
    openModal("Avaliação guiada", `
      <div class="progress-bar" style="margin-bottom:22px"><div class="progress-fill" style="width:${progress}%"></div></div>
      <p class="meta">PERGUNTA ${index+1} DE ${list.length}</p>
      <h2 style="font-size:25px;line-height:1.15;margin-bottom:8px">${step.title}</h2>
      ${step.subtitle?`<p class="muted">${step.subtitle}</p>`:""}
      ${input}
    `, step.type==="choice" ? "" : `
      <button class="primary" id="wizardNext" type="button">CONTINUAR</button>
      ${step.optional?'<button class="secondary" id="wizardSkip" type="button">Pular</button>':""}
      ${index>0?'<button class="secondary" id="wizardBack" type="button">← Voltar</button>':""}
    `);

    if(step.type==="choice"){
      $$(".wizard-choice").forEach(b=>b.onclick=()=>{
        answers[step.key]=b.dataset.value;
        index++;
        draw();
      });
    }else{
      setTimeout(()=>$("#wizardInput")?.focus(),50);
      $("#wizardNext").onclick=()=>{
        const val=+$("#wizardInput").value;
        if(!val || val < step.min || val > step.max) return toast(`Informe um valor entre ${step.min} e ${step.max}.`);
        answers[step.key]=val; index++; draw();
      };
      $("#wizardInput").onkeydown=e=>{ if(e.key==="Enter") $("#wizardNext").click(); };
      if(step.optional) $("#wizardSkip").onclick=()=>{ answers[step.key]=null; index++; draw(); };
      if(index>0) $("#wizardBack").onclick=()=>{ index--; draw(); };
    }
  }

  function showResult(){
    const fatRaw=calculateNavy(answers.sex,answers.height,answers.neck,answers.waist,answers.hip||0);
    if(!Number.isFinite(fatRaw) || fatRaw<2 || fatRaw>65){ toast("Não consegui calcular. Confira suas medidas."); index=3; return draw(); }
    const fat=Math.round(fatRaw*10)/10;
    const bmi=Math.round((answers.weight/((answers.height/100)**2))*10)/10;
    const fatMass=Math.round(answers.weight*(fat/100)*10)/10;
    const leanMass=Math.round((answers.weight-fatMass)*10)/10;
    const bmr=Math.round(answers.sex==="male"
      ? 10*answers.weight+6.25*answers.height-5*answers.age+5
      : 10*answers.weight+6.25*answers.height-5*answers.age-161);

    openModal("Sua estimativa", `
      <div class="card" style="text-align:center">
        <span class="pill" style="color:var(--warning);background:rgba(255,209,102,.1)">ESTIMATIVA</span>
        <p class="muted" style="margin:12px 0 2px">Gordura corporal estimada</p>
        <strong style="font-size:46px;color:var(--accent)">~${fat}%</strong>
      </div>
      <div class="grid-2">
        <div class="stat"><span class="muted">Peso</span><strong>${answers.weight} kg</strong></div>
        <div class="stat"><span class="muted">IMC</span><strong>${bmi}</strong></div>
        <div class="stat"><span class="muted">Gordura</span><strong>${fatMass} kg</strong></div>
        <div class="stat"><span class="muted">Massa livre</span><strong>${leanMass} kg</strong></div>
      </div>
      <div class="card" style="margin-top:12px">
        <div class="list-item"><span>Metabolismo basal estimado</span><b>~${bmr} kcal</b></div>
        <p class="meta" style="margin:12px 0 0">Esta é uma estimativa antropométrica baseada em circunferências. Não é uma bioimpedância e não estima com segurança gordura visceral ou água corporal.</p>
      </div>
    `, `<button class="primary" id="wizardSave" type="button">SALVAR AVALIAÇÃO</button><button class="secondary" id="wizardRedo" type="button">Refazer perguntas</button>`);
    $("#wizardSave").onclick=()=>{
      state.body.push({
        id:crypto.randomUUID(),method:"estimated",date:answers.date,sex:answers.sex,age:answers.age,height:answers.height,
        weight:answers.weight,neck:answers.neck,waist:answers.waist,hip:answers.hip||null,arm:answers.arm||null,
        thigh:answers.thigh||null,chest:answers.chest||null,bodyFat:fat,fatMass,leanMass,bmi,bmr,
        muscleMass:null,visceralFat:null,water:null
      });
      save(); closeModal(); currentView="body"; render(); toast("Avaliação estimada salva.");
    };
    $("#wizardRedo").onclick=()=>{ index=0; draw(); };
  }
  draw();
}

function openBodyEditor(){
  openModal("Nova avaliação", `
    <div class="form-group"><label>Data</label><input id="bDate" type="date" value="${todayISO()}"></div>
    <div class="inline-fields">
      <div class="form-group"><label>Peso (kg)</label><input id="bWeight" type="number" step="0.1"></div>
      <div class="form-group"><label>Gordura corporal (%)</label><input id="bFat" type="number" step="0.1"></div>
    </div>
    <div class="inline-fields">
      <div class="form-group"><label>Massa muscular (kg)</label><input id="bMuscle" type="number" step="0.1"></div>
      <div class="form-group"><label>Água corporal (%)</label><input id="bWater" type="number" step="0.1"></div>
    </div>
    <div class="inline-fields">
      <div class="form-group"><label>Gordura visceral</label><input id="bVisceral" type="number" step="0.1"></div>
      <div class="form-group"><label>Metabolismo basal</label><input id="bBmr" type="number"></div>
    </div>
    <div class="inline-fields">
      <div class="form-group"><label>Cintura (cm)</label><input id="bWaist" type="number" step="0.1"></div>
      <div class="form-group"><label>Braço (cm)</label><input id="bArm" type="number" step="0.1"></div>
    </div>
    <div class="inline-fields">
      <div class="form-group"><label>Coxa (cm)</label><input id="bThigh" type="number" step="0.1"></div>
      <div class="form-group"><label>Peito (cm)</label><input id="bChest" type="number" step="0.1"></div>
    </div>
    <div class="form-group"><label>Observações</label><textarea id="bNotes"></textarea></div>
  `, `<button class="primary" id="saveBody" type="button">Salvar avaliação</button>`);
  $("#saveBody").onclick=()=>{
    const weight=+$(" #bWeight".trim()).value||null;
    if(!weight) return toast("Informe pelo menos o peso.");
    state.body.push({
      id:crypto.randomUUID(),method:"measured",date:$("#bDate").value,weight,
      bodyFat:+$("#bFat").value||null,muscleMass:+$("#bMuscle").value||null,leanMass:null,bmi:null,water:+$("#bWater").value||null,
      visceralFat:+$("#bVisceral").value||null,bmr:+$("#bBmr").value||null,waist:+$("#bWaist").value||null,
      arm:+$("#bArm").value||null,thigh:+$("#bThigh").value||null,chest:+$("#bChest").value||null,notes:$("#bNotes").value.trim()
    });
    save(); closeModal(); render(); toast("Avaliação salva.");
  };
}

function renderProgress(app){
  const body=[...state.body].sort((a,b)=>a.date.localeCompare(b.date));
  const latest=body.at(-1), first=body[0];
  const diff=(key,suffix="")=>{
    if(!latest?.[key] || !first?.[key]) return "—";
    const d=(latest[key]-first[key]).toFixed(1);
    return `${d>0?"+":""}${d}${suffix}`;
  };
  app.innerHTML=`
    <div class="grid-2">
      <div class="stat"><span class="muted">Evolução peso</span><strong>${diff("weight"," kg")}</strong></div>
      <div class="stat"><span class="muted">Evolução gordura</span><strong>${diff("bodyFat","%")}</strong></div>
    </div>
    <div class="section-title"><h2>Peso</h2></div>
    <section class="card"><canvas id="weightChart" width="440" height="220"></canvas></section>
    <div class="section-title"><h2>Volume dos treinos</h2></div>
    <section class="card"><canvas id="volumeChart" width="440" height="220"></canvas></section>
    <section class="card">
      <h3>Backup</h3><p class="muted">Exporte seus dados para não depender somente do armazenamento do navegador.</p>
      <div class="stack"><button class="secondary" id="exportData">Exportar JSON</button><button class="secondary" id="importData">Importar JSON</button><input id="importFile" type="file" accept="application/json" hidden></div>
    </section>`;
  drawChart($("#weightChart"), body.map(x=>({label:x.date.slice(5),fullDate:x.date,value:x.weight})), {label:"Peso",suffix:" kg"});
  drawChart($("#volumeChart"), [...state.sessions].sort((a,b)=>a.date.localeCompare(b.date)).map(x=>({label:x.date.slice(5),fullDate:x.date,value:Math.round(sessionVolume(x))})).slice(-12), {label:"Volume",suffix:" kg"});
  $("#exportData").onclick=exportData;
  $("#importData").onclick=()=>$("#importFile").click();
  $("#importFile").onchange=importData;
}

function drawChart(canvas, pts, options={}){
  const ctx=canvas.getContext("2d"), w=canvas.width, h=canvas.height, pad=30;
  const suffix=options.suffix||"";
  const labelName=options.label||"Valor";
  let plotted=[];

  function paint(selectedIndex=null){
    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle="#2b3138"; ctx.lineWidth=1;
    [0,1,2,3].forEach(i=>{
      const y=pad+i*(h-2*pad)/3;
      ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(w-pad,y);ctx.stroke();
    });

    if(pts.length<1){
      ctx.fillStyle="#8d97a3";ctx.font="14px system-ui";
      ctx.fillText("Sem dados suficientes",pad,h/2);
      return;
    }

    const vals=pts.map(p=>p.value), min=Math.min(...vals), max=Math.max(...vals), span=(max-min)||1;
    plotted=pts.map((p,i)=>({
      ...p,
      x:pad+(pts.length===1?(w-2*pad)/2:i*(w-2*pad)/(pts.length-1)),
      y:h-pad-(p.value-min)/span*(h-2*pad)
    }));

    ctx.strokeStyle="#b5f34a";ctx.lineWidth=3;ctx.beginPath();
    plotted.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
    ctx.stroke();

    plotted.forEach((p,i)=>{
      ctx.fillStyle="#b5f34a";
      ctx.beginPath();ctx.arc(p.x,p.y, selectedIndex===i?7:4,0,Math.PI*2);ctx.fill();
      if(selectedIndex===i){
        ctx.strokeStyle="#f6f7f8";ctx.lineWidth=2;
        ctx.beginPath();ctx.arc(p.x,p.y,9,0,Math.PI*2);ctx.stroke();
      }
    });

    if(selectedIndex!==null && plotted[selectedIndex]){
      const p=plotted[selectedIndex];
      const dateText=p.fullDate ? fmtDate(p.fullDate) : p.label;
      const valueText=`${labelName}: ${p.value}${suffix}`;
      ctx.font="bold 14px system-ui";
      const boxW=Math.max(ctx.measureText(valueText).width,ctx.measureText(dateText).width)+24;
      const boxH=52;
      let bx=p.x-boxW/2;
      bx=Math.max(8,Math.min(w-boxW-8,bx));
      let by=p.y-boxH-18;
      if(by<8) by=p.y+18;

      ctx.fillStyle="#f6f7f8";
      roundRect(ctx,bx,by,boxW,boxH,12);
      ctx.fill();

      ctx.fillStyle="#0b0d10";
      ctx.font="bold 14px system-ui";
      ctx.fillText(valueText,bx+12,by+20);
      ctx.fillStyle="#5f6872";
      ctx.font="12px system-ui";
      ctx.fillText(dateText,bx+12,by+39);
    }
  }

  function selectPoint(clientX,clientY){
    if(!plotted.length) return;
    const rect=canvas.getBoundingClientRect();
    const sx=canvas.width/rect.width, sy=canvas.height/rect.height;
    const x=(clientX-rect.left)*sx, y=(clientY-rect.top)*sy;
    let best=-1, bestDist=Infinity;
    plotted.forEach((p,i)=>{
      const d=Math.hypot(p.x-x,p.y-y);
      if(d<bestDist){bestDist=d;best=i;}
    });
    if(best>=0 && bestDist<38*sx) paint(best);
  }

  canvas.onclick=e=>selectPoint(e.clientX,e.clientY);
  canvas.ontouchstart=e=>{
    const t=e.touches[0];
    if(t){ e.preventDefault(); selectPoint(t.clientX,t.clientY); }
  };
  paint();
}

function roundRect(ctx,x,y,w,h,r){
  r=Math.min(r,w/2,h/2);
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}
function exportData(){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`gym-pocket-backup-${todayISO()}.json`;a.click();URL.revokeObjectURL(a.href);
}
function importData(e){
  const file=e.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{ try{ state=JSON.parse(reader.result); save(); render(); toast("Backup importado."); }catch{ toast("Arquivo inválido."); } };
  reader.readAsText(file);
}
function openModal(title,body,actions=""){
  $("#modalTitle").textContent=title; $("#modalBody").innerHTML=body; $("#modalActions").innerHTML=actions; $("#modal").showModal();
}
function closeModal(){ clearInterval(restTimerInterval); $("#modal").close(); }
$("#modalClose").onclick=closeModal;
$$(".nav-item").forEach(b=>b.onclick=()=>{ currentView=b.dataset.view; render(); });

window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("#installBtn").hidden=false;});
$("#installBtn").onclick=async()=>{ if(!deferredPrompt)return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; $("#installBtn").hidden=true; };

if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
render();
