'use strict';
window.CommunityShopping=(()=>{
  const KEY='ricettario-community-shopping-v2',OLD_KEY='ricettario-community-shopping-v1',STORES=['Angelo','Eurospin','Altro'];
  const SOURCE=`Colazione/Merenda\tBiscotti
Colazione/Merenda\tCaffè
Colazione/Merenda\tCioccolato in polvere
Colazione/Merenda\tMiele
Colazione/Merenda\tOrzo
Colazione/Merenda\tTè
Colazione/Merenda\tTisane
Cucina/Cibo\tGrissini
Cucina/Cibo\tDolcificante
Cucina/Cibo\tZucchero bianco
Cucina/Cibo\tZucchero di canna
Cucina/Cibo\tCeci
Cucina/Cibo\tFagioli
Cucina/Cibo\tLegumi secchi
Cucina/Cibo\tLenticchie in scatola
Cucina/Cibo\tMais
Cucina/Cibo\tMarmellata
Cucina/Cibo\tPassata di pomodoro
Cucina/Cibo\tPolpa di pomodoro
Animali\tCrocchette cani
Animali\tCrocchette gatti
Animali\tScatolette cani
Animali\tScatolette gatti
Casa/Pulizia\tAmmoniaca
Casa/Pulizia\tAmmorbidente
Casa/Pulizia\tCandeggina 5L
Casa/Pulizia\tCarta igienica
Casa/Pulizia\tDetersivo lavatrice
Casa/Pulizia\tDetersivo pavimenti 2L
Casa/Pulizia\tGuanti monouso M/L
Casa/Pulizia\tPagliette
Casa/Pulizia\tPanni cucina
Casa/Pulizia\tRotoloni carta
Casa/Pulizia\tSacchi pattumiera 80x110
Casa/Pulizia\tScope e palette
Casa/Pulizia\tSpugne per bagni
Casa/Pulizia\tSpugne per pentole
Casa/Pulizia\tStuzzicadenti
Casa/Pulizia\tTovaglioli
Igiene Personale\tAssorbenti
Igiene Personale\tBagnoschiuma
Igiene Personale\tBalsamo capelli
Igiene Personale\tDentifricio
Igiene Personale\tDetergente intimo
Igiene Personale\tDeodorante ambiente
Igiene Personale\tFazzoletti
Igiene Personale\tLamette
Igiene Personale\tSaponetta
Igiene Personale\tSchiuma da barba
Igiene Personale\tShampoo
Igiene Personale\tSpazzolini da denti
Formaggi/Carne/Pesce/Freschi\tAffettati in vaschetta
Formaggi/Carne/Pesce/Freschi\tArrosto
Formaggi/Carne/Pesce/Freschi\tBonroll
Formaggi/Carne/Pesce/Freschi\tBurro
Formaggi/Carne/Pesce/Freschi\tCosce/fettine di pollo
Formaggi/Carne/Pesce/Freschi\tFiletti di pesce
Formaggi/Carne/Pesce/Freschi\tFormaggio
Formaggi/Carne/Pesce/Freschi\tLatte
Formaggi/Carne/Pesce/Freschi\tLievito di pizza
Formaggi/Carne/Pesce/Freschi\tMix grattugiato
Formaggi/Carne/Pesce/Freschi\tMozzarelle
Formaggi/Carne/Pesce/Freschi\tPanna per dolci
Formaggi/Carne/Pesce/Freschi\tPasta fresca
Formaggi/Carne/Pesce/Freschi\tPasta sfoglia
Formaggi/Carne/Pesce/Freschi\tPetti di pollo
Formaggi/Carne/Pesce/Freschi\tRagù
Formaggi/Carne/Pesce/Freschi\tRicotta
Formaggi/Carne/Pesce/Freschi\tRolatine di pollo
Formaggi/Carne/Pesce/Freschi\tSalamino piccante
Formaggi/Carne/Pesce/Freschi\tSalsiccia
Cucina/Cibo\tAcciughe
Cucina/Cibo\tCapperi
Cucina/Cibo\tCous-cous
Cucina/Cibo\tDado
Cucina/Cibo\tFarina integrale/manitoba
Cucina/Cibo\tOlive nere
Cucina/Cibo\tOlive verdi
Cucina/Cibo\tOlio di semi
Cucina/Cibo\tOlio EVO
Cucina/Cibo\tOlio di oliva
Cucina/Cibo\tPanna da cucina
Cucina/Cibo\tPangrattato
Cucina/Cibo\tPasta minestre
Cucina/Cibo\tPastina per lasagna
Cucina/Cibo\tPasta sfoglia
Cucina/Cibo\tRiso
Cucina/Cibo\tSale fino
Cucina/Cibo\tSale grosso
Cucina/Cibo\tSpezie
Cucina/Cibo\tTonno in scatola grande
Cucina/Cibo\tTonno in scatola piccolo
Cucina/Cibo\tUova
Cucina/Cibo\tZafferano
Altro per la casa/Pulizia\tAlluminio
Altro per la casa/Pulizia\tBicchieri plastica grandi
Altro per la casa/Pulizia\tBicchieri plastica piccoli
Altro per la casa/Pulizia\tCarta forno
Altro per la casa/Pulizia\tPellicola
Altro per la casa/Pulizia\tPiatti plastica
Altro per la casa/Pulizia\tPosate plastica
Prodotti Eurospin\tCorn flakes\tEurospin
Prodotti Eurospin\tCrackers\tEurospin
Prodotti Eurospin\tDeodorante corpo no alcol\tEurospin
Prodotti Eurospin\tSalvaslip\tEurospin
Prodotti Eurospin\tFarina di grano 00\tEurospin
Prodotti Eurospin\tFette biscottate\tEurospin
Prodotti Eurospin\tMuslei\tEurospin
Prodotti Eurospin\tYogurt\tEurospin
Prodotti Eurospin\tWurstel\tEurospin`;
  const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uid=()=>crypto.randomUUID?.()||'community-'+Date.now()+'-'+Math.random().toString(36).slice(2);
  const seed=()=>({version:1,other:'',items:SOURCE.split('\n').map((line,i)=>{const [department,name,store]=line.split('\t');return{id:'drive-'+i,department,name,qty:'',store:store||'Angelo',selected:false,custom:false}})});
  let api,archive={version:2,activeDate:'',days:{}},data=seed(),editing='';
  const today=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`};
  function validDate(v){return /^\d{4}-\d{2}-\d{2}$/.test(v||'')}
  function validItem(i){return i&&typeof i.id==='string'&&typeof i.name==='string'&&i.name.trim()&&typeof i.department==='string'}
  function sanitizeDay(x){const d={version:1,other:typeof x?.other==='string'?x.other.slice(0,20000):'',items:Array.isArray(x?.items)?x.items.filter(validItem).slice(0,2000).map(i=>({id:i.id,name:i.name.slice(0,180),department:i.department.slice(0,100),qty:typeof i.qty==='string'?i.qty.slice(0,80):'',store:STORES.includes(i.store)?i.store:'Altro',selected:!!i.selected,custom:!!i.custom})):[]};return d}
  function ensureDay(date){if(!archive.days[date])archive.days[date]=seed();return archive.days[date]}
  function load(){const date=today();if(window.CucinaDataGuard?.isBlocked(KEY)){archive={version:2,activeDate:date,days:{}};data=ensureDay(date);return}try{const x=JSON.parse(localStorage.getItem(KEY));if(x?.version===2&&x.days&&typeof x.days==='object'){archive={version:2,activeDate:validDate(x.activeDate)?x.activeDate:date,days:{}};for(const [day,value] of Object.entries(x.days))if(validDate(day))archive.days[day]=sanitizeDay(value)}else{const old=JSON.parse(localStorage.getItem(OLD_KEY));archive={version:2,activeDate:date,days:{[date]:sanitizeDay(old||seed())}}}}catch{archive={version:2,activeDate:date,days:{}}}data=ensureDay(archive.activeDate)}
  function markSaved(){const e=$('communitySaved');if(e)e.textContent='Salvato automaticamente · '+new Date().toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})}
  function save(render=true){if(window.CucinaDataGuard?.isBlocked(KEY)){$('communityStatus').textContent='Salvataggio protetto: recupera i dati originali e ripristina un backup valido.';return false}archive.days[archive.activeDate]=data;try{localStorage.setItem(KEY,JSON.stringify(archive));markSaved()}catch{if($('communityStatus'))$('communityStatus').textContent='Salvataggio locale non riuscito. Esporta subito l’archivio.'}if(render)renderList()}
  function renderHistory(){const days=Object.keys(archive.days).sort().reverse();$('communityHistory').innerHTML=days.map(d=>{const n=archive.days[d].items.filter(i=>i.selected||i.qty.trim()).length;return `<option value="${d}" ${d===archive.activeDate?'selected':''}>${new Date(d+'T12:00:00').toLocaleDateString('it-IT')} · ${n} prodotti</option>`}).join('');$('communityDate').value=archive.activeDate}
  function switchDay(date){if(!validDate(date))return;save(false);archive.activeDate=date;data=ensureDay(date);$('communityOther').value=data.other;$('communitySearch').value='';$('communityStoreFilter').value='';save();$('communityStatus').textContent='Giornata '+new Date(date+'T12:00:00').toLocaleDateString('it-IT')+' aperta.'}
  function filtered(){const q=$('communitySearch').value.trim().toLocaleLowerCase('it'),store=$('communityStoreFilter').value;return data.items.filter(i=>(!store||i.store===store)&&(!q||(i.name+' '+i.department).toLocaleLowerCase('it').includes(q)))}
  function row(i){return `<div class="community-row ${i.selected?'selected':''}"><input type="checkbox" data-community-check="${esc(i.id)}" ${i.selected?'checked':''} aria-label="Da comprare: ${esc(i.name)}"><button class="community-name" data-community-edit="${esc(i.id)}"><strong>${esc(i.name)}</strong><small>${esc(i.department)}</small></button><input data-community-qty="${esc(i.id)}" value="${esc(i.qty)}" maxlength="80" placeholder="Quantità" aria-label="Quantità per ${esc(i.name)}"><select data-community-store="${esc(i.id)}" aria-label="Supermercato per ${esc(i.name)}">${STORES.map(s=>`<option ${i.store===s?'selected':''}>${s}</option>`).join('')}</select><button class="community-edit" data-community-edit="${esc(i.id)}" aria-label="Modifica ${esc(i.name)}">✎</button></div>`}
  function renderList(){const list=filtered(),departments=[...new Set(list.map(i=>i.department))];$('communityList').innerHTML=departments.length?departments.map(d=>`<section class="community-department"><h3>${esc(d)}</h3>${list.filter(i=>i.department===d).map(row).join('')}</section>`).join(''):'<div class="empty-mini">Nessun prodotto trovato.</div>';const active=data.items.filter(i=>i.selected||i.qty.trim()).length;$('communitySummary').textContent=`${active} da comprare · ${data.items.length} prodotti totali`;if($('communityOther').value!==data.other)$('communityOther').value=data.other;renderHistory()}
  function activeItems(){return data.items.filter(i=>i.selected||i.qty.trim())}
  function printHtml(){const items=activeItems(),other=data.other.trim();if(!items.length&&!other)throw Error('Spunta almeno un prodotto, inserisci una quantità oppure scrivi nello spazio ALTRO.');const size=items.length>90?'6pt':items.length>60?'7pt':items.length>35?'8pt':'9pt';let body='';for(const store of STORES){const storeItems=items.filter(i=>i.store===store);if(!storeItems.length)continue;body+=`<section class="community-print-store"><h2>${esc(store)}</h2>`;for(const dep of [...new Set(storeItems.map(i=>i.department))])body+=`<div class="community-print-group"><h3>${esc(dep)}</h3>${storeItems.filter(i=>i.department===dep).map(i=>`<div class="community-print-row"><span>☐</span><b>${esc(i.name)}</b><em>${esc(i.qty||'________')}</em></div>`).join('')}</div>`;body+='</section>'}if(other)body+=`<section class="community-print-other"><h2>ALTRO</h2><p>${esc(other).replace(/\n/g,'<br>')}</p></section>`;return `<div class="community-print" style="--community-print-size:${size}"><header><h1>Lista della spesa · Comunità</h1><p>${new Date(archive.activeDate+'T12:00:00').toLocaleDateString('it-IT')} · ${items.length} prodotti</p></header><div class="community-print-columns">${body}</div></div>`}
  function print(){try{api.printHTML(printHtml());$('communityStatus').textContent='Anteprima A4 pronta. Controlla e premi “Stampa ora”.'}catch(e){$('communityStatus').textContent=e.message}}
  function openEdit(id){const i=data.items.find(x=>x.id===id);if(!i)return;editing=id;$('communityEditName').value=i.name;$('communityEditQty').value=i.qty;$('communityEditDepartment').value=i.department;$('communityEditStore').value=i.store;$('communityEditDialog').showModal()}
  function csv(){const lines=[['Data','Supermercato','Reparto','Prodotto','Quantità'],...activeItems().map(i=>[archive.activeDate,i.store,i.department,i.name,i.qty])];if(data.other.trim())lines.push([archive.activeDate,'Altro','ALTRO',data.other.replace(/\n/g,' / '),'']);const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';return '\ufeff'+lines.map(r=>r.map(q).join(';')).join('\r\n')}
  function exportArchive(){save(false);api.download('Spesa_comunita_archivio_'+today()+'.json',JSON.stringify({...archive,exportedAt:new Date().toISOString()},null,2),'application/json');$('communityStatus').textContent=Object.keys(archive.days).length+' giornate esportate.'}
  function importArchive(x){window.CucinaDataGuard?.validate(KEY,x);if(!x||x.version!==2||!x.days||typeof x.days!=='object')throw Error('Scegli un archivio JSON della spesa comunità.');let count=0;for(const [day,value] of Object.entries(x.days))if(validDate(day)){archive.days[day]=sanitizeDay(value);count++}if(!count)throw Error('L’archivio non contiene giornate valide.');data=ensureDay(archive.activeDate);save();$('communityStatus').textContent=count+' giornate importate e unite all’archivio.'}
  function init(options){api=options;load();$('communityOther').value=data.other;renderList();$('communityDate').onchange=e=>switchDay(e.target.value);$('communityHistory').onchange=e=>switchDay(e.target.value);$('communityToday').onclick=()=>switchDay(today());$('communityCopyPrevious').onclick=()=>{const prev=Object.keys(archive.days).filter(d=>d<archive.activeDate).sort().pop();if(!prev){$('communityStatus').textContent='Non ci sono giornate precedenti da copiare.';return}if((activeItems().length||data.other.trim())&&!confirm('Sostituire il contenuto del giorno aperto con quello del '+new Date(prev+'T12:00:00').toLocaleDateString('it-IT')+'?'))return;data=JSON.parse(JSON.stringify(archive.days[prev]));archive.days[archive.activeDate]=data;$('communityOther').value=data.other;save();$('communityStatus').textContent='Giornata precedente copiata.'};$('communitySearch').oninput=renderList;$('communityStoreFilter').onchange=renderList;$('communityList').onclick=e=>{const b=e.target.closest('[data-community-edit]');if(b)openEdit(b.dataset.communityEdit)};$('communityList').onchange=e=>{const check=e.target.dataset.communityCheck,store=e.target.dataset.communityStore;if(check){const i=data.items.find(x=>x.id===check);i.selected=e.target.checked;save()}if(store){const i=data.items.find(x=>x.id===store);i.store=e.target.value;save()}};$('communityList').oninput=e=>{const id=e.target.dataset.communityQty;if(!id)return;const i=data.items.find(x=>x.id===id);i.qty=e.target.value.slice(0,80);if(i.qty.trim())i.selected=true;save(false);const row=e.target.closest('.community-row'),box=row?.querySelector('[data-community-check]');row?.classList.toggle('selected',i.selected);if(box)box.checked=i.selected;$('communitySummary').textContent=`${activeItems().length} da comprare · ${data.items.length} prodotti totali`};$('communityOther').oninput=e=>{data.other=e.target.value.slice(0,20000);save(false)};$('communitySelectQty').onclick=()=>{data.items.forEach(i=>{if(i.qty.trim())i.selected=true});save()};$('communityClear').onclick=()=>{data.items.forEach(i=>i.selected=false);save()};$('communityAdd').onsubmit=e=>{e.preventDefault();data.items.push({id:uid(),name:$('communityAddName').value.trim(),qty:$('communityAddQty').value.trim(),department:$('communityAddDepartment').value.trim()||'Altro',store:$('communityAddStore').value,selected:true,custom:true});e.target.reset();$('communityAddStore').value='Angelo';save();$('communityStatus').textContent='Prodotto aggiunto.'};$('communityEditForm').onsubmit=e=>{e.preventDefault();const i=data.items.find(x=>x.id===editing);if(!i)return;i.name=$('communityEditName').value.trim();i.qty=$('communityEditQty').value.trim();i.department=$('communityEditDepartment').value.trim()||'Altro';i.store=$('communityEditStore').value;if(i.qty)i.selected=true;save();$('communityEditDialog').close()};$('communityDelete').onclick=()=>{const i=data.items.find(x=>x.id===editing);if(i&&confirm('Eliminare “'+i.name+'” dalla lista di questo giorno?')){data.items=data.items.filter(x=>x.id!==editing);save();$('communityEditDialog').close()}};$('communityPrint').onclick=print;$('communityPrintTop').onclick=print;$('communityCsv').onclick=()=>{api.download('Spesa_comunita_'+archive.activeDate+'.csv',csv(),'text/csv;charset=utf-8');$('communityStatus').textContent='Giornata esportata in CSV.'};$('communityExport').onclick=exportArchive;$('communityImport').onclick=()=>$('communityImportFile').click();$('communityImportFile').onchange=async()=>{const f=$('communityImportFile').files[0];if(!f)return;try{if(f.size>20*1024*1024)throw Error('Il file supera 20 MB.');importArchive(JSON.parse(await f.text()))}catch(e){$('communityStatus').textContent='Importazione non riuscita: '+e.message}finally{$('communityImportFile').value=''}};$('communityReset').onclick=()=>{if(confirm('Ripristinare i 110 prodotti originali solo per questa giornata? Quantità, spunte, prodotti aggiunti e testo ALTRO del giorno verranno cancellati.')){data=seed();archive.days[archive.activeDate]=data;save();$('communityOther').value='';$('communityStatus').textContent='Giornata ripristinata.'}}}
  return{init,refresh:renderList,seedCount:()=>seed().items.length,exportData:()=>JSON.parse(JSON.stringify(archive))};
})();
