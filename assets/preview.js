/* Shell satu-halaman untuk preview (artifact): rute pakai hash polos, tanpa query string. */
(function(){
 const LIST=['index','destinasi','detail','berita','artikel','agenda','tentang','inovasi','program','ekraf','penginapan','kuliner','travel','pokdarwis','data'];
 const QP=new Set(['destinasi','penginapan','kuliner','travel','pokdarwis','ekraf']);
 const PUB=new RegExp('^('+LIST.join('|')+')\\.html(\\?.*)?$');
 let mode=null;
 async function render(){
  const h=location.hash;let m;
  if(/^#adm/.test(h)){
   if(mode!=='adm'){mode='adm';document.body.className='adm';document.body.innerHTML='<div id="root"></div>';root=document.getElementById('root')}
   await route();return}
  mode='pub';if(__qs===null)__qs='';
  if((m=h.match(/^#(detail|artikel|program)-(.+)$/))){__qs='?id='+m[2];await boot(m[1])}
  else{const n=h.slice(1);if(LIST.includes(n)&&n!=='index'){if(!QP.has(n))__qs='';await boot(n)}else{__qs='';await boot('index')}}
  window.scrollTo(0,0);
 }
 function go(hash,qs){if(qs!==undefined)__qs=qs;if(location.hash===hash)render();else location.hash=hash}
 document.addEventListener('click',e=>{
  const a=e.target.closest&&e.target.closest('a[href]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey)return;
  const href=a.getAttribute('href');
  if(href==='admin.html'){e.preventDefault();go('#adm-dasbor');return}
  const m=href.match(PUB);if(!m)return;e.preventDefault();
  const page=m[1],q=m[2]||'',p=new URLSearchParams(q);
  if(page==='index')go('#home','');
  else if(['detail','artikel','program'].includes(page))go('#'+page+'-'+p.get('id'),'?id='+p.get('id'));
  else go('#'+page,QP.has(page)?q:'');
 },true);
 document.addEventListener('submit',e=>{const f=e.target;if(f.getAttribute&&f.getAttribute('action')==='destinasi.html'){e.preventDefault();const q=new URLSearchParams(new FormData(f));[...q.keys()].forEach(k=>{if(!q.get(k))q.delete(k)});go('#destinasi','?'+q.toString())}});
 addEventListener('hashchange',render);
 document.addEventListener('DOMContentLoaded',render);
})();
