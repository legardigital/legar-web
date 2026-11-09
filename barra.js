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
var c=d.createElement('div');c.className='cur';c.setAttribute('aria-hidden','true');
c.innerHTML='<span class="cd"></span><span class="ce"><i></i></span>';
d.body.appendChild(c);root.classList.add('curon');
var eg=c.querySelector('.ce i');
var CLICK='a,button,summary,label,select,[role=button],[onclick],.bb,.pin,.chit,.m,.pr,.sb,.go';
var TXT='input:not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio]),textarea,[contenteditable]';
var mx=-100,my=-100,x=-100,y=-100,vx=0,vy=0,rx=0,ry=0,hov=false,run=false;
function loop(){
  var k=reduce?1:.32;
  var nx=x+(mx-x)*k,ny=y+(my-y)*k;vx=nx-x;vy=ny-y;x=nx;y=ny;
  c.style.transform='translate3d('+x+'px,'+y+'px,0)';
  if(hov){
    var ty=reduce?0:Math.max(-55,Math.min(55,vx*4)),tx=reduce?0:Math.max(-45,Math.min(45,-vy*4));
    ry+=(ty-ry)*.18;rx+=(tx-rx)*.18;
    var t='rotateY('+ry.toFixed(1)+'deg) rotateX('+rx.toFixed(1)+'deg) rotateZ('+(ry*.25).toFixed(1)+'deg)';
    eg.style.setProperty('--t',t);
    if(!c.classList.contains('flap'))eg.style.transform=t+' scale(1)';
  }else{eg.style.transform='scale(.15)';rx=ry=0}
  if(Math.abs(mx-x)>.1||Math.abs(my-y)>.1||Math.abs(rx)>.2||Math.abs(ry)>.2)requestAnimationFrame(loop);else run=false;
}
function kick(){if(!run){run=true;requestAnimationFrame(loop)}}
d.addEventListener('pointermove',function(e){
  if(e.pointerType&&e.pointerType!=='mouse')return;
  mx=e.clientX;my=e.clientY;c.classList.add('vis');
  var t=e.target;
  c.classList.toggle('txt',!!(t.closest&&t.closest(TXT)));
  hov=!!(t.closest&&t.closest(CLICK));c.classList.toggle('hov',hov);kick();
},{passive:true});
d.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;c.classList.add('dn');
  if(hov&&!reduce){c.classList.remove('flap');void eg.offsetWidth;c.classList.add('flap');setTimeout(function(){c.classList.remove('flap');kick()},460)}});
d.addEventListener('pointerup',function(){c.classList.remove('dn')});
d.addEventListener('mouseleave',function(){c.classList.remove('vis')});
root.addEventListener('mouseleave',function(){c.classList.remove('vis')});
d.addEventListener('mouseenter',function(){c.classList.add('vis')});
})();
