(function(){
const el=document.getElementById('tool'); if(!el) return;
const MODE=el.dataset.mode||'full';
const CFG=window.CMB||{}; const RC=+CFG.rc||325, RENT=+CFG.rent||2100, CAP=CFG.capture||'';
const EMAIL='sam@smmainsurance.com';
const RCC={"LOS ANGELES":1979,"SANTA MONICA":1979,"WEST HOLLYWOOD":1979,"BEVERLY HILLS":1995,"PASADENA":1995,"INGLEWOOD":1995,"BALDWIN PARK":1995,"BELL GARDENS":1995,"CULVER CITY":1995,"POMONA":1995};
const TYPE=new Set(["AVE","AV","AVENUE","ST","STREET","BLVD","BL","BOULEVARD","DR","DRIVE","PL","PLACE","RD","ROAD","WAY","CT","COURT","LN","LANE","TER","TERRACE","HWY","HIGHWAY","CIR","CIRCLE","PKWY","PARKWAY","PLZ","PLAZA","SQ","TRL","LOOP","WALK"]);
const DIR={N:"N",S:"S",E:"E",W:"W",NORTH:"N",SOUTH:"S",EAST:"E",WEST:"W"};
const TYPEC={AVE:"AVE",AV:"AVE",AVENUE:"AVE",ST:"ST",STREET:"ST",BLVD:"BLVD",BL:"BLVD",BOULEVARD:"BLVD",DR:"DR",DRIVE:"DR",PL:"PL",PLACE:"PL",RD:"RD",ROAD:"RD",WAY:"WAY",CT:"CT",COURT:"CT",LN:"LN",LANE:"LN",TER:"TER",TERRACE:"TER",HWY:"HWY",HIGHWAY:"HWY",CIR:"CIR",CIRCLE:"CIR",PKWY:"PKWY",PARKWAY:"PKWY",PLZ:"PLZ",PLAZA:"PLZ",SQ:"SQ",TRL:"TRL",LOOP:"LOOP",WALK:"WALK"};
const UNITW=new Set(["APT","APTS","UNIT","UNITS","STE","SUITE","NO","NUM","BLDG","BLD","SPC","RM","FL","FLOOR","LOT","SP"]);
const SUF=new Set([].concat(Array.from(TYPE),["N","S","E","W","NORTH","SOUTH","EAST","WEST"]));
const WORDNUM={FIRST:"1",SECOND:"2",THIRD:"3",FOURTH:"4",FIFTH:"5",SIXTH:"6",SEVENTH:"7",EIGHTH:"8",NINTH:"9",TENTH:"10",ELEVENTH:"11",TWELFTH:"12",THIRTEENTH:"13",FOURTEENTH:"14",FIFTEENTH:"15",SIXTEENTH:"16",SEVENTEENTH:"17",EIGHTEENTH:"18",NINETEENTH:"19",TWENTIETH:"20"};
el.innerHTML=`<div class="row"><input id="cmb-addr" placeholder="Street address, e.g. 1234 N Vermont Ave"><input id="cmb-zip" class="zip" placeholder="ZIP" maxlength="5" inputmode="numeric"><button class="btn" id="cmb-go">Check</button></div><p class="muted">LA County, buildings with 5 or more units. Public records only. Nothing is stored until you ask for the report.</p><div id="cmb-out"></div>`;
const out=document.getElementById('cmb-out');

// ---- address matching ----
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function normTok(w){if(WORDNUM[w])return WORDNUM[w]; const m=/^(\d+)(ST|ND|RD|TH)$/.exec(w); if(m)return m[1]; if(DIR[w])return DIR[w]; if(TYPEC[w])return TYPEC[w]; return w;}
function rawToks(s){return String(s||'').toUpperCase().replace(/[^A-Z0-9]+/g,' ').trim().split(' ').filter(Boolean);}
function toks(s){return rawToks(s).map(normTok);}
// drop apartment/unit designators and anything after the street type ("118 E PALMER AVE NO 17" -> E PALMER AVE)
function core(t){let end=t.length;
 for(let i=0;i<t.length;i++){if(UNITW.has(t[i])){end=i;break;}}
 let last=-1; for(let i=0;i<end;i++) if(TYPE.has(t[i])) last=i;
 if(last>=0&&last+1<end) end=last+1;
 return t.slice(0,end);}
function score(q,situs){
 const a=toks(q), b=toks(situs);
 if(!a.length||!b.length) return 0;
 if(a[0]!==b[0]) return 0;                                   // house number must match exactly
 const an=core(a.slice(1)), bn=core(b.slice(1));
 let aw=an.filter(w=>!SUF.has(w)), bw=bn.filter(w=>!SUF.has(w));
 if(!aw.length||!bw.length){aw=a.slice(1); bw=b.slice(1);}   // street name is all suffix words, e.g. COURT ST or AVENUE J
 if(!aw.length&&!bw.length) return 1.2;                      // bare house number on both sides, never confident
 if(!aw.length||!bw.length) return 0;
 const near=(x,ys)=>ys.some(y=>y===x||(x.length>2&&y.indexOf(x)===0)||(y.length>2&&x.indexOf(y)===0));
 const hit=aw.filter(w=>near(w,bw)).length;
 if(!hit) return 0;                                          // at least one street-name token must match
 let s=1+hit/Math.max(aw.length,bw.length);
 const ad=an.filter(w=>DIR[w]), bd=bn.filter(w=>DIR[w]);
 if(ad.length&&bd.length) s+=ad.some(w=>bd.indexOf(w)>=0)?0.15:-0.5;   // N Vermont is not S Vermont
 const at=streetType(an), bt=streetType(bn);
 if(at&&bt) s+=(at===bt)?0.15:-0.35;                                   // Gramercy Dr is not Gramercy Pl
 return s;}
function streetType(t){let v=''; t.forEach(w=>{if(TYPEC[w]) v=TYPEC[w];}); return v;}
// strip trailing city, state and ZIP noise the visitor may have typed
function trimQuery(q,stop){const t=rawToks(q);
 while(t.length>2){const w=t[t.length-1];
  if(stop.has(w)||/^\d{5}$/.test(w)||w==='CA'||w==='CALIF'||w==='CALIFORNIA'||w==='USA') t.pop(); else break;}
 return t.join(' ');}

// ---- public API helpers ----
function fetchJSON(url,ms){const c=('AbortController' in window)?new AbortController():null;
 const t=c?setTimeout(()=>c.abort(),ms||12000):0;
 return fetch(url,c?{signal:c.signal}:undefined).then(r=>{if(!r.ok) throw new Error('HTTP '+r.status); return r.json();})
  .then(j=>{if(t)clearTimeout(t); if(j&&j.error) throw new Error(j.error.message||'service error'); return j;},
        e=>{if(t)clearTimeout(t); throw e;});}
async function point(url,lat,lon,fields){
 const u=url+'?'+new URLSearchParams({geometry:lon+','+lat,geometryType:'esriGeometryPoint',inSR:4326,spatialRel:'esriSpatialRelIntersects',outFields:fields,returnGeometry:'false',f:'json'});
 const j=await fetchJSON(u); return (j.features||[]).map(f=>f.attributes);}

function rentRule(city,yb){const c=(city||'').toUpperCase(); const yr=new Date().getFullYear();
 if(RCC[c]&&yb&&yb<RCC[c]) return [city+' rent stabilization applies (built '+yb+')','warn'];
 if(yb&&yb<yr-15) return ['AB 1482 statewide rent cap applies (built '+yb+')',''];
 return ['Likely exempt from rent caps (newer building)','good'];}

async function lookup(){
 const raw=document.getElementById('cmb-addr').value.trim(), z=document.getElementById('cmb-zip').value.trim();
 if(!raw||!/^\d{5}$/.test(z)){out.innerHTML='<p class="muted">Enter a street address and a 5-digit ZIP.</p>';return;}
 out.innerHTML='<p class="muted">Looking up the parcel...</p>';
 let list;
 try{const r=await fetch('/data/zips/'+encodeURIComponent(z)+'.json'); if(!r.ok) throw new Error('no file'); list=await r.json(); if(!Array.isArray(list)) throw new Error('bad file');}
 catch(e){out.innerHTML='<p>No 5+ unit apartment buildings on file for ZIP '+esc(z)+' in LA County. Check the ZIP, or <a href="mailto:'+EMAIL+'">email me the address</a> and I will pull it by hand.</p>';return;}
 const stop=new Set(); list.forEach(p=>rawToks(p[2]).forEach(w=>stop.add(w)));
 const q=trimQuery(raw,stop);
 const scored=list.map(p=>[score(q,p[1]),p]).filter(x=>x[0]>0).sort((a,b)=>b[0]-a[0]||(b[1][3]||0)-(a[1][3]||0));
 const miss='<p>No match for <b>'+esc(raw)+'</b> in ZIP '+esc(z)+'. This tool covers buildings the Assessor lists with 5 or more units, so a house, a duplex or a fourplex will not be here. Check the street name and the ZIP, or <a href="mailto:'+EMAIL+'">email me the address</a>.</p>';
 if(!scored.length){out.innerHTML=miss;return;}
 const top=scored[0][0], tied=scored.length>1&&scored[1][0]===top;
 if(top>=2&&!tied){show(scored[0][1],z);return;}
 const cand=scored.filter(x=>x[0]>=top-0.3).slice(0,6);
 const head=tied?'More than one building matches. Which one?':(cand.length===1?'Closest record on file. Is this the building?':'No exact match. Did you mean one of these?');
 out.innerHTML='<p><b>'+head+'</b></p><div class="matches">'+cand.map((x,i)=>{const p=x[1];
   return '<button type="button" data-i="'+i+'">'+esc(p[1])+', '+esc(p[2])+' ('+(p[3]>=5?p[3]+' units':'5+ units')+', built '+(p[4]||'?')+') <small>AIN '+esc(p[0])+'</small></button>';}).join('')+
   '</div><p class="muted">If none of these is it, check the street name and ZIP, or <a href="mailto:'+EMAIL+'">email me the address</a>.</p>';
 out.querySelectorAll('.matches button').forEach(b=>b.onclick=()=>show(cand[+b.dataset.i][1],z));}

function show(p,z){
 const ain=p[0],situs=p[1],city=p[2],units=p[3],yb=p[4],sqft=p[5],lat=p[6],lon=p[7];
 const okU=units>=5, rc=sqft*RC, rents=(okU?units:0)*RENT*12, pre=!!(yb&&yb<1978), rr=rentRule(city,yb);
 const fact=(k,v,cls)=>'<div class="fact '+(cls||'')+'"><small>'+k+'</small><b>'+v+'</b></div>';
 const softCard='<div class="fact" id="f-soft"><small>Soft-story list (LA city)</small><b>Checking...</b></div>';
 out.innerHTML='<h3 style="margin-top:14px">'+esc(situs)+', '+esc(city)+' '+esc(z)+'</h3><div class="facts">'+
 (MODE==='softstory'?softCard:'')+
 fact('Units',okU?units:'5 or more (county classified)')+fact('Year built',yb||'Unknown',pre?'warn':'good')+fact('Square feet',sqft?sqft.toLocaleString():'Unknown')+
 fact('Replacement cost estimate',sqft?'$'+rc.toLocaleString():'Unknown')+'<div class="fact" id="f-lr12"><small>Loss of rents, 12 months</small><b>'+(okU?'$'+rents.toLocaleString():'Enter unit count below')+'</b></div>'+'<div class="fact" id="f-lr24"><small>Loss of rents, 24 months</small><b>'+(okU?'$'+(rents*2).toLocaleString():'Enter unit count below')+'</b></div>'+
 fact('Rent regulation',esc(rr[0]),rr[1])+
 (MODE==='softstory'?'':softCard)+'<div class="fact" id="f-flood"><small>FEMA flood zone</small><b>Checking...</b></div><div class="fact" id="f-fire"><small>Fire hazard zone</small><b>Checking...</b></div></div>'+
 '<div class="gaps"><b>Four things to check on the current policy</b><ul>'+(pre?'<li><b>Ordinance and law A, B and C.</b> Pre-1978 building: the city will require a code-compliant rebuild. <a href="/ordinance-and-law.html">Why.</a></li>':'')+
 '<li><b>Loss of rents months.</b> Lenders ask for 12. In LA carry 18 to 24'+(rr[1]==='warn'?', and this building is rent regulated, so lean to 24':'')+'. <a href="/loss-of-rents.html">Why.</a></li>'+
 '<li><b>Replacement cost.</b> At $'+RC+'/sqft this building is about $'+rc.toLocaleString()+' to rebuild. Compare to the policy limit.</li>'+
 '<li><b>Water damage deductible.</b> Ask whether a separate, higher deductible applies to water losses.</li></ul></div>'+
 '<div class="capture"><b>Want this as a written report, with the gaps checked against your actual policy?</b><p class="muted">Free, no obligation. I read the policy and send back what I find.</p>'+
 '<input id="c-name" placeholder="Your name"><input id="c-email" type="email" placeholder="Email"><input id="c-when" placeholder="Renewal or closing date (optional)"><button class="btn" id="c-send">Send me the report</button><p class="muted" id="c-msg"></p></div>';
 let uCount=okU?units:0;
 if(!okU){const facts=out.querySelector('.facts'); const box=document.createElement('p'); box.className='muted'; box.innerHTML='The county record does not carry a reliable unit count for this building'+(units?' (it lists '+units+', but the county classifies the parcel as 5 or more apartments)':'')+'. How many units does it have? <input id="cmb-units" type="number" min="5" max="999" inputmode="numeric" style="width:90px;padding:6px;border:1px solid #cbd5e1;border-radius:6px">'; facts.after(box);
  document.getElementById('cmb-units').addEventListener('input',e=>{const u=parseInt(e.target.value,10); const ok=u>=5&&u<=999; uCount=ok?u:0; const r=u*RENT*12;
   document.querySelector('#f-lr12 b').textContent=ok?'$'+r.toLocaleString():'Enter unit count below';
   document.querySelector('#f-lr24 b').textContent=ok?'$'+(r*2).toLocaleString():'Enter unit count below';});}
 document.getElementById('c-send').onclick=()=>capture({ain:ain,situs:situs,city:city,zip:z,units:uCount,yb:yb,sqft:sqft});
 const set=(id,label,val,cls)=>{const n=document.getElementById(id); if(!n)return; n.innerHTML='<small>'+label+'</small><b>'+val+'</b>'; n.className='fact '+(cls||'');};
 softStory(situs,city,z,pre,set);
 hazards(lat,lon,set);}

async function softStory(situs,city,z,pre,set){
 const L='Soft-story list (LA city)';
 if((city||'').toUpperCase()!=='LOS ANGELES'||!pre){
  set('f-soft','Soft-story',pre?'Pre-1978 outside LA city: check that city\'s ordinance':'Not a pre-1978 building'); return;}
 const t=rawToks(situs), num=t[0];
 const keep=[]; core(t.slice(1)).forEach(w=>{if(!SUF.has(normTok(w))&&!/^\d+$/.test(w)) keep.push(w);});
 const key=(keep.length?keep:core(t.slice(1))).join('%').replace(/'/g,"''");
 try{
  const where="zip='"+z.replace(/'/g,"''")+"' AND upper(address) like '"+num.replace(/'/g,"''")+" %"+key+"%'";
  const rows=await fetchJSON('https://data.lacity.org/resource/dqq4-799r.json?'+new URLSearchParams({'$where':where,'$limit':5}));
  if(!rows.length){set('f-soft',L,'Not on the list (confirm no tuck-under parking)'); return;}
  const rank=r=>r.cofc_issued?2:(r.issued?1:0);
  const x=rows.slice().sort((a,b)=>rank(b)-rank(a))[0];
  const stage=x.cofc_issued?'retrofit CERTIFIED':(x.issued?'permit issued, work pending':'order to comply open, no permit');
  set('f-soft',L,'On the list: '+stage,x.cofc_issued?'good':'warn');
 }catch(e){set('f-soft',L,'Could not check right now, ask me','warn');}}

function hazards(lat,lon,set){
 if(!lat||!lon){set('f-flood','FEMA flood zone','No coordinates on file'); set('f-fire','Fire hazard zone','No coordinates on file'); return;}
 point('https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query',lat,lon,'FLD_ZONE,ZONE_SUBTY,SFHA_TF')
  .then(zz=>{if(!zz.length){set('f-flood','FEMA flood zone','Not mapped by FEMA'); return;}
   const a=zz[0], s=a.SFHA_TF==='T';
   set('f-flood','FEMA flood zone','Zone '+esc(a.FLD_ZONE)+(s?': special flood hazard area, lender will require flood':': no flood requirement'),s?'warn':'good');})
  .catch(()=>set('f-flood','FEMA flood zone','Could not check right now, ask me','warn'));
 point('https://services.arcgis.com/RmCCgQtiZLDCtblq/arcgis/rest/services/FHSZ_for_LACo/FeatureServer/0/query',lat,lon,'HAZ_CLASS,SRA')
  .then(f=>{if(!f.length){set('f-fire','Fire hazard zone','Not in a fire hazard severity zone','good'); return;}
   set('f-fire','Fire hazard zone',esc(f[0].HAZ_CLASS)+' fire hazard severity zone','warn');})
  .catch(()=>set('f-fire','Fire hazard zone','Could not check right now, ask me','warn'));}

function mailtoLink(b,name,email,when){
 return 'mailto:'+EMAIL+'?subject='+encodeURIComponent('Building report: '+b.situs+', '+b.zip)+
  '&body='+encodeURIComponent('Name: '+name+'\nEmail: '+email+'\nDate: '+when+'\nBuilding: '+b.situs+', '+b.city+' '+b.zip+' ('+(b.units?b.units+' units':'unit count not given')+', built '+b.yb+')');}
async function capture(b){
 const name=document.getElementById('c-name').value.trim(), email=document.getElementById('c-email').value.trim(), when=document.getElementById('c-when').value.trim();
 const msg=document.getElementById('c-msg');
 if(!email||email.indexOf('@')<1){msg.textContent='Add an email so I can send it.';return;}
 const payload=Object.assign({name:name,email:email,when:when},b,{ts:new Date().toISOString(),page:location.pathname});
 const cap=(window.CMB&&window.CMB.capture)||CAP;
 if(cap){
  try{await fetch(cap,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)});
   msg.textContent='Got it. The report goes out within one business day.';}
  catch(e){msg.innerHTML='Could not send. Email me directly: <a href="mailto:'+EMAIL+'">'+EMAIL+'</a>';}}
 else{
  const href=mailtoLink(b,name,email,when);
  const a=document.createElement('a'); a.href=href; a.style.display='none'; document.body.appendChild(a); a.click(); a.remove();
  msg.innerHTML='Your email app should open with the request filled in. If it did not, <a href="'+esc(href)+'">click here to send it</a>.';}}

document.getElementById('cmb-go').onclick=lookup;
document.getElementById('cmb-addr').addEventListener('keydown',e=>{if(e.key==='Enter')lookup();});
document.getElementById('cmb-zip').addEventListener('keydown',e=>{if(e.key==='Enter')lookup();});
if(window.CMB) window.CMB.score=score; // exposed so the matching logic can be regression-tested from the console
})();
