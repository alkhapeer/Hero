const ACADEMY='https://hero.kesug.com/Academy/';
const app=document.getElementById('app');
let courses=[];
let deferredInstall=null;

const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const btn=(href,text,cls='primary')=>`<a class="btn ${cls}" href="${esc(href)}"> ${text}</a>`;

async function load(){
 const r=await fetch('./data/courses.json',{cache:'no-store'});
 if(!r.ok) throw new Error('تعذر تحميل بيانات الدورات');
 courses=(await r.json()).courses||[];
}
function home(){
 app.innerHTML=`<section class="hero"><span>HERO ACADEMY</span><h1>أكاديمية هيرو</h1>
 <p>واجهة واحدة لتصفح التطبيقات والدورات وتشغيل الدورات التي يوجهك إليها نظام الأكاديمية.</p>
 <div class="actions">${btn('#courses','📚 الدورات')}${btn('#apps','📱 التطبيقات','ghost')}</div></section>
 <section class="section"><h2>الأكاديمية</h2><div class="grid">
 <a class="card" href="${ACADEMY}courses.php" target="_blank" rel="noopener"><b>📚 الدورات</b><small>استعرض الدورات والتجارب والشراء.</small></a>
 <a class="card" href="${ACADEMY}home.php" target="_blank" rel="noopener"><b>🎓 دوراتي</b><small>ادخل إلى دوراتك وروابطها بعد الاعتماد.</small></a>
 </div></section>`;
}
function coursesPage(){
 app.innerHTML=`<section class="section"><div class="head"><h1>الدورات</h1><a href="${ACADEMY}courses.php" target="_blank">الأكاديمية ↗</a></div>
 <p class="muted">اختر دورة لفتح صفحة التفاصيل أو تجربة الدورة من نظام الأكاديمية.</p>
 <div class="grid">${courses.map(c=>`<article class="course"><div class="icon">${esc(c.icon)}</div><span>${esc(c.category)}</span>
 <h3>${esc(c.title)}</h3><p>${esc(c.description)}</p>
 <div class="actions">${btn(c.details_url,'تفاصيل الدورة','ghost')}${btn(c.trial_url,'▶ تجربة الدورة')}</div></article>`).join('')}</div></section>`;
}
function apps(){
 app.innerHTML=`<section class="section"><h1>التطبيقات</h1><div class="empty">قسم التطبيقات جاهز لإضافة التطبيقات التعليمية مستقبلًا.</div></section>`;
}
function active(){
 app.innerHTML=`<section class="section"><h1>دوراتي</h1>
 <div class="notice">يتم الحصول على الدورات المملوكة وروابطها من نظام الأكاديمية.</div>
 <div class="actions">${btn(`${ACADEMY}home.php`,'فتح دوراتي في الأكاديمية ↗')}</div>
 <p class="muted">عند اختيار دورة مفعلة من الأكاديمية، يتم توجيهك إلى رابط الدورة المحمية ليتم عرضها داخل هذا التطبيق.</p></section>`;
}
function settings(){
 app.innerHTML=`<section class="section"><h1>الإعدادات</h1><div class="card"><b>Hero Academy</b><p class="muted">نسخة Static — بدون نظام دفع أو تسجيل أو تفعيل داخل الواجهة العامة.</p></div></section>`;
}
function route(){
 const h=location.hash.slice(1)||'home';
 if(h==='home')home(); else if(h==='apps')apps(); else if(h==='courses')coursesPage(); else if(h==='active')active(); else if(h==='settings')settings(); else home();
}
load().then(route).catch(e=>app.innerHTML=`<div class="empty">${esc(e.message)}</div>`);
addEventListener('hashchange',route);
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;document.getElementById('installBtn').classList.remove('hidden')});
document.getElementById('installBtn').onclick=async()=>{if(deferredInstall){deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null}};
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(console.error));
