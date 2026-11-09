/* legAR · barra superior: arma el índice de la página, abre y cierra el menú, y valida el código de seguimiento. */
(function(){
var doc=document,root=doc.documentElement;
function $(s,r){return (r||doc).querySelector(s)}
function $$(s,r){return [].slice.call((r||doc).querySelectorAll(s))}

/* busca una sección por selector, o por texto de un título ("t:texto") */
function find(sel){
  if(!sel)return null;
  if(sel.charAt(0)==='=')return $(sel.slice(1));
  if(sel.indexOf('t:')===0){
    var t=sel.slice(2).toLowerCase();
    var h=$$('h2, h3, .kick').filter(function(h){return !h.closest('.lbmn,.lb')}).find(function(h){return h.textContent.toLowerCase().indexOf(t)>-1});
    return h?(h.closest('section')||h):null;
  }
  var el=$(sel);return el?(el.closest('section')||el):null;
}

var cfg=window.LBIDX;
if(!cfg){ /* sin lista propia: usa los títulos de la página */
  cfg=[['Inicio','main > section']];
  $$('main section h2').forEach(function(h){var t=(h.getAttribute('aria-label')||h.textContent).replace(/\s+/g,' ').trim();if(!t){var im=h.querySelector('img');t=im?im.alt:''}cfg.push([t,null,h])});
}
var ix=$('#lbix'),items=[];
cfg.forEach(function(r,i){
  var el=(r[2]&&r[2].nodeType)?(r[2].closest('section')||r[2]):find(r[1]);
  if(!el||items.some(function(it){return it.el===el}))return;
  if(!el.id)el.id='s'+(i+1);
  var li=doc.createElement('li'),a=doc.createElement('a');
  a.href=i===0?'#':'#'+el.id;
  a.innerHTML='<small>'+String(items.length+1).padStart(2,'0')+'</small>';
  a.appendChild(doc.createTextNode(r[0]));
  if(r[2]==='ar')a.insertAdjacentHTML('beforeend','<svg class="lbflag" viewBox="0 0 28 18" aria-hidden="true"><rect width="28" height="18" rx="2.5" fill="#74ACDF"/><rect y="6" width="28" height="6" fill="#fff"/><circle cx="14" cy="9" r="2.9" fill="none" stroke="#F6B40E" stroke-width="1.3" stroke-dasharray=".7 .62"/><circle cx="14" cy="9" r="1.75" fill="#F6B40E"/></svg>');
  if(i===0)a.addEventListener('click',function(e){e.preventDefault();scrollTo({top:0,behavior:'smooth'})});
  li.appendChild(a);if(ix)ix.appendChild(li);items.push({el:el,a:a});
});

var mb=$('#lbmb');
function setMenu(o){root.classList.toggle('lbopen',o);if(mb){mb.setAttribute('aria-expanded',o);mb.querySelector('.t').textContent=o?'Cerrar':'Índice'}doc.body.style.overflow=o?'hidden':''}
if(mb)mb.addEventListener('click',function(){setMenu(!root.classList.contains('lbopen'))});
$$('.lbmn a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
doc.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
function onScroll(){var cur=-1;items.forEach(function(it,i){if(it.el.getBoundingClientRect().top<innerHeight*.4)cur=i});items.forEach(function(it,i){it.a.classList.toggle('on',i===cur)})}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* código de seguimiento */
var sc=$('#sgc'),sg=$('#sgg'),se=$('#sge'),SEG=window.LBSEG;
if(sc&&sg&&SEG){
  var MSG='El código tiene 8 letras y números, como 7KQ4-M2XP.';
  var norm=function(){return sc.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8)};
  var upd=function(){var v=norm();sc.value=v.length>4?v.slice(0,4)+'-'+v.slice(4):v;sg.href=v.length===8?SEG+'#'+v.slice(0,4)+'-'+v.slice(4):SEG;if(v.length===8)se.textContent=''};
  sc.addEventListener('input',upd);upd();
  sg.addEventListener('click',function(e){if(norm().length!==8){e.preventDefault();se.textContent=MSG;sc.focus()}});
  var f=$('#sgf');if(f)f.addEventListener('submit',function(e){e.preventDefault();if(norm().length===8)sg.click();else se.textContent=MSG});
}
})();

