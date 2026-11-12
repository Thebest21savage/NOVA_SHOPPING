import { byId, comparisonTable, money, products } from "./products.js";
import { getSavedItems, initCart } from "./cart.js";
import { initAuth } from "./auth.js";
import { startCheckout } from "./checkout.js";
import { getProductNotes } from "./product-detail-data.js";

const query = new URLSearchParams(window.location.search);
const requestedProduct = byId(query.get("id"));
const product = requestedProduct || products[0];
const notes = getProductNotes(product);
const moneyLabel = amount => money(amount);

function notify(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function setOpen(id, open) {
  const element = document.getElementById(id);
  element.classList.toggle("open", open);
  element.setAttribute("aria-hidden", String(!open));
}

function readLocalList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (_) {
    return [];
  }
}

function renderProduct() {
  document.title = product.name + " — NOVA Shopping";
  document.getElementById("breadcrumbCategory").textContent = product.category;
  document.getElementById("breadcrumbCategory").href = "../index.html?category=" + encodeURIComponent(product.category) + "#productsSection";
  document.getElementById("breadcrumbBrand").textContent = notes.brand;
  document.getElementById("breadcrumbProduct").textContent = product.name;
  document.getElementById("detailBrand").textContent = notes.brand;
  document.getElementById("detailName").textContent = product.name;
  document.getElementById("detailRating").textContent = product.rating.toFixed(1) + " · " + product.reviews.toLocaleString() + " sample reviews";
  document.getElementById("detailSummary").textContent = product.features + ". Explore the listing, trade-offs, and sample comparisons before making a choice.";
  document.getElementById("snapshotBestFor").textContent = notes.bestFor;
  document.getElementById("snapshotStandout").textContent = notes.standout;
  document.getElementById("snapshotBefore").textContent = notes.beforeBuy;
  document.getElementById("detailPrice").textContent = moneyLabel(product.price);
  document.getElementById("detailOldPrice").textContent = product.old ? moneyLabel(product.old) : "";
  document.getElementById("detailSavings").textContent = product.old ? Math.round((1 - product.price / product.old) * 100) + "% below listed prior price" : "Sample catalog price";
  document.getElementById("intelligencePrice").textContent = moneyLabel(product.price);
  document.getElementById("intelligencePrevious").textContent = product.old ? "Listed prior price " + moneyLabel(product.old) : "No prior price listed in sample catalog";
  document.getElementById("mobilePrice").textContent = moneyLabel(product.price);
  document.getElementById("detailAddBtn").dataset.add = String(product.id);
  document.getElementById("mobileAddBtn").dataset.add = String(product.id);
  document.getElementById("detailSaveBtn").dataset.save = String(product.id);
  document.getElementById("detailCompareBtn").dataset.compareId = String(product.id);
  document.getElementById("mainProductImage").src = "../" + product.image.replace(/^\.\//, "");
  document.getElementById("mainProductImage").alt = product.name + " sample catalog illustration";
  document.getElementById("galleryCaption").textContent = product.name + " · catalog illustration";
  document.getElementById("matchCopy").textContent = notes.bestFor + " " + notes.standout;
  document.getElementById("considerList").innerHTML = notes.considerList.map(item => "<li>" + item + "</li>").join("");
  document.getElementById("bestForList").innerHTML = notes.bestForList.map(item => "<li>" + item + "</li>").join("");
  document.getElementById("anotherOptionList").innerHTML = notes.considerList.map(item => "<li>" + item + "</li>").join("");
  document.getElementById("peopleLoveList").innerHTML = notes.loved.map(item => "<li>" + item + "</li>").join("");
  document.getElementById("concernsList").innerHTML = notes.concerns.map(item => "<li>" + item + "</li>").join("");
  document.getElementById("reviewScore").textContent = product.rating.toFixed(1) + " / 5";
  document.getElementById("reviewCount").textContent = product.reviews.toLocaleString() + " catalog review count · sample data";
  document.getElementById("fullDescription").textContent = product.name + " is a " + product.category.toLowerCase() + " sample listing. " + notes.bestFor + " The current catalog summary is: " + product.features + ". Additional seller-authored descriptions and verified specifications will appear when product data is connected.";
  document.getElementById("includedDetails").textContent = "Package contents are not supplied in this sample listing. Confirm included items with the seller before purchasing " + product.name + ".";
  document.getElementById("compatibilityDetails").textContent = notes.beforeBuy + " Compatibility, dimensions, and care guidance are not connected for this sample product.";
  renderOptions();
  renderGallery();
  renderVideoCards();
  renderReviews();
  renderAlternatives();
  renderSpecs();
  renderPriceHistory();
  renderBuyingOptions();
  renderAccessories();
  renderRelatedAndRecent();
  updateSavedButton();
  updateCompareButtons();
}

function renderOptions() {
  const container = document.getElementById("productOptions");
  if (!notes.variants) { container.innerHTML = ""; return; }
  container.innerHTML = '<div class="option-label-row"><span>' + notes.variants.label + '</span><small>PREVIEW</small></div><div class="option-choices">' + notes.variants.values.map((value, index) => '<button type="button" class="option-choice ' + (index === 0 ? "active" : "") + '" data-option-choice aria-pressed="' + (index === 0) + '">' + value + '</button>').join("") + '</div>';
  container.querySelectorAll("[data-option-choice]").forEach(button => button.addEventListener("click", () => {
    container.querySelectorAll("[data-option-choice]").forEach(choice => {
      choice.classList.toggle("active", choice === button);
      choice.setAttribute("aria-pressed", String(choice === button));
    });
    document.getElementById("optionFeedback").hidden = false;
  }));
}

const galleryViews = [
  {name:"Product art", mode:"", caption:"Product illustration · demo catalog"},
  {name:"Detail view", mode:"thumb-detail", caption:"Closer look · illustrative crop"},
  {name:"Styled view", mode:"thumb-styled", caption:"Styled view · sample artwork"},
  {name:"Video preview", mode:"thumb-video", video:true, caption:"Video preview · placeholder"}
];

function renderGallery() {
  const image = "../" + product.image.replace(/^\.\//, "");
  document.getElementById("galleryThumbs").innerHTML = galleryViews.map((view, index) => '<button class="gallery-thumb ' + (index === 0 ? "active" : "") + '" type="button" data-gallery-index="' + index + '" aria-label="' + view.name + '"><span class="thumb-art ' + view.mode + '"><img src="' + image + '" alt="" loading="lazy">' + (view.video ? '<span class="thumb-play" aria-hidden="true">▶</span>' : "") + '</span><small>' + view.name + '</small></button>').join("");
  document.querySelectorAll("[data-gallery-index]").forEach(button => button.addEventListener("click", () => {
    const view = galleryViews[Number(button.dataset.galleryIndex)];
    document.querySelectorAll("[data-gallery-index]").forEach(item => item.classList.toggle("active", item === button));
    if (view.video) {
      openVideo("Product video preview", "Product-specific video playback is not connected. This sample artwork shows where a real video preview will appear.");
      return;
    }
    const stage = document.getElementById("galleryStage");
    stage.dataset.view = view.mode;
    document.getElementById("galleryCaption").textContent = product.name + " · " + view.caption;
    document.getElementById("mainProductImage").classList.remove("is-zoomed");
  }));
}

function renderVideoCards() {
  const types = ["Reviews","Real-world tests","Unboxings","Comparisons"];
  const titles = ["A closer look at the details","What to consider for everyday use","First impressions and setup","How it compares in the NOVA catalog"];
  const image = "../" + product.image.replace(/^\.\//, "");
  document.getElementById("videoGrid").innerHTML = types.map((type, index) => '<button class="video-card" type="button" data-video-title="' + titles[index] + '"><span class="video-thumb video-tone-' + index + '"><img src="' + image + '" alt="" loading="lazy"><span class="play-mark" aria-hidden="true">▶</span><span class="video-type">' + type + '</span></span><b>' + titles[index] + '</b><small>NOVA creator spotlight · placeholder</small></button>').join("");
  document.querySelectorAll("[data-video-title]").forEach(button => button.addEventListener("click", () => openVideo(button.dataset.videoTitle, "Creator videos about " + product.name + " will appear here when product-specific media is connected.")));
}

function makeReviewSamples() {
  return [
    {rating:5,title:"Easy to compare at a glance",theme:"Listing clarity",body:"Sample review preview: the listing gives a clear sense of what this product is for. More verified product details would make the choice easier."},
    {rating:4,title:"A promising everyday pick",theme:"Everyday use",body:"Sample review preview: the core idea feels practical. I would still want the seller's full specifications before deciding."},
    {rating:4,title:"A few details to confirm",theme:"Before purchasing",body:"Sample review preview: useful highlights are here, though fit, compatibility, or care information would help answer the final questions."}
  ];
}

function renderReviews() {
  const term = document.getElementById("reviewSearch").value.trim().toLowerCase();
  const ratingFilter = document.getElementById("reviewFilter").value;
  const sort = document.getElementById("reviewSort").value;
  let reviews = makeReviewSamples().filter(review => {
    const matchesRating = ratingFilter === "all" || String(review.rating) === ratingFilter;
    const matchesTerm = (review.title + " " + review.body + " " + review.theme + " " + product.name).toLowerCase().includes(term);
    return matchesRating && matchesTerm;
  });
  if (sort === "high") reviews = reviews.sort((a,b) => b.rating - a.rating);
  if (sort === "low") reviews = reviews.sort((a,b) => a.rating - b.rating);
  document.getElementById("reviewList").innerHTML = reviews.length ? reviews.map(review => '<article class="review-card"><div class="review-card-top"><span class="stars" aria-label="' + review.rating + ' out of 5 stars">' + "★".repeat(review.rating) + "☆".repeat(5 - review.rating) + '</span><span class="demo-review-badge">SAMPLE REVIEW</span></div><h3>' + review.title + '</h3><p>' + review.body + '</p><div class="review-meta"><span>Sample review preview</span><span>' + review.theme + '</span></div></article>').join("") : '<p class="no-reviews">No sample reviews match these filters.</p>';
}

function readCompareIds() {
  return readLocalList("nova-compare").map(Number).filter(id => products.some(item => item.id === id)).slice(0,3);
}

function updateSavedButton() {
  const button = document.getElementById("detailSaveBtn");
  const saved = getSavedItems().includes(product.id);
  button.setAttribute("aria-pressed", String(saved));
  button.classList.toggle("is-saved", saved);
  button.innerHTML = (saved ? "♥" : "♡") + " <span>" + (saved ? "Saved" : "Save") + "</span>";
}

function updateCompareButtons() {
  const selected = readCompareIds();
  const current = document.getElementById("detailCompareBtn");
  const isSelected = selected.includes(product.id);
  current.setAttribute("aria-pressed", String(isSelected));
  current.classList.toggle("is-selected", isSelected);
  current.innerHTML = "⚖ <span>" + (isSelected ? "In compare list" : "Add to compare") + "</span>";
  document.querySelectorAll("[data-compare-id]").forEach(button => {
    const active = selected.includes(Number(button.dataset.compareId));
    button.classList.toggle("selected", active);
    button.setAttribute("aria-pressed", String(active));
    const label = button.querySelector("[data-compare-label]");
    if (label) label.textContent = active ? "In compare list" : "Add to compare";
  });
}

function toggleCompare(id) {
  let selected = readCompareIds();
  if (selected.includes(id)) selected = selected.filter(item => item !== id);
  else if (selected.length < 3) selected = [...selected, id];
  else { notify("Compare up to three products at a time."); return; }
  localStorage.setItem("nova-compare", JSON.stringify(selected));
  updateCompareButtons();
  notify(selected.includes(id) ? "Added to your comparison list" : "Removed from your comparison list");
}

function renderAlternatives() {
  const alternatives = notes.alternatives.map(entry => ({...entry, product:byId(entry.id)})).filter(entry => entry.product);
  document.getElementById("alternativeGrid").innerHTML = alternatives.length ? alternatives.map(entry => '<article class="alternative-card"><span class="alternative-purpose">' + entry.label + '</span><a href="./product.html?id=' + entry.product.id + '" class="alternative-image"><img src="../' + entry.product.image.replace(/^\.\//, "") + '" alt="' + entry.product.name + '" loading="lazy"></a><div class="alternative-content"><a href="./product.html?id=' + entry.product.id + '" class="alternative-title">' + entry.product.name + '</a><strong>' + moneyLabel(entry.product.price) + '</strong><p>' + entry.reason + '</p><button type="button" class="chip compare-choice" data-compare-id="' + entry.product.id + '" aria-pressed="false">⚖ <span data-compare-label>Add to compare</span></button></div></article>').join("") : '<p class="no-reviews">Explore the catalog to find more sample products.</p>';
  updateCompareButtons();
}

function renderSpecs() {
  document.getElementById("specExplainerGrid").innerHTML = notes.specs.map(spec => '<article class="spec-explainer"><span class="spec-kicker">THE SPEC</span><h3>' + spec.label + '</h3><strong>' + spec.value + '</strong><div><span>WHAT IT MEANS</span><p>' + spec.meaning + '</p></div><div><span>WHY IT MATTERS</span><p>' + spec.why + '</p></div></article>').join("");
  const rows = [
    ["Product", product.name], ["Brand", notes.brand], ["Category", product.category], ["Sample price", moneyLabel(product.price)],
    ["Catalog highlights", product.features], ["Dimensions", "Not supplied in sample catalog"], ["Materials", "Confirm with seller"],
    ["Compatibility / care", "Confirm with seller"], ["Warranty and returns", "Seller policies not connected"]
  ];
  document.getElementById("fullSpecsList").innerHTML = rows.map(([label,value]) => '<div><dt>' + label + '</dt><dd>' + value + '</dd></div>').join("");
}

function renderPriceHistory() {
  const current = product.price;
  const high = product.old || current * 1.12;
  const values = [high, high * .96, Math.max(current, high * .91), current * 1.04, current];
  const min = Math.min(...values) * .94;
  const max = Math.max(...values) * 1.04;
  const points = values.map((value,index) => {
    const x = 9 + index * 94;
    const y = 83 - ((value - min) / (max - min || 1)) * 62;
    return [x,y];
  });
  const line = points.map(([x,y],index) => (index ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)).join(" ");
  const area = line + " L" + points.at(-1)[0] + " 91 L" + points[0][0] + " 91 Z";
  document.getElementById("priceChart").innerHTML = '<svg viewBox="0 0 385 100" role="img" aria-label="Illustrative sample price chart"><path d="' + area + '" fill="#F0ECF7"/><path d="' + line + '" fill="none" stroke="#6750A4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="' + points.at(-1)[0] + '" cy="' + points.at(-1)[1].toFixed(1) + '" r="4" fill="#6750A4"/></svg><div><span>Earlier sample</span><span>Current sample</span></div>';
}

function renderBuyingOptions() {
  const alternate = product.price + 4.95;
  document.getElementById("buyingOptions").innerHTML = '<div class="buying-row buying-best"><div><b>NOVA sample catalog</b><small>Delivery shown as included · 3–5 days (example)</small></div><strong>' + moneyLabel(product.price) + '</strong><span>Sample listing</span></div><div class="buying-row"><div><b>Illustrative alternate</b><small>Example delivery $4.95 · 5–7 days</small></div><strong>' + moneyLabel(alternate) + '</strong><span>Example only</span></div>';
}

function renderAccessories() {
  const accessories = notes.accessories.map(entry => ({...entry, product:byId(entry.id)})).filter(entry => entry.product);
  document.getElementById("accessoryGrid").innerHTML = accessories.map(entry => '<article class="accessory-card"><a class="accessory-image" href="./product.html?id=' + entry.product.id + '"><img src="../' + entry.product.image.replace(/^\.\//, "") + '" alt="' + entry.product.name + '" loading="lazy"></a><div><p class="section-kicker">A THOUGHTFUL PAIRING</p><a class="alternative-title" href="./product.html?id=' + entry.product.id + '">' + entry.product.name + '</a><p>' + entry.reason + '</p><div class="accessory-bottom"><strong>' + moneyLabel(entry.product.price) + '</strong><button class="add" type="button" data-add="' + entry.product.id + '">Add to cart</button></div></div></article>').join("") || '<p class="no-reviews">More pairings will appear as the NOVA catalog grows.</p>';
}

function productTile(item) {
  return '<article class="related-tile"><a href="./product.html?id=' + item.id + '"><img src="../' + item.image.replace(/^\.\//, "") + '" alt="' + item.name + '" loading="lazy"><span>' + item.category + '</span><b>' + item.name + '</b></a><div><strong>' + moneyLabel(item.price) + '</strong><button type="button" class="add" data-add="' + item.id + '">Add to cart</button></div></article>';
}

function renderRelatedAndRecent() {
  const related = notes.alternatives.map(item => byId(item.id)).filter(Boolean).slice(0,3);
  document.getElementById("relatedProducts").innerHTML = related.map(productTile).join("");
  const recentIds = readLocalList("nova-recently-viewed").map(Number).filter(id => id !== product.id);
  const recentlyViewed = recentIds.map(byId).filter(Boolean).slice(0,4);
  document.getElementById("recentProducts").innerHTML = recentlyViewed.length ? recentlyViewed.map(productTile).join("") : '<p class="recent-empty">Products you view next will be kept here on this device.</p>';
  const viewed = readLocalList("nova-recently-viewed").map(Number).filter(id => id !== product.id);
  localStorage.setItem("nova-recently-viewed", JSON.stringify([product.id,...viewed].slice(0,6)));
}

function openCompare() {
  const alternatives = notes.alternatives.map(item => item.id).filter(id => byId(id));
  const ids = [...new Set([product.id,...readCompareIds(),...alternatives])].slice(0,3);
  const selected = ids.map(byId).filter(Boolean);
  if (selected.length < 2) { notify("Add another product to your comparison list first."); return; }
  document.getElementById("compareBody").innerHTML = comparisonTable(selected);
  setOpen("compareModal",true);
}

function openVideo(title, message) {
  document.getElementById("videoModalTitle").textContent = title;
  document.getElementById("videoModalMessage").textContent = message;
  document.getElementById("videoModalArt").innerHTML = '<img src="../' + product.image.replace(/^\.\//, "") + '" alt="' + product.name + ' sample illustration"><span aria-hidden="true">▶</span>';
  setOpen("videoModal",true);
}

function openPriceAlert() {
  document.getElementById("priceAlertInput").value = Math.max(.01, Math.floor(product.price * .8)).toFixed(2);
  setOpen("priceAlertModal",true);
}

function savePriceAlert(event) {
  event.preventDefault();
  const target = Number(document.getElementById("priceAlertInput").value);
  if (!Number.isFinite(target) || target <= 0) { notify("Enter a target price greater than zero."); return; }
  const alerts = readLocalList("nova-price-alerts").filter(item => Number(item.product_id) !== product.id);
  alerts.push({product_id:product.id,target_price_cents:Math.round(target * 100),saved_at:new Date().toISOString()});
  localStorage.setItem("nova-price-alerts", JSON.stringify(alerts));
  setOpen("priceAlertModal",false);
  notify("Target saved on this device. Automatic monitoring is not connected.");
}

function setupEvents() {
  initCart({onSavedChange:updateSavedButton,notify});
  initAuth(notify);
  document.getElementById("checkoutBtn").addEventListener("click",() => startCheckout(notify));
  document.getElementById("detailSearchForm").addEventListener("submit",event => {
    event.preventDefault();
    const term = document.getElementById("detailSearchInput").value.trim();
    if (term) window.location.href = "../index.html?q=" + encodeURIComponent(term) + "#productsSection";
  });
  document.getElementById("savedBtn").addEventListener("click",() => window.location.assign("../index.html?view=saved#productsSection"));
  document.getElementById("novaAiHeader").addEventListener("click",() => {
    document.getElementById("whyNOVA").scrollIntoView({behavior:"smooth"});
    notify("NOVA’s sample decision notes are below.");
  });
  document.getElementById("detailCompareBtn").addEventListener("click",() => toggleCompare(product.id));
  document.addEventListener("click",event => {
    const button = event.target.closest("[data-compare-id]");
    if (button) toggleCompare(Number(button.dataset.compareId));
  });
  document.getElementById("compareAllBtn").addEventListener("click",openCompare);
  document.getElementById("closeCompare").addEventListener("click",() => setOpen("compareModal",false));
  document.getElementById("compareModal").addEventListener("click",event => { if (event.target.id === "compareModal") setOpen("compareModal",false); });
  document.getElementById("closeVideo").addEventListener("click",() => setOpen("videoModal",false));
  document.getElementById("videoModal").addEventListener("click",event => { if (event.target.id === "videoModal") setOpen("videoModal",false); });
  document.getElementById("watchMoreBtn").addEventListener("click",() => openVideo("More about " + product.name,"A product-specific creator feed will appear here when video content is connected."));
  document.getElementById("reviewMediaBtn").addEventListener("click",() => openVideo("Customer photos and videos","Customer-uploaded media is not connected yet. This preview uses NOVA catalog artwork."));
  document.getElementById("reviewSearch").addEventListener("input",renderReviews);
  document.getElementById("reviewFilter").addEventListener("change",renderReviews);
  document.getElementById("reviewSort").addEventListener("change",renderReviews);
  document.getElementById("priceAlertBtn").addEventListener("click",openPriceAlert);
  document.getElementById("closePriceAlert").addEventListener("click",() => setOpen("priceAlertModal",false));
  document.getElementById("priceAlertModal").addEventListener("click",event => { if (event.target.id === "priceAlertModal") setOpen("priceAlertModal",false); });
  document.getElementById("priceAlertForm").addEventListener("submit",savePriceAlert);
  document.getElementById("zoomImageBtn").addEventListener("click",() => {
    const image = document.getElementById("mainProductImage");
    const zoomed = image.classList.toggle("is-zoomed");
    document.getElementById("zoomImageBtn").setAttribute("aria-label",zoomed ? "Reset product illustration zoom" : "Zoom product illustration");
  });
  document.getElementById("alternativesJump").addEventListener("click",() => document.getElementById("compare").scrollIntoView({behavior:"smooth"}));
  document.querySelectorAll(".quick-nav a").forEach(link => link.addEventListener("click",() => {
    document.querySelectorAll(".quick-nav a").forEach(item => { item.classList.toggle("active",item === link); item.removeAttribute("aria-current"); });
    link.setAttribute("aria-current","location");
  }));
  document.addEventListener("keydown",event => {
    if (event.key !== "Escape") return;
    ["compareModal","videoModal","priceAlertModal","cartOverlay","accountModal"].forEach(id => setOpen(id,false));
  });
  observeQuickNav();
}

function observeQuickNav() {
  if (!("IntersectionObserver" in window)) return;
  const links = [...document.querySelectorAll(".quick-nav a")];
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach(link => {
      const active = link.getAttribute("href") === "#" + visible.target.id;
      link.classList.toggle("active",active);
      if (active) link.setAttribute("aria-current","location"); else link.removeAttribute("aria-current");
    });
  },{rootMargin:"-120px 0px -65% 0px",threshold:[0,.2,.5]});
  links.forEach(link => {
    const section = document.getElementById(link.hash.slice(1));
    if (section) observer.observe(section);
  });
}

if (!requestedProduct) notify("Showing a NOVA sample product while the requested item is unavailable.");
renderProduct();
setupEvents();

