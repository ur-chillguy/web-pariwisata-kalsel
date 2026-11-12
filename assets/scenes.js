const ICONS={
 pin:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
 cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
 search:'<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',
 arrow:'<path d="M5 12h14M12 5l7 7-7 7"/>',
 ticket:'<path d="M2 9a3 3 0 0 1 0 6v3h20v-3a3 3 0 0 1 0-6V6H2z"/><path d="M13 6v12" stroke-dasharray="2 3"/>',
 image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
 file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/>',
 layout:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
 users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
 sliders:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
 bold:'<path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z"/>',
 italic:'<path d="M19 4h-9M14 20H5M15 4L9 20"/>',
 list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
 link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
 upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
 eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
 menu:'<path d="M3 12h18M3 6h18M3 18h18"/>',
 home:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
 compass:'<circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
 trend:'<path d="M23 6l-9.5 9.5-5-5L1 18"/>',
 check:'<path d="M20 6L9 17l-5-5"/>',
 mail:'<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M22 6l-10 7L2 6"/>',
 bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 quote:'<path d="M3 21c3 0 7-1 7-8V5H3v8h4M14 21c3 0 7-1 7-8V5h-7v8h4"/>',
 wifi:'<path d="M5 12.55a11 11 0 0 1 14 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>',
 car:'<path d="M5 17h14M3 13l2-6h14l2 6v4H3zM7 17v2M17 17v2"/>',
 toilet:'<path d="M12 3v18M5 7h4M15 7h4M7 21v-7M17 21v-7"/>',
 food:'<path d="M3 2v7c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2V2M6 2v20M18 22V2c-3 2-4 5-4 8s1 4 4 4"/>',
 pray:'<path d="M12 3l8 6v12H4V9zM9 21v-6h6v6"/>',
 share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
 trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
 edit:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
 heading:'<path d="M6 4v16M18 4v16M6 12h12"/>',
 chevron:'<path d="M6 9l6 6 6-6"/>',
 dots:'<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
 globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
 save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
 bulb:'<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
 bar:'<path d="M12 20V10M18 20V4M6 20v-4"/>',
 bag:'<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
 bed:'<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>',
 phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>'
};
function icon(n,s=18,c='currentColor',w=1.8){return `<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]||''}</svg>`}
function ridge(y,amp,f,ph,w=800,h=500){let p=`M0 ${h} L0 ${y}`;for(let x=0;x<=w;x+=16){p+=` L${x} ${(y+Math.sin(x*f+ph)*amp+Math.sin(x*f*2.3+ph*1.7)*amp*.4).toFixed(1)}`}return p+` L${w} ${h} Z`}
function palm(x,y,s,col){let f='';for(let a=-70;a<=70;a+=35){f+=`<ellipse cx="${x+Math.sin(a*Math.PI/180)*28*s}" cy="${y-18*s+Math.abs(a)/6}" rx="${30*s}" ry="${6*s}" transform="rotate(${a} ${x} ${y-18*s})" fill="${col}"/>`}
 return `<path d="M${x} ${y+130*s} Q${x+14*s} ${y+60*s} ${x} ${y}" stroke="${col}" stroke-width="${6*s}" fill="none" stroke-linecap="round"/>${f}`}
