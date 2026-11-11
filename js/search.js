export const viewState = {
  category: "All",
  filter: "All",
  query: "",
  dealsOnly: false,
  savedOnly: false,
  discoveryIds: null
};

function resetDiscovery() {
  viewState.discoveryIds = null;
  viewState.savedOnly = false;
}

function scrollToProducts() {
  document.getElementById("productsSection").scrollIntoView({behavior:"smooth"});
}

export function showDiscoveryResults(ids, render) {
  viewState.category = "All";
  viewState.filter = "All";
  viewState.dealsOnly = false;
  viewState.savedOnly = false;
  viewState.query = "";
  viewState.discoveryIds = ids;
  document.getElementById("searchInput").value = "";
  document.querySelectorAll("[data-filter]").forEach(button => button.classList.toggle("active", button.dataset.filter === "All"));
  render();
  scrollToProducts();
}

export function initSearch(render) {
  document.addEventListener("click", event => {
    const categoryButton = event.target.closest("[data-category]");
    if (!categoryButton) return;
    viewState.category = categoryButton.dataset.category;
    viewState.dealsOnly = false;
    viewState.filter = "All";
    viewState.query = "";
    resetDiscovery();
    document.getElementById("searchInput").value = "";
    document.querySelectorAll("[data-filter]").forEach(button => button.classList.toggle("active", button.dataset.filter === "All"));
    render();
    scrollToProducts();
  });

  document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
    resetDiscovery();
    viewState.filter = button.dataset.filter;
    viewState.dealsOnly = false;
    document.querySelectorAll("[data-filter]").forEach(item => item.classList.toggle("active", item === button));
    render();
  }));

  document.getElementById("searchForm").addEventListener("submit", event => {
    event.preventDefault();
    viewState.query = document.getElementById("searchInput").value.trim();
    viewState.category = "All";
    viewState.dealsOnly = false;
    resetDiscovery();
    render();
    scrollToProducts();
  });
  document.getElementById("sortSelect").addEventListener("change", render);

  document.getElementById("dealsBtn").addEventListener("click", () => {
    viewState.category = "All";
    viewState.dealsOnly = true;
    viewState.filter = "Deals";
    viewState.query = "";
    resetDiscovery();
    document.getElementById("searchInput").value = "";
    document.querySelectorAll("[data-filter]").forEach(button => button.classList.toggle("active", button.dataset.filter === "Deals"));
    render();
    scrollToProducts();
  });

  document.getElementById("exploreBtn").addEventListener("click", scrollToProducts);
  document.getElementById("savedBtn").addEventListener("click", () => {
    if (viewState.savedOnly) {
      viewState.savedOnly = false;
      viewState.category = "All";
      viewState.query = "";
      document.getElementById("searchInput").value = "";
    } else {
      viewState.category = "All";
      viewState.filter = "All";
      viewState.dealsOnly = false;
      viewState.discoveryIds = null;
      viewState.savedOnly = true;
      viewState.query = "";
      document.getElementById("searchInput").value = "";
      document.querySelectorAll("[data-filter]").forEach(button => button.classList.toggle("active", button.dataset.filter === "All"));
    }
    render();
    scrollToProducts();
  });
}
