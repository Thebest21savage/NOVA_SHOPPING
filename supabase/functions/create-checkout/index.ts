import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors={ "Access-Control-Allow-Origin":Deno.env.get("SITE_URL")??"https://YOUR_SITE_DOMAIN","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS" };
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 try{
  if(req.method!=="POST")return new Response("Method not allowed",{status:405,headers:cors});
  const auth=req.headers.get("Authorization");if(!auth)return new Response("Sign-in required",{status:401,headers:cors});
  const url=Deno.env.get("SUPABASE_URL")!,anon=Deno.env.get("SUPABASE_ANON_KEY")!,service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,stripeKey=Deno.env.get("STRIPE_SECRET_KEY")!,site=Deno.env.get("SITE_URL")!;
  const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}}});
  const {data:{user},error:userError}=await userClient.auth.getUser();if(userError||!user)return new Response("Invalid session",{status:401,headers:cors});
  const {items}=await req.json();if(!Array.isArray(items)||items.length<1||items.length>30)return new Response("Invalid cart",{status:400,headers:cors});
  if(items.some((x:any)=>!Number.isInteger(x.quantity)||x.quantity<1||x.quantity>20))return new Response("Invalid quantity",{status:400,headers:cors});
  const admin=createClient(url,service),ids=[...new Set(items.map((x:any)=>String(x.product_id)))];
  const {data:products,error}=await admin.from("products").select("id,name,price_cents,currency,active,inventory").in("id",ids);
  if(error||!products||products.length!==ids.length)return new Response("Some products are unavailable",{status:400,headers:cors});
  let total=0;const lines:any[]=[];
  for(const item of items){const p=products.find((x:any)=>x.id===String(item.product_id));if(!p?.active||p.inventory<item.quantity)return new Response("Insufficient inventory",{status:409,headers:cors});total+=p.price_cents*item.quantity;lines.push({product_id:p.id,product_name:p.name,quantity:item.quantity,unit_price_cents:p.price_cents,currency:p.currency});}
  if(total<50||total>10000000)return new Response("Order total outside allowed range",{status:400,headers:cors});
  const currency=lines[0].currency;if(lines.some(x=>x.currency!==currency))return new Response("Mixed currencies are not supported",{status:400,headers:cors});
  const {data:order,error:oe}=await admin.from("orders").insert({user_id:user.id,status:"pending",total_cents:total,currency}).select("id").single();if(oe)throw oe;
  const {error:ie}=await admin.from("order_items").insert(lines.map(x=>({order_id:order.id,product_id:x.product_id,product_name:x.product_name,quantity:x.quantity,unit_price_cents:x.unit_price_cents})));
  if(ie){await admin.from("orders").delete().eq("id",order.id);throw ie;}
  const body=new URLSearchParams();body.set("mode","payment");body.set("success_url",site+"/?payment=success");body.set("cancel_url",site+"/?payment=cancelled");body.set("client_reference_id",order.id);body.set("metadata[user_id]",user.id);body.set("metadata[order_id]",order.id);
  lines.forEach((x:any,i:number)=>{body.set(`line_items[${i}][price_data][currency]`,x.currency);body.set(`line_items[${i}][price_data][product_data][name]`,x.product_name);body.set(`line_items[${i}][price_data][unit_amount]`,String(x.unit_price_cents));body.set(`line_items[${i}][quantity]`,String(x.quantity));});
  const response=await fetch("https://api.stripe.com/v1/checkout/sessions",{method:"POST",headers:{Authorization:"Bearer "+stripeKey,"Content-Type":"application/x-www-form-urlencoded"},body});
  const session=await response.json();if(!response.ok)throw new Error(session.error?.message||"Stripe checkout failed");
  await admin.from("orders").update({stripe_session_id:session.id}).eq("id",order.id);
  return new Response(JSON.stringify({url:session.url}),{headers:{...cors,"Content-Type":"application/json"}});
 }catch(e){console.error(e);return new Response(JSON.stringify({error:"Unable to create checkout session"}),{status:500,headers:{...cors,"Content-Type":"application/json"}});}
});