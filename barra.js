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
  var lw=doc.createElement('span');lw.className='lbt';r[0].split('legAR').forEach(function(p,k){if(k){var im=doc.createElement('img');im.src='legar-tab-blanco.png';im.alt='legAR';im.className='lblogo';lw.appendChild(im)}if(p)lw.appendChild(doc.createTextNode(p))});a.appendChild(lw);
  if(r[2]==='ar')a.insertAdjacentHTML('beforeend','<svg class="lbflag" viewBox="0 0 28 18" aria-hidden="true"><rect width="28" height="18" rx="2.5" fill="#74ACDF"/><rect y="6" width="28" height="6" fill="#fff"/><circle cx="14" cy="9" r="2.9" fill="none" stroke="#F6B40E" stroke-width="1.3" stroke-dasharray=".7 .62"/><circle cx="14" cy="9" r="1.75" fill="#F6B40E"/></svg>');
  if(i===0)a.addEventListener('click',function(e){e.preventDefault();scrollTo({top:0,behavior:'smooth'})});
  li.appendChild(a);if(ix)ix.appendChild(li);items.push({el:el,a:a});
});

var mb=$('#lbmb');
var lbw=$('.lbmw');if(lbw&&!$('.lbclose')){var cb=doc.createElement('button');cb.type='button';cb.className='lbclose';cb.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>Cerrar índice';var ftx=$('.lbft',lbw);lbw.insertBefore(cb,ftx||null);cb.addEventListener('click',function(){setMenu(false)})}
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

/* cursor legAR: puntito blanco que sigue al mouse */
(function(){
if(!window.matchMedia||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
var d=document,root=d.documentElement;
var c=d.createElement('div');c.className='lgcur';c.setAttribute('aria-hidden','true');c.innerHTML='<span class="lgc-dot"></span>';d.body.appendChild(c);
var CLICK='a,button,summary,label,select,[role=button],[onclick],.bb,.pin,.chit,.m,.pr,.sb,.go';
var TXT='input:not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio]),textarea,[contenteditable]';
function show(o){c.classList.toggle('lgc-v',o);root.classList.toggle('lgc-on',o)}
d.addEventListener('pointermove',function(e){
  if(e.pointerType&&e.pointerType!=='mouse')return;
  c.style.transform='translate3d('+e.clientX+'px,'+e.clientY+'px,0)';show(true);
  var t=e.target;c.classList.toggle('lgc-t',!!(t.closest&&t.closest(TXT)));c.classList.toggle('lgc-h',!!(t.closest&&t.closest(CLICK)));
},{passive:true});
d.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse')c.classList.add('lgc-d')});
d.addEventListener('pointerup',function(){c.classList.remove('lgc-d')});
d.addEventListener('pointerout',function(e){if(!e.relatedTarget)show(false)});
root.addEventListener('mouseleave',function(){show(false)});
addEventListener('blur',function(){show(false)});
d.addEventListener('visibilitychange',function(){if(d.hidden)show(false)});
})();

/* "ver más": muestra lo que estaba guardado */
(function(){
[].slice.call(document.querySelectorAll('.vermas')).forEach(function(b){
  var box=document.getElementById(b.getAttribute('aria-controls'));if(!box)return;
  b.addEventListener('click',function(){var o=box.hidden;box.hidden=!o;b.setAttribute('aria-expanded',o);b.textContent=o?b.dataset.less:b.dataset.more;if(!o)b.scrollIntoView({block:'center',behavior:'smooth'})});
});
})();


/* secciones y tarjetas que aparecen al bajar */
(function(){
var d=document,root=d.documentElement;
if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
if(d.querySelector('.sl-u,.sl-l,.sl-r'))return; /* Marketing ya tiene su propia animación */
var SEL=['section h2','section .sub','section ol>li','section details','.sv2>details','.adc','a.jb','.jt','.ar2>a','.tl2>div','.pq>div','.mjc','.qhc','.dic','.rvc','.rve','.doors','.why>div','.bn>li','.rf','.sgt .tk','.ben>li','.case','.me2','.evo','.hlc-hero','.hlc-dato','.hlc-pitch','.hlc-3>div','#lbix'].join(',');
var els=[].slice.call(d.querySelectorAll(SEL)).filter(function(e){return !e.closest('.lb,.lbmn,.c.top,.hero,.v3hero,#mapa svg,.bub,.lbix')&&!e.parentElement.closest('.lg-rv')&&e.id!=='lbix'});
var vh=innerHeight;
root.classList.add('lg-rvon');
els.forEach(function(e){
  if(e.getBoundingClientRect().top<vh*.92)return; /* lo que ya se ve al entrar, queda quieto */
  e.classList.add('lg-rv');
  var sib=e.parentElement?[].indexOf.call(e.parentElement.children,e):0;
  e.style.transitionDelay=Math.min(sib,5)*70+'ms';
});
var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('lg-in');io.unobserve(x.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
[].slice.call(d.querySelectorAll('.lg-rv')).forEach(function(e){io.observe(e)});
/* al saltar desde el índice o un link, lo que queda arriba aparece de una */
addEventListener('hashchange',function(){setTimeout(function(){[].slice.call(d.querySelectorAll('.lg-rv:not(.lg-in)')).forEach(function(e){if(e.getBoundingClientRect().top<innerHeight)e.classList.add('lg-in')})},400)});
})();


/* letras que se encienden en verde al pasar el dedo o el mouse (títulos) */
(function(){
var d=document;
var hs=[].slice.call(d.querySelectorAll('h1,h2')).filter(function(h){return !h.closest('.lb,.lbmn,.md,.bx,#ov')&&!h.querySelector('.v3c,.lgl')});
hs.forEach(function(h){
  var label=(function walk(n){var s='';n.childNodes.forEach(function(c){if(c.nodeType===3)s+=c.nodeValue;else if(c.nodeType===1)s+=c.tagName==='IMG'?(c.alt||''):walk(c)});return s})(h).replace(/\s+/g,' ').trim();
  if(!h.getAttribute('aria-label'))h.setAttribute('aria-label',label);
  var tw=d.createTreeWalker(h,NodeFilter.SHOW_TEXT,null),nodes=[],n;while(n=tw.nextNode())if(n.nodeValue.trim())nodes.push(n);
  nodes.forEach(function(t){
    var f=d.createDocumentFragment();
    t.nodeValue.split(/(\s+)/).forEach(function(w){
      if(!w)return;if(/^\s+$/.test(w)){f.appendChild(d.createTextNode(w));return}
      var ws=d.createElement('span');ws.className='lgw';ws.setAttribute('aria-hidden','true');
      w.split('').forEach(function(ch){var c=d.createElement('span');c.className='lgl';c.textContent=ch;ws.appendChild(c)});
      f.appendChild(ws);
    });
    t.parentNode.replaceChild(f,t);
  });
});
function hit(x,y){var el=d.elementFromPoint(x,y);if(el&&el.classList&&el.classList.contains('lgl')){el.classList.add('lg-on');clearTimeout(el._lg);el._lg=setTimeout(function(){el.classList.remove('lg-on')},650)}}
d.addEventListener('pointermove',function(e){if(e.pointerType==='mouse')hit(e.clientX,e.clientY)},{passive:true});
d.addEventListener('touchmove',function(e){var t=e.touches[0];if(t)hit(t.clientX,t.clientY)},{passive:true});
d.addEventListener('touchstart',function(e){var t=e.touches[0];if(t)hit(t.clientX,t.clientY)},{passive:true});
})();