/* cursor legAR */
(function(){
if(!window.matchMedia||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var d=document,root=d.documentElement;
var c=d.createElement('div');c.className='lgcur';c.setAttribute('aria-hidden','true');
c.innerHTML='<span class="lgc-dot"></span><span class="lgc-egg"><i></i></span>';
d.body.appendChild(c);
var eg=c.querySelector('.lgc-egg i');
var CLICK='a,button,summary,label,select,[role=button],[onclick],.bb,.pin,.chit,.m,.pr,.sb,.go';
var TXT='input:not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio]),textarea,[contenteditable]';
var FLY='a[href*="wa.me"],a[href*="instagram.com"]';
var mx=0,my=0,x=0,y=0,rx=0,ry=0,hov=false,run=false,seen=false;
function show(o){c.classList.toggle('lgc-v',o);root.classList.toggle('lgc-on',o)}
function loop(){
  var k=reduce?1:.45,vx=(mx-x)*k,vy=(my-y)*k;x+=vx;y+=vy;
  c.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)';
  var ty=hov&&!reduce?Math.max(-55,Math.min(55,vx*5)):0,tx=hov&&!reduce?Math.max(-45,Math.min(45,-vy*5)):0;
  ry+=(ty-ry)*.2;rx+=(tx-rx)*.2;
  eg.style.transform='rotateY('+ry.toFixed(1)+'deg) rotateX('+rx.toFixed(1)+'deg) rotateZ('+(ry*.25).toFixed(1)+'deg)';
  if(Math.abs(mx-x)>.2||Math.abs(my-y)>.2||Math.abs(rx)>.3||Math.abs(ry)>.3)requestAnimationFrame(loop);else run=false;
}
function kick(){if(!run){run=true;requestAnimationFrame(loop)}}
d.addEventListener('pointermove',function(e){
  if(e.pointerType&&e.pointerType!=='mouse')return;
  mx=e.clientX;my=e.clientY;if(!seen){seen=true;x=mx;y=my}
  show(true);
  var t=e.target;
  c.classList.toggle('lgc-t',!!(t.closest&&t.closest(TXT)));
  hov=!!(t.closest&&t.closest(CLICK));c.classList.toggle('lgc-h',hov);kick();
},{passive:true});
d.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse')c.classList.add('lgc-d')});
d.addEventListener('pointerup',function(){c.classList.remove('lgc-d')});
/* si el mouse sale de la página o se cambia de pestaña, el puntito se esconde y vuelve la flecha */
d.addEventListener('pointerout',function(e){if(!e.relatedTarget)show(false)});
root.addEventListener('mouseleave',function(){show(false)});
addEventListener('blur',function(){show(false)});
d.addEventListener('visibilitychange',function(){if(d.hidden)show(false)});

/* el halcón sale volando al tocar WhatsApp o Instagram */
function fly(){
  if(reduce||!seen)return 0;
  var f=d.createElement('div');f.className='lgc-fly';f.setAttribute('aria-hidden','true');f.innerHTML='<i></i>';d.body.appendChild(f);
  var sx=mx<innerWidth/2?1:-1,top=my<innerHeight*.35,p=[sx*(.7+Math.random()*.3),top?(.25+Math.random()*.35):-(.5+Math.random()*.5)];
  var dx=p[0]*(innerWidth*.7+200),dy=p[1]*(innerHeight*.6+200),rot=p[0]*25;
  var fr=[],n=9;
  for(var i=0;i<=n;i++){var q=i/n,e=Math.pow(q,1.6),fl=i%2?.55:1.08;
    fr.push({transform:'translate3d('+(mx+dx*e).toFixed(1)+'px,'+(my+dy*e-Math.sin(q*Math.PI)*40).toFixed(1)+'px,0) rotate('+(rot*q).toFixed(1)+'deg) scale('+(1-q*.55).toFixed(2)+') scaleX('+(i===0||i===n?1:fl)+')',opacity:i===n?0:1})}
  c.classList.add('lgc-gone');
  var a=f.animate(fr,{duration:1000,easing:'linear'});
  a.onfinish=function(){f.remove()};
  setTimeout(function(){c.classList.remove('lgc-gone')},1050);
  return 520;
}
d.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest(FLY);
  if(!a||a.dataset.lgcGo||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  var w=fly();if(!w)return;
  e.preventDefault();
  setTimeout(function(){a.dataset.lgcGo='1';a.click();delete a.dataset.lgcGo},w);
},true);
})();

/* "ver más": muestra lo que estaba guardado */
(function(){
[].slice.call(document.querySelectorAll('.vermas')).forEach(function(b){
  var box=document.getElementById(b.getAttribute('aria-controls'));if(!box)return;
  b.addEventListener('click',function(){var o=box.hidden;box.hidden=!o;b.setAttribute('aria-expanded',o);b.textContent=o?b.dataset.less:b.dataset.more;if(!o)b.scrollIntoView({block:'center',behavior:'smooth'})});
});
})();

/* aviso: "este es el índice" (se muestra hasta que la persona lo usa o lo cierra) */
(function(){
var mb=document.getElementById('lbmb');if(!mb)return;
var KEY='lgIdxVisto';
function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
function set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function sget(k){try{return sessionStorage.getItem(k)}catch(e){return null}}
function sset(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}
if(get(KEY)||sget('lgIdxHint'))return;
var h=document.createElement('div');h.className='lbhint';h.setAttribute('role','status');
h.innerHTML='<b>Este es el índice</b>Tocalo para saltar directo a cualquier sección.<button type="button" aria-label="Cerrar aviso">×</button>';
document.body.appendChild(h);
function place(){var r=mb.getBoundingClientRect();var w=Math.min(240,innerWidth-24);h.style.maxWidth=w+'px';
  var left=Math.max(12,Math.min(r.right-w,innerWidth-w-12));h.style.left=left+'px';h.style.top=(r.bottom+12)+'px';
  h.style.setProperty('--ax',Math.max(12,(left+w)-(r.left+r.width/2)-7)+'px')}
var t;
function hide(seen){h.classList.remove('on');mb.classList.remove('lbpulse');clearTimeout(t);if(seen)set(KEY,'1');setTimeout(function(){h.remove()},350)}
setTimeout(function(){if(document.documentElement.classList.contains('lbopen'))return;place();h.classList.add('on');mb.classList.add('lbpulse');sset('lgIdxHint','1');t=setTimeout(function(){hide(false)},8000)},1800);
addEventListener('resize',place);
h.querySelector('button').addEventListener('click',function(){hide(true)});
mb.addEventListener('click',function(){hide(true)});
})();
