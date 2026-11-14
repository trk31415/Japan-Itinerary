const links={bus:['Blue Liner timetable & reservations','https://www.sakkan.com/lp/hyoutou-bus/'],festival:['Official Lake Shikotsu Ice Festival listing','https://www.1000sai-chitose.or.jp/event/detail_1130.html'],rail:['JR Hokkaido airport trains & timetables','https://www.jrhokkaido.co.jp/global/english/train/'],locker:['Station locker information','https://www.jrhokkaido.co.jp/network/locker/']};
Object.assign(links,{"kappa": ["Kappa Liner timetable, boarding map & reservations", "https://www.jotetsu.co.jp/bus/kappa_liner/index.html"], "snowshoe": ["FRILUFSLIV snowshoe tour & booking request", "https://www.friluftsliv.website/english/activities/snowshoe-tour/"], "snowshoeMap": ["Google Maps: bus stop to snowshoe meeting point", "https://www.google.com/maps/dir/?api=1&origin=Jozankei+Yunomachi+bus+stop+Sapporo&destination=FRILUFSLIV+Nono+Terrace+Jozankei&travelmode=walking"], "hoheikyo": ["Hoheikyo Onsen visitor information", "https://jozankei.jp/en/oneday/hoheikyo-onsen/"], "hoheikyoMap": ["Google Maps: Hoheikyo Onsen", "https://www.google.com/maps/search/?api=1&query=Hoheikyo+Onsen+Sapporo"], "yukitouro": ["New Yukitouro 2027: hours & admission", "https://jozankei.jp/en/event/yukitouro2027/"], "yukitouroMap": ["Google Maps: Jozankei Shrine", "https://www.google.com/maps/search/?api=1&query=Jozankei+Shrine"], "susukino": ["Susukino dining & nightlife guide", "https://visit.sapporo.travel/discover/city/susukino/"], "susukinoMap": ["Google Maps: Susukino area (use operator map for bus stop)", "https://www.google.com/maps/search/?api=1&query=Susukino+Station+Sapporo"], "lights": ["Sapporo White Illumination official guide", "https://www.sapporo.travel/en/event/event-list/sapporo_white_illumination/"]});

(async()=>{
const response=await fetch('public-itinerary.json?v=jozankei-20261114');
if(!response.ok)throw Error('Itinerary unavailable');
const {days,flights}=await response.json();
const badge=s=>`<span class="badge ${s==='Booked'?'booked':''}">${s}</span>`;
const label=d=>new Date(Date.UTC(2027,1,d)).toLocaleDateString('en-US',{weekday:'short',timeZone:'UTC'});
document.querySelector('#days').innerHTML=days.map(d=>`<details class="day" id="day-${d.n}" ${d.n===18?'open':''}><summary><span class="date">${label(d.n).toUpperCase()}<b>${d.n}</b>FEB</span><div class="day-title"><h3>${d.title}</h3><p>${d.place}</p></div>${badge(d.events.every(x=>x.status==='Booked')?'Booked':'Plans open')}<span class="chevron" aria-hidden="true">+</span></summary><div class="events">${d.events.map(x=>`<article class="event"><time>${x.time}</time><div><h4>${x.title}</h4>${badge(x.status)}<p><b>${x.location}</b></p><p>${x.description}</p>${x.refs.map(r=>`<p><a href="${links[r][1]}" target="_blank" rel="noopener noreferrer">${links[r][0]} ↗</a></p>`).join('')}</div></article>`).join('')}</div></details>`).join('');
document.querySelector('#date-jump').innerHTML+=days.map(d=>`<option value="${d.n}">${label(d.n)}, Feb ${d.n} · ${d.place}</option>`).join('');
function filter(place){document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.filter===place);b.setAttribute('aria-pressed',b.dataset.filter===place)});days.forEach(d=>document.querySelector('#day-'+d.n).hidden=place!=='All'&&!d.tags.includes(place))}
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>filter(b.dataset.filter));
document.querySelector('#expand').onclick=()=>document.querySelectorAll('.day:not([hidden])').forEach(d=>d.open=true);
document.querySelector('#collapse').onclick=()=>document.querySelectorAll('.day').forEach(d=>d.open=false);
function jump(n){filter('All');const d=document.querySelector('#day-'+n);if(d){d.open=true;d.scrollIntoView({behavior:'smooth',block:'start'})}}
document.querySelector('#date-jump').onchange=ev=>jump(ev.target.value);
document.querySelectorAll('[data-place]').forEach(a=>a.onclick=()=>filter(a.dataset.place));
document.querySelectorAll('a[href^="#day-"]').forEach(a=>a.onclick=ev=>{ev.preventDefault();jump(a.hash.replace('#day-',''));history.replaceState(null,'',a.hash)});
if(location.hash.startsWith('#day-'))jump(location.hash.replace('#day-',''));
document.querySelector('#flight-list').innerHTML=flights.map(f=>`<article class="flight"><div class="flight-head">${f[0]} ${badge(f[5])}</div><div class="airports">${f[1]} <span>→</span> ${f[2]}</div><p>${f[6]}</p><p><b>Departs</b> ${f[3]}</p><p><b>Arrives</b> ${f[4]}</p></article>`).join('');
document.querySelector('#source-note').textContent='Tentative February 18–19 plans include proposed bus times, snowshoeing, hot springs and winter lights. Official provider links are supplied for reservations and current details. February 2027 availability, exact trains, local transfers and hotel luggage storage still need confirmation. Recheck before booking.';



})().catch(()=>{document.querySelector('#days').textContent='The itinerary could not be loaded. Please refresh the page.';});
