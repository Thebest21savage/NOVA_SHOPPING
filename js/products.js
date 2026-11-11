export const products = [
  {id:1,name:"Wireless Noise-Canceling Headphones",category:"Electronics",price:89.99,old:129.99,rating:4.8,reviews:1240,emoji:"🎧",image:"./assets/images/headphones.svg",tag:"Bestseller",features:"Wireless audio · noise cancellation",kind:"Popular"},
  {id:2,name:"Minimal Ceramic Table Lamp",category:"Home",price:42.5,old:59,rating:4.7,reviews:386,emoji:"💡",image:"./assets/images/lamp.svg",tag:"NOVA pick",features:"Ceramic build · table lamp",kind:"Popular"},
  {id:3,name:"Everyday Canvas Sneakers",category:"Fashion",price:54,old:72,rating:4.6,reviews:812,emoji:"👟",image:"./assets/images/sneakers.svg",tag:"25% off",features:"Canvas upper · everyday sneakers",kind:"Deals"},
  {id:4,name:"Hydrating Daily Skin Set",category:"Beauty",price:32,old:40,rating:4.9,reviews:2050,emoji:"🧴",image:"./assets/images/skincare.svg",tag:"Top rated",features:"Hydrating skincare · daily set",kind:"Popular"},
  {id:5,name:"Smart Fitness Watch",category:"Electronics",price:119,old:149,rating:4.5,reviews:978,emoji:"⌚",image:"./assets/images/watch.svg",tag:"Deal",features:"Smart watch · fitness focus",kind:"Deals"},
  {id:6,name:"Insulated Travel Bottle",category:"Sports",price:24.99,old:29.99,rating:4.8,reviews:634,emoji:"🥤",image:"./assets/images/bottle.svg",tag:"Everyday fave",features:"Insulated build · travel bottle",kind:"Popular"},
  {id:7,name:"The Art of Small Habits",category:"Books",price:16.5,old:null,rating:4.7,reviews:291,emoji:"📚",image:"./assets/images/book.svg",tag:"Staff pick",features:"Reading · everyday habits",kind:"New"},
  {id:8,name:"Soft Knit Throw Blanket",category:"Home",price:38,old:52,rating:4.6,reviews:447,emoji:"🧶",image:"./assets/images/blanket.svg",tag:"Cozy pick",features:"Soft knit · throw blanket",kind:"Popular"},
  {id:9,name:"Build-It Creative Robot Kit",category:"Toys",price:39.99,old:49.99,rating:4.8,reviews:512,emoji:"🤖",image:"./assets/images/robot-kit.svg",tag:"New",features:"Build-it kit · creative robot",kind:"New"},
  {id:10,name:"Classic Everyday Backpack",category:"Fashion",price:46,old:null,rating:4.5,reviews:318,emoji:"🎒",image:"./assets/images/backpack.svg",tag:"Just in",features:"Everyday carry · backpack",kind:"New"},
  {id:11,name:"Portable Bluetooth Speaker",category:"Electronics",price:34.99,old:49.99,rating:4.6,reviews:1503,emoji:"🔊",image:"./assets/images/speaker.svg",tag:"Great value",features:"Portable audio · Bluetooth speaker",kind:"Deals"},
  {id:12,name:"Indoor Plant Starter Set",category:"Home",price:27.5,old:null,rating:4.7,reviews:188,emoji:"🪴",image:"./assets/images/plant.svg",tag:"Fresh find",features:"Indoor gardening · starter set",kind:"New"}
];

export const categories = [
  ["All","./assets/images/hero-studio.svg","Everything"],
  ["Electronics","./assets/images/headphones.svg","Tech"],
  ["Fashion","./assets/images/sneakers.svg","Fashion"],
  ["Home","./assets/images/lamp.svg","Home"],
  ["Beauty","./assets/images/skincare.svg","Beauty"],
  ["Toys","./assets/images/robot-kit.svg","Gaming & toys"],
  ["Sports","./assets/images/bottle.svg","Sports"],
  ["Books","./assets/images/book.svg","Books"]
];

export const money = amount => "$" + Number(amount).toFixed(2);
export const byId = id => products.find(product => product.id === Number(id));

export function renderCategories(activeCategory = "All") {
  document.getElementById("categories").innerHTML = categories.map(([name, image, label]) =>
    '<button class="category ' + (activeCategory === name ? "active" : "") + '" data-category="' + name + '" type="button"><img src="' + image + '" alt="" loading="lazy"><span>' + label + '</span></button>'
  ).join("");
}

