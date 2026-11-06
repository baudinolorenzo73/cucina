'use strict';
window.RecipeAppearance=(()=>{
  const KEY='ricettario-appearance-v2',THEME='ricettario-theme';
  const presets={
    Orto:{accent:'#23845f',secondary:'#f0a12e',light:['#fff8ed','#fffdf8'],dark:['#101f1a','#1b3027']},
    Sole:{accent:'#ba472d',secondary:'#e9a82d',light:['#fff5ee','#fffdf9'],dark:['#261b17','#382720']},
    Mare:{accent:'#176daf',secondary:'#17a49e',light:['#f0f8ff','#ffffff'],dark:['#111f2c','#1c3040']},
    Lavanda:{accent:'#794db2',secondary:'#d077a8',light:['#f8f2ff','#fffcff'],dark:['#201a2b','#30263d']},
    Ciliegia:{accent:'#b5365d',secondary:'#e59c37',light:['#fff3f5','#fffdfb'],dark:['#291920','#3b252e']}
  };
  let prefs={name:'Orto',...presets.Orto};
  const hex=v=>/^#[0-9a-f]{6}$/i.test(v||'');
  const luminance=c=>{const a=[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)/255).map(x=>x<=.03928?x/12.92:((x+.055)/1.055)**2.4);return .2126*a[0]+.7152*a[1]+.0722*a[2]};
  const contrast=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
  const readable=bg=>contrast(bg,'#17211d')>=4.5?'#17211d':'#f7fbf8';
  const muted=bg=>readable(bg)==='#17211d'?'#667269':'#b8c7bd';
  function load(){if(window.CucinaDataGuard?.isBlocked(KEY))return;try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&hex(saved.accent)&&hex(saved.secondary)&&saved.light?.every(hex)&&saved.dark?.every(hex))prefs=saved}catch{}}
  function effectiveTheme(){const v=document.getElementById('theme')?.value||'light';return v==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):v}
  function apply(){const dark=effectiveTheme()==='dark',colors=dark?prefs.dark:prefs.light,b=document.body,s=b.style;b.classList.toggle('dark',dark);s.setProperty('--bg',colors[0]);s.setProperty('--paper',colors[1]);s.setProperty('--accent',prefs.accent);s.setProperty('--secondary',prefs.secondary);s.setProperty('--ink',readable(colors[0]));s.setProperty('--text',readable(colors[0]));s.setProperty('--muted',muted(colors[0]));s.setProperty('--surface-ink',readable(colors[1]));s.setProperty('--surface-muted',muted(colors[1]));s.setProperty('--line',readable(colors[0])==='#17211d'?'#d7ddd8':'#41534a');s.setProperty('--soft',dark?'color-mix(in srgb, var(--accent) 22%, var(--paper))':'color-mix(in srgb, var(--accent) 10%, var(--paper))');s.setProperty('--on-accent',readable(prefs.accent));document.documentElement.style.colorScheme=dark?'dark':'light';document.querySelector('meta[name=theme-color]').content=prefs.accent;const t=document.getElementById('themeToggle');if(t){t.textContent=dark?'☀':'☾';t.setAttribute('aria-pressed',String(dark));t.setAttribute('aria-label',dark?'Attiva tema chiaro':'Attiva tema scuro')}sync()}
  function save(){if(window.CucinaDataGuard?.isBlocked(KEY))return;try{localStorage.setItem(KEY,JSON.stringify(prefs))}catch{}apply()}
  function sync(){const dark=effectiveTheme()==='dark',colors=dark?prefs.dark:prefs.light;[['accentColor',prefs.accent],['secondaryColor',prefs.secondary],['backgroundColor',colors[0]],['surfaceColor',colors[1]]].forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.value=v});document.querySelectorAll('.palette-btn').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.palette===prefs.name)))}
  function choose(name){const p=presets[name];prefs={name,...JSON.parse(JSON.stringify(p))};save()}
  function init(){load();const theme=document.getElementById('theme');try{theme.value=localStorage.getItem(THEME)||'light'}catch{}const list=document.getElementById('paletteList');list.innerHTML=Object.entries(presets).map(([name,p])=>`<button class="palette-btn" data-palette="${name}" aria-pressed="false"><span class="palette-dot" style="background:linear-gradient(135deg,${p.accent} 50%,${p.secondary} 50%)"></span>${name}</button>`).join('');list.onclick=e=>{const b=e.target.closest('[data-palette]');if(b)choose(b.dataset.palette)};theme.onchange=()=>{try{localStorage.setItem(THEME,theme.value)}catch{}apply()};document.getElementById('themeToggle').onclick=()=>{theme.value=effectiveTheme()==='dark'?'light':'dark';theme.onchange()};[['accentColor','accent'],['secondaryColor','secondary']].forEach(([id,key])=>document.getElementById(id).oninput=e=>{prefs.name='';prefs[key]=e.target.value;save()});[['backgroundColor',0],['surfaceColor',1]].forEach(([id,index])=>document.getElementById(id).oninput=e=>{prefs.name='';prefs[effectiveTheme()][index]=e.target.value;save()});document.getElementById('resetColors').onclick=()=>choose('Orto');matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(theme.value==='system')apply()});apply()}
  return{init,apply};
})();
