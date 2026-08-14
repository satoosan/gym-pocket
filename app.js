
const STORAGE_KEY = "gym-pocket-v1";
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const defaultData = {
  exerciseLibrary: [
    { id: crypto.randomUUID(), name:"Supino reto", muscle:"Peito" },
    { id: crypto.randomUUID(), name:"Desenvolvimento", muscle:"Ombros" },
    { id: crypto.randomUUID(), name:"Tríceps corda", muscle:"Tríceps" }
  ],
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
  activeSession: null,
  settings: { goalWeight: 80 }
};

let state = load();
let currentView = "home";
let deferredPrompt = null;

function load(){
  try {
    const raw=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(!raw) {
      const fresh=structuredClone(defaultData);

      // Vincula os exercícios da ficha inicial à biblioteca.
      fresh.workouts.forEach(w=>{
        w.exercises.forEach(ex=>{
          const lib=fresh.exerciseLibrary.find(item=>normalizeExerciseName(item.name)===normalizeExerciseName(ex.name));
          if(lib) ex.libraryId=lib.id;
        });
      });

      return fresh;
    }

    const workouts=Array.isArray(raw.workouts)?raw.workouts:[];
    const exerciseLibrary=Array.isArray(raw.exerciseLibrary)?raw.exerciseLibrary:[];

    // Migração automática: exercícios já existentes nas fichas entram na biblioteca.
    workouts.forEach(w=>{
      (w.exercises||[]).forEach(ex=>{
        let lib=null;

        if(ex.libraryId){
          lib=exerciseLibrary.find(item=>item.id===ex.libraryId);
        }

        if(!lib){
          lib=exerciseLibrary.find(item=>normalizeExerciseName(item.name)===normalizeExerciseName(ex.name));
        }

        if(!lib && ex.name){
          lib={id:crypto.randomUUID(),name:ex.name,muscle:""};
          exerciseLibrary.push(lib);
        }

        if(lib) ex.libraryId=lib.id;
      });
    });

    // Histórico antigo também recebe o libraryId quando é possível identificar pelo nome.
    const sessions=Array.isArray(raw.sessions)?raw.sessions:[];
    sessions.forEach(session=>{
      (session.exercises||[]).forEach(ex=>{
        if(!ex.libraryId){
          const lib=exerciseLibrary.find(item=>normalizeExerciseName(item.name)===normalizeExerciseName(ex.name));
          if(lib) ex.libraryId=lib.id;
        }
      });
    });

    return {
      exerciseLibrary,
      workouts,
      sessions,
      body:Array.isArray(raw.body)?raw.body:[],
      activeSession:raw.activeSession||null,
      settings:{...defaultData.settings,...(raw.settings||{})}
    };
  } catch {
    return structuredClone(defaultData);
  }
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
  const titles={home:"Hoje",workouts:"Treinos",exercises:"Exercícios",history:"Histórico",body:"Corpo",progress:"Progresso"};
  $("#pageTitle").textContent=titles[currentView];
  $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===currentView));
  if(currentView==="home") renderHome(app);
  if(currentView==="workouts") renderWorkouts(app);
  if(currentView==="exercises") renderExerciseLibrary(app);
  if(currentView==="history") renderHistory(app);
  if(currentView==="body") renderBody(app);
  if(currentView==="progress") renderProgress(app);
}

function getWeekBounds(){
  const now=new Date();
  const day=(now.getDay()+6)%7; // Monday = 0
  const start=new Date(now);
  start.setHours(0,0,0,0);
  start.setDate(now.getDate()-day);
  const end=new Date(start);
  end.setDate(start.getDate()+6);
  end.setHours(23,59,59,999);
  return {start,end};
}