const SC={
 hills:(id)=>`<defs><linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD0C3"/><stop offset=".7" stop-color="#F8E6BD"/></linearGradient></defs>
  <rect width="800" height="500" fill="url(#s${id})"/><circle cx="590" cy="170" r="52" fill="#FFF3C4" opacity=".95"/>
  <path d="${ridge(250,30,.012,1)}" fill="#6FB295"/><path d="${ridge(300,34,.017,2.2)}" fill="#3E9171"/><path d="${ridge(360,26,.02,.6)}" fill="#1F6B4F"/><path d="${ridge(420,18,.03,3)}" fill="#0F3D2E"/>`,
 beach:(id)=>`<defs><linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EC4E6"/><stop offset="1" stop-color="#FCE3B8"/></linearGradient><linearGradient id="w${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2AA7B5"/><stop offset="1" stop-color="#7FD6D0"/></linearGradient></defs>
  <rect width="800" height="500" fill="url(#s${id})"/><circle cx="210" cy="190" r="46" fill="#FFE9A8"/>
  <rect y="270" width="800" height="150" fill="url(#w${id})"/>
  <path d="M0 330 Q100 318 200 330 T400 330 T600 330 T800 330" stroke="#fff" stroke-opacity=".5" stroke-width="3" fill="none"/>
  <path d="M0 372 Q100 360 200 372 T400 372 T600 372 T800 372" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none"/>
  <path d="M0 500 L0 410 Q300 380 800 430 L800 500Z" fill="#F2DDB5"/>${palm(640,250,1.1,'#0F3D2E')}${palm(720,290,.8,'#1F6B4F')}`,
 waterfall:(id)=>`<defs><linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B7E0D2"/><stop offset="1" stop-color="#6FB295"/></linearGradient><linearGradient id="f${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#E7F7F5" stop-opacity=".75"/></linearGradient></defs>
  <rect width="800" height="500" fill="url(#s${id})"/>
  <path d="M0 0 L330 0 L350 120 L320 330 L0 360Z" fill="#1F6B4F"/><path d="M800 0 L470 0 L450 130 L490 330 L800 350Z" fill="#0F3D2E"/>
  <path d="M0 0 L250 0 L270 150 L240 300 L0 310Z" fill="#0F3D2E" opacity=".55"/>
  <rect x="352" y="0" width="98" height="360" fill="url(#f${id})"/><rect x="372" y="0" width="10" height="360" fill="#fff" opacity=".6"/><rect x="410" y="0" width="7" height="360" fill="#fff" opacity=".6"/>
  <ellipse cx="400" cy="372" rx="120" ry="22" fill="#fff" opacity=".7"/>
  <path d="M0 500 L0 380 Q200 350 400 392 Q600 350 800 385 L800 500Z" fill="#2AA7B5" opacity=".9"/><path d="M0 500 L0 440 Q250 420 500 450 Q700 430 800 445 L800 500Z" fill="#0F3D2E"/>`,
 culture:(id)=>`<defs><linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E4A8E"/><stop offset=".55" stop-color="#E8795A"/><stop offset="1" stop-color="#F6C46B"/></linearGradient></defs>
  <rect width="800" height="500" fill="url(#s${id})"/><circle cx="400" cy="300" r="90" fill="#FFE2A0" opacity=".9"/>
  <path d="${ridge(300,20,.01,2)}" fill="#4A2E63" opacity=".8"/>
  <g fill="#2A1840"><path d="M250 330 L400 230 L550 330Z"/><path d="M290 330 L400 262 L510 330Z" fill="#3A2356"/><rect x="290" y="330" width="220" height="12"/>
  <rect x="300" y="342" width="12" height="80"/><rect x="340" y="342" width="12" height="80"/><rect x="388" y="342" width="12" height="80"/><rect x="436" y="342" width="12" height="80"/><rect x="486" y="342" width="12" height="80"/>
  <path d="M385 230 L400 196 L415 230Z"/></g><path d="M0 500 L0 420 L800 420 L800 500Z" fill="#1E1030"/>`,
 mist:(id)=>`<defs><linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE7DB"/><stop offset="1" stop-color="#F4ECD8"/></linearGradient></defs>
  <rect width="800" height="500" fill="url(#s${id})"/><path d="${ridge(230,26,.014,4)}" fill="#8CC3A9"/><ellipse cx="400" cy="300" rx="480" ry="40" fill="#fff" opacity=".55"/><path d="${ridge(310,30,.018,1.4)}" fill="#3E9171"/><ellipse cx="300" cy="380" rx="420" ry="34" fill="#fff" opacity=".4"/><path d="${ridge(400,22,.025,5)}" fill="#0F3D2E"/>`,
river:(id)=>`<defs><linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4B97A"/><stop offset=".65" stop-color="#F8E7C4"/></linearGradient><linearGradient id="w${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FB5A8"/><stop offset="1" stop-color="#2F6B62"/></linearGradient></defs>
  <rect width="800" height="500" fill="url(#s${id})"/><circle cx="580" cy="200" r="50" fill="#FFE9A8"/>
  <path d="${ridge(268,14,.025,1)}" fill="#6FA484"/><path d="${ridge(292,10,.04,2)}" fill="#2F6B4F"/>
  <rect y="300" width="800" height="200" fill="url(#w${id})"/>
  <path d="M0 340 Q100 332 200 340 T400 340 T600 340 T800 340" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none"/>
  ${boat(170,390,1.1)}${boat(470,360,.8)}${boat(620,430,1.3)}`
};

function boat(x,y,s){return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-60 0 Q0 22 60 0 L50 14 Q0 26 -50 14Z" fill="#8A4B22"/><ellipse cx="-22" cy="-6" rx="16" ry="8" fill="#E8B04A"/><circle cx="18" cy="-26" r="7" fill="#6B3A1A"/><path d="M2 -30 L18 -48 L34 -30Z" fill="#E8B04A"/><rect x="12" y="-20" width="12" height="20" rx="4" fill="#D9622B"/></g>`}

let _sid=0;
function scene(k,extra=''){_sid++;return `<svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${(SC[k]||SC.hills)(_sid)}${extra}</svg>`}
function hydrate(root=document){
 root.querySelectorAll('[data-scene]:not([data-h])').forEach(e=>{e.dataset.h=1;e.classList.add('scene');e.insertAdjacentHTML('afterbegin',scene(e.dataset.scene))});
 root.querySelectorAll('[data-i]:not([data-hi])').forEach(e=>{e.dataset.hi=1;e.insertAdjacentHTML('afterbegin',icon(e.dataset.i,+e.dataset.s||18))});
}
function cover(it,cls=''){return `<div class="scene ${cls}">${it.foto?`<img src="${it.foto}" alt="">`:scene(it.scene||'hills')}</div>`}
