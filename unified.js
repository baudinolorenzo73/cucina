'use strict';
window.CucinaUnita=(()=>{
 const KEYS=['lollo-ricettario-v1','ricettario-menu-calendar-v1','ricettario-community-shopping-v2','ricettario-shopping-v2','ricettario-appearance-v2','ricettario-theme','turni_offline_state_v1'];
 const $=id=>document.getElementById(id);
 let api,frameReady=false;
 const engine=()=>$('turniFrame')?.contentWindow?.CucinaTurniAPI;
 const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function getMenu(date){return window.MenuCalendar.getDay(date)}
 function openMenu(date){api.openView('menu');window.MenuCalendar.selectDate(date)}
 function assignment(date){
  const s=engine()?.snapshot();if(!s)return null;
  const [y,m,g]=date.split('-').map(Number),current=s.anno===y&&s.mese===m;
  const currentSpecial=current?s.giorniSpeciali?.find(x=>x.giorno===g):null;
  const archived=s.storico?.[y+'-'+m];
  const record=current&&(s.griglia||currentSpecial)?s:archived;if(!record)return null;
  // Never present an invalidated generated plan as an assignment.
  const d=record.griglia?.[g],special=record.giorniSpeciali?.find(x=>x.giorno===g);
  if(!d&&!special)return null;
  return {archived:record!==s,cucina:special?special.cucina.join(', '):d.CUCINA||'Da assegnare',servizio:special?special.servizio.join(', '):d.SERVIZIO||'Da assegnare',affCucina:d?.affCucina,affServizio:d?.affServizio};
 }
 function renderAssignment(date){
  const el=$('menuTurni');if(!el)return;el.dataset.date=date;const a=assignment(date);
  el.innerHTML='<h3>Turni cucina e servizio</h3>'+(a?.archived?'<p>Dal piano archiviato del mese.</p>':'')+(a?'<p><b>Cucina:</b> '+safe(a.cucina)+(a.affCucina?' · affiancamento '+safe(a.affCucina):'')+'</p><p><b>Servizio:</b> '+safe(a.servizio)+(a.affServizio?' · affiancamento '+safe(a.affServizio):'')+'</p>':'<p>Nessun turno salvato per questa data. Puoi generarlo o importare il backup della vecchia app.</p>')+'<button type="button" id="openTurniDate">Apri i turni del mese</button>';
  $('openTurniDate').onclick=()=>{api.openView('turni');engine()?.showMonth(date)};
 }
 function syncTheme(){
  if(!frameReady)return;const s=getComputedStyle(document.body),map={'--bg':'--bg','--card':'--paper','--surface2':'--paper','--ink':'--ink','--muted':'--muted','--line':'--line','--accent':'--accent','--accent-text':'--on-accent','--accent2':'--secondary','--modal-bg':'--paper','--header-bg':'--paper'};
  engine()?.setTheme(document.body.classList.contains('dark'),Object.fromEntries(Object.entries(map).map(([k,v])=>[k,s.getPropertyValue(v)])));
 }
 function turnsChanged(){syncTheme();const date=$('menuTurni')?.dataset.date;if(date)renderAssignment(date)}
 function turnsReady(){frameReady=true;syncTheme();turnsChanged()}
 function recoverStorage(){const data={};for(const key of window.CucinaDataGuard.KEYS)data[key]=localStorage.getItem(key);api.download('Cucina_recupero_originali_'+Date.now()+'.json',JSON.stringify({format:'lollo-cucina-recupero',data,issues:window.CucinaDataGuard.issues()},null,2));api.toast('Copia originale esportata per il recupero. Questo file conserva anche eventuali sezioni non leggibili.');}
 function assignmentHTML(date){const a=assignment(date);return a?'<div class="menu-notes"><b>Turni'+(a.archived?' · archivio':'')+'</b><p>Cucina: '+safe(a.cucina)+(a.affCucina?' · affiancamento '+safe(a.affCucina):'')+'<br>Servizio: '+safe(a.servizio)+(a.affServizio?' · affiancamento '+safe(a.affServizio):'')+'</p></div>':''}
 function exportAll(){
  if(window.CucinaDataGuard.issues().length)throw Error('Alcuni salvataggi sono protetti: usa Recupera salvataggi originali prima di ripristinare un backup valido.');
  if(!engine())throw Error('Attendi il caricamento della sezione turni.');
  const data={};for(const key of KEYS)data[key]=localStorage.getItem(key);
  data['lollo-ricettario-v1']=JSON.stringify(api.recipeState());
  data['ricettario-menu-calendar-v1']=JSON.stringify(window.MenuCalendar.exportData());
  data['ricettario-community-shopping-v2']=JSON.stringify(window.CommunityShopping.exportData());
  data['ricettario-shopping-v2']=JSON.stringify(window.RecipeShopping.exportData());
  data.turni_offline_state_v1=JSON.stringify(engine().snapshot());
  api.download('La_nostra_cucina_backup_'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify({format:'lollo-cucina-unita',version:2,exportedAt:new Date().toISOString(),data},null,2));
  api.toast('Backup completo esportato: ricette, menù, spesa, turni e colori. Chiavi API escluse.');
 }
 function validateAll(x){
  if(x?.format!=='lollo-cucina-unita'||x.version!==2||!x.data||typeof x.data!=='object')throw Error('Backup unico non valido.');
  if(!engine())throw Error('Attendi il caricamento della sezione turni.');
  for(const key of KEYS){const raw=x.data[key];if(raw!==null&&typeof raw!=='string')throw Error('Sezione mancante o non valida: '+key);if(raw!==null)window.CucinaDataGuard.validate(key,key==='ricettario-theme'?raw:JSON.parse(raw))}
  api.validateRecipes(JSON.parse(x.data['lollo-ricettario-v1']));
  const t=JSON.parse(x.data.turni_offline_state_v1),err=engine().validate(t);if(err)throw Error(err);
  const m=JSON.parse(x.data['ricettario-menu-calendar-v1']);if(m?.version!==1||!m.templates||!m.overrides)throw Error('Calendario menù non valido.');
  const c=JSON.parse(x.data['ricettario-community-shopping-v2']);if(c?.version!==2||!c.days)throw Error('Archivio spesa non valido.');
 }
 function importAll(x){
  validateAll(x);if(!confirm('Ripristinare ricette, menù, spesa, turni e colori da questo backup? Prima di procedere puoi annullare ed esportare i dati attuali.'))return;
  const before=Object.fromEntries(KEYS.map(k=>[k,localStorage.getItem(k)]));
  try{for(const k of KEYS)localStorage.removeItem(k);for(const k of KEYS)if(x.data[k]!==null)localStorage.setItem(k,x.data[k])}
  catch(e){let failed=false;for(const k of KEYS){try{localStorage.removeItem(k)}catch{failed=true}}for(const k of KEYS){try{if(before[k]!==null)localStorage.setItem(k,before[k])}catch{failed=true}}if(failed){api.download('Cucina_recupero_prima_del_ripristino.json',JSON.stringify({format:'lollo-cucina-unita',version:2,data:before},null,2));throw Error('Ripristino non riuscito: scaricata una copia dei dati precedenti per il recupero.')}throw Error('Spazio insufficiente: ripristino annullato, dati precedenti conservati.')}
  location.reload();
 }
 function refresh(){syncTheme();$('turniFrame').contentWindow?.aggiornaMenuCollegati?.()}
 function init(options){
  api=options;
  $('recoverStorage').onclick=()=>{try{recoverStorage()}catch(e){api.toast(e.message)}};
  $('unifiedBackup').onclick=()=>{try{exportAll()}catch(e){api.toast(e.message)}};
  $('unifiedRestore').onclick=()=>$('unifiedImportFile').click();
  $('unifiedImportFile').onchange=async e=>{try{const f=e.target.files[0];if(!f)return;if(f.size>30*1024*1024)throw Error('Il file supera 30 MB.');importAll(JSON.parse(await f.text()))}catch(err){api.toast(err.message)}finally{e.target.value=''}};
  $('legacyTurniImport').onclick=()=>$('legacyTurniFile').click();
  $('legacyTurniFile').onchange=async e=>{try{const f=e.target.files[0];if(!f)return;if(f.size>20*1024*1024)throw Error('Il file supera 20 MB.');if(!engine())throw Error('Attendi il caricamento dei turni.');const d=JSON.parse(await f.text()),err=engine().validate(d);if(err)throw Error(err);if(!confirm('Importare persone, regole e turni dal backup selezionato? I turni attualmente aperti saranno sostituiti.'))return;engine().importData(d);api.toast('Turni importati. Ricette, menù e spesa sono disponibili nello stesso programma.')}catch(err){api.toast('Importazione non riuscita: '+err.message)}finally{e.target.value=''}};
  $('turniFrame').addEventListener('load',turnsReady);
  new MutationObserver(syncTheme).observe(document.body,{attributes:true,attributeFilter:['class','style']});
  if(window.TURNI_DOCUMENT)$('turniFrame').srcdoc=window.TURNI_DOCUMENT;else $('turniFrame').src='./turni.html';
 }
 return{init,assignment,assignmentHTML,recoverStorage,getMenu,openMenu,renderAssignment,turnsChanged,turnsReady,exportAll,importAll,refresh};
})();

