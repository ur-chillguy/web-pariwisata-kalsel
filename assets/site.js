/* ===== util (dipakai situs publik & admin) ===== */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>{const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)};
const fmt=(iso,o={day:'numeric',month:'long',year:'numeric'})=>iso?new Date(iso+'T00:00:00').toLocaleDateString('id-ID',o):'';
const dparts=iso=>{const d=new Date(iso+'T00:00:00');return{d:String(d.getDate()).padStart(2,'0'),m:d.toLocaleDateString('id-ID',{month:'short'}).replace('.','').toUpperCase()}};
const pad2=n=>String(n).padStart(2,'0');
const num=n=>(+n||0).toLocaleString('id-ID');
const compact=n=>n>=1e6?(n/1e6).toFixed(1).replace('.',',')+' jt':n>=1e3?Math.round(n/1e3)+' rb':String(Math.round(n));
const fmtPeriode=p=>p?new Date(p+'-01T00:00:00').toLocaleDateString('id-ID',{month:'long',year:'numeric'}):'';
const isPub=x=>x.status==='terbit'||(x.status==='terjadwal'&&(x.tanggal||x.mulai||'')<=today());
const stripHtml=h=>{const d=document.createElement('div');d.innerHTML=h||'';return d.textContent||''};
function sanitize(html){
 const d=new DOMParser().parseFromString('<body>'+(html||''),'text/html');
 const ok={B:1,STRONG:1,I:1,EM:1,U:1,H2:1,H3:1,P:1,UL:1,OL:1,LI:1,A:1,BR:1,BLOCKQUOTE:1,DIV:1};
 (function walk(n){[...n.childNodes].forEach(c=>{
  if(c.nodeType===3)return;
  if(c.nodeType!==1||/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|LINK|META)$/.test(c.tagName)){c.remove();return}
  walk(c);
  if(!ok[c.tagName]){c.replaceWith(...c.childNodes);return}
  [...c.attributes].forEach(a=>{if(!(c.tagName==='A'&&a.name==='href'))c.removeAttribute(a.name)});
  if(c.tagName==='A'){const h=c.getAttribute('href')||'';if(!/^(https?:|mailto:|#|\/)/i.test(h))c.removeAttribute('href');c.target='_blank';c.rel='noopener'}
 })})(d.body);
 return d.body.innerHTML;
}
function resizeImage(file,max=1280,q=.8){return new Promise((res,rej)=>{const r=new FileReader();r.onerror=rej;r.onload=()=>{const im=new Image();im.onerror=()=>rej(new Error('File bukan gambar yang valid'));im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',q))};im.src=r.result};r.readAsDataURL(file)})}

/* ===== layout publik ===== */
const NAV=[['index','Beranda'],['destinasi','Destinasi'],{l:'Direktori',k:['penginapan','kuliner','travel','pokdarwis']},['ekraf','Ekraf'],['inovasi','Inovasi'],{l:'Kabar',k:['berita','agenda']},['data','Data'],['tentang','Tentang']];
const PLABEL={berita:'Berita',agenda:'Agenda',penginapan:'Penginapan',kuliner:'Kuliner',travel:'Travel Agen',pokdarwis:'Pokdarwis (Kelompok Sadar Wisata)'};
const PARENT={detail:'destinasi',artikel:'berita',program:'inovasi'};
function navHtml(S,page,solid){
 const cur=PARENT[page]||page;
 const items=NAV.map(n=>Array.isArray(n)?`<a href="${n[0]}.html" class="${cur===n[0]?'on':''}">${n[1]}</a>`
  :`<div class="dd ${n.k.includes(cur)?'on':''}"><button type="button" aria-haspopup="true" aria-expanded="false">${n.l}<span data-i="chevron" data-s="14"></span></button><div class="sub">${n.k.map(k=>`<a href="${k}.html" class="${cur===k?'on':''}">${PLABEL[k]}</a>`).join('')}</div></div>`).join('');
 return `<nav class="nav ${solid?'solid':''}"><div class="wrap">
  <a class="brand" href="index.html"><div class="logo" data-i="compass" data-s="24"></div><div><b>${esc(S.singkat)}</b><small>${esc(S.wilayah)}</small></div></a>
  <div class="menu" id="menu">${items}</div>
  <button class="burger" id="burger" aria-label="Buka menu" aria-expanded="false" data-i="menu" data-s="26"></button>
 </div></nav>`;
}
function footHtml(S){
 return `<footer><div class="wrap"><div class="cols">
  <div><div class="brand" style="color:#fff"><div class="logo" data-i="compass" data-s="24"></div><div><b>${esc(S.singkat)}</b><small>${esc(S.wilayah)}</small></div></div><p style="margin-top:18px;max-width:320px;opacity:.88">${esc(S.slogan)}</p></div>
  <div><h4>Jelajahi</h4><ul><li><a href="destinasi.html">Destinasi</a></li><li><a href="penginapan.html">Penginapan</a></li><li><a href="kuliner.html">Kuliner</a></li><li><a href="travel.html">Travel agen</a></li><li><a href="pokdarwis.html">Pokdarwis</a></li><li><a href="ekraf.html">Ekonomi kreatif</a></li></ul></div>
  <div><h4>Informasi</h4><ul><li><a href="inovasi.html">Inovasi &amp; program kerja</a></li><li><a href="data.html">Data kunjungan</a></li><li><a href="berita.html">Berita</a></li><li><a href="agenda.html">Agenda</a></li><li><a href="tentang.html">Tentang kami</a></li><li><a href="admin.html">Masuk admin</a></li></ul></div>
  <div><h4>Kontak</h4><ul><li>${esc(S.alamat)}</li><li>${esc(S.telp)}</li><li>${esc(S.email)}</li></ul></div>
 </div><div class="bar"><span>© ${new Date().getFullYear()} ${esc(S.nama)} ${esc(S.wilayah)}</span><a class="credit" href="https://instagram.com/ur.chillguy" target="_blank" rel="noopener">Dibangun oleh <b>@ur.chillguy</b></a></div></div></footer>`;
}
const pagehead=(crumb,title,lead)=>`<section class="pagehead"><div class="wrap"><div class="crumb"><a href="index.html">Beranda</a>/${crumb}</div><h1>${title}</h1>${lead?`<p>${lead}</p>`:''}</div></section>`;

/* ===== komponen kartu ===== */
function destCard(d){return `<a class="pc" href="detail.html?id=${d.id}">${cover(d)}<div class="b"><span class="tag">${esc(d.kategori.toUpperCase())}</span><h3>${esc(d.nama)}</h3><p>${esc(d.ringkas)}</p><div class="m"><span data-i="pin" data-s="14"> ${esc(d.kabupaten)}</span><span data-i="ticket" data-s="14"> ${esc(d.tiket||'-')}</span></div></div></a>`}
function newsCard(a,first){return `<a class="nc ${first?'first':''}" href="artikel.html?id=${a.id}">${cover(a)}<div class="b"><span class="tag ${a.kategori==='Promosi'?'terra':a.kategori==='Info'?'gold':''}">${esc(a.kategori.toUpperCase())}</span><h3>${esc(a.judul)}</h3><p>${esc(a.ringkas)}</p><p style="margin-top:10px;font-size:12px"><span data-i="cal" data-s="13"></span> ${fmt(a.tanggal)}</p></div></a>`}
function evRow(g){const p=dparts(g.mulai);return `<div class="ev"><div class="d"><b>${p.d}</b><span>${p.m}</span></div><div><h4>${esc(g.judul)}</h4><small><span data-i="pin" data-s="12"></span>${esc(g.lokasi)}</small></div></div>`}
function dirCard(x,k){const d=DIR[k];return `<div class="pc dc">${cover(x)}<div class="b"><span class="tag">${esc((x.sub||'').toUpperCase())}</span><h3>${esc(x.nama)}</h3><p>${esc(x.ringkas)}</p><ul class="dl">
 <li><span data-i="pin" data-s="15"></span><span>${esc([x.alamat,x.kabupaten].filter(Boolean).join(', '))}</span></li>
 ${x.info?`<li><span data-i="${d.infoIcon}" data-s="15"></span><span><small>${esc(d.infoL)}</small>${esc(x.info)}</span></li>`:''}
 ${x.kontak?`<li><span data-i="phone" data-s="15"></span><span>${esc(x.kontak)}</span></li>`:''}</ul></div></div>`}
const TCL={Rencana:'terra',Berjalan:'gold',Selesai:''};
function progCard(p){return `<a class="pc" href="program.html?id=${p.id}">${cover(p)}<div class="b"><span class="tag">${esc(p.bidang.toUpperCase())}</span> <span class="tag ${TCL[p.tahap]||''}">${esc(p.tahap.toUpperCase())}</span><h3>${esc(p.judul)}</h3><p>${esc(p.ringkas)}</p>${p.capaian?`<div class="capx"><span data-i="trend" data-s="15"></span>${esc(p.capaian)}</div>`:''}<div class="m" style="margin-top:10px"><span data-i="cal" data-s="14"> Tahun ${esc(p.tahun)}</span></div></div></a>`}
const empty=(t,s='')=>`<div class="empty" style="grid-column:1/-1"><b style="display:block;font-size:17px;color:var(--ink);margin-bottom:6px">${t}</b>${s}</div>`;
const chips=(list,id='cats')=>`<div class="filters" id="${id}"><span class="cat" data-k="">Semua</span>${list.map(k=>`<span class="cat" data-k="${esc(k)}">${esc(k)}</span>`).join('')}<span id="cnt" class="muted" style="margin-left:auto;font-size:14px"></span></div>`;
function niceMax(v){const p=10**Math.floor(Math.log10(v));return Math.ceil(v/p*2)/2*p}
function barChart(rows){
 const W=1000,H=320,pl=60,pr=10,pt=16,pb=34,iw=W-pl-pr,ih=H-pt-pb;
 const mx=niceMax(Math.max(1,...rows.map(r=>r?(+r.wisnus)+(+r.wisman):0)));const bw=iw/12;let g='';
 for(let i=0;i<=4;i++){const y=pt+ih-ih*i/4;g+=`<line x1="${pl}" x2="${W-pr}" y1="${y}" y2="${y}" stroke="#E4DCCB"/><text x="${pl-10}" y="${y+4}" text-anchor="end" font-size="12" fill="#5E6E66">${compact(mx*i/4)}</text>`}
 rows.forEach((r,i)=>{const x=pl+bw*i+bw*.2,w=bw*.6,yb=pt+ih;
  if(r){const hn=ih*r.wisnus/mx,hm=Math.max(2,ih*r.wisman/mx);
   g+=`<g><title>${MONTHS[i]}: ${num(r.wisnus)} wisnus, ${num(r.wisman)} wisman</title><rect x="${x}" y="${yb-hn}" width="${w}" height="${hn}" rx="3" fill="#1F6B4F"/><rect x="${x}" y="${yb-hn-hm-2}" width="${w}" height="${hm}" rx="2" fill="#E8B04A"/></g>`}
  g+=`<text x="${pl+bw*i+bw/2}" y="${H-10}" text-anchor="middle" font-size="12" fill="#5E6E66">${MONTHS[i]}</text>`});
 return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik jumlah kunjungan per bulan">${g}</svg>`;
}

/* ===== halaman ===== */
function dirPage(k){return async S=>{
 const d=DIR[k],L=(await DB.list(k)).filter(isPub),P=QS();
 document.title=d.label+' — '+S.singkat;
 app_after=()=>{
  const st={q:P.get('q')||'',kab:P.get('kab')||'',sub:''};
  const draw=()=>{const r=L.filter(x=>(!st.sub||x.sub===st.sub)&&(!st.kab||x.kabupaten===st.kab)&&(!st.q||(x.nama+' '+x.ringkas+' '+(x.info||'')).toLowerCase().includes(st.q.toLowerCase())));
   $('#cnt').textContent=r.length+' '+d.unit;$('#res').innerHTML=r.length?r.map(x=>dirCard(x,k)).join(''):empty(d.label+' tidak ditemukan','Coba kata kunci atau filter lain.');hydrate($('#res'));
   $$('#cats .cat').forEach(c=>c.classList.toggle('on',c.dataset.k===st.sub))};
  $('#q').value=st.q;$('#kab').value=st.kab;
  $('#q').oninput=e=>{st.q=e.target.value;draw()};$('#kab').onchange=e=>{st.kab=e.target.value;draw()};
  $('#cats').onclick=e=>{const c=e.target.closest('.cat');if(c){st.sub=c.dataset.k;draw()}};draw();
 };
 return pagehead(`${d.grp?`<span>${d.grp}</span>/`:''}<span>${esc(d.label)}</span>`,esc(d.label),esc(d.lead))+
 `<section class="sec"><div class="wrap"><div class="filters"><div style="flex:1;min-width:220px"><input id="q" class="inp" placeholder="Cari ${esc(d.unit)}…" aria-label="Cari ${esc(d.unit)}"></div><div style="min-width:200px"><select id="kab" class="sel" aria-label="Kabupaten/Kota"><option value="">Semua kabupaten/kota</option>${KABUPATEN.map(x=>`<option>${esc(x)}</option>`).join('')}</select></div></div>
 ${chips(d.subs)}<div class="grid3" id="res"></div>
 <p class="muted" style="font-size:13px;margin-top:26px">Ingin usaha atau kelompok Anda tercantum di sini? Hubungi kami melalui kontak di bagian bawah halaman.</p></div></section>`;
}}
const PAGES={
 async index(S){
  const T=['destinasi','artikel','agenda','inovasi','kunjungan',...Object.keys(DIR)],L={};
  for(const t of T)L[t]=(await DB.list(t)).filter(isPub);
  const pd=L.destinasi,pa=L.artikel.sort((a,b)=>b.tanggal.localeCompare(a.tanggal)),pg=L.agenda;
  let feat=pd.filter(x=>x.unggulan);feat=feat.concat(pd.filter(x=>!x.unggulan)).slice(0,5);
  const up=pg.filter(g=>(g.selesai||g.mulai)>=today()).sort((a,b)=>a.mulai.localeCompare(b.mulai)).slice(0,4);
  const kc=k=>pd.filter(x=>x.kabupaten===k).length;
  const ys=[...new Set(L.kunjungan.map(k=>k.periode.slice(0,4)))].sort();
  const ky=ys.filter(y=>L.kunjungan.filter(k=>k.periode.startsWith(y)).length===12).pop()||ys[ys.length-1];
  const ktot=L.kunjungan.filter(k=>ky&&k.periode.startsWith(ky)).reduce((s,k)=>s+(+k.wisnus)+(+k.wisman),0);
  document.title=S.nama+' '+S.wilayah;
  return `<header class="hero"><div data-scene="hills"></div>
   <div class="copy"><div class="wrap"><div class="eyebrow" style="color:var(--gold)">Selamat datang di</div>
    <h1>Jelajahi Pesona <em>Kalimantan Selatan</em></h1><p>${esc(S.slogan)} Temukan destinasi, penginapan, kuliner, dan agenda wisata dalam satu tempat.</p>
    <div class="cta"><a class="btn primary" href="destinasi.html">Jelajahi Destinasi <span data-i="arrow" data-s="16"></span></a><a class="btn ghost" href="agenda.html">Lihat Agenda</a></div></div></div>
   <form class="searchbar" action="destinasi.html" role="search">
    <div class="f"><label for="q">Cari destinasi</label><input id="q" name="q" placeholder="Air terjun, pantai, budaya…"></div>
    <div class="f"><label for="kat">Kategori</label><select id="kat" name="kat"><option value="">Semua kategori</option>${KATEGORI.map(k=>`<option>${esc(k)}</option>`).join('')}</select></div>
    <div class="f"><label for="kab">Kabupaten/Kota</label><select id="kab" name="kab"><option value="">Semua wilayah</option>${KABUPATEN.map(k=>`<option>${esc(k)}</option>`).join('')}</select></div>
    <button class="btn primary" style="padding:0 28px"><span data-i="search" data-s="18"></span> Cari</button></form></header>
  <section class="stats"><div class="wrap">
   <a href="destinasi.html"><b>${pd.length}</b><span>Destinasi wisata</span></a>
   <a href="penginapan.html"><b>${L.penginapan.length+L.kuliner.length}</b><span>Penginapan &amp; kuliner</span></a>
   <a href="ekraf.html"><b>${L.ekraf.length}</b><span>Pelaku ekraf</span></a>
   <a href="data.html"><b>${ktot?compact(ktot):'-'}</b><span>Kunjungan ${ky||''}</span></a></div></section>
  <section class="sec"><div class="wrap"><div class="head"><div><div class="eyebrow">Destinasi unggulan</div><h2>Tempat yang wajib kamu kunjungi</h2><p class="lead">Dikurasi oleh tim dan diperbarui langsung lewat panel admin.</p></div><a class="btn line" href="destinasi.html">Lihat semua <span data-i="arrow" data-s="16"></span></a></div>
   ${feat.length?`<div class="bento">${feat.map((d,i)=>`<a class="card ${i===0?'big':''}" href="detail.html?id=${d.id}">${cover(d)}<div class="t"><span class="tag">${esc(d.kategori.toUpperCase())}</span><h3>${esc(d.nama)}</h3><div class="m"><span data-i="pin" data-s="14"> ${esc(d.kabupaten)}</span>${i===0?`<span data-i="ticket" data-s="14"> ${esc(d.tiket||'-')}</span>`:''}</div></div></a>`).join('')}</div>`:empty('Belum ada destinasi','Tambahkan destinasi lewat panel admin.')}</div></section>
  <section class="sec" style="padding-top:10px"><div class="wrap"><div class="head"><div><div class="eyebrow">Rencanakan perjalanan</div><h2>Semua yang kamu butuhkan</h2><p class="lead">Tempat menginap, makan, mitra perjalanan, dan kelompok sadar wisata di setiap daerah.</p></div></div>
   <div class="tiles">${['penginapan','kuliner','travel','pokdarwis'].map(k=>`<a class="tile" href="${k}.html"><div class="ic" data-i="${DIR[k].icon}" data-s="26"></div><b>${esc(DIR[k].label)}</b><span>${L[k].length} ${esc(DIR[k].unit)} terdaftar</span><span class="go">Lihat daftar →</span></a>`).join('')}</div></div></section>
  <section class="sec" style="padding-top:10px"><div class="wrap"><div class="head"><div><div class="eyebrow">Kabar terbaru</div><h2>Berita &amp; agenda</h2></div></div>
   <div class="news"><div class="ncards">${pa.length?pa.slice(0,3).map((a,i)=>newsCard(a,i===0)).join(''):empty('Belum ada berita')}</div>
   <div class="agenda"><div class="eyebrow" style="color:var(--gold)">Kalender</div><h3>Agenda mendatang</h3>${up.length?up.map(evRow).join(''):'<p style="opacity:.8;margin-top:16px">Belum ada agenda mendatang.</p>'}<a class="btn ghost sm" style="margin-top:14px" href="agenda.html">Semua agenda</a></div></div></div></section>
  <section class="sec alt"><div class="wrap"><div class="head"><div><div class="eyebrow">Ekonomi kreatif</div><h2>Karya kreatif urang Banua</h2><p class="lead">${esc(DIR.ekraf.lead)}</p></div><a class="btn line" href="ekraf.html">Lihat semua <span data-i="arrow" data-s="16"></span></a></div>
   <div class="grid3">${L.ekraf.length?L.ekraf.slice(0,3).map(x=>dirCard(x,'ekraf')).join(''):empty('Belum ada pelaku ekraf')}</div></div></section>
  <section class="sec"><div class="wrap"><div class="head"><div><div class="eyebrow">Inovasi</div><h2>Program kerja &amp; inovasi</h2><p class="lead">Langkah nyata mengembangkan destinasi, SDM, pemasaran, dan ekonomi kreatif.</p></div><a class="btn line" href="inovasi.html">Semua program <span data-i="arrow" data-s="16"></span></a></div>
   <div class="grid3">${L.inovasi.length?L.inovasi.slice(0,3).map(progCard).join(''):empty('Belum ada program')}</div></div></section>
  <section class="sec alt"><div class="wrap"><div class="head"><div><div class="eyebrow">Wilayah</div><h2>Jelajahi per kabupaten/kota</h2></div></div>
   <div class="regions">${KABUPATEN.map(k=>`<a class="rg" href="destinasi.html?kab=${encodeURIComponent(k)}">${esc(k)}<b>${kc(k)}</b></a>`).join('')}</div></div></section>`;
 },
 async destinasi(S){
  const D=(await DB.list('destinasi')).filter(isPub);const P=QS();
  document.title='Destinasi — '+S.singkat;
  app_after=()=>{
   const st={q:P.get('q')||'',kat:P.get('kat')||'',kab:P.get('kab')||''};
   const draw=()=>{const r=D.filter(d=>(!st.kat||d.kategori===st.kat)&&(!st.kab||d.kabupaten===st.kab)&&(!st.q||(d.nama+' '+d.ringkas+' '+d.kabupaten).toLowerCase().includes(st.q.toLowerCase())));
    $('#cnt').textContent=r.length+' destinasi';$('#res').innerHTML=r.length?r.map(destCard).join(''):empty('Destinasi tidak ditemukan','Coba kata kunci atau filter lain.');hydrate($('#res'));
    $$('#cats .cat').forEach(c=>c.classList.toggle('on',c.dataset.k===st.kat))};
   $('#q').value=st.q;$('#kab').value=st.kab;
   $('#q').oninput=e=>{st.q=e.target.value;draw()};$('#kab').onchange=e=>{st.kab=e.target.value;draw()};
   $('#cats').onclick=e=>{const c=e.target.closest('.cat');if(!c)return;st.kat=c.dataset.k;draw()};draw();
  };
  return pagehead('<span>Destinasi</span>','Destinasi wisata','Temukan tempat menarik di seluruh kabupaten/kota Kalimantan Selatan, lengkap dengan keterangan jam buka, tiket, dan fasilitas.')+
  `<section class="sec"><div class="wrap"><div class="filters"><div style="flex:1;min-width:220px"><input id="q" class="inp" placeholder="Cari nama destinasi…" aria-label="Cari destinasi"></div><div style="min-width:200px"><select id="kab" class="sel" aria-label="Kabupaten/Kota"><option value="">Semua kabupaten/kota</option>${KABUPATEN.map(k=>`<option>${esc(k)}</option>`).join('')}</select></div></div>
   ${chips(KATEGORI)}<div class="grid3" id="res"></div></div></section>`;
 },
 async detail(S){
  const id=QS().get('id');const d=await DB.get('destinasi',id);
  if(!d||!isPub(d))return pagehead('<span>Destinasi</span>','Destinasi tidak ditemukan','<a href="destinasi.html" style="text-decoration:underline">Kembali ke daftar destinasi</a>');
  document.title=d.nama+' — '+S.singkat;
  const rel=(await DB.list('destinasi')).filter(x=>isPub(x)&&x.id!==d.id&&(x.kabupaten===d.kabupaten||x.kategori===d.kategori)).slice(0,3);
  const near=[...(await DB.list('penginapan')),...(await DB.list('kuliner'))].filter(x=>isPub(x)&&x.kabupaten===d.kabupaten).slice(0,3);
  const q=encodeURIComponent(d.nama+' '+d.kabupaten+' Kalimantan Selatan');
  app_after=()=>{$('#share').onclick=async()=>{try{if(navigator.share)await navigator.share({title:d.nama,url:location.href});else{await navigator.clipboard.writeText(location.href);$('#share').lastChild.textContent=' Tautan disalin'}}catch(e){}}};
  return `<header class="dhero">${cover(d)}<div class="t"><div class="wrap"><div class="crumb"><a href="index.html">Beranda</a>/<a href="destinasi.html">Destinasi</a>/<span>${esc(d.kategori)}</span></div>
   <span class="tag" style="margin-top:14px;background:rgba(255,255,255,.22);color:#fff">${esc(d.kategori.toUpperCase())}</span>${d.unggulan?' <span class="tag gold">UNGGULAN</span>':''}<h1>${esc(d.nama)}</h1>
   <div class="dmeta"><span data-i="pin" data-s="16"> ${esc(d.kabupaten)}</span><span data-i="clock" data-s="16"> ${esc(d.jam||'-')}</span><span data-i="ticket" data-s="16"> ${esc(d.tiket||'-')}</span></div></div></div></header>
  <div class="wrap"><div class="body"><div><h2 style="font-size:30px;margin-bottom:14px">Tentang destinasi</h2><div class="prose">${sanitize(d.deskripsi)}</div>
   ${d.galeri&&d.galeri.length?`<h2 style="font-size:30px;margin:30px 0 14px">Galeri</h2><div class="gal">${d.galeri.map(g=>`<div class="scene"><img src="${g}" alt=""></div>`).join('')}</div>`:''}
   ${d.fasilitas&&d.fasilitas.length?`<h2 style="font-size:30px;margin:30px 0 6px">Fasilitas</h2><div class="fas">${d.fasilitas.filter(f=>FASILITAS[f]).map(f=>`<div data-i="${FASILITAS[f][0]}" data-s="18"> ${FASILITAS[f][1]}</div>`).join('')}</div>`:''}
   ${near.length?`<h2 style="font-size:30px;margin:30px 0 14px">Menginap &amp; makan di sekitar</h2><div class="near">${near.map(x=>`<a href="${x.id.startsWith('pg')?'penginapan':'kuliner'}.html?kab=${encodeURIComponent(x.kabupaten)}"><span data-i="${x.id.startsWith('pg')?'bed':'food'}" data-s="18"></span><span><b>${esc(x.nama)}</b><small>${esc(x.sub)} · ${esc(x.info||'')}</small></span></a>`).join('')}</div>`:''}</div>
   <aside class="info"><h3>Informasi kunjungan</h3><small class="muted">Diperbarui ${fmt(d.updated)}</small>
    <div class="row" style="margin-top:14px"><div class="ic" data-i="clock" data-s="20"></div><div><small>Jam buka</small><b>${esc(d.jam||'-')}</b></div></div>
    <div class="row"><div class="ic" data-i="ticket" data-s="20"></div><div><small>Tiket masuk</small><b>${esc(d.tiket||'-')}</b></div></div>
    <div class="row"><div class="ic" data-i="pin" data-s="20"></div><div><small>Alamat</small><b>${esc(d.alamat||d.kabupaten)}</b></div></div>
    ${d.kontak?`<div class="row"><div class="ic" data-i="phone" data-s="20"></div><div><small>Kontak pengelola</small><b>${esc(d.kontak)}</b></div></div>`:''}
    <div style="display:grid;gap:10px;margin-top:8px"><a class="btn dark" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${q}"><span data-i="pin" data-s="16"></span> Petunjuk Arah</a><button class="btn line" id="share"><span data-i="share" data-s="16"></span><span> Bagikan</span></button></div></aside></div></div>
  ${rel.length?`<section class="sec alt"><div class="wrap"><div class="eyebrow">Sekitar lokasi</div><h2 style="font-size:34px">Destinasi terkait</h2><div class="grid3" style="margin-top:24px">${rel.map(destCard).join('')}</div></div></section>`:''}`;
 },
 penginapan:dirPage('penginapan'),kuliner:dirPage('kuliner'),travel:dirPage('travel'),pokdarwis:dirPage('pokdarwis'),ekraf:dirPage('ekraf'),
 async inovasi(S){
  const I=(await DB.list('inovasi')).filter(isPub).sort((a,b)=>b.tahun-a.tahun);document.title='Inovasi — '+S.singkat;
  app_after=()=>{let k='';const draw=()=>{const r=I.filter(x=>!k||x.bidang===k);$('#cnt').textContent=r.length+' program';$('#res').innerHTML=r.length?r.map(progCard).join(''):empty('Belum ada program di bidang ini');hydrate($('#res'));$$('#cats .cat').forEach(c=>c.classList.toggle('on',c.dataset.k===k))};
   $('#cats').onclick=e=>{const c=e.target.closest('.cat');if(c){k=c.dataset.k;draw()}};draw()};
  const kp=(t,ic,bg,c)=>`<div class="kpi"><div class="ic" style="background:${bg};color:${c}" data-i="${ic}" data-s="22"></div><div><b>${I.filter(x=>x.tahap===t).length}</b><span>Program ${t.toLowerCase()}</span></div></div>`;
  return pagehead('<span>Inovasi</span>','Inovasi &amp; program kerja','Program unggulan untuk mengembangkan destinasi, sumber daya manusia, pemasaran, dan ekonomi kreatif.')+
  `<section class="sec"><div class="wrap"><div class="kpis k3">${kp('Berjalan','trend','#FBEBC8','#8A5E0B')}${kp('Selesai','check','#DCEBE1','#1F6B4F')}${kp('Rencana','bulb','#FBE3D6','#B24A18')}</div>${chips(BIDANG)}<div class="grid3" id="res"></div></div></section>`;
 },
 async program(S){
  const p=await DB.get('inovasi',QS().get('id'));
  if(!p||!isPub(p))return pagehead('<a href="inovasi.html">Inovasi</a>','Program tidak ditemukan','<a href="inovasi.html" style="text-decoration:underline">Kembali ke daftar program</a>');
  document.title=p.judul+' — '+S.singkat;
  return `<section class="pagehead" style="padding:30px 0"><div class="wrap"><div class="crumb"><a href="index.html">Beranda</a>/<a href="inovasi.html">Inovasi</a>/<span>${esc(p.bidang)}</span></div></div></section>
  <article class="artwrap"><span class="tag">${esc(p.bidang.toUpperCase())}</span> <span class="tag ${TCL[p.tahap]||''}">${esc(p.tahap.toUpperCase())}</span><h1>${esc(p.judul)}</h1><div class="muted" style="font-size:14px"><span data-i="cal" data-s="14"></span> Tahun ${esc(p.tahun)}</div>
  <div class="cv scene">${p.foto?`<img src="${p.foto}" alt="">`:scene(p.scene||'hills')}</div>
  ${p.capaian?`<div class="hlbox"><small>Capaian / target</small><b>${esc(p.capaian)}</b></div>`:''}
  <p class="prose" style="font-weight:500">${esc(p.ringkas)}</p><div class="prose">${sanitize(p.isi)}</div><a class="btn line" style="margin-top:20px" href="inovasi.html">← Semua program</a></article>`;
 },
 async data(S){
  const K=(await DB.list('kunjungan')).filter(isPub).sort((a,b)=>a.periode.localeCompare(b.periode));document.title='Data Kunjungan — '+S.singkat;
  const head=pagehead('<span>Data kunjungan</span>','Data kunjungan wisatawan','Rekap bulanan wisatawan nusantara (wisnus) dan wisatawan mancanegara (wisman).');
  if(!K.length)return head+`<section class="sec"><div class="wrap">${empty('Belum ada data kunjungan','Data ditambahkan dari panel admin.')}</div></section>`;
  const years=[...new Set(K.map(k=>k.periode.slice(0,4)))].sort().reverse();
  const get=(y,i)=>K.find(k=>k.periode===y+'-'+pad2(i+1));
  app_after=()=>{const draw=()=>{
   const y=$('#yr').value,rows=MONTHS.map((_,i)=>get(y,i)),py=String(+y-1);
   const tn=rows.reduce((s,r)=>s+(r?+r.wisnus:0),0),tm=rows.reduce((s,r)=>s+(r?+r.wisman:0),0),n=rows.filter(Boolean).length;
   const prev=rows.reduce((s,r,i)=>{const p=r&&get(py,i);return s+(p?(+p.wisnus)+(+p.wisman):0)},0);
   const ch=prev?((tn+tm-prev)/prev*100):null;
   const kp=(ic,bg,c,v,l)=>`<div class="kpi"><div class="ic" style="background:${bg};color:${c}" data-i="${ic}" data-s="22"></div><div><b>${v}</b><span>${l}</span></div></div>`;
   $('#dk').innerHTML=kp('users','#DCEBE1','#1F6B4F',compact(tn+tm),`Total kunjungan ${y}${n<12?` (${n} bulan)`:''}`)+kp('compass','#DCEBE1','#1F6B4F',compact(tn),'Wisatawan nusantara')+kp('globe','#FBEBC8','#8A5E0B',compact(tm),'Wisatawan mancanegara')+
    kp('trend','#E3E8FB','#3A4DB3',ch===null?'-':(ch>=0?'+':'')+ch.toFixed(1).replace('.',',')+'%',ch===null?'Belum ada data tahun lalu':`Dibanding periode sama ${py}`);
   $('#chart').innerHTML=barChart(rows);
   $('#dt').innerHTML=`<thead><tr><th>Bulan</th><th style="text-align:right">Wisnus</th><th style="text-align:right">Wisman</th><th style="text-align:right">Total</th></tr></thead><tbody>${rows.map((r,i)=>r?`<tr><td>${MONTHS[i]} ${y}</td><td style="text-align:right">${num(r.wisnus)}</td><td style="text-align:right">${num(r.wisman)}</td><td style="text-align:right;font-weight:600">${num(+r.wisnus+ +r.wisman)}</td></tr>`:'').join('')}<tr style="background:var(--mint)"><td><b>Jumlah</b></td><td style="text-align:right"><b>${num(tn)}</b></td><td style="text-align:right"><b>${num(tm)}</b></td><td style="text-align:right"><b>${num(tn+tm)}</b></td></tr></tbody>`;
   hydrate($('#dk'));};
   $('#yr').onchange=draw;draw()};
  return head+`<section class="sec"><div class="wrap">
   <div class="filters"><label for="yr" style="font-weight:600;font-size:14px">Tahun</label><select id="yr" class="sel" style="width:140px">${years.map(y=>`<option>${y}</option>`).join('')}</select><span class="muted" style="margin-left:auto;font-size:13px">Data contoh untuk demo, bukan angka resmi.</span></div>
   <div class="kpis" id="dk"></div>
   <div class="panel"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:10px"><h3 style="margin:0">Kunjungan per bulan</h3><div class="lg"><span><i style="background:#1F6B4F"></i>Wisnus</span><span><i style="background:#E8B04A"></i>Wisman</span></div></div><div id="chart"></div></div>
   <div class="panel" style="margin-top:18px"><h3>Tabel rekap</h3><div class="tw"><table id="dt"></table></div></div></div></section>`;
 },
 async berita(S){
  const A=(await DB.list('artikel')).filter(isPub).sort((a,b)=>b.tanggal.localeCompare(a.tanggal));document.title='Berita — '+S.singkat;
  app_after=()=>{let k='';const draw=()=>{const r=A.filter(a=>!k||a.kategori===k);$('#cnt').textContent=r.length+' artikel';$('#res').innerHTML=r.length?r.map(a=>newsCard(a)).join(''):empty('Belum ada berita');hydrate($('#res'));$$('#cats .cat').forEach(c=>c.classList.toggle('on',c.dataset.k===k))};
   $('#cats').onclick=e=>{const c=e.target.closest('.cat');if(c){k=c.dataset.k;draw()}};draw()};
  return pagehead('<span>Berita</span>','Berita &amp; informasi','Kabar terbaru, promosi, dan pengumuman.')+`<section class="sec"><div class="wrap">${chips(KAT_ARTIKEL)}<div class="grid3" id="res"></div></div></section>`;
 },
 async artikel(S){
  const a=await DB.get('artikel',QS().get('id'));
  if(!a||!isPub(a))return pagehead('<a href="berita.html">Berita</a>','Artikel tidak ditemukan','<a href="berita.html" style="text-decoration:underline">Kembali ke berita</a>');
  document.title=a.judul+' — '+S.singkat;
  return `<section class="pagehead" style="padding:30px 0"><div class="wrap"><div class="crumb"><a href="index.html">Beranda</a>/<a href="berita.html">Berita</a>/<span>${esc(a.kategori)}</span></div></div></section>
  <article class="artwrap"><span class="tag">${esc(a.kategori.toUpperCase())}</span><h1>${esc(a.judul)}</h1><div class="muted" style="font-size:14px"><span data-i="cal" data-s="14"></span> ${fmt(a.tanggal)}</div>
  <div class="cv scene">${a.foto?`<img src="${a.foto}" alt="">`:scene(a.scene||'hills')}</div><div class="prose">${sanitize(a.isi)}</div><a class="btn line" style="margin-top:20px" href="berita.html">← Semua berita</a></article>`;
 },
 async agenda(S){
  const G=(await DB.list('agenda')).filter(isPub);document.title='Agenda — '+S.singkat;
  const up=G.filter(g=>(g.selesai||g.mulai)>=today()).sort((a,b)=>a.mulai.localeCompare(b.mulai));
  const past=G.filter(g=>(g.selesai||g.mulai)<today()).sort((a,b)=>b.mulai.localeCompare(a.mulai));
  const row=(g,dim)=>{const p=dparts(g.mulai);return `<div class="pc agr" style="${dim?'opacity:.7':''}">${cover(g)}<div class="b" style="display:flex;gap:18px;align-items:flex-start"><div class="ev" style="border:0;padding:0;margin:0"><div class="d"><b>${p.d}</b><span>${p.m}</span></div></div><div><h3 style="margin-top:0">${esc(g.judul)}</h3><div class="m" style="margin-top:4px"><span data-i="pin" data-s="14"> ${esc(g.lokasi)}</span><span data-i="cal" data-s="14"> ${fmt(g.mulai)}${g.selesai?' – '+fmt(g.selesai):''}</span></div><div class="prose" style="font-size:14.5px;margin-top:10px">${sanitize(g.deskripsi)}</div></div></div></div>`};
  return pagehead('<span>Agenda</span>','Agenda wisata','Festival, lomba, dan acara budaya di Kalimantan Selatan.')+
  `<section class="sec"><div class="wrap"><h2 style="font-size:30px;margin-bottom:20px">Mendatang</h2><div style="display:grid;gap:18px">${up.length?up.map(g=>row(g)).join(''):empty('Belum ada agenda mendatang')}</div>
  ${past.length?`<h2 style="font-size:30px;margin:44px 0 20px">Telah berlangsung</h2><div style="display:grid;gap:18px">${past.map(g=>row(g,1)).join('')}</div>`:''}</div></section>`;
 },
 async tentang(S){
  document.title='Tentang Kami — '+S.singkat;
  return pagehead('<span>Tentang Kami</span>',esc(S.nama),esc(S.wilayah))+
  `<section class="sec"><div class="wrap"><div class="body" style="padding:0"><div class="prose">${sanitize(S.tentang)}</div><aside class="info"><h3>Hubungi kami</h3>
   <div class="row" style="margin-top:12px"><div class="ic" data-i="pin" data-s="20"></div><div><small>Alamat</small><b>${esc(S.alamat)}</b></div></div>
   <div class="row"><div class="ic" data-i="phone" data-s="20"></div><div><small>Telepon</small><b>${esc(S.telp)}</b></div></div>
   <div class="row"><div class="ic" data-i="mail" data-s="20"></div><div><small>Email</small><b>${esc(S.email)}</b></div></div></aside></div></div></section>`;
 }
};
let app_after=null;
let __qs=null;
function QS(){return new URLSearchParams(__qs!==null?__qs:location.search)}
async function boot(forcePage){
 const page=forcePage||document.body.dataset.page;if(!page||!PAGES[page])return;
 app_after=null;document.body.className='';document.body.innerHTML='';document.body.dataset.page=page;delete document.body.dataset.ready;
 const S=await DB.settings();
 document.body.insertAdjacentHTML('afterbegin',`<div id="hdr">${navHtml(S,page,page!=='index'&&page!=='detail')}</div><main id="app"></main><div id="ftr">${footHtml(S)}</div>`);
 $('#app').innerHTML=await PAGES[page](S);
 hydrate();if(app_after)app_after();
 const b=$('#burger'),m=$('#menu');b.onclick=()=>{const o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)};
 $$('#menu .dd>button').forEach(bt=>bt.onclick=()=>{const dd=bt.parentElement,o=!dd.classList.contains('open');$$('#menu .dd').forEach(x=>x.classList.remove('open'));dd.classList.toggle('open',o);bt.setAttribute('aria-expanded',o)});
 document.body.dataset.ready='1';
}
document.addEventListener('DOMContentLoaded',()=>boot());
