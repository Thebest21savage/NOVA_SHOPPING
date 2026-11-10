
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":Deno.env.get("SITE_URL")??"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 try{
  if(req.method!=="POST")return new Response("Method not allowed",{status:405,headers:cors});
  const auth=req.headers.get("Authorization");if(!auth)return new Response(JSON.stringify({error:"Sign in to use NOVA AI."}),{status:401,headers:{...cors,"Content-Type":"application/json"}});
  const url=Deno.env.get("SUPABASE_URL")!,anon=Deno.env.get("SUPABASE_ANON_KEY")!,key=Deno.env.get("OPENAI_API_KEY")!;
  const client=createClient(url,anon,{global:{headers:{Authorization:auth}}});
  const {data:{user},error:ue}=await client.auth.getUser();if(ue||!user)return new Response(JSON.stringify({error:"Please sign in again."}),{status:401,headers:{...cors,"Content-Type":"application/json"}});
  const body=await req.json(),message=String(body.message??"").trim();if(!message||message.length>2000)return new Response(JSON.stringify({error:"Enter a message up to 2,000 characters."}),{status:400,headers:{...cors,"Content-Type":"application/json"}});
  const {data:catalog,error}=await client.from("products").select("id,name,description,category,price_cents,currency,active").eq("active",true).limit(100);if(error)throw error;
  const items=(catalog??[]).map((p:any)=>({id:p.id,name:p.name,description:p.description,category:p.category,price:(p.price_cents/100).toFixed(2),currency:p.currency}));
  const history=Array.isArray(body.history)?body.history.slice(-16).filter((m:any)=>["user","assistant"].includes(m?.role)&&typeof m?.content==="string").map((m:any)=>({role:m.role,content:m.content.slice(0,2000)})):[];\n  const messages=[{role:"system",content:"You are NOVA, a capable, conversational AI shopping assistant. Be helpful, natural, and clear. Answer general questions too, but prioritize shopping help. Recommend catalog products only when relevant and never invent stock, shipping, discounts, ratings, seller details, or product features. Clearly distinguish catalog items from external marketplace listings. Ask a brief follow-up when needed. Prices are in the currency shown. Catalog: "+JSON.stringify(items)},...history,{role:"user",content:message}];\n  const response=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4.1-mini",temperature:0.5,max_tokens:900,messages})});
  const result=await response.json();if(!response.ok)throw new Error(result.error?.message??"AI provider request failed");
  const reply=result.choices?.[0]?.message?.content?.trim();if(!reply)throw new Error("AI returned an empty response");
  return new Response(JSON.stringify({reply}),{headers:{...cors,"Content-Type":"application/json"}});
 }catch(e){console.error(e);return new Response(JSON.stringify({error:e.message??"NOVA AI is unavailable"}),{status:500,headers:{...cors,"Content-Type":"application/json"}})}
});