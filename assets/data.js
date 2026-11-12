/* ============================================================
   DATA LAYER — semua akses data lewat objek DB (async).
   Saat ini: localStorage (mode demo). Nanti: ganti isi DB.* agar
   memanggil API PHP (fetch('/api/...')) tanpa mengubah halaman.
   ============================================================ */
const KABUPATEN=['Banjarmasin','Banjarbaru','Banjar','Barito Kuala','Tapin','Hulu Sungai Selatan','Hulu Sungai Tengah','Hulu Sungai Utara','Tabalong','Tanah Laut','Tanah Bumbu','Kotabaru','Balangan'];
const KATEGORI=['Alam','Pantai & Bahari','Budaya & Sejarah','Kuliner','Religi'];
const KAT_ARTIKEL=['Berita','Promosi','Info','Pengumuman'];
const FASILITAS={parkir:['car','Area parkir'],toilet:['toilet','Toilet'],makan:['food','Warung makan'],musala:['pray','Musala'],sinyal:['wifi','Sinyal seluler'],pemandu:['check','Pemandu lokal']};
const SCENES=['hills','beach','waterfall','culture','mist','river'];

const _d=n=>{const d=new Date();d.setDate(d.getDate()+n);return new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)};

const BIDANG=['Destinasi','Pemasaran','SDM & Kelembagaan','Ekonomi Kreatif','Digitalisasi'];
const TAHAP=['Rencana','Berjalan','Selesai'];
const MONTHS=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const DIR={
 penginapan:{label:'Penginapan',one:'penginapan',unit:'penginapan',icon:'bed',scene:'river',subL:'Tipe',subs:['Hotel','Resort','Homestay','Guest House'],infoL:'Kisaran harga per malam',infoPh:'Rp 250.000 – Rp 500.000',infoIcon:'ticket',lead:'Hotel, resort, dan homestay di sekitar destinasi wisata Kalimantan Selatan.',grp:'Direktori'},
 kuliner:{label:'Kuliner',one:'tempat kuliner',unit:'tempat kuliner',icon:'food',scene:'culture',subL:'Jenis',subs:['Rumah makan','Kafe','Jajanan & kue','Oleh-oleh'],infoL:'Kisaran harga',infoPh:'Rp 20.000 – Rp 50.000',infoIcon:'ticket',lead:'Cita rasa Banjar: soto, ketupat Kandangan, wadai, hingga oleh-oleh khas.',grp:'Direktori'},
 travel:{label:'Travel Agen',one:'travel agen',unit:'travel agen',icon:'globe',scene:'hills',subL:'Jenis layanan',subs:['Biro perjalanan wisata','Operator tur','Agen tiket','Sewa kendaraan'],infoL:'Layanan unggulan',infoPh:'Paket susur sungai, tur Meratus',infoIcon:'compass',lead:'Mitra perjalanan untuk paket wisata, tur, tiket, dan transportasi.',grp:'Direktori'},
 pokdarwis:{label:'Pokdarwis',one:'pokdarwis',unit:'pokdarwis',icon:'users',scene:'mist',subL:'Klasifikasi',subs:['Rintisan','Berkembang','Maju','Mandiri'],infoL:'Destinasi kelolaan',infoPh:'Nama destinasi yang dikelola',infoIcon:'compass',lead:'Kelompok Sadar Wisata: warga penggerak yang mengelola destinasi di desanya.',grp:'Direktori'},
 ekraf:{label:'Ekonomi Kreatif',one:'pelaku ekraf',unit:'pelaku ekraf',icon:'bag',scene:'culture',subL:'Subsektor',subs:['Kriya','Fesyen','Kuliner','Musik','Seni pertunjukan','Fotografi','Desain','Aplikasi & game'],infoL:'Produk unggulan',infoPh:'Kain sasirangan, anyaman purun',infoIcon:'check',lead:'Pelaku ekonomi kreatif Kalimantan Selatan: kriya, fesyen, musik, hingga kuliner kreatif.'}
};
const _dir=(p,rows)=>rows.map((r,i)=>({id:p+(i+1),nama:r[0],sub:r[1],kabupaten:r[2],alamat:r[3],info:r[4],ringkas:r[5],scene:r[6],kontak:'0812-0000-0000',foto:null,status:'terbit',updated:_d(-i-1)}));
const _kj=()=>{const a=[],D={2025:[[86,1.6],[79,1.4],[92,1.7],[98,1.9],[104,2.0],[131,2.6],[142,3.1],[118,2.8],[101,2.2],[97,1.9],[95,1.8],[148,2.9]],2026:[[94,1.8],[88,1.6],[99,1.9],[108,2.1],[112,2.3],[140,2.9],[155,3.4],[129,3.0],[110,2.4],[104,2.1]]};
 Object.entries(D).forEach(([y,ms])=>ms.forEach(([n,m],i)=>{const mm=String(i+1).padStart(2,'0');a.push({id:'k'+y+mm,periode:y+'-'+mm,wisnus:n*1000+(i*137)%900,wisman:Math.round(m*1000)+(i*53)%90,status:'terbit',updated:_d(-1)})}));return a.reverse()};
