/* ===== Panel admin (SPA, hash router) ===== */
let root=$('#root');
let user=null;try{user=JSON.parse(sessionStorage.getItem('dc_sess'))}catch(e){}
const fs=d=>fmt(d,{day:'numeric',month:'short',year:'numeric'});
const CFG={
 artikel:{label:'Berita',one:'artikel',icon:'file',nm:i=>i.judul,view:i=>'artikel.html?id='+i.id,sub:i=>[i.kategori,fs(i.tanggal)],h:['Judul','Kategori','Tanggal'],key:'f_judul'},
 agenda:{label:'Agenda',one:'agenda',icon:'cal',nm:i=>i.judul,view:()=>'agenda.html',sub:i=>[i.lokasi,fs(i.mulai)],h:['Acara','Lokasi','Tanggal'],key:'f_judul'},
 destinasi:{label:'Destinasi',one:'destinasi',icon:'pin',nm:i=>i.nama,view:i=>'detail.html?id='+i.id,sub:i=>[i.kabupaten,i.kategori],h:['Nama','Kabupaten/Kota','Kategori'],key:'f_nama'},
 inovasi:{label:'Inovasi',one:'program',icon:'bulb',nm:i=>i.judul,view:i=>'program.html?id='+i.id,sub:i=>[i.bidang,i.tahap+' · '+i.tahun],h:['Program','Bidang','Tahap'],key:'f_judul'}
};
Object.entries(DIR).forEach(([k,d])=>{CFG[k]={label:d.label,one:d.one,icon:d.icon,nm:i=>i.nama,view:()=>k+'.html',sub:i=>[i.kabupaten,i.sub],h:['Nama','Kabupaten/Kota',d.subL],key:'f_nama',dir:1}});
CFG.kunjungan={label:'Data Kunjungan',one:'data',icon:'bar',nm:i=>fmtPeriode(i.periode),view:()=>'data.html',sub:i=>[num(i.wisnus),num(i.wisman)],h:['Periode','Wisnus','Wisman'],key:'f_periode'};
const ucf=s=>s[0].toUpperCase()+s.slice(1);
const label=s=>({terbit:'Terbit',draf:'Draf',terjadwal:'Terjadwal'}[s]||s);
function toast(msg,err){$$('.toast').forEach(x=>x.remove());const t=document.createElement('div');t.className='toast'+(err?' err':'');t.setAttribute('role','status');t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2800)}
function modal(inner,onMount){return new Promise(res=>{const m=document.createElement('div');m.className='modal';m.innerHTML=`<div class="m" role="dialog" aria-modal="true">${inner}</div>`;document.body.appendChild(m);
 const done=v=>{m.remove();res(v)};m.onclick=e=>{if(e.target===m)done(null)};m.onkeydown=e=>{if(e.key==='Escape')done(null)};onMount(m,done)})}
const confirmBox=({title,body,ok})=>modal(`<h3>${esc(title)}</h3><p class="muted">${esc(body)}</p><div style="display:flex;gap:10px;justify-content:flex-end;margin-top:22px"><button class="btn line" data-no>Batal</button><button class="btn danger" data-ok>${esc(ok)}</button></div>`,(m,done)=>{m.querySelector('[data-no]').onclick=()=>done(false);m.querySelector('[data-ok]').onclick=()=>done(true);m.querySelector('[data-no]').focus()});
const promptBox=({title,label})=>modal(`<h3>${esc(title)}</h3><div class="field" style="margin-top:14px"><label for="pv">${esc(label)}</label><input class="inp" id="pv" placeholder="https://"></div><div style="display:flex;gap:10px;justify-content:flex-end"><button class="btn line" data-no>Batal</button><button class="btn dark" data-ok>Pasang Tautan</button></div>`,(m,done)=>{const i=m.querySelector('#pv');i.focus();i.onkeydown=e=>{if(e.key==='Enter')done(i.value)};m.querySelector('[data-no]').onclick=()=>done(null);m.querySelector('[data-ok]').onclick=()=>done(i.value)});