export function renderProducts(viewState, saved, compareIds) {
  let list = products.filter(product => {
    const matchesCategory = viewState.category === "All" || product.category === viewState.category;
    const matchesKind = viewState.filter === "All" || viewState.filter === product.kind || (viewState.filter === "Deals" && Boolean(product.old));
    const matchesDeals = !viewState.dealsOnly || Boolean(product.old);
    const matchesSearch = (product.name + " " + product.category + " " + product.tag).toLowerCase().includes(viewState.query.toLowerCase());
    const matchesSaved = !viewState.savedOnly || saved.includes(product.id);
    const matchesDiscovery = !viewState.discoveryIds || viewState.discoveryIds.includes(product.id);
    return matchesCategory && matchesKind && matchesDeals && matchesSearch && matchesSaved && matchesDiscovery;
  });
  const sort = document.getElementById("sortSelect").value;
  if (sort === "low") list.sort((a,b) => a.price-b.price);
  if (sort === "high") list.sort((a,b) => b.price-a.price);
  if (sort === "rating") list.sort((a,b) => b.rating-a.rating);

  document.getElementById("productHeading").textContent = viewState.discoveryIds ? "NOVA picks for your budget" : viewState.savedOnly ? "Your saved discoveries" : viewState.query ? 'Results for "' + viewState.query + '"' : viewState.dealsOnly ? "NOVA price opportunities" : viewState.category === "All" ? "Trending on NOVA" : viewState.category + " discoveries";
  document.getElementById("productSub").textContent = viewState.discoveryIds ? "A few highly rated sample finds within your budget." : viewState.savedOnly ? "The things you’ve kept close for later." : list.length + " thoughtful finds to explore.";
  document.getElementById("resultCount").textContent = list.length + (list.length === 1 ? " discovery" : " discoveries");
  document.querySelectorAll(".nav [data-category], #categories [data-category]").forEach(button => button.classList.toggle("active", button.dataset.category === viewState.category));

  document.getElementById("productGrid").innerHTML = list.length ? list.map(product =>
    '<article class="product ' + (product.tag === "NOVA pick" ? "recommended" : "") + '">' +
      '<div class="product-art tone-' + product.category.toLowerCase() + '">' +
        '<span class="tag ' + (product.tag === "NOVA pick" ? "nova-tag" : "") + '">' + product.tag + '</span>' +
        '<div class="product-actions">' +
          '<button class="round-action ' + (saved.includes(product.id) ? "saved" : "") + '" data-save="' + product.id + '" type="button" aria-label="' + (saved.includes(product.id) ? "Remove " + product.name + " from saved items" : "Save " + product.name) + '">' + (saved.includes(product.id) ? "♥" : "♡") + '</button>' +
          '<button class="round-action ' + (compareIds.includes(product.id) ? "compare-picked" : "") + '" data-compare="' + product.id + '" type="button" aria-label="' + (compareIds.includes(product.id) ? "Remove " + product.name + " from comparison" : "Add " + product.name + " to comparison") + '">⚖</button>' +
        '</div><img class="product-image" src="' + product.image + '" alt="' + product.name + '" loading="lazy" decoding="async">' +
      '</div><h3>' + product.name + '</h3><div class="rating" aria-label="' + product.rating + ' out of 5 stars">★★★★★ <small>' + product.rating + ' (' + product.reviews.toLocaleString() + ')</small></div>' +
      '<div class="price">' + money(product.price) + (product.old ? '<span class="old">' + money(product.old) + '</span>' : "") + '</div>' +
      '<div class="delivery"><span class="delivery-mark">✓</span> Free delivery on demo orders</div><button class="add" data-add="' + product.id + '" type="button">Add to cart</button></article>'
  ).join("") : '<div class="empty">No products found. Try another search or category.</div>';
}

export function comparisonTable(selectedProducts) {
  const rows = [
    ["Price", product => money(product.price)],
    ["Rating", product => product.rating + " / 5 (" + product.reviews.toLocaleString() + " reviews)"],
    ["Highlights", product => product.features],
    ["Category", product => product.category],
    ["Delivery", () => "Free delivery on demo orders"],
    ["Value context", product => product.old ? product.rating + "★ · " + Math.round((1 - product.price / product.old) * 100) + "% below the listed previous price" : product.rating + "★ · no previous price listed"]
  ];
  return '<div class="compare-table-wrap"><table class="compare-table"><thead><tr><th>What matters</th>' + selectedProducts.map(product => "<th>" + product.emoji + " " + product.name + "</th>").join("") + "</tr></thead><tbody>" + rows.map(([label, value]) => "<tr><td>" + label + "</td>" + selectedProducts.map(product => "<td>" + value(product) + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";
}

