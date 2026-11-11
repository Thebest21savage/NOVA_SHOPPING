import { byId, money } from "./products.js";

function readStore(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch (_) {
    return fallback;
  }
}

export const cart = readStore("nova-cart", {});
let savedItems = readStore("nova-saved", []);
export const getSavedItems = () => savedItems;

function updateCount() {
  document.getElementById("cartCount").textContent = Object.values(cart).reduce((sum, quantity) => sum + Number(quantity || 0), 0);
}

function persistCart() {
  localStorage.setItem("nova-cart", JSON.stringify(cart));
  updateCount();
}

function persistSaved() {
  localStorage.setItem("nova-saved", JSON.stringify(savedItems));
}

export function cartItemsForCheckout() {
  return Object.entries(cart)
    .filter(([id, quantity]) => quantity > 0 && byId(id))
    .map(([product_id, quantity]) => ({ product_id, quantity }));
}

export function renderCart() {
  const entries = Object.entries(cart).filter(([id, quantity]) => quantity > 0 && byId(id));
  document.getElementById("cartItems").innerHTML = entries.length ? entries.map(([id, quantity]) => {
    const product = byId(id);
    return '<div class="cart-line"><div class="mini" aria-hidden="true">' + product.emoji + '</div><div><b>' + product.name + '</b><small>' + money(product.price) + '</small><div class="qty"><button data-qty="' + id + '" data-delta="-1" type="button" aria-label="Remove one">−</button><span>' + quantity + '</span><button data-qty="' + id + '" data-delta="1" type="button" aria-label="Add one">+</button></div></div><b>' + money(product.price * quantity) + '</b></div>';
  }).join("") : '<div class="empty">Your cart is ready for a little something.</div>';

  document.getElementById("cartTotal").textContent = money(entries.reduce((sum,[id,quantity]) => sum + byId(id).price * quantity, 0));
  document.getElementById("checkoutBtn").disabled = !entries.length;
  document.getElementById("checkoutBtn").style.opacity = entries.length ? "1" : ".5";
}

export function initCart({ onSavedChange, notify }) {
  document.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add]");
    if (addButton) {
      const id = addButton.dataset.add;
      cart[id] = (cart[id] || 0) + 1;
      persistCart();
      notify("Added to your cart");
    }

    const saveButton = event.target.closest("[data-save]");
    if (saveButton) {
      const id = Number(saveButton.dataset.save);
      savedItems = savedItems.includes(id) ? savedItems.filter(item => item !== id) : [...savedItems,id];
      persistSaved();
      onSavedChange();
      notify(savedItems.includes(id) ? "Saved for later" : "Removed from saved");
    }

    const quantityButton = event.target.closest("[data-qty]");
    if (quantityButton) {
      const id = quantityButton.dataset.qty;
      cart[id] = (cart[id] || 0) + Number(quantityButton.dataset.delta);
      if (cart[id] <= 0) delete cart[id];
      persistCart();
      renderCart();
    }
  });

  document.getElementById("cartBtn").addEventListener("click", () => {
    renderCart();
    document.getElementById("cartOverlay").classList.add("open");
    document.getElementById("cartOverlay").setAttribute("aria-hidden","false");
  });
  const closeCart = () => {
    document.getElementById("cartOverlay").classList.remove("open");
    document.getElementById("cartOverlay").setAttribute("aria-hidden","true");
  };
  document.getElementById("closeCart").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", event => {
    if (event.target === document.getElementById("cartOverlay")) closeCart();
  });
  renderCart();
  updateCount();
}