const SEED={
 v:1,
 settings:{
  nama:'Dinas Kebudayaan dan Pariwisata',wilayah:'Provinsi Kalimantan Selatan',singkat:'Disbudpar Kalsel',
  slogan:'Sungai, pegunungan, dan budaya Banjar yang hidup.',
  tentang:'<p>Dinas Kebudayaan dan Pariwisata Provinsi Kalimantan Selatan adalah pusat informasi resmi tentang destinasi, agenda, dan layanan wisatawan di Kalimantan Selatan.</p><p>Isi halaman ini dapat diubah dari panel admin pada menu Pengaturan Situs.</p>',
  alamat:'Jl. Contoh No. 1, Banjarmasin',telp:'(0511) 000 0000',email:'info@contoh.go.id',instagram:''
 },
 users:[{id:'u1',username:'admin',password:'admin123',nama:'Admin Disparbud',role:'Administrator'}],
 destinasi:[
  {id:'d1',nama:'Pasar Terapung Lok Baintan',kategori:'Budaya & Sejarah',kabupaten:'Banjar',unggulan:true,scene:'river',status:'terbit',
   ringkas:'Pasar tradisional di atas sungai: pedagang berperahu jukung menjajakan hasil kebun dan kue khas Banjar sejak subuh.',
   deskripsi:'<p>Pasar terapung adalah wajah khas budaya sungai Kalimantan Selatan. Para pedagang, umumnya ibu-ibu berperahu jukung, bertransaksi langsung di atas air dengan sistem barter maupun tunai.</p><p>Datanglah pagi hari untuk merasakan suasana paling ramai, lalu cicipi kue tradisional dan sarapan di atas perahu.</p>',
   jam:'Subuh – sekitar 09.00',tiket:'Gratis (sewa perahu terpisah)',alamat:'Desa Lok Baintan, Kab. Banjar',kontak:'',fasilitas:['parkir','makan','toilet'],galeri:[],foto:null,updated:'2026-11-10'},
  {id:'d2',nama:'Loksado & Bamboo Rafting',kategori:'Alam',kabupaten:'Hulu Sungai Selatan',unggulan:true,scene:'waterfall',status:'terbit',
   ringkas:'Gerbang Pegunungan Meratus: arung sungai dengan rakit bambu, jembatan gantung, dan kampung adat Dayak Meratus.',
   deskripsi:'<p>Loksado berada di kaki Pegunungan Meratus dan dikenal sebagai tempat wisata petualangan dan budaya. Pengunjung dapat menyusuri sungai dengan rakit bambu bersama pemandu lokal.</p><p>Di sekitarnya terdapat kampung adat dan jalur trekking yang menembus hutan.</p>',
   jam:'Setiap hari, 08.00 – 17.00',tiket:'Tarif rakit sesuai paket',alamat:'Kec. Loksado, Kab. Hulu Sungai Selatan',kontak:'',fasilitas:['parkir','pemandu','makan','musala'],galeri:[],foto:null,updated:'2026-11-10'},
  {id:'d3',nama:'Air Terjun Mandin Damar',kategori:'Alam',kabupaten:'Hulu Sungai Tengah',unggulan:true,scene:'waterfall',status:'terbit',
   ringkas:'Air terjun bertingkat di tengah hutan Meratus dengan kolam jernih untuk berendam.',
   deskripsi:'<p>Air terjun bertingkat dengan udara sejuk dan rimbun pepohonan. Cocok untuk wisata keluarga dan pencinta alam.</p><p>Gunakan alas kaki anti-selip dan hindari berkunjung saat hujan deras.</p>',
   jam:'Setiap hari, 08.00 – 17.00',tiket:'Rp 5.000',alamat:'Kab. Hulu Sungai Tengah',kontak:'',fasilitas:['parkir','toilet','makan'],galeri:[],foto:null,updated:'2026-11-09'},
  {id:'d4',nama:'Pantai Angsana',kategori:'Pantai & Bahari',kabupaten:'Tanah Bumbu',unggulan:true,scene:'beach',status:'terbit',
   ringkas:'Hamparan pasir luas dan ombak landai, favorit untuk berekreasi bersama keluarga saat akhir pekan.',
   deskripsi:'<p>Pantai dengan garis pantai panjang dan suasana senja yang memukau. Tersedia warung makan seafood di sepanjang pantai.</p>',
   jam:'Setiap hari, 24 jam',tiket:'Rp 5.000',alamat:'Kab. Tanah Bumbu',kontak:'',fasilitas:['parkir','toilet','makan','musala'],galeri:[],foto:null,updated:'2026-11-08'},
  {id:'d5',nama:'Waduk Riam Kanan',kategori:'Alam',kabupaten:'Banjar',unggulan:true,scene:'hills',status:'terbit',
   ringkas:'Danau buatan dikelilingi perbukitan hijau. Nikmati perahu wisata dan pulau-pulau kecil di tengahnya.',
   deskripsi:'<p>Waduk Riam Kanan menawarkan panorama perbukitan dan air tenang. Pengunjung dapat menyewa perahu untuk berkeliling dan memancing.</p>',
   jam:'Setiap hari, 07.00 – 18.00',tiket:'Rp 5.000',alamat:'Kec. Aranio, Kab. Banjar',kontak:'',fasilitas:['parkir','makan','toilet','musala'],galeri:[],foto:null,updated:'2026-11-07'},
  {id:'d6',nama:'Masjid Sultan Suriansyah',kategori:'Religi',kabupaten:'Banjarmasin',unggulan:false,scene:'culture',status:'terbit',
   ringkas:'Masjid tertua di Kalimantan Selatan dengan arsitektur tradisional Banjar bersejarah.',
   deskripsi:'<p>Masjid bersejarah yang menjadi bagian dari jejak awal Kesultanan Banjar. Arsitekturnya khas dengan atap bertingkat.</p><p>Pengunjung diharapkan berpakaian sopan dan menghormati waktu ibadah.</p>',
   jam:'Setiap hari (di luar waktu salat)',tiket:'Gratis',alamat:'Kuin Utara, Banjarmasin',kontak:'',fasilitas:['parkir','toilet','musala'],galeri:[],foto:null,updated:'2026-11-06'},
  {id:'d7',nama:'Pulau Kaget',kategori:'Alam',kabupaten:'Barito Kuala',unggulan:false,scene:'river',status:'terbit',
   ringkas:'Kawasan konservasi di delta sungai, habitat bekantan yang dapat diamati dari perahu saat sore.',
   deskripsi:'<p>Pulau Kaget dikenal sebagai tempat pengamatan bekantan, primata endemik Kalimantan. Kunjungan dilakukan dengan perahu dan sebaiknya sore hari.</p>',
   jam:'Sore hari (menyesuaikan pengelola)',tiket:'Sewa perahu',alamat:'Kab. Barito Kuala',kontak:'',fasilitas:['pemandu'],galeri:[],foto:null,updated:'2026-11-05'},
  {id:'d8',nama:'Kampung Sasirangan',kategori:'Budaya & Sejarah',kabupaten:'Banjarmasin',unggulan:false,scene:'culture',status:'terbit',
   ringkas:'Sentra kain khas Banjar: lihat proses pewarnaan sasirangan dan belanja langsung dari perajin.',
   deskripsi:'<p>Sasirangan adalah kain tradisional Banjar dengan motif jumputan. Di sini pengunjung dapat melihat proses pembuatan dan membeli langsung dari perajin.</p>',
   jam:'Senin – Sabtu, 09.00 – 16.00',tiket:'Gratis',alamat:'Banjarmasin',kontak:'',fasilitas:['parkir','toilet'],galeri:[],foto:null,updated:'2026-11-04'}
 ],
 artikel:[
  {id:'a1',judul:'Festival Budaya Sungai Kalimantan Selatan Resmi Dibuka',kategori:'Berita',scene:'culture',foto:null,status:'terbit',tanggal:_d(-3),
   ringkas:'Ribuan pengunjung memadati lokasi pada hari pertama festival yang menampilkan seni, kuliner, dan kerajinan lokal.',
   isi:'<p>Festival tahunan ini menampilkan pertunjukan seni, kuliner khas Banjar, dan kerajinan dari berbagai kabupaten/kota.</p><h2>Apa yang bisa dinikmati?</h2><ul><li>Pertunjukan musik dan tari tradisional</li><li>Bazar kuliner dan kerajinan</li><li>Lomba perahu hias</li></ul><p>Informasi jadwal lengkap dapat dilihat pada halaman agenda.</p>'},
  {id:'a2',judul:'Paket Wisata Akhir Tahun: Sungai dan Pegunungan Meratus',kategori:'Promosi',scene:'river',foto:null,status:'terbit',tanggal:_d(-5),
   ringkas:'Paket perjalanan yang menggabungkan wisata sungai, kuliner, dan petualangan di kaki Meratus.',
   isi:'<p>Dinas membuka informasi paket wisata akhir tahun bagi keluarga dan kelompok. Detail paket dapat dikonfirmasi melalui pengelola destinasi masing-masing.</p>'},
  {id:'a3',judul:'Tips Berkunjung ke Air Terjun Saat Musim Hujan',kategori:'Info',scene:'waterfall',foto:null,status:'terbit',tanggal:_d(-8),
   ringkas:'Debit air meningkat dan jalur licin. Ini hal yang perlu disiapkan sebelum berangkat.',
   isi:'<p>Saat musim hujan, jalur menuju air terjun dapat licin. Gunakan alas kaki anti-selip, bawa pakaian ganti, dan ikuti arahan pemandu setempat.</p>'},
  {id:'a4',judul:'Pendaftaran Pemandu Wisata Lokal Dibuka',kategori:'Pengumuman',scene:'hills',foto:null,status:'terbit',tanggal:_d(-12),
   ringkas:'Warga yang berminat menjadi pemandu wisata dapat mendaftar melalui dinas.',
   isi:'<p>Dinas membuka pendaftaran pemandu wisata lokal. Calon peserta akan mengikuti pelatihan dasar pemanduan dan keselamatan.</p>'},
  {id:'a5',judul:'Rancangan: Panduan Wisata Pantai Tanah Bumbu',kategori:'Info',scene:'beach',foto:null,status:'draf',tanggal:_d(0),
   ringkas:'Draf panduan yang masih disusun.',isi:'<p>Draf artikel…</p>'}
 ],
 agenda:[
  {id:'g1',judul:'Lomba Perahu Hias Sungai',mulai:_d(10),selesai:'',lokasi:'Dermaga Kota, Banjarmasin',scene:'river',foto:null,status:'terbit',deskripsi:'<p>Lomba tahunan perahu hias di sungai dengan tema budaya Banjar.</p>'},
  {id:'g2',judul:'Pasar Rakyat & Kuliner Nusantara',mulai:_d(24),selesai:_d(26),lokasi:'Lapangan Utama',scene:'culture',foto:null,status:'terbit',deskripsi:'<p>Bazar kuliner dan produk UMKM dari seluruh kabupaten/kota.</p>'},
  {id:'g3',judul:'Trail Run Meratus',mulai:_d(33),selesai:'',lokasi:'Kaki Pegunungan Meratus',scene:'mist',foto:null,status:'terbit',deskripsi:'<p>Lari lintas alam menyusuri jalur hutan dan perkampungan.</p>'},
  {id:'g4',judul:'Pesta Rakyat Tahun Baru di Pantai',mulai:_d(50),selesai:'',lokasi:'Pantai Angsana',scene:'beach',foto:null,status:'terbit',deskripsi:'<p>Hiburan musik dan kuliner laut menyambut tahun baru.</p>'},
  {id:'g5',judul:'Festival Kuliner Banjar (Lalu)',mulai:_d(-24),selesai:'',lokasi:'Banjarmasin',scene:'culture',foto:null,status:'terbit',deskripsi:'<p>Telah selesai.</p>'}
 ],
 inovasi:[
  {id:'i1',judul:'Desa Wisata Digital',bidang:'Digitalisasi',tahap:'Berjalan',tahun:2026,scene:'hills',foto:null,status:'terbit',capaian:'12 desa wisata didampingi',ringkas:'Pendampingan desa wisata agar mampu memasarkan paket wisata dan homestay secara daring.',isi:'<p>Program ini mendampingi pengelola desa wisata membuat profil digital, foto produk, dan pemesanan daring sederhana.</p><h2>Kegiatan utama</h2><ul><li>Pelatihan fotografi dan konten media sosial</li><li>Pembuatan halaman profil desa wisata</li><li>Pendampingan pemesanan dan pembayaran daring</li></ul>'},
  {id:'i2',judul:'Sertifikasi Pemandu Wisata dan Pokdarwis',bidang:'SDM & Kelembagaan',tahap:'Berjalan',tahun:2026,scene:'mist',foto:null,status:'terbit',capaian:'Target 150 pemandu tersertifikasi',ringkas:'Peningkatan kompetensi pemandu lokal dan pengurus Pokdarwis melalui pelatihan dan uji kompetensi.',isi:'<p>Pemandu dan pengurus Pokdarwis mengikuti pelatihan pelayanan, keselamatan, dan interpretasi budaya, lalu uji kompetensi.</p>'},
  {id:'i3',judul:'Kalender Event Pariwisata Terpadu',bidang:'Pemasaran',tahap:'Selesai',tahun:2025,scene:'culture',foto:null,status:'terbit',capaian:'1 kalender bersama 13 kabupaten/kota',ringkas:'Menyatukan jadwal festival dan event seluruh kabupaten/kota dalam satu kalender promosi.',isi:'<p>Kalender event terpadu memudahkan wisatawan dan biro perjalanan menyusun paket berdasarkan jadwal acara.</p>'},
  {id:'i4',judul:'Kurasi Produk Ekraf Unggulan',bidang:'Ekonomi Kreatif',tahap:'Berjalan',tahun:2026,scene:'culture',foto:null,status:'terbit',capaian:'40 produk dikurasi',ringkas:'Seleksi dan pendampingan produk kriya, fesyen, dan kuliner kreatif agar siap dipasarkan ke wisatawan.',isi:'<p>Produk terpilih mendapat pendampingan kemasan, label, dan akses ke etalase pameran.</p>'},
  {id:'i5',judul:'Penataan Jalur Wisata Susur Sungai',bidang:'Destinasi',tahap:'Rencana',tahun:2027,scene:'river',foto:null,status:'terbit',capaian:'',ringkas:'Rencana penataan dermaga, papan informasi, dan rute susur sungai yang terhubung antardestinasi.',isi:'<p>Program dalam tahap perencanaan bersama pemangku kepentingan.</p>'}
 ],
 penginapan:_dir('pg',[
  ['Homestay Tepian Sungai','Homestay','Banjar','Dekat Pasar Terapung Lok Baintan','Rp 200.000 – Rp 350.000','Rumah panggung di tepi sungai, cocok untuk wisatawan yang ingin berangkat ke pasar terapung sejak subuh.','river'],
  ['Hotel Kota Sungai','Hotel','Banjarmasin','Pusat kota','Rp 450.000 – Rp 900.000','Hotel di pusat kota dengan akses mudah ke siring sungai, kuliner, dan pusat oleh-oleh.','culture'],
  ['Penginapan Kaki Meratus','Guest House','Hulu Sungai Selatan','Kec. Loksado','Rp 250.000 – Rp 400.000','Penginapan sederhana dengan udara sejuk, titik awal bamboo rafting dan trekking.','mist'],
  ['Cottage Pesisir Angsana','Resort','Tanah Bumbu','Kawasan Pantai Angsana','Rp 600.000 – Rp 1.200.000','Cottage menghadap laut dengan akses langsung ke pantai.','beach']]),
 kuliner:_dir('kl',[
  ['Warung Soto Banjar Tepian','Rumah makan','Banjarmasin','Tepi sungai','Rp 20.000 – Rp 40.000','Soto Banjar dengan ketupat dan perkedel, dinikmati sambil melihat perahu lewat.','river'],
  ['Kedai Ketupat Kandangan','Rumah makan','Hulu Sungai Selatan','Kandangan','Rp 25.000 – Rp 50.000','Ketupat Kandangan berkuah santan dengan ikan haruan bakar.','culture'],
  ['Pusat Wadai Banjar','Jajanan & kue','Banjarmasin','Pusat kota','Rp 2.000 – Rp 15.000','Aneka kue tradisional Banjar, buka sejak pagi.','culture'],
  ['Galeri Oleh-oleh Banua','Oleh-oleh','Banjarbaru','Jalan utama kota','Rp 15.000 – Rp 150.000','Amplang, kerupuk ikan, dodol, dan oleh-oleh khas Kalimantan Selatan.','hills']]),
 travel:_dir('tr',[
  ['Banua Trip Wisata','Biro perjalanan wisata','Banjarmasin','Pusat kota','Paket pasar terapung, susur sungai, Loksado','Biro perjalanan untuk paket wisata keluarga, rombongan, dan instansi.','river'],
  ['Meratus Adventure Tour','Operator tur','Hulu Sungai Selatan','Kec. Loksado','Bamboo rafting, trekking, kampung adat','Operator tur petualangan dengan pemandu lokal berpengalaman.','waterfall'],
  ['Sungai Rental & Travel','Sewa kendaraan','Banjarbaru','Dekat bandara','Sewa mobil dengan sopir, antar-jemput bandara','Transportasi wisata dan antar-jemput bandara ke berbagai destinasi.','hills']]),
 pokdarwis:_dir('pk',[
  ['Pokdarwis Tepian Lok Baintan','Berkembang','Banjar','Desa Lok Baintan','Pasar terapung dan susur sungai','Mengelola wisata pasar terapung, pemandu perahu, dan homestay warga.','river'],
  ['Pokdarwis Rakit Meratus','Maju','Hulu Sungai Selatan','Kec. Loksado','Bamboo rafting dan homestay','Mengelola jasa rakit bambu, pemandu trekking, dan homestay.','waterfall'],
  ['Pokdarwis Mandin Lestari','Rintisan','Hulu Sungai Tengah','Kawasan air terjun','Air Terjun Mandin Damar','Kelompok baru yang menata jalur dan kebersihan kawasan air terjun.','mist'],
  ['Pokdarwis Pesisir Angsana','Berkembang','Tanah Bumbu','Kawasan pantai','Pantai Angsana','Mengelola kebersihan pantai, parkir, dan warung warga.','beach']]),
 ekraf:_dir('ek',[
  ['Sanggar Sasirangan Tepian','Fesyen','Banjarmasin','Kampung perajin','Kain dan busana sasirangan','Perajin kain sasirangan motif tradisional dan kontemporer, menerima pesanan seragam.','culture'],
  ['Perajin Purun Banua','Kriya','Banjarbaru','Sentra anyaman','Tas, tikar, dan topi anyaman purun','Kelompok perajin anyaman purun dengan produk ramah lingkungan.','hills'],
  ['Galeri Permata Banua','Kriya','Banjar','Kawasan pasar permata','Perhiasan dan batu permata olahan','Perajin perhiasan dan pengolahan batu permata.','mist'],
  ['Sanggar Musik Panting','Musik','Banjarmasin','Pusat kota','Pertunjukan musik panting','Grup musik tradisional untuk acara, festival, dan penyambutan tamu.','culture'],
  ['Dapur Kreatif Wadai','Kuliner','Banjarbaru','Pusat kota','Kue tradisional kemasan modern','Mengemas kue tradisional Banjar menjadi oleh-oleh yang tahan lama.','river']]),
 kunjungan:_kj()
};

