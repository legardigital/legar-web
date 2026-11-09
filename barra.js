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
