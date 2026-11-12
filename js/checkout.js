import { cartItemsForCheckout } from "./cart.js";
import { getCurrentUser, getSupabase } from "./auth.js";

export async function startCheckout(notify) {
  const items = cartItemsForCheckout();
  if (!items.length) return;
  const supabase = getSupabase();
  if (!supabase) { notify("Connect Supabase and Stripe to enable secure checkout."); return; }
  if (!getCurrentUser()) {
    document.getElementById("cartOverlay").classList.remove("open");
    document.getElementById("cartOverlay").setAttribute("aria-hidden","true");
    document.getElementById("accountModal").classList.add("open");
    document.getElementById("accountModal").setAttribute("aria-hidden","false");
    notify("Please sign in before checkout.");
    return;
  }
  try {
    const {data,error} = await supabase.functions.invoke("create-checkout",{body:{items}});
    if (error) throw error;
    if (!data?.url) throw new Error("Checkout URL missing");
    location.assign(data.url);
  } catch (error) {
    notify(error.message || "Could not start checkout");
  }
}

