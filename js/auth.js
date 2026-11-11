import { money } from "./products.js";

let supabase = null;
let currentUser = null;

export const getSupabase = () => supabase;
export const getCurrentUser = () => currentUser;

async function refreshAuth() {
  if (!supabase) {
    document.getElementById("authMessage").textContent = "Account service is not configured yet. Add Supabase settings using the setup guide.";
    return;
  }
  const {data} = await supabase.auth.getSession();
  currentUser = data.session?.user || null;
  document.getElementById("accountLabel").textContent = currentUser ? currentUser.email.split("@")[0] : "Sign in";
  document.getElementById("signOutBtn").style.display = currentUser ? "block" : "none";
  document.getElementById("signInBtn").style.display = currentUser ? "none" : "block";
  document.getElementById("signUpBtn").style.display = currentUser ? "none" : "block";
  document.getElementById("authTitle").textContent = currentUser ? "Your NOVA account" : "Welcome to NOVA";
  document.getElementById("authMessage").textContent = currentUser ? currentUser.email : "Sign in or create your NOVA customer account.";
  document.getElementById("accountDetails").innerHTML = currentUser ? '<p>Customer account active.</p><button class="chip" id="ordersBtn" type="button">View my orders</button>' : "";
}

export function initAuth(notify) {
  if (window.NOVA_CONFIG?.supabaseUrl && window.NOVA_CONFIG?.supabaseAnonKey && window.supabase?.createClient) {
    supabase = window.supabase.createClient(window.NOVA_CONFIG.supabaseUrl, window.NOVA_CONFIG.supabaseAnonKey);
  }

  document.getElementById("accountBtn").addEventListener("click", () => {
    document.getElementById("accountModal").classList.add("open");
    document.getElementById("accountModal").setAttribute("aria-hidden","false");
  });
  const closeAccount = () => {
    document.getElementById("accountModal").classList.remove("open");
    document.getElementById("accountModal").setAttribute("aria-hidden","true");
  };
  document.getElementById("closeAccount").addEventListener("click", closeAccount);
  document.getElementById("accountModal").addEventListener("click", event => {
    if (event.target === document.getElementById("accountModal")) closeAccount();
  });

  document.getElementById("signInBtn").addEventListener("click", async () => {
    if (!supabase) { notify("Supabase is not configured"); return; }
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const {error} = await supabase.auth.signInWithPassword({email,password});
    if (error) { notify(error.message); return; }
    await refreshAuth();
    notify("Signed in successfully");
  });

  document.getElementById("signUpBtn").addEventListener("click", async () => {
    if (!supabase) { notify("Supabase is not configured"); return; }
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    if (password.length < 8) { notify("Use a password with at least 8 characters"); return; }
    const {data,error} = await supabase.auth.signUp({email,password});
    if (error) { notify(error.message); return; }
    notify(data.session ? "Account created" : "Check your email to confirm your account");
    if (data.session) await refreshAuth();
  });

  document.getElementById("signOutBtn").addEventListener("click", async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    await refreshAuth();
    notify("Signed out");
  });

  document.getElementById("accountDetails").addEventListener("click", async event => {
    if (event.target.id !== "ordersBtn" || !supabase) return;
    const {data,error} = await supabase.from("orders").select("id,status,total_cents,created_at").order("created_at",{ascending:false}).limit(20);
    if (error) { notify("Order history will appear after the database migration is installed"); return; }
    document.getElementById("accountDetails").innerHTML = "<h3>Recent orders</h3>" + (data.length ? data.map(order => "<p>Order " + order.id.slice(0,8) + " · " + order.status + " · " + money(order.total_cents / 100) + "</p>").join("") : "<p>No orders yet.</p>");
  });

  if (supabase) {
    supabase.auth.onAuthStateChange(() => refreshAuth());
    refreshAuth();
  } else {
    refreshAuth();
  }
}
