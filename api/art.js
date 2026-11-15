const guard=require('../lib/limit');
module.exports=async function handler(req,res){
res.setHeader('Cache-Control','no-store');if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:'Artwork generation is not configured. Set OPENAI_API_KEY on the hosting platform.'});
let {poem,style}=req.body||{};if(typeof poem!=='string'||poem.trim().length<20||poem.length>4000)return res.status(400).json({error:'Write a poem of at least 20 characters first.'});
const gate=await guard(req,'art',3);if(!gate.ok)return res.status(gate.status).json({error:gate.error});
try{const r=await fetch('https://api.openai.com/v1/images/generations',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-1',size:'1024x1024',quality:'medium',n:1,prompt:`Create original climate poetry artwork in a ${String(style||'cinematic landscape').slice(0,70)} style. Represent the emotional themes and sensory imagery of this poem without including any text, letters, logos, watermarks or factual data claims: ${poem.slice(0,2600)}`})});const j=await r.json();if(!r.ok)throw new Error(j.error?.message||'Image service is unavailable.');const b64=j.data?.[0]?.b64_json;if(!b64)throw new Error('No image returned by the artwork service.');return res.status(200).json({image:`data:image/png;base64,${b64}`})}catch(e){return res.status(502).json({error:e.message})}
};
