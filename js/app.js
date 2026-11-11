import { byId, comparisonTable, products, renderCategories, renderProducts } from "./products.js";
import { cartItemsForCheckout, getSavedItems, initCart } from "./cart.js";
import { initSearch, showDiscoveryResults, viewState } from "./search.js";
import { getCurrentUser, getSupabase, initAuth } from "./auth.js";

let compareIds = [];

function notify(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function updateCompareStatus() {
  document.getElementById("compareStatus").textContent = compareIds.length + " of 3 selected";
  document.getElementById("compareSelectionBtn").disabled = compareIds.length < 2;
}

function renderPage() {
  renderCategories(viewState.category);
  renderProducts(viewState, getSavedItems(), compareIds);
  updateCompareStatus();
}

function showComparison() {
  if (compareIds.length < 2) { notify("Choose at least two products with the balance icon first."); return; }
  const selectedProducts = compareIds.map(byId).filter(Boolean);
  document.getElementById("compareBody").innerHTML = comparisonTable(selectedProducts);
  document.getElementById("compareModal").classList.add("open");
  document.getElementById("compareModal").setAttribute("aria-hidden","false");
}

function closeComparison() {
  document.getElementById("compareModal").classList.remove("open");
  document.getElementById("compareModal").setAttribute("aria-hidden","true");
}

function openTools(feature) {
  document.getElementById("toolsOverlay").classList.add("open");
  document.getElementById("toolsOverlay").setAttribute("aria-hidden","false");
  document.getElementById("toolsTab").setAttribute("aria-expanded","true");
  document.getElementById("mobileTools").setAttribute("aria-expanded","true");
  if (feature) setToolOpen(feature);
}

function closeTools() {
  document.getElementById("toolsOverlay").classList.remove("open");
  document.getElementById("toolsOverlay").setAttribute("aria-hidden","true");
  document.getElementById("toolsTab").setAttribute("aria-expanded","false");
  document.getElementById("mobileTools").setAttribute("aria-expanded","false");
}

function setToolOpen(feature) {
  document.querySelectorAll(".tool-item").forEach(item => {
    const trigger = item.querySelector("[data-tool-toggle]");
    const isOpen = trigger.dataset.toolToggle === feature;
    item.classList.toggle("open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
    item.querySelector(".tool-panel").setAttribute("aria-hidden", String(!isOpen));
  });
}

function setupTools() {
  document.getElementById("toolsTab").addEventListener("click", () => openTools());
  document.getElementById("mobileTools").addEventListener("click", () => openTools());
  document.getElementById("closeTools").addEventListener("click", closeTools);
  document.getElementById("toolsOverlay").addEventListener("click", event => {
    if (event.target === document.getElementById("toolsOverlay") || event.target.closest(".tool-cta")) closeTools();
  });
  document.querySelectorAll("[data-tool-toggle]").forEach(button => button.addEventListener("click", () => {
    const wasOpen = button.getAttribute("aria-expanded") === "true";
    if (wasOpen) {
      button.closest(".tool-item").classList.remove("open");
      button.setAttribute("aria-expanded","false");
      document.getElementById(button.getAttribute("aria-controls")).setAttribute("aria-hidden","true");
    } else setToolOpen(button.dataset.toolToggle);
  }));
  document.querySelectorAll("[data-open-tools]").forEach(button => button.addEventListener("click", () => openTools(button.dataset.openTools)));
}

async function startCheckout() {
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

function setupComparison() {
  document.addEventListener("click", event => {
    const compareButton = event.target.closest("[data-compare]");
    if (!compareButton) return;
    const id = Number(compareButton.dataset.compare);
    if (compareIds.includes(id)) compareIds = compareIds.filter(item => item !== id);
    else if (compareIds.length < 3) compareIds = [...compareIds,id];
    else { notify("Compare up to three products at a time."); return; }
    renderPage();
    notify(compareIds.includes(id) ? "Added to your comparison" : "Removed from comparison");
  });
  document.getElementById("compareSelectionBtn").addEventListener("click", showComparison);
  document.getElementById("compareBtn").addEventListener("click", showComparison);
  document.getElementById("closeCompare").addEventListener("click", closeComparison);
  document.getElementById("compareModal").addEventListener("click", event => {
    if (event.target === document.getElementById("compareModal")) closeComparison();
  });
}

function setupShoppingTools() {
  document.getElementById("aiBtn").addEventListener("click", () => {
    const budget = window.prompt("What’s your budget in dollars?");
    if (budget === null) return;
    const amount = Number(budget);
    if (!Number.isFinite(amount) || amount <= 0) { notify("Enter a budget greater than zero."); return; }
    const picks = products.filter(product => product.price <= amount).sort((a,b) => b.rating-a.rating).slice(0,3);
    if (!picks.length) { notify("No sample picks found under $" + budget); return; }
    showDiscoveryResults(picks.map(product => product.id),renderPage);
    notify("Here are " + picks.length + " highly rated picks under $" + amount.toFixed(2));
  });

  document.getElementById("rewardsBtn").addEventListener("click", async () => {
    const supabase = getSupabase(), user = getCurrentUser();
    if (!supabase || !user) { notify("Sign in with a connected Supabase account to view your rewards."); return; }
    const {data,error} = await supabase.from("reward_ledger").select("points").eq("user_id",user.id);
    if (error) { notify("Rewards ledger is not available yet."); return; }
    const points = (data || []).reduce((sum,entry) => sum + Number(entry.points || 0), 0);
    notify("Your current NOVA Rewards balance is " + points + " points.");
  });

  document.getElementById("sellerBtn").addEventListener("click", async () => {
    const supabase = getSupabase(), user = getCurrentUser();
    if (!supabase || !user) { notify("Sign in with a connected Supabase account to check seller applications."); return; }
    const {data:existing,error:lookupError} = await supabase.from("sellers").select("store_name,status").eq("user_id",user.id).maybeSingle();
    if (lookupError) { notify("Seller applications are not available yet."); return; }
    if (existing) { notify(existing.store_name + " application: " + existing.status + "."); return; }
    const storeName = window.prompt("What should your shop be called?");
    if (!storeName || !storeName.trim()) return;
    const {error} = await supabase.from("sellers").insert({user_id:user.id,store_name:storeName.trim()});
    if (error) { notify("Could not submit your seller application."); return; }
    notify("Seller application submitted for review.");
  });

  document.getElementById("priceWatchBtn").addEventListener("click", async () => {
    const product = products.find(item => getSavedItems().includes(item.id));
    if (!product) { notify("Save a product first, then set a target price."); return; }
    const target = window.prompt("Alert me when " + product.name + " drops below ($):",String(Math.floor(product.price * .8)));
    if (target === null) return;
    const targetPrice = Number(target);
    if (!Number.isFinite(targetPrice) || targetPrice <= 0) { notify("Enter a target price greater than zero."); return; }
    const supabase = getSupabase(), user = getCurrentUser();
    if (!supabase || !user) { notify("Sign in with a connected Supabase account to save this price target."); return; }
    const {error} = await supabase.from("price_alerts").insert({user_id:user.id,product_id:String(product.id),target_price_cents:Math.round(targetPrice * 100)});
    if (error) { notify("Could not save the price target."); return; }
    notify("Price target saved. Automatic drop notifications need a monitoring service.");
  });

  document.getElementById("listsBtn").addEventListener("click", () => {
    notify(getCurrentUser() ? "Shared lists and group voting are not connected yet." : "Sign in to prepare your NOVA account for Social Shopping.");
  });
}

function setupKeyboardAndMotion() {
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    closeTools();
    document.getElementById("cartOverlay").classList.remove("open");
    document.getElementById("cartOverlay").setAttribute("aria-hidden","true");
    closeComparison();
    ["accountModal"].forEach(id => {
      document.getElementById(id).classList.remove("open");
      document.getElementById(id).setAttribute("aria-hidden","true");
    });
  });

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.body.classList.add("motion-ready");
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("revealed"); revealObserver.unobserve(entry.target); }
    }), {threshold:.12});
    document.querySelectorAll(".js-reveal").forEach(element => revealObserver.observe(element));
  } else {
    document.querySelectorAll(".js-reveal").forEach(element => element.classList.add("revealed"));
  }
}

initCart({onSavedChange:renderPage,notify});
initSearch(renderPage);
initAuth(notify);
setupTools();
setupComparison();
setupShoppingTools();
document.getElementById("checkoutBtn").addEventListener("click",startCheckout);
renderPage();
setupKeyboardAndMotion();
