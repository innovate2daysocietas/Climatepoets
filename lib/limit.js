const {createHash}=require('crypto');
// Durable, global rate limits to prevent unbounded paid AI API use.
module.exports=async function guard(req,feature,max){
const base=process.env.UPSTASH_REDIS_REST_URL,token=process.env.UPSTASH_REDIS_REST_TOKEN;
if(!base||!token)return {ok:false,error:'AI rate limiting is not configured. Add Upstash credentials to enable public AI safely.',status:503};
const ip=(req.headers?.['x-forwarded-for']||req.headers?.['x-real-ip']||'unknown').split(',')[0].trim();
const hash=createHash('sha256').update(ip).digest('hex').slice(0,24);
const day=new Date().toISOString().slice(0,10),key=`climatepoets:${feature}:${day}:${hash}`;
try{
  const r=await fetch(`${base.replace(/\/$/,'')}/pipeline`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify([['INCR',key],['EXPIRE',key,86400]])});
  if(!r.ok)return{ok:false,error:'AI usage protection service is currently unavailable.',status:503};
  const out=await r.json();const count=Number(out?.[0]?.result);
  if(!Number.isFinite(count))return{ok:false,error:'AI usage protection failed.',status:503};
  if(count>max)return{ok:false,error:'Daily AI generation limit reached. Please try tomorrow.',status:429};
  return{ok:true};
}catch{return{ok:false,error:'AI usage protection service is currently unavailable.',status:503}}
};