const DB=(()=>{
 const KEY='disbudpar_kalsel_demo_v1';
 let cache=null;
 function load(){
  if(cache)return cache;
  try{const raw=localStorage.getItem(KEY);cache=raw?JSON.parse(raw):null}catch(e){cache=null}
  if(!cache){cache=JSON.parse(JSON.stringify(SEED));persist(true)}
  else{let ch=0;Object.keys(SEED).forEach(k=>{if(!(k in cache)){cache[k]=JSON.parse(JSON.stringify(SEED[k]));ch=1}});if(ch)persist(true)}
  return cache;
 }
 function persist(silent){
  try{localStorage.setItem(KEY,JSON.stringify(cache));return true}
  catch(e){
   let ok=true;try{localStorage.setItem('__t','1');localStorage.removeItem('__t')}catch(x){ok=false}
   if(!ok)return false; /* storage tidak tersedia: data tetap di memori selama halaman terbuka */
   if(!silent)throw new Error('Penyimpanan browser penuh. Kurangi jumlah/ukuran foto.');return false}
 }
 const uid=p=>p+Math.random().toString(36).slice(2,9);
 return{
  async settings(){return load().settings},
  async saveSettings(s){load().settings=s;persist()},
  async list(t){return load()[t].slice()},
  async get(t,id){return load()[t].find(x=>x.id===id)||null},
  async save(t,item){const d=load();const a=d[t];item.updated=new Date().toISOString().slice(0,10);
   if(!item.id){item.id=uid(t[0]);a.unshift(item)}else{const i=a.findIndex(x=>x.id===item.id);i>=0?a[i]=item:a.unshift(item)}
   persist();return item},
  async remove(t,id){const d=load();d[t]=d[t].filter(x=>x.id!==id);persist()},
  async login(u,p){const x=load().users.find(x=>x.username===u&&x.password===p);return x?{id:x.id,nama:x.nama,role:x.role}:null},
  async reset(){cache=JSON.parse(JSON.stringify(SEED));persist()},
  usageKB(){try{return Math.round((localStorage.getItem(KEY)||'').length/1024)}catch(e){return 0}}
 };
})();