/* ---------- login ---------- */
function showLogin(){
 root.innerHTML=`<div class="login"><form class="box" id="lf" novalidate><div class="brand" style="color:var(--forest)"><div class="logo" data-i="compass" data-s="24"></div><div><b>Disbudpar CMS</b><small class="muted">Panel admin</small></div></div>
  <h1>Masuk ke panel admin</h1><p class="muted" style="margin-bottom:20px">Kelola destinasi, direktori, berita, dan data situs.</p>
  <div class="demo">Mode demo: gunakan <b>admin</b> / <b>admin123</b></div>
  <div class="field"><label for="u">Nama pengguna</label><input class="inp" id="u" autocomplete="username" autofocus></div>
  <div class="field"><label for="p">Kata sandi</label><input class="inp" id="p" type="password" autocomplete="current-password"></div>
  <div id="err" role="alert" style="color:var(--danger);font-size:13px;min-height:20px;margin-bottom:6px"></div>
  <button class="btn primary" style="width:100%">Masuk</button><p style="text-align:center;margin-top:16px;font-size:13px"><a href="index.html" class="muted">← Kembali ke situs</a></p></form></div>`;
 hydrate(root);
 $('#lf').onsubmit=async e=>{e.preventDefault();const r=await DB.login($('#u').value.trim(),$('#p').value);
  if(!r){$('#err').textContent='Nama pengguna atau kata sandi belum cocok. Coba lagi.';return}
  user=r;try{sessionStorage.setItem('dc_sess',JSON.stringify(r))}catch(e){}location.hash='#adm-dasbor';route()};
}
/* ---------- shell ---------- */
async function shell(active,html){
 const dr=(await DB.list('artikel')).filter(a=>a.status==='draf').length;
 const nav=(h,b)=>{const c=CFG[h]||{icon:h==='dasbor'?'layout':'sliders',label:h==='dasbor'?'Dasbor':'Pengaturan Situs'};return `<a href="#adm-${h}" class="${active===h?'on':''}" data-i="${c.icon}" data-s="18"> ${c.label}${b?`<em>${b}</em>`:''}</a>`};
 root.innerHTML=`<div class="app"><aside class="sb" id="sb"><div class="brand"><div class="logo" data-i="compass" data-s="22"></div><div><b>Disbudpar CMS</b><small>Kalimantan Selatan</small></div></div>
  ${nav('dasbor')}<div class="grp">Konten</div>${nav('artikel',dr||'')}${nav('agenda')}${nav('destinasi')}${nav('inovasi')}
  <div class="grp">Direktori</div>${nav('penginapan')}${nav('kuliner')}${nav('travel')}${nav('pokdarwis')}${nav('ekraf')}
  <div class="grp">Data</div>${nav('kunjungan')}
  <div class="grp">Sistem</div>${nav('pengaturan')}
  <div class="me"><div class="av">${esc(user.nama.slice(0,2).toUpperCase())}</div><div style="min-width:0"><b style="color:#fff;display:block;font-size:13px">${esc(user.nama)}</b><button id="out" style="background:none;border:0;color:#cfe0d5;font-size:12px;text-decoration:underline;padding:0">Keluar</button></div></div></aside>
  <main class="main"><div class="tb"><div style="display:flex;gap:10px;align-items:center"><button class="ib burger" id="bg" aria-label="Buka menu" data-i="menu" data-s="20"></button><span class="muted" style="font-size:14px">${esc(user.role)}</span></div><a class="btn line sm" href="index.html" target="_blank"><span data-i="eye" data-s="16"></span> Lihat Situs</a></div>
  <div class="demo">Mode demo: data tersimpan di browser ini saja. Setelah dihubungkan ke database hosting, data akan tersimpan permanen untuk semua admin.</div>${html}</main></div>`;
 hydrate(root);
 $('#out').onclick=()=>{try{sessionStorage.removeItem('dc_sess')}catch(e){}user=null;location.hash='#adm-masuk';showLogin()};
 $('#bg').onclick=()=>$('#sb').classList.toggle('open');
}
/* ---------- dasbor ---------- */
async function viewDash(){
 const T=Object.keys(CFG).filter(t=>t!=='kunjungan'),D={};for(const t of T)D[t]=await DB.list(t);
 const dirN=Object.keys(DIR).reduce((s,k)=>s+D[k].filter(x=>x.status==='terbit').length,0);
 const kp=(ic,bg,c,n,l)=>`<div class="kpi"><div class="ic" style="background:${bg};color:${c}" data-i="${ic}" data-s="22"></div><div><b>${n}</b><span>${l}</span></div></div>`;
 const all=T.flatMap(t=>D[t].map(x=>({t,x}))).sort((a,b)=>(b.x.updated||'').localeCompare(a.x.updated||'')).slice(0,8);
 await shell('dasbor',`<div class="ph"><div><h1>Selamat datang, ${esc(user.nama.split(' ')[0])}</h1><p class="muted">${fmt(today(),{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p></div>
  <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn dark" href="#adm-artikel-baru"><span data-i="plus" data-s="16"></span> Tulis Berita</a><a class="btn primary" href="#adm-destinasi-baru"><span data-i="plus" data-s="16"></span> Tambah Destinasi</a></div></div>
  <div class="kpis">${kp('pin','#FBE3D6','#B24A18',D.destinasi.filter(a=>a.status==='terbit').length,'Destinasi aktif')}${kp('users','#DCEBE1','#1F6B4F',dirN,'Usaha & kelompok di direktori')}${kp('file','#E3E8FB','#3A4DB3',D.artikel.filter(a=>a.status==='terbit').length,'Berita terbit')}${kp('edit','#FBEBC8','#8A5E0B',T.reduce((s,t)=>s+D[t].filter(x=>x.status==='draf').length,0),'Draf menunggu')}</div>
  <div class="panel"><h3>Konten terakhir diperbarui</h3><div class="tw"><table><tr><th>Judul</th><th>Jenis</th><th>Status</th><th>Diperbarui</th></tr>${all.map(({t,x})=>`<tr><td>${cover(x,'th')}<a class="nm" href="#adm-${t}-${x.id}">${esc(CFG[t].nm(x))}</a></td><td>${CFG[t].label}</td><td><span class="st ${x.status}">${label(x.status)}</span></td><td>${fmt(x.updated,{day:'numeric',month:'short'})}</td></tr>`).join('')}</table></div></div>`);
 hydrate(root);
}
/* ---------- daftar ---------- */
async function viewList(t){
 const c=CFG[t];const items=await DB.list(t);let q='',st='';
 if(t==='kunjungan')items.sort((a,b)=>b.periode.localeCompare(a.periode));
 await shell(t,`<div class="ph"><div><h1>${c.label}</h1><p class="muted" id="cnt"></p></div><a class="btn primary" href="#adm-${t}-baru"><span data-i="plus" data-s="16"></span> Tambah ${ucf(c.one)}</a></div>
  <div class="panel"><div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap"><input class="inp" id="q" placeholder="Cari ${c.one}…" aria-label="Cari" style="flex:1;min-width:200px"><select class="sel" id="st" aria-label="Filter status" style="width:170px"><option value="">Semua status</option><option value="terbit">Terbit</option><option value="draf">Draf</option>${t==='artikel'?'<option value="terjadwal">Terjadwal</option>':''}</select></div>
  <div class="tw"><table><thead><tr><th>${c.h[0]}</th><th>${c.h[1]}</th><th>${c.h[2]}</th><th>Status</th><th></th></tr></thead><tbody id="tb"></tbody></table></div></div>`);
 const draw=()=>{const r=items.filter(i=>(!st||i.status===st)&&(!q||c.nm(i).toLowerCase().includes(q.toLowerCase())));
  $('#cnt').textContent=`${r.length} dari ${items.length} ${c.one}`;
  $('#tb').innerHTML=r.length?r.map(i=>{const s=c.sub(i);return `<tr><td>${t==='kunjungan'?'':cover(i,'th')}<a class="nm" href="#adm-${t}-${i.id}">${esc(c.nm(i))}</a></td><td>${esc(s[0])}</td><td>${esc(s[1])}</td><td><span class="st ${i.status}">${label(i.status)}</span></td>
   <td style="white-space:nowrap;text-align:right"><a class="ib" title="Lihat di situs" aria-label="Lihat di situs" href="${c.view(i)}" target="_blank" data-i="eye" data-s="16"></a> <a class="ib" title="Ubah" aria-label="Ubah" href="#adm-${t}-${i.id}" data-i="edit" data-s="16"></a> <button class="ib del" title="Hapus" aria-label="Hapus ${esc(c.nm(i))}" data-del="${i.id}" data-i="trash" data-s="16"></button></td></tr>`}).join(''):`<tr><td colspan="5" style="text-align:center;padding:40px;color:var(--muted)">Belum ada ${c.one} yang cocok.</td></tr>`;hydrate($('#tb'))};
 $('#q').oninput=e=>{q=e.target.value;draw()};$('#st').onchange=e=>{st=e.target.value;draw()};
 $('#tb').onclick=async e=>{const b=e.target.closest('[data-del]');if(!b)return;const it=items.find(x=>x.id===b.dataset.del);
  if(await confirmBox({title:`Hapus “${c.nm(it)}”?`,body:'Tindakan ini tidak bisa dibatalkan.',ok:`Hapus ${ucf(c.one)}`})){await DB.remove(t,it.id);items.splice(items.indexOf(it),1);draw();toast(ucf(c.one)+' dihapus')}};
 draw();
}
/* ---------- komponen form ---------- */
const fText=(id,l,v,o={})=>`<div class="field"><label for="${id}">${l}</label><input class="inp" id="${id}" type="${o.type||'text'}" value="${esc(v??'')}" ${o.ph?`placeholder="${esc(o.ph)}"`:''} ${o.type==='number'?'min="0" inputmode="numeric"':''}>${o.hint?`<div class="hint">${o.hint}</div>`:''}</div>`;
const fArea=(id,l,v,h)=>`<div class="field"><label for="${id}">${l}</label><textarea class="inp" id="${id}" rows="2">${esc(v||'')}</textarea>${h?`<div class="hint">${h}</div>`:''}</div>`;
const fSel=(id,l,opts,v)=>`<div class="field"><label for="${id}">${l}</label><select class="sel" id="${id}">${opts.map(o=>{const [val,t]=Array.isArray(o)?o:[o,o];return `<option value="${esc(val)}" ${String(val)===String(v)?'selected':''}>${esc(t)}</option>`}).join('')}</select></div>`;
const g2=(...a)=>`<div class="g2">${a.join('')}</div>`;
const rte=(id,html,ph)=>`<div class="tool" data-for="${id}">${[['bold','bold','Tebal'],['italic','italic','Miring'],['heading','h2','Judul bagian'],['list','ul','Daftar poin'],['link','link','Tautan']].map(b=>`<button type="button" data-cmd="${b[1]}" title="${b[2]}" aria-label="${b[2]}" data-i="${b[0]}" data-s="17"></button>`).join('')}</div><div class="cont" id="${id}" contenteditable="true" role="textbox" aria-multiline="true" data-ph="${ph}">${sanitize(html)}</div>`;
const rteField=(id,l,html,ph)=>`<div class="field"><label>${l}</label><div class="ed" style="border-radius:14px">${rte(id,html,ph)}</div></div>`;
function bindRte(id){
 const ed=$('#'+id);let saved=null;const tool=$(`.tool[data-for="${id}"]`);
 tool.onmousedown=e=>e.preventDefault();
 tool.onclick=async e=>{const b=e.target.closest('[data-cmd]');if(!b)return;ed.focus();const c=b.dataset.cmd;
  if(c==='bold')document.execCommand('bold');else if(c==='italic')document.execCommand('italic');
  else if(c==='ul')document.execCommand('insertUnorderedList');
  else if(c==='h2'){const cur=document.queryCommandValue('formatBlock').toLowerCase();document.execCommand('formatBlock',false,cur==='h2'?'p':'h2')}
  else if(c==='link'){const s=getSelection();if(s.rangeCount)saved=s.getRangeAt(0);const u=await promptBox({title:'Pasang tautan',label:'Alamat tautan (URL)'});
   if(u&&/^(https?:|mailto:)/i.test(u.trim())){ed.focus();const s2=getSelection();s2.removeAllRanges();if(saved)s2.addRange(saved);document.execCommand('createLink',false,u.trim())}else if(u)toast('Tautan harus diawali https:// atau mailto:',1)}};
 ed.onpaste=e=>{e.preventDefault();const t=(e.clipboardData||window.clipboardData).getData('text/plain');document.execCommand('insertText',false,t)};
}
function coverBox(cur){
 return `<div class="panel"><h3>Gambar sampul</h3><div class="drop" id="drop" style="cursor:pointer" role="button" tabindex="0" aria-label="Ganti gambar sampul"></div>
  <input type="file" id="file" accept="image/*" hidden><div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button type="button" class="btn line sm" id="up"><span data-i="upload" data-s="14"></span> Unggah Foto</button><button type="button" class="btn line sm" id="rm" ${cur.foto?'':'hidden'}>Hapus Foto</button></div>
  <div class="field" style="margin-top:14px"><label for="scn">Ilustrasi bawaan (bila tanpa foto)</label><select class="sel" id="scn">${SCENES.map(s=>`<option ${s===cur.scene?'selected':''}>${s}</option>`).join('')}</select></div></div>`;
}
function bindCover(cur){
 const paint=()=>{$('#drop').innerHTML=cover(cur);$('#drop').firstElementChild.style.cssText='position:absolute;inset:0;border-radius:12px';$('#rm').hidden=!cur.foto;$('#scn').disabled=!!cur.foto;hydrate($('#drop'))};paint();
 const pick=()=>$('#file').click();$('#drop').onclick=pick;$('#drop').onkeydown=e=>{if(e.key==='Enter'||e.key===' ')pick()};$('#up').onclick=pick;
 $('#file').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{cur.foto=await resizeImage(f);paint();toast('Foto siap. Klik Simpan untuk menyimpan.')}catch(x){toast(x.message,1)}e.target.value=''};
 $('#rm').onclick=()=>{cur.foto=null;paint()};$('#scn').onchange=e=>{cur.scene=e.target.value;paint()};
}
/* ---------- editor ---------- */
const BLANK={
 artikel:()=>({judul:'',kategori:'Berita',scene:'hills',foto:null,status:'draf',tanggal:today(),ringkas:'',isi:''}),
 destinasi:()=>({nama:'',kategori:KATEGORI[0],kabupaten:KABUPATEN[0],unggulan:false,scene:'hills',status:'draf',ringkas:'',deskripsi:'',jam:'',tiket:'',alamat:'',kontak:'',fasilitas:[],galeri:[],foto:null}),
 agenda:()=>({judul:'',mulai:today(),selesai:'',lokasi:'',scene:'culture',foto:null,status:'draf',deskripsi:''}),
 inovasi:()=>({judul:'',bidang:BIDANG[0],tahap:'Berjalan',tahun:new Date().getFullYear(),ringkas:'',capaian:'',isi:'',scene:'hills',foto:null,status:'draf'}),
 kunjungan:()=>({periode:today().slice(0,7),wisnus:'',wisman:'',status:'terbit'})
};
const blank=t=>CFG[t].dir?{nama:'',sub:DIR[t].subs[0],kabupaten:KABUPATEN[0],ringkas:'',alamat:'',kontak:'',info:'',scene:DIR[t].scene,foto:null,status:'draf'}:BLANK[t]();
async function viewEditor(t,id){
 const c=CFG[t];const isNew=id==='baru';const cur=isNew?blank(t):await DB.get(t,id);
 if(!cur){await shell(t,`<div class="empty">${ucf(c.one)} tidak ditemukan. <a href="#adm-${t}" style="text-decoration:underline">Kembali ke daftar</a></div>`);return}
 const pub2=[['terbit','Terbit'],['draf','Draf']];
 let main='',side='';
 if(t==='artikel'){
  main=`<div class="ed"><div class="ti"><label class="muted" style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:700" for="f_judul">Judul berita</label><input id="f_judul" value="${esc(cur.judul)}" placeholder="Tulis judul yang jelas dan singkat"></div>${rte('f_isi',cur.isi,'Mulai menulis isi berita di sini…')}</div>
  <div class="panel" style="margin-top:16px">${fArea('f_ringkas','Ringkasan',cur.ringkas,'Tampil di kartu berita dan hasil pencarian Google (maks. 160 karakter).')}</div>`;
  side=`<div class="panel"><h3>Penerbitan</h3>${fSel('f_status','Status',[['draf','Draf'],['terbit','Terbit'],['terjadwal','Terjadwal']],cur.status)}${fText('f_tanggal','Tanggal terbit',cur.tanggal,{type:'date'})}${fSel('f_kategori','Kategori',KAT_ARTIKEL,cur.kategori)}</div>`;
 }else if(t==='destinasi'){
  main=`<div class="panel">${fText('f_nama','Nama destinasi',cur.nama,{ph:'Contoh: Air Terjun Mandin Damar'})}${g2(fSel('f_kategori','Kategori',KATEGORI,cur.kategori),fSel('f_kabupaten','Kabupaten/Kota',KABUPATEN,cur.kabupaten))}
   ${fArea('f_ringkas','Ringkasan singkat',cur.ringkas,'Satu atau dua kalimat untuk kartu destinasi.')}${rteField('f_deskripsi','Keterangan lengkap',cur.deskripsi,'Ceritakan keunikan destinasi…')}</div>
   <div class="panel" style="margin-top:16px"><h3>Informasi kunjungan</h3>${g2(fText('f_jam','Jam buka',cur.jam,{ph:'Setiap hari, 08.00 – 17.00'}),fText('f_tiket','Tiket masuk',cur.tiket,{ph:'Rp 10.000 atau Gratis'}),fText('f_alamat','Alamat',cur.alamat),fText('f_kontak','Kontak pengelola',cur.kontak,{ph:'Nama / nomor telepon'}))}
   <div class="field"><label>Fasilitas</label><div class="g2" style="gap:2px 14px">${Object.entries(FASILITAS).map(([k,v])=>`<label class="chk"><input type="checkbox" name="fas" value="${k}" ${cur.fasilitas.includes(k)?'checked':''}> ${v[1]}</label>`).join('')}</div></div></div>`;
  side=`<div class="panel"><h3>Penerbitan</h3>${fSel('f_status','Status',pub2,cur.status)}<label class="chk"><input type="checkbox" id="f_unggulan" ${cur.unggulan?'checked':''}> Tampilkan sebagai destinasi unggulan</label></div>`;
 }else if(t==='agenda'){
  main=`<div class="panel">${fText('f_judul','Nama acara',cur.judul)}${g2(fText('f_mulai','Tanggal mulai',cur.mulai,{type:'date'}),fText('f_selesai','Tanggal selesai (opsional)',cur.selesai,{type:'date'}))}${fText('f_lokasi','Lokasi',cur.lokasi)}${rteField('f_deskripsi','Deskripsi',cur.deskripsi,'Jelaskan acara…')}</div>`;
  side=`<div class="panel"><h3>Penerbitan</h3>${fSel('f_status','Status',pub2,cur.status)}</div>`;
 }else if(t==='inovasi'){
  main=`<div class="panel">${fText('f_judul','Nama program / inovasi',cur.judul,{ph:'Contoh: Desa Wisata Digital'})}${g2(fSel('f_bidang','Bidang',BIDANG,cur.bidang),fSel('f_tahap','Tahap',TAHAP,cur.tahap))}
   ${g2(fText('f_tahun','Tahun',cur.tahun,{type:'number'}),fText('f_capaian','Capaian / target',cur.capaian,{ph:'Contoh: 12 desa wisata didampingi'}))}
   ${fArea('f_ringkas','Ringkasan',cur.ringkas,'Satu atau dua kalimat untuk kartu program.')}${rteField('f_isi','Uraian program',cur.isi,'Latar belakang, kegiatan, dan hasil yang diharapkan…')}</div>`;
  side=`<div class="panel"><h3>Penerbitan</h3>${fSel('f_status','Status',pub2,cur.status)}</div>`;
 }else if(t==='kunjungan'){
  main=`<div class="panel">${fText('f_periode','Periode (bulan)',cur.periode,{type:'month',hint:'Format tahun-bulan, contoh 2026-10.'})}${g2(fText('f_wisnus','Wisatawan nusantara (wisnus)',cur.wisnus,{type:'number'}),fText('f_wisman','Wisatawan mancanegara (wisman)',cur.wisman,{type:'number'}))}
   <p class="muted" style="font-size:13px">Grafik dan tabel di halaman Data Kunjungan diperbarui otomatis dari data ini.</p></div>`;
  side=`<div class="panel"><h3>Penerbitan</h3>${fSel('f_status','Status',pub2,cur.status)}</div>`;
 }else{
  const d=DIR[t];
  main=`<div class="panel">${fText('f_nama','Nama',cur.nama)}${g2(fSel('f_sub',d.subL,d.subs,cur.sub),fSel('f_kabupaten','Kabupaten/Kota',KABUPATEN,cur.kabupaten))}
   ${fArea('f_ringkas','Keterangan singkat',cur.ringkas,'Satu atau dua kalimat yang tampil di kartu.')}
   ${g2(fText('f_alamat','Alamat / lokasi',cur.alamat),fText('f_kontak','Kontak (telepon/WA)',cur.kontak))}${fText('f_info',d.infoL,cur.info,{ph:d.infoPh})}</div>`;
  side=`<div class="panel"><h3>Penerbitan</h3>${fSel('f_status','Status',pub2,cur.status)}</div>`;
 }
 const gal=t==='destinasi'?`<div class="panel"><h3>Galeri foto</h3><div class="thumbs" id="thumbs"></div><input type="file" id="gfile" accept="image/*" multiple hidden><button type="button" class="btn line sm" style="margin-top:12px" id="gadd"><span data-i="image" data-s="14"></span> Tambah Foto</button><div class="hint muted" style="font-size:12px;margin-top:8px">Maksimal 6 foto. Ukuran otomatis diperkecil.</div></div>`:'';
 await shell(t,`<div class="ph"><div><div class="muted" style="font-size:13px"><a href="#adm-${t}" style="text-decoration:underline">${c.label}</a> / ${isNew?'Baru':'Ubah'}</div><h1>${isNew?'Tambah '+c.one:'Ubah '+c.one}</h1></div>
  <div style="display:flex;gap:10px"><a class="btn line" href="#adm-${t}">Batal</a><button class="btn primary" id="save"><span data-i="save" data-s="16"></span> Simpan</button></div></div>
  <div class="eg"><div>${main}</div><div style="display:flex;flex-direction:column;gap:16px">${side}${t==='kunjungan'?'':coverBox(cur)}${gal}</div></div>`);
 hydrate(root);if(t!=='kunjungan')bindCover(cur);
 $$('.cont[contenteditable]').forEach(e=>bindRte(e.id));
 if(t==='destinasi'){
  cur.galeri=cur.galeri||[];
  const drawG=()=>{$('#thumbs').innerHTML=cur.galeri.map((g,i)=>`<div class="tb2"><img src="${g}" alt=""><button type="button" data-rg="${i}" aria-label="Hapus foto ${i+1}">×</button></div>`).join('');$('#gadd').disabled=cur.galeri.length>=6};drawG();
  $('#gadd').onclick=()=>$('#gfile').click();
  $('#gfile').onchange=async e=>{for(const f of [...e.target.files]){if(cur.galeri.length>=6){toast('Maksimal 6 foto galeri',1);break}try{cur.galeri.push(await resizeImage(f,1000,.75))}catch(x){toast(x.message,1)}}e.target.value='';drawG()};
  $('#thumbs').onclick=e=>{const b=e.target.closest('[data-rg]');if(b){cur.galeri.splice(+b.dataset.rg,1);drawG()}};
 }
 $('#save').onclick=async()=>{
  const v=id=>(($('#'+id)||{}).value||'').trim();const h=id=>sanitize($('#'+id).innerHTML.trim());const n=id=>Math.max(0,parseInt(v(id),10)||0);
  if(!v(c.key)){toast(($('label[for='+c.key+']')||{}).textContent+' belum diisi',1);$('#'+c.key).focus();return}
  if(t==='artikel')Object.assign(cur,{judul:v('f_judul'),isi:h('f_isi'),ringkas:v('f_ringkas')||stripHtml(h('f_isi')).slice(0,150),status:v('f_status'),tanggal:v('f_tanggal')||today(),kategori:v('f_kategori')});
  else if(t==='destinasi')Object.assign(cur,{nama:v('f_nama'),kategori:v('f_kategori'),kabupaten:v('f_kabupaten'),ringkas:v('f_ringkas'),deskripsi:h('f_deskripsi'),jam:v('f_jam'),tiket:v('f_tiket'),alamat:v('f_alamat'),kontak:v('f_kontak'),fasilitas:$$('[name=fas]:checked').map(x=>x.value),unggulan:$('#f_unggulan').checked,status:v('f_status')});
  else if(t==='agenda'){if(!v('f_mulai')){toast('Tanggal mulai belum diisi',1);return}Object.assign(cur,{judul:v('f_judul'),mulai:v('f_mulai'),selesai:v('f_selesai'),lokasi:v('f_lokasi'),deskripsi:h('f_deskripsi'),status:v('f_status')})}
  else if(t==='inovasi')Object.assign(cur,{judul:v('f_judul'),bidang:v('f_bidang'),tahap:v('f_tahap'),tahun:n('f_tahun')||new Date().getFullYear(),capaian:v('f_capaian'),ringkas:v('f_ringkas'),isi:h('f_isi'),status:v('f_status')});
  else if(t==='kunjungan'){const per=v('f_periode');if(!/^\d{4}-\d{2}$/.test(per)){toast('Periode harus berformat tahun-bulan, contoh 2026-10',1);return}
   if((await DB.list('kunjungan')).some(k=>k.periode===per&&k.id!==cur.id)){toast('Data '+fmtPeriode(per)+' sudah ada. Ubah data yang sudah ada.',1);return}
   Object.assign(cur,{periode:per,wisnus:n('f_wisnus'),wisman:n('f_wisman'),status:v('f_status')})}
  else Object.assign(cur,{nama:v('f_nama'),sub:v('f_sub'),kabupaten:v('f_kabupaten'),ringkas:v('f_ringkas'),alamat:v('f_alamat'),kontak:v('f_kontak'),info:v('f_info'),status:v('f_status')});
  try{await DB.save(t,cur);toast(ucf(c.one)+' tersimpan');location.hash='#adm-'+t}catch(x){toast(x.message,1)}
 };
}
/* ---------- pengaturan ---------- */
async function viewSettings(){
 const S=await DB.settings();
 await shell('pengaturan',`<div class="ph"><div><h1>Pengaturan situs</h1><p class="muted">Identitas dan kontak yang tampil di seluruh situs, termasuk footer.</p></div><button class="btn primary" id="save"><span data-i="save" data-s="16"></span> Simpan</button></div>
  <div class="eg"><div class="panel">${fText('s_nama','Nama instansi',S.nama)}${fText('s_wilayah','Wilayah',S.wilayah)}${fText('s_singkat','Nama singkat (di menu)',S.singkat)}${fArea('s_slogan','Slogan',S.slogan)}
  ${rteField('s_tentang','Halaman “Tentang Kami”',S.tentang,'Tulis profil…')}</div>
  <div style="display:flex;flex-direction:column;gap:16px"><div class="panel"><h3>Kontak (footer)</h3>${fText('s_alamat','Alamat',S.alamat)}${fText('s_telp','Telepon',S.telp)}${fText('s_email','Email',S.email)}</div>
  <div class="panel"><h3>Data demo</h3><p class="muted" style="font-size:13px;margin-bottom:12px">Penyimpanan terpakai: ${DB.usageKB()} KB dari sekitar 5.000 KB.</p><button class="btn line sm" id="rst">Kembalikan Data Contoh</button></div></div></div>`);
 hydrate(root);bindRte('s_tentang');
 $('#save').onclick=async()=>{const v=id=>$('#'+id).value.trim();try{await DB.saveSettings({...S,nama:v('s_nama'),wilayah:v('s_wilayah'),singkat:v('s_singkat'),slogan:v('s_slogan'),tentang:sanitize($('#s_tentang').innerHTML),alamat:v('s_alamat'),telp:v('s_telp'),email:v('s_email')});toast('Pengaturan tersimpan')}catch(x){toast(x.message,1)}};
 $('#rst').onclick=async()=>{if(await confirmBox({title:'Kembalikan data contoh?',body:'Semua perubahan, foto, dan konten yang sudah ditambahkan akan diganti dengan data contoh awal.',ok:'Kembalikan Data'})){await DB.reset();toast('Data contoh dipulihkan');route()}};
}
/* ---------- router ---------- */
async function route(){
 if(!user){showLogin();return}
 const mm=location.hash.match(/^#adm-([a-z]+)(?:-(.+))?$/)||[];const a=mm[1]||'dasbor',b=mm[2];
 try{
  if(CFG[a])b?await viewEditor(a,b):await viewList(a);
  else if(a==='pengaturan')await viewSettings();
  else await viewDash();
 }catch(e){console.error(e);root.innerHTML=`<div class="login"><div class="box"><h1>Terjadi kesalahan</h1><p class="muted">${esc(e.message)}</p><a class="btn dark" href="#adm-dasbor" style="margin-top:16px">Kembali ke Dasbor</a></div></div>`}
 window.scrollTo(0,0);document.body.dataset.ready='1';
}
if($('#root')){addEventListener('hashchange',route);route()}