function renderHome(app){
  const lastBody=[...state.body].sort((a,b)=>b.date.localeCompare(a.date))[0];
  const month=new Date().toISOString().slice(0,7);
  const monthSessions=state.sessions.filter(s=>s.date.startsWith(month));
  const todayName=["Dom","Seg","Ter","Qua","Qui","Sex","Sab"][new Date().getDay()];
  const plannedToday=state.workouts.filter(w=>Array.isArray(w.days) && w.days.includes(todayName));

  const {start:weekStart,end:weekEnd}=getWeekBounds();
  const weekDays=["Seg","Ter","Qua","Qui","Sex","Sab","Dom"];

  const weekHtml=weekDays.map((d,index)=>{
    const date=new Date(weekStart);
    date.setDate(weekStart.getDate()+index);
    const iso=date.toISOString().slice(0,10);

    const plannedCount=state.workouts.filter(w=>Array.isArray(w.days)&&w.days.includes(d)).length;
    const completedCount=state.sessions.filter(s=>s.date===iso).length;
    const isToday=iso===todayISO();

    let symbol="•";
    if(completedCount>0) symbol="✓";
    else if(plannedCount>0) symbol=plannedCount>1?String(plannedCount):"○";

    return `<div class="day ${completedCount>0?"done":""} ${isToday?"today":""}">
      <small>${d}</small>
      <b>${symbol}</b>
      ${plannedCount>0?`<div class="meta" style="font-size:9px;margin-top:4px">${plannedCount} treino${plannedCount>1?"s":""}</div>`:""}
    </div>`;
  }).join("");

  const todayCards = plannedToday.length
    ? plannedToday.map((w,i)=>`
        <section class="card hero">
          <div class="row">
            <div>
              <span class="pill">${plannedToday.length>1?`Treino ${i+1} de ${plannedToday.length}`:"Treino de hoje"}</span>
              <h2 style="font-size:26px;margin:12px 0 6px">${escapeHtml(w.name)}</h2>
              <p class="muted">${w.exercises.length} exercícios · ${todayName}</p>
            </div>
          </div>
          <button class="primary" data-start-workout="${w.id}">INICIAR TREINO</button>
        </section>
      `).join("")
    : `
      <section class="card hero">
        <span class="pill" style="color:var(--warning);background:rgba(255,209,102,.1)">Sem treino hoje</span>
        <h2 style="font-size:26px;margin:12px 0 6px">Nenhum treino agendado</h2>
        <p class="muted">Hoje é ${todayName}. Você pode editar suas fichas e definir este dia da semana.</p>
        <button class="secondary" id="goWorkouts">VER TREINOS</button>
      </section>
    `;

  app.innerHTML=`
    ${todayCards}

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

  $$("[data-start-workout]").forEach(b=>b.onclick=()=>openSession(b.dataset.startWorkout));
  const go=$("#goWorkouts");
  if(go) go.onclick=()=>{ currentView="workouts"; render(); };
}


function renderExerciseLibrary(app){
  const renderList=(filter="")=>{
    const normalized=normalizeExerciseName(filter);
    const items=[...state.exerciseLibrary]
      .filter(e=>normalizeExerciseName(e.name).includes(normalized))
      .sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));

    const list=$("#exerciseLibraryList");
    if(!list) return;

    list.innerHTML=items.length
      ? items.map(e=>`
          <div class="list-item">
            <div>
              <b>${escapeHtml(e.name)}</b>
              <div class="meta">${escapeHtml(e.muscle||"Sem grupo muscular")}</div>
            </div>
            <button class="small-btn" data-edit-library="${e.id}">Editar</button>
          </div>
        `).join("")
      : `<div class="empty-state" style="padding:24px 8px">
          <div class="empty-icon">☷</div>
          <h3>Nenhum exercício</h3>
          <p>Cadastre um exercício ou altere a busca.</p>
        </div>`;

    $$("[data-edit-library]").forEach(btn=>{
      btn.onclick=()=>openLibraryExerciseEditor(btn.dataset.editLibrary);
    });
  };

  app.innerHTML=`
    <button class="primary" id="newLibraryExercise">＋ NOVO EXERCÍCIO</button>

    <div class="section-title"><h2>Biblioteca de exercícios</h2></div>
    <section class="card">
      <div class="form-group">
        <label>Buscar</label>
        <input id="exerciseLibrarySearch" placeholder="Ex.: supino, rosca, agachamento..." autocomplete="off">
      </div>
      <div id="exerciseLibraryList"></div>
    </section>
  `;

  $("#newLibraryExercise").onclick=()=>openLibraryExerciseEditor();
  $("#exerciseLibrarySearch").oninput=e=>renderList(e.target.value);
  renderList();
}

function openLibraryExerciseEditor(id=null, afterSave=null){
  const existing=id ? state.exerciseLibrary.find(e=>e.id===id) : null;

  openModal(existing?"Editar exercício":"Novo exercício", `
    <div id="libraryValidation" class="validation-box" hidden></div>

    <div class="form-group">
      <label>Nome do exercício</label>
      <input id="libraryExerciseName" value="${escapeHtml(existing?.name||"")}" placeholder="Ex.: Supino reto máquina">
    </div>

    <div class="form-group">
      <label>Grupo muscular</label>
      <input id="libraryExerciseMuscle" value="${escapeHtml(existing?.muscle||"")}" placeholder="Ex.: Peito">
    </div>
  `, `
    <button class="primary" type="button" id="saveLibraryExercise">Salvar exercício</button>
    ${existing?'<button class="danger" type="button" id="deleteLibraryExercise">Excluir exercício</button>':""}
  `);

  $("#saveLibraryExercise").onclick=()=>{
    const name=$("#libraryExerciseName").value.trim();
    const muscle=$("#libraryExerciseMuscle").value.trim();
    const validation=$("#libraryValidation");

    const errors=[];
    if(!name) errors.push("Informe o nome do exercício.");

    const duplicate=state.exerciseLibrary.find(e=>
      e.id!==id &&
      normalizeExerciseName(e.name)===normalizeExerciseName(name)
    );
    if(duplicate) errors.push("Já existe um exercício com esse nome.");

    if(errors.length){
      validation.hidden=false;
      validation.innerHTML=`<b>Não foi possível salvar:</b><ul>${errors.map(e=>`<li>${escapeHtml(e)}</li>`).join("")}</ul>`;
      return;
    }

    let saved;
    if(existing){
      existing.name=name;
      existing.muscle=muscle;
      saved=existing;

      // Atualiza o nome nas fichas vinculadas.
      state.workouts.forEach(w=>{
        (w.exercises||[]).forEach(ex=>{
          if(ex.libraryId===existing.id) ex.name=name;
        });
      });
    }else{
      saved={id:crypto.randomUUID(),name,muscle};
      state.exerciseLibrary.push(saved);
    }

    save();
    closeModal();

    if(typeof afterSave==="function"){
      afterSave(saved);
    }else{
      currentView="exercises";
      render();
    }

    toast("Exercício salvo.");
  };

  if(existing){
    $("#deleteLibraryExercise").onclick=()=>{
      const used=state.workouts.some(w=>(w.exercises||[]).some(ex=>ex.libraryId===existing.id));
      if(used){
        toast("Esse exercício está sendo usado em uma ficha.");
        return;
      }

      if(!confirm(`Excluir "${existing.name}" da biblioteca?`)) return;

      state.exerciseLibrary=state.exerciseLibrary.filter(e=>e.id!==existing.id);
      save();
      closeModal();
      currentView="exercises";
      render();
      toast("Exercício excluído.");
    };
  }
}

function openExercisePicker(onSelect){
  const modalForm=$("#modalForm");
  if(!modalForm) return;

  const modalEl=$("#modal");
  const savedScrollTop=modalEl ? modalEl.scrollTop : 0;

  let overlay=$("#exercisePickerOverlay");
  if(overlay) overlay.remove();

  overlay=document.createElement("div");
  overlay.id="exercisePickerOverlay";
  overlay.className="picker-overlay";
  overlay.innerHTML=`
    <div class="picker-sheet">
      <div class="modal-head">
        <h2>Selecionar exercício</h2>
        <button class="icon-btn" type="button" id="closeExercisePicker">×</button>
      </div>

      <div class="form-group">
        <label>Buscar na biblioteca</label>
        <input id="exercisePickerSearch" placeholder="Digite o nome do exercício..." autocomplete="off">
      </div>

      <div id="exercisePickerList"></div>

      <hr>

      <button class="secondary" type="button" id="createExerciseFromPicker">＋ CADASTRAR NOVO EXERCÍCIO</button>
    </div>
  `;

  modalForm.appendChild(overlay);

  const closePicker=()=>{
    overlay.remove();
    if(modalEl) modalEl.scrollTop=savedScrollTop;
  };

  const draw=(filter="")=>{
    const normalized=normalizeExerciseName(filter);
    const items=[...state.exerciseLibrary]
      .filter(e=>normalizeExerciseName(e.name).includes(normalized))
      .sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));

    $("#exercisePickerList").innerHTML=items.length
      ? items.map(e=>`
          <button class="exercise-pick-item" type="button" data-pick-exercise="${e.id}">
            <div>
              <b>${escapeHtml(e.name)}</b>
              <span>${escapeHtml(e.muscle||"Sem grupo muscular")}</span>
            </div>
            <strong>＋</strong>
          </button>
        `).join("")
      : `<div class="empty-state" style="padding:20px 8px">
          <p>Nenhum exercício encontrado.</p>
        </div>`;

    $$("[data-pick-exercise]",overlay).forEach(btn=>{
      btn.onclick=()=>{
        const selected=state.exerciseLibrary.find(e=>e.id===btn.dataset.pickExercise);
        if(!selected) return;
        closePicker();
        onSelect(selected);
      };
    });
  };

  $("#closeExercisePicker").onclick=closePicker;
  $("#exercisePickerSearch").oninput=e=>draw(e.target.value);

  $("#createExerciseFromPicker").onclick=()=>{
    // Cria um mini formulário dentro da própria camada, sem fechar o editor do treino.
    overlay.innerHTML=`
      <div class="picker-sheet">
        <div class="modal-head">
          <h2>Novo exercício</h2>
          <button class="icon-btn" type="button" id="backToExercisePicker">←</button>
        </div>

        <div id="pickerLibraryValidation" class="validation-box" hidden></div>

        <div class="form-group">
          <label>Nome do exercício</label>
          <input id="pickerNewExerciseName" placeholder="Ex.: Supino reto máquina">
        </div>

        <div class="form-group">
          <label>Grupo muscular</label>
          <input id="pickerNewExerciseMuscle" placeholder="Ex.: Peito">
        </div>

        <button class="primary" type="button" id="savePickerExercise">Salvar e selecionar</button>
      </div>
    `;

    $("#backToExercisePicker").onclick=()=>{
      overlay.remove();
      openExercisePicker(onSelect);
    };

    $("#savePickerExercise").onclick=()=>{
      const name=$("#pickerNewExerciseName").value.trim();
      const muscle=$("#pickerNewExerciseMuscle").value.trim();
      const validation=$("#pickerLibraryValidation");

      const errors=[];
      if(!name) errors.push("Informe o nome do exercício.");

      const duplicate=state.exerciseLibrary.find(e=>
        normalizeExerciseName(e.name)===normalizeExerciseName(name)
      );

      if(duplicate) errors.push("Já existe um exercício com esse nome.");

      if(errors.length){
        validation.hidden=false;
        validation.innerHTML=`<b>Não foi possível salvar:</b><ul>${errors.map(e=>`<li>${escapeHtml(e)}</li>`).join("")}</ul>`;
        return;
      }

      const saved={id:crypto.randomUUID(),name,muscle};
      state.exerciseLibrary.push(saved);
      save();

      closePicker();
      onSelect(saved);
      toast("Exercício salvo e selecionado.");
    };
  };

  draw();
  setTimeout(()=>$("#exercisePickerSearch")?.focus(),50);
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
    <div id="workoutValidation" class="validation-box" hidden></div>
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
  const renumberExerciseRows=()=>{
    $$(".exercise-edit").forEach((row,i)=>{
      const label=$(".exercise-number",row);
      if(label) label.textContent=`Exercício ${i+1}`;
    });
  };

  const bindExerciseEditorEvents=()=>{
    $$(".exercise-edit").forEach(row=>{
      const choose=$(".chooseExerciseBtn",row);
      const remove=$(".removeExerciseBtn",row);

      if(choose && !choose.dataset.bound){
        choose.dataset.bound="1";
        choose.onclick=()=>{
          openExercisePicker(selected=>{
            row.dataset.libraryId=selected.id;
            $(".eName",row).value=selected.name;
            $(".selectedExerciseName",row).textContent=selected.name;
            choose.textContent="Trocar";
            clearWorkoutValidation();
            focusExerciseRow(row);
          });
        };
      }

      if(remove && !remove.dataset.bound){
        remove.dataset.bound="1";
        remove.onclick=()=>{
          row.remove();
          renumberExerciseRows();
          clearWorkoutValidation();
        };
      }
    });
  };

  $("#addExercise").onclick=()=>{
    $("#exerciseEditor").insertAdjacentHTML(
      "beforeend",
      exerciseEditorRow({
        id:crypto.randomUUID(),
        libraryId:"",
        name:"",
        sets:3,
        reps:"8-12",
        weight:0
      }, $("#exerciseEditor").children.length)
    );
    bindExerciseEditorEvents();

    const rows=$$(".exercise-edit");
    const newRow=rows[rows.length-1];

    if(newRow){
      // Mantém o usuário no novo card e já abre o seletor.
      focusExerciseRow(newRow);

      setTimeout(()=>{
        const choose=$(".chooseExerciseBtn",newRow);
        if(choose) choose.click();
      },180);
    }
  };
  const clearWorkoutValidation=()=>{
    const v=$("#workoutValidation");
    if(v){ v.hidden=true; v.innerHTML=""; }
  };
  $("#wName").addEventListener("input",clearWorkoutValidation);
  $("#exerciseEditor").addEventListener("input",clearWorkoutValidation);
  bindExerciseEditorEvents();

  $("#saveWorkout").onclick=()=>{
    const name=$("#wName").value.trim();
    const exercises=$$(".exercise-edit").map(row=>({
      id:row.dataset.id,
      libraryId:row.dataset.libraryId||null,
      name:$(".eName",row).value.trim(),
      sets:+$(".eSets",row).value||1,
      reps:$(".eReps",row).value.trim()||"8-12",
      weight:+$(".eWeight",row).value||0
    })).filter(e=>e.name);

    const errors=[];
    if(!name) errors.push("Informe o nome do treino.");
    if(exercises.length<1) errors.push("Adicione pelo menos um exercício ao treino.");

    const validation=$("#workoutValidation");
    if(errors.length){
      validation.hidden=false;
      validation.innerHTML=`<b>Não foi possível salvar:</b><ul>${errors.map(e=>`<li>${escapeHtml(e)}</li>`).join("")}</ul>`;
      validation.scrollIntoView({behavior:"smooth",block:"start"});
      return;
    }

    validation.hidden=true;
    validation.innerHTML="";

    const next={...workout,name,days:$$(".dayCheck:checked").map(x=>x.value),exercises};
    if(id) state.workouts=state.workouts.map(w=>w.id===id?next:w); else state.workouts.push(next);
    save(); closeModal(); currentView="workouts"; render(); toast("Treino salvo.");
  };
  if(id) $("#deleteWorkout").onclick=()=>{
    state.workouts=state.workouts.filter(w=>w.id!==id); save(); closeModal(); render(); toast("Treino excluído.");
  };
}

function exerciseEditorRow(e,i){
  return `<div class="card exercise-edit" data-id="${e.id}" data-library-id="${e.libraryId||""}">
    <div class="row">
      <div style="min-width:0">
        <div class="meta exercise-number">Exercício ${i+1}</div>
        <h3 class="selectedExerciseName" style="margin:4px 0;word-break:break-word">${escapeHtml(e.name||"Nenhum exercício selecionado")}</h3>
      </div>
      <button class="small-btn chooseExerciseBtn" type="button">${e.name?"Trocar":"Selecionar"}</button>
    </div>

    <input class="eName" type="hidden" value="${escapeHtml(e.name||"")}">

    <div class="inline-fields" style="margin-top:12px">
      <div class="form-group">
        <label>Séries</label>
        <input class="eSets" type="number" min="1" value="${e.sets||3}">
      </div>
      <div class="form-group">
        <label>Reps</label>
        <input class="eReps" value="${escapeHtml(e.reps||"8-12")}">
      </div>
    </div>

    <div class="form-group">
      <label>Peso sugerido (kg)</label>
      <input class="eWeight" type="number" step="0.5" value="${e.weight||0}">
    </div>

    <button class="danger removeExerciseBtn" type="button">Remover do treino</button>
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

function createSessionDraft(workout){
  const previous=[...state.sessions].reverse().find(s=>s.workoutId===workout.id);
  return {
    id:crypto.randomUUID(),
    workoutId:workout.id,
    workoutName:workout.name,
    date:todayISO(),
    exercises:workout.exercises.map(ex=>{
      const prevEx=previous?.exercises.find(x=>x.exerciseId===ex.id);
      return {
        exerciseId:ex.id,
        libraryId:ex.libraryId||null,
        name:ex.name,
        sets:Array.from({length:ex.sets},(_,i)=>{
          const prevSet=prevEx?.sets?.[i];
          return {
            weight:prevSet?.weight ?? ex.weight ?? 0,
            reps:prevSet?.reps ?? (parseInt(ex.reps)||0),
            done:false
          };
        })
      };
    })
  };
}

function persistActiveSessionFromUI(){
  if(!state.activeSession) return;
  state.activeSession.exercises=$$(".session-ex").map(exEl=>({
    exerciseId:exEl.dataset.id,
    libraryId:state.activeSession.exercises.find(x=>x.exerciseId===exEl.dataset.id)?.libraryId || null,
    name:state.activeSession.exercises.find(x=>x.exerciseId===exEl.dataset.id)?.name || "",
    sets:$$(".set-row",exEl).map(r=>({
      weight:+$(".set-weight",r).value||0,
      reps:+$(".set-reps",r).value||0,
      done:$(".check-set",r).classList.contains("checked")
    }))
  }));
  save();
}

function openSession(workoutId){
  const workout=state.workouts.find(w=>w.id===workoutId);
  if(!workout) return;

  // Resume same unfinished workout; otherwise create a new draft.
  if(!state.activeSession || state.activeSession.workoutId!==workoutId){
    state.activeSession=createSessionDraft(workout);
    save();
  }

  const draft=state.activeSession;

  const body=workout.exercises.map(ex=>{
    let draftEx=draft.exercises.find(x=>x.exerciseId===ex.id);

    // If exercise was added/changed after draft creation, rebuild only that part.
    if(!draftEx){
      draftEx={
        exerciseId:ex.id,
        libraryId:ex.libraryId||null,
        name:ex.name,
        sets:Array.from({length:ex.sets},()=>({weight:ex.weight||0,reps:parseInt(ex.reps)||0,done:false}))
      };
      draft.exercises.push(draftEx);
    }

    while(draftEx.sets.length<ex.sets){
      draftEx.sets.push({weight:ex.weight||0,reps:parseInt(ex.reps)||0,done:false});
    }
    if(draftEx.sets.length>ex.sets) draftEx.sets=draftEx.sets.slice(0,ex.sets);

    return `<section class="card session-ex" data-id="${ex.id}">
      <div class="row">
        <div>
          <h3>${escapeHtml(ex.name)}</h3>
          <div class="meta">Meta: ${ex.sets} × ${escapeHtml(ex.reps)}</div>
        </div>
        ${(()=>{
          const pr=getExercisePR(ex.name,null,ex.libraryId||null);
          return pr
            ? `<span class="pill pr-pill">PR ${pr.weight} kg × ${pr.reps}</span>`
            : `<span class="pill">${draftEx.sets.some(s=>s.done)?"Em andamento":"Sem PR ainda"}</span>`;
        })()}
      </div>
      ${(()=>{
        const pr=getExercisePR(ex.name,null,ex.libraryId||null);
        return pr ? `<div class="meta" style="margin-top:6px">Melhor carga registrada: <b>${pr.weight} kg × ${pr.reps} reps</b> · ${fmtDate(pr.date)}</div>` : "";
      })()}
      <div class="meta" style="margin:8px 0">Série · Peso (kg) · Reps</div>
      ${draftEx.sets.map((set,i)=>`
        <div class="set-row">
          <div class="set-num">${i+1}</div>
          <input class="set-weight" type="number" step="0.5" value="${set.weight}">
          <input class="set-reps" type="number" min="0" value="${set.reps}">
          <button type="button" class="check-set ${set.done?"checked":""}">✓</button>
        </div>`).join("")}
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
        <button class="secondary" type="button" id="startTimer">Iniciar 01:30</button>
        <button class="secondary" type="button" id="stopTimer">Parar</button>
      </div>
      <p class="meta" style="margin:10px 0 0">Ao concluir uma série, o descanso inicia automaticamente.</p>
    </section>
    ${body}`, `
      <button class="primary" type="button" id="finishSession">FINALIZAR TREINO</button>
      <button class="secondary" type="button" id="saveAndCloseSession">SALVAR E CONTINUAR DEPOIS</button>
      <button class="danger" type="button" id="discardSession">DESCARTAR TREINO EM ANDAMENTO</button>
    `);

  let timerSeconds=90;
  const refreshTimerLabel=()=>{
    const m=String(Math.floor(timerSeconds/60)).padStart(2,"0");
    const s=String(timerSeconds%60).padStart(2,"0");
    $("#restTime").textContent=`${m}:${s}`;
    $("#startTimer").textContent=`Iniciar ${m}:${s}`;
  };

  $("#minusTimer").onclick=()=>{timerSeconds=Math.max(15,timerSeconds-15);stopRestTimer();refreshTimerLabel();};
  $("#plusTimer").onclick=()=>{timerSeconds=Math.min(600,timerSeconds+15);stopRestTimer();refreshTimerLabel();};
  $("#startTimer").onclick=()=>startRestTimer(timerSeconds);
  $("#stopTimer").onclick=()=>{stopRestTimer();refreshTimerLabel();};

  $$(".set-weight, .set-reps").forEach(inp=>{
    inp.addEventListener("input",persistActiveSessionFromUI);
    inp.addEventListener("change",persistActiveSessionFromUI);
  });

  $$(".check-set").forEach(b=>b.onclick=()=>{
    const wasChecked=b.classList.contains("checked");
    b.classList.toggle("checked");

    if(!wasChecked && b.classList.contains("checked")){
      const row=b.closest(".set-row");
      const exEl=b.closest(".session-ex");
      const exerciseName=workout.exercises.find(e=>e.id===exEl.dataset.id)?.name || "";
      const weight=+$(".set-weight",row).value||0;
      const reps=+$(".set-reps",row).value||0;
      const libraryId=workout.exercises.find(e=>e.id===exEl.dataset.id)?.libraryId || null;
      const result=compareSetToPR(exerciseName,weight,reps,libraryId);

      if(result.status==="new"){
        b.classList.add("pr-new");
        setTimeout(()=>b.classList.remove("pr-new"),1800);
      }else if(result.status==="equal"){
        b.classList.add("pr-equal");
        setTimeout(()=>b.classList.remove("pr-equal"),1800);
      }

      showPRCelebration(result.status,exerciseName,weight,reps);
      startRestTimer(timerSeconds);
    }

    persistActiveSessionFromUI();
  });

  $("#saveAndCloseSession").onclick=()=>{
    persistActiveSessionFromUI();
    stopRestTimer();
    closeModal();
    toast("Treino salvo. Você pode continuar depois.");
  };

  $("#discardSession").onclick=()=>{
    if(!confirm("Descartar o treino em andamento? Os checks e valores ainda não finalizados serão apagados.")) return;
    state.activeSession=null;
    save();
    stopRestTimer();
    closeModal();
    toast("Treino em andamento descartado.");
  };

  $("#finishSession").onclick=()=>{
    persistActiveSessionFromUI();
    const finished=structuredClone(state.activeSession);
    finished.id=crypto.randomUUID();
    finished.date=todayISO();
    state.sessions.push(finished);
    state.activeSession=null;
    save();
    stopRestTimer();
    closeModal();
    currentView="history";
    render();
    toast("Treino registrado. Boa!");
  };
}

function renderHistory(app){
  const sessions=[...state.sessions].sort((a,b)=>b.date.localeCompare(a.date));
  app.innerHTML=`<section class="card">
    ${sessions.length ? sessions.map(s=>`
      <div class="list-item">
        <div><b>${escapeHtml(s.workoutName)}</b><div class="meta">${fmtDate(s.date)} · ${s.exercises.length} exercícios · Volume total: ${sessionVolume(s).toFixed(0)} kg</div></div>
        <button class="small-btn" data-session="${s.id}">Ver</button>
      </div>`).join("") : $("#emptyTemplate").innerHTML}
  </section>`;
  $$("[data-session]").forEach(b=>b.onclick=()=>showSession(b.dataset.session));
}

function normalizeExerciseName(name=""){
  return String(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .trim()
    .toLowerCase()
    .replace(/\s+/g," ");
}

function getExercisePR(name, excludeSessionId=null, libraryId=null){
  const target=normalizeExerciseName(name);
  let best=null;

  state.sessions.forEach(session=>{
    if(excludeSessionId && session.id===excludeSessionId) return;

    (session.exercises||[]).forEach(ex=>{
      const same = libraryId && ex.libraryId
        ? ex.libraryId===libraryId
        : normalizeExerciseName(ex.name)===target;

      if(!same) return;

      (ex.sets||[]).forEach(set=>{
        if(!set.done) return;

        const weight=+set.weight||0;
        const reps=+set.reps||0;
        if(weight<=0 || reps<=0) return;

        if(!best || weight>best.weight || (weight===best.weight && reps>best.reps)){
          best={
            weight,
            reps,
            date:session.date,
            workoutName:session.workoutName
          };
        }
      });
    });
  });

  return best;
}

function getAllExercisePRs(){
  const identities=new Map();

  state.sessions.forEach(session=>{
    (session.exercises||[]).forEach(ex=>{
      const key=ex.libraryId || normalizeExerciseName(ex.name);
      if(key && !identities.has(key)){
        identities.set(key,{
          name:ex.name,
          libraryId:ex.libraryId||null
        });
      }
    });
  });

  return [...identities.values()]
    .map(item=>({
      name:item.name,
      libraryId:item.libraryId,
      pr:getExercisePR(item.name,null,item.libraryId)
    }))
    .filter(item=>item.pr)
    .sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));
}

function isSetNewPR(exerciseName, weight, reps){
  const current=getExercisePR(exerciseName);
  if(!current) return weight>0 && reps>0;
  return weight>current.weight || (weight===current.weight && reps>current.reps);
}


function compareSetToPR(exerciseName, weight, reps, libraryId=null){
  const current=getExercisePR(exerciseName,null,libraryId);
  weight=+weight||0;
  reps=+reps||0;

  if(weight<=0 || reps<=0) return {status:"none",current};

  if(!current) return {status:"new",current:null};

  if(weight>current.weight || (weight===current.weight && reps>current.reps)){
    return {status:"new",current};
  }

  if(weight===current.weight && reps===current.reps){
    return {status:"equal",current};
  }

  return {status:"none",current};
}

function showPRCelebration(status, exerciseName, weight, reps){
  if(status==="new"){
    toast(`🔥 NOVO PR! ${exerciseName}: ${weight} kg × ${reps}. É ISSO AÍ!`);
  }else if(status==="equal"){
    toast(`💪 PR IGUALADO! ${exerciseName}: ${weight} kg × ${reps}. Continua assim!`);
  }
}

function sessionVolume(s){
  return s.exercises
    .flatMap(e=>e.sets)
    .reduce((sum,x)=>sum+(x.done?(+x.weight||0)*(+x.reps||0):0),0);
}
function showSession(id){
  const s=state.sessions.find(x=>x.id===id); if(!s)return;
  openModal(`${s.workoutName} · ${fmtDate(s.date)}`, s.exercises.map(e=>{
    const pr=getExercisePR(e.name);
    return `
      <div class="card">
        <div class="row">
          <h3 style="margin:0">${escapeHtml(e.name)}</h3>
          ${pr?`<span class="pill pr-pill">PR ${pr.weight} kg × ${pr.reps}</span>`:""}
        </div>
        ${e.sets.map((set,i)=>`<div class="list-item"><span>Série ${i+1}</span><b>${set.weight} kg × ${set.reps} ${set.done?"✓":""}</b></div>`).join("")}
      </div>`;
  }).join(""), `<button class="danger" id="deleteSession" type="button">Excluir registro</button>`);
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
    <section class="card">
      <canvas id="volumeChart" width="440" height="220"></canvas>
      <p class="meta" style="margin:10px 2px 0">Volume = peso × repetições de todas as séries concluídas. Ele não representa a carga da barra, e sim o trabalho total registrado.</p>
    </section>

    <div class="section-title"><h2>PRs por exercício</h2></div>
    <section class="card">
      ${(()=>{
        const prs=getAllExercisePRs();
        if(!prs.length){
          return `<div class="empty-state" style="padding:24px 10px"><div class="empty-icon">🏆</div><h3>Sem PRs ainda</h3><p>Finalize séries com carga e repetições para começar a registrar seus recordes.</p></div>`;
        }

        return `
          <div class="form-group" style="margin-bottom:10px">
            <input id="prSearch" placeholder="Buscar exercício..." autocomplete="off">
          </div>
          <div id="prList"></div>
          ${prs.length>6?`<button class="secondary" type="button" id="toggleAllPRs" style="margin-top:12px">Ver todos (${prs.length})</button>`:""}
          <div class="meta" id="prCount" style="margin-top:10px"></div>
        `;
      })()}
    </section>

    <section class="card">
      <h3>Backup e restauração</h3>
      <p class="muted">O backup inclui treinos, exercícios, histórico, cargas, avaliações corporais e configurações.</p>
      <div class="stack">
        <button class="secondary" id="exportData">Exportar backup completo (.json)</button>
        <button class="secondary" id="importData">Importar backup (.json)</button>
        <input id="importFile" type="file" accept="application/json,.json" hidden>
      </div>
    </section>

    <section class="card">
      <h3>Zona de reset</h3>
      <p class="muted">Escolha exatamente o que deseja apagar. Cada ação pede confirmação.</p>
      <div class="stack">
        <button class="danger" id="resetProgress">Resetar progresso e histórico</button>
        <button class="danger" id="resetWorkouts">Resetar fichas de treino</button>
        <button class="danger" id="resetAll">Resetar tudo</button>
      </div>
    </section>`;
  drawChart($("#weightChart"), body.map(x=>({label:x.date.slice(5),fullDate:x.date,value:x.weight})), {label:"Peso",suffix:" kg"});
  drawChart($("#volumeChart"), [...state.sessions].sort((a,b)=>a.date.localeCompare(b.date)).map(x=>({label:x.date.slice(5),fullDate:x.date,value:Math.round(sessionVolume(x))})).slice(-12), {label:"Volume",suffix:" kg"});

  const allPRs=getAllExercisePRs();
  let showingAllPRs=false;

  const renderPRList=(filter="")=>{
    const list=$("#prList");
    if(!list) return;

    const normalized=normalizeExerciseName(filter);
    const filtered=allPRs.filter(item=>normalizeExerciseName(item.name).includes(normalized));
    const rows=(showingAllPRs || normalized ? filtered : filtered.slice(0,6));

    list.innerHTML=rows.length
      ? rows.map(item=>`
          <div class="list-item pr-row">
            <div>
              <b>${escapeHtml(item.name)}</b>
              <div class="meta">${fmtDate(item.pr.date)} · ${escapeHtml(item.pr.workoutName||"Treino")}</div>
            </div>
            <span class="pill pr-pill">${item.pr.weight} kg × ${item.pr.reps}</span>
          </div>
        `).join("")
      : `<div class="empty-state" style="padding:18px 8px"><p>Nenhum exercício encontrado.</p></div>`;

    const count=$("#prCount");
    if(count) count.textContent=`${rows.length} de ${filtered.length} exercícios`;

    const toggle=$("#toggleAllPRs");
    if(toggle && !normalized){
      toggle.textContent=showingAllPRs ? "Mostrar menos" : `Ver todos (${allPRs.length})`;
    }
  };

  const prSearch=$("#prSearch");
  if(prSearch){
    prSearch.oninput=()=>renderPRList(prSearch.value);
    renderPRList("");
  }

  const toggle=$("#toggleAllPRs");
  if(toggle) toggle.onclick=()=>{
    showingAllPRs=!showingAllPRs;
    renderPRList(prSearch?.value||"");
  };

  $("#exportData").onclick=exportData;
  $("#importData").onclick=()=>$("#importFile").click();
  $("#importFile").onchange=importData;
  $("#resetProgress").onclick=resetProgressData;
  $("#resetWorkouts").onclick=resetWorkoutData;
  $("#resetAll").onclick=resetAllData;
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
function buildBackup(){
  return {
    app: "Gym Pocket",
    backupVersion: 2,
    exportedAt: new Date().toISOString(),
    summary: {
      workouts: state.workouts.length,
      sessions: state.sessions.length,
      bodyAssessments: state.body.length
    },
    data: {
      exerciseLibrary: state.exerciseLibrary,
      workouts: state.workouts,
      sessions: state.sessions,
      body: state.body,
      activeSession: state.activeSession,
      settings: state.settings
    }
  };
}

function exportData(){
  const backup=buildBackup();
  const blob=new Blob([JSON.stringify(backup,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=`gym-pocket-backup-completo-${todayISO()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast("Backup completo exportado.");
}

function normalizeImportedData(parsed){
  // Aceita backups novos e também exports antigos do Gym Pocket.
  const data=parsed?.data && parsed?.app==="Gym Pocket" ? parsed.data : parsed;
  if(!data || typeof data!=="object") throw new Error("Formato inválido");
  return {
    exerciseLibrary:Array.isArray(data.exerciseLibrary)?data.exerciseLibrary:[],
    workouts:Array.isArray(data.workouts)?data.workouts:[],
    sessions:Array.isArray(data.sessions)?data.sessions:[],
    body:Array.isArray(data.body)?data.body:[],
    activeSession:data.activeSession||null,
    settings:data.settings && typeof data.settings==="object" ? data.settings : {}
  };
}

function mergeById(current,incoming){
  const map=new Map();
  [...current,...incoming].forEach(item=>{
    if(!item || typeof item!=="object") return;
    const key=item.id || crypto.randomUUID();
    map.set(key,{...item,id:key});
  });
  return [...map.values()];
}

function mergeImportedData(incoming){
  state={
    exerciseLibrary:mergeById(state.exerciseLibrary,incoming.exerciseLibrary),
    workouts:mergeById(state.workouts,incoming.workouts),
    sessions:mergeById(state.sessions,incoming.sessions),
    body:mergeById(state.body,incoming.body),
    activeSession:state.activeSession || incoming.activeSession || null,
    settings:{...state.settings,...incoming.settings}
  };
}

function replaceImportedData(incoming){
  state={
    exerciseLibrary:incoming.exerciseLibrary,
    workouts:incoming.workouts,
    sessions:incoming.sessions,
    body:incoming.body,
    activeSession:incoming.activeSession||null,
    settings:{...defaultData.settings,...incoming.settings}
  };
}

function importData(e){
  const file=e.target.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const parsed=JSON.parse(reader.result);
      const incoming=normalizeImportedData(parsed);

      openModal("Importar backup", `
        <div class="card">
          <h3>Backup encontrado</h3>
          <div class="list-item"><span>Treinos</span><b>${incoming.workouts.length}</b></div>
          <div class="list-item"><span>Registros no histórico</span><b>${incoming.sessions.length}</b></div>
          <div class="list-item"><span>Avaliações corporais</span><b>${incoming.body.length}</b></div>
        </div>
        <p class="muted"><b>Mesclar</b> mantém seus dados atuais e adiciona/atualiza os dados do backup.</p>
        <p class="muted"><b>Substituir</b> apaga os dados atuais e deixa somente o conteúdo do backup.</p>
      `, `
        <button class="primary" id="mergeBackup" type="button">Mesclar com dados atuais</button>
        <button class="danger" id="replaceBackup" type="button">Substituir dados atuais</button>
      `);

      $("#mergeBackup").onclick=()=>{
        mergeImportedData(incoming);
        save();
        closeModal();
        render();
        toast("Backup mesclado com sucesso.");
      };

      $("#replaceBackup").onclick=()=>{
        if(!confirm("Isso vai substituir os dados atuais do Gym Pocket. Deseja continuar?")) return;
        replaceImportedData(incoming);
        save();
        closeModal();
        render();
        toast("Dados substituídos pelo backup.");
      };
    }catch{
      toast("Arquivo de backup inválido.");
    }finally{
      e.target.value="";
    }
  };
  reader.readAsText(file);
}

