// NASA POWER observations proxy. No invented measurements.
module.exports=async function handler(req,res){
res.setHeader('Cache-Control','public, s-maxage=3600, stale-while-revalidate=86400');
if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
const lat=Number(req.query.lat),lon=Number(req.query.lon),year=Number(req.query.year);
if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180||!Number.isInteger(year)||year<1984||year>new Date().getUTCFullYear()-1)return res.status(400).json({error:'Invalid coordinates or year.'});
const endpoint='https://power.larc.nasa.gov/api/temporal/daily/point';
const qs=new URLSearchParams({parameters:'T2M,PRECTOTCORR',community:'AG',longitude:lon.toFixed(4),latitude:lat.toFixed(4),start:`${year}0101`,end:`${year}1231`,format:'JSON'});
try{
const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),24000);
let upstream;try{upstream=await fetch(`${endpoint}?${qs}`,{signal:ctrl.signal,headers:{Accept:'application/json'}})}finally{clearTimeout(timer)}
if(!upstream.ok)throw new Error(`NASA POWER HTTP ${upstream.status}`);
const data=await upstream.json();const t=data?.properties?.parameter?.T2M, p=data?.properties?.parameter?.PRECTOTCORR;
if(!t||!p)throw new Error('NASA POWER returned no supported records.');
const months=Array.from({length:12},(_,i)=>({label:new Date(Date.UTC(2020,i,1)).toLocaleString('en',{month:'long',timeZone:'UTC'}),temp:null,rain:null,tempDays:0,rainDays:0,_t:0,_p:0}));
for(let day of Object.keys(t)){let m=Number(day.slice(4,6))-1;if(m<0||m>11)continue;let v=Number(t[day]);if(Number.isFinite(v)&&v>-900){months[m]._t+=v;months[m].tempDays++}}
for(let day of Object.keys(p)){let m=Number(day.slice(4,6))-1;if(m<0||m>11)continue;let v=Number(p[day]);if(Number.isFinite(v)&&v>-900){months[m]._p+=Math.max(0,v);months[m].rainDays++}}
let validDays=months.reduce((a,m)=>a+m.tempDays,0);for(let m of months){m.temp=m.tempDays?Number((m._t/m.tempDays).toFixed(3)):null;m.rain=m.rainDays?Number(m._p.toFixed(3)):null;delete m._t;delete m._p}
if(validDays<100)throw new Error('Insufficient available NASA observations for the selected year.');
return res.status(200).json({source:'NASA POWER daily point API',parameters:['T2M','PRECTOTCORR'],lat,lon,year,validDays,months,accessedAt:new Date().toISOString(),sourceUrl:`${endpoint}?${qs}`});
}catch(e){return res.status(502).json({error:`NASA data could not be retrieved: ${e.message}`})}
};
