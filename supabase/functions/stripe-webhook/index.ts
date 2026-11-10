// Supabase Edge Function: stripe-webhook
// Required secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const stripe=new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!,{apiVersion:"2023-10-16"});
const cryptoProvider=Stripe.createSubtleCryptoProvider();
Deno.serve(async(req)=>{
 if(req.method!=="POST") return new Response("Method not allowed",{status:405});
 const signature=req.headers.get("Stripe-Signature");if(!signature)return new Response("Missing signature",{status:400});
 let event:Stripe.Event;
 try{event=await stripe.webhooks.constructEventAsync(await req.text(),signature,Deno.env.get("STRIPE_WEBHOOK_SECRET")!,undefined,cryptoProvider)}
 catch(_){return new Response("Invalid signature",{status:400})}
 const admin=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
 if(event.type==="checkout.session.completed"){
  const session=event.data.object as Stripe.Checkout.Session;const orderId=session.metadata?.order_id;
  if(orderId){await admin.from("orders").update({status:"paid",stripe_session_id:session.id}).eq("id",orderId);}
 }
 if(event.type==="checkout.session.expired"){
  const session=event.data.object as Stripe.Checkout.Session;const orderId=session.metadata?.order_id;
  if(orderId)await admin.from("orders").update({status:"expired"}).eq("id",orderId);
 }
 return new Response(JSON.stringify({received:true}),{headers:{"Content-Type":"application/json"}});
});