function resetProgressData(){
  if(!confirm("Resetar todo o progresso? Isso apagará o histórico de treinos e todas as avaliações corporais, mas manterá suas fichas de treino.")) return;
  state.sessions=[];
  state.body=[];
  state.activeSession=null;
  save();
  render();
  toast("Progresso e histórico resetados.");
}

function resetWorkoutData(){
  if(!confirm("Resetar todas as fichas de treino? O histórico e as avaliações corporais serão mantidos.")) return;
  state.workouts=[];
  state.activeSession=null;
  save();
  render();
  toast("Fichas de treino resetadas.");
}

function resetAllData(){
  if(!confirm("RESETAR TUDO? Isso apagará treinos, histórico, avaliações e configurações salvas neste aparelho.")) return;
  if(!confirm("Última confirmação: deseja realmente apagar todos os dados do Gym Pocket?")) return;
  state={exerciseLibrary:[],workouts:[],sessions:[],body:[],activeSession:null,settings:{...defaultData.settings}};
  save();
  render();
  toast("Gym Pocket resetado.");
}

function focusExerciseRow(row){
  if(!row) return;
  requestAnimationFrame(()=>{
    row.scrollIntoView({behavior:"smooth",block:"center"});
    const firstInput=$(".eSets",row) || $(".eReps",row) || $(".eWeight",row);
    if(firstInput){
      setTimeout(()=>{
        firstInput.focus({preventScroll:true});
        if(firstInput.select) firstInput.select();
      },250);
    }
  });
}

function openModal(title,body,actions=""){
  $("#modalTitle").textContent=title; $("#modalBody").innerHTML=body; $("#modalActions").innerHTML=actions; $("#modal").showModal();
}
function closeModal(){
  clearInterval(restTimerInterval);
  if(state.activeSession && $$(".session-ex").length) persistActiveSessionFromUI();
  $("#modal").close();
}
$("#modalClose").onclick=closeModal;
$$(".nav-item").forEach(b=>b.onclick=()=>{ currentView=b.dataset.view; render(); });

window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("#installBtn").hidden=false;});
$("#installBtn").onclick=async()=>{ if(!deferredPrompt)return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; $("#installBtn").hidden=true; };

if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
render();
