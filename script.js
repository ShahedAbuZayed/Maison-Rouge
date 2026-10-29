/* ======= 1. FLORAL PRODUCTS DATABASE ======= */
const BOUQUET_DATA = [
  {
    id: 1,
    name: "Noir Velvet",
    category: "seasonal",
    price: 300,
    rating: 5,
    image: "images/1.jpeg",
    badge: "Bestseller",
    description:
      "Deep burgundy garden roses paired with dark ranunculus, wild maroon calla lilies, and eucalyptus.",
    stemCount: "28 Premium Stems",
    aroma: "Damask Rose & Warm Amber",
  },
  {
    id: 2,
    name: "Velvet Blush",
    category: "seasonal",
    price: 280,
    rating: 4.9,
    image: "images/2.jpeg",
    badge: "Seasonal",
    description:
      "Soft blush garden roses blended with crimson dahlias and cascading dark seasonal foliage.",
    stemCount: "24 Stems",
    aroma: "Fresh Peony & Wild Vanilla",
  },
  {
    id: 3,
    name: "Rouge Privé Masterpiece",
    category: "prive",
    price: 420,
    rating: 5,
    image: "images/3.jpeg",
    badge: "Privé Exclusive",
    description:
      "Imported Dutch white dahlias with dark crimson garden roses and rare maroon orchids.",
    stemCount: "36 Master Stems",
    aroma: "French Jasmine & Velvet Musk",
  },
  {
    id: 4,
    name: "Golden Reverie",
    category: "exclusive",
    price: 120,
    rating: 4.8,
    image: "images/4.jpeg",
    badge: "Popular",
    description:
      "Vibrant autumnal tiger orchids and crimson calla lilies set in crystal clear blown glass.",
    stemCount: "18 Stems",
    aroma: "Citrus & Golden Orchid",
  },
  {
    id: 5,
    name: "Light Nightmare",
    category: "prive",
    price: 240,
    rating: 4.9,
    image: "images/5.jpeg",
    badge: "Limited Drop",
    description:
      "Ethereal blend of pale orchids, plum calla lilies, and cascading dark botanical leaves.",
    stemCount: "22 Stems",
    aroma: "Midnight Iris & Cedar",
  },
  {
    id: 6,
    name: "Bridal Noir Elegance",
    category: "bridal",
    price: 350,
    rating: 5,
    image: "images/6.jpeg",
    badge: "Haute Bridal",
    description:
      "Pure white ranunculus tied with a black silk ribbon. Minimalist drama for the modern bride.",
    stemCount: "30 Stems",
    aroma: "Crisp White Linen & Rose",
  },
  {
    id: 7,
    name: "Crimson Calla Monarch",
    category: "exclusive",
    price: 310,
    rating: 4.9,
    image: "images/7.jpeg",
    badge: "Exclusive",
    description:
      "Sleek velvet calla lilies arranged in asymmetrical height with dark metallic foliage.",
    stemCount: "20 Long Stems",
    aroma: "Subtle Violet Leaf",
  },
  {
    id: 8,
    name: "Opulent Hydrangea Sky",
    category: "seasonal",
    price: 260,
    rating: 4.7,
    image: "images/8.jpeg",
    badge: "Fresh Bloom",
    description:
      "Voluminous lilac hydrangeas paired with dark maroon garden roses in a white ceramic urn.",
    stemCount: "26 Stems",
    aroma: "Sweet Lilac & Powder",
  },
];

/* ====
           2. STATE MANAGEMENT & LOCAL STORAGE PERSISTENCE
           ===== */
let state = {
  cart: JSON.parse(localStorage.getItem("maison_cart")) || [],
  wishlist: JSON.parse(localStorage.getItem("maison_wishlist")) || [],
  currentFilter: "all",
  maxPrice: 450,
  discountRate: 0,
  currency: "USD",
  currencySymbol: "$",
  currencyRate: 1,
  selectedProduct: null,
};

const CURRENCIES = {
  USD: { symbol: "$", rate: 1 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
  AED: { symbol: "AED ", rate: 3.67 },
};

function saveState() {
  localStorage.setItem("maison_cart", JSON.stringify(state.cart));
  localStorage.setItem("maison_wishlist", JSON.stringify(state.wishlist));
  updateBadges();
}

function formatPrice(val) {
  return `${state.currencySymbol}${(val * state.currencyRate).toFixed(0)}`;
}

/* Currency Selector Handler */
document.getElementById("currencySelector").addEventListener("change", (e) => {
  const code = e.target.value;
  if (CURRENCIES[code]) {
    state.currency = code;
    state.currencySymbol = CURRENCIES[code].symbol;
    state.currencyRate = CURRENCIES[code].rate;
    renderBouquets();
    renderCartDrawer();
    renderWishlistDrawer();
  }
});

/* ==========================================================================
           3. BACKGROUND FLOATING PETALS CANVAS FX
           ========================================================================== */
const canvas = document.getElementById("petalsCanvas");
const ctx = canvas.getContext("2d");
let petals = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Petal {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = -20;
    this.size = Math.random() * 8 + 4;
    this.speedY = Math.random() * 1.5 + 0.8;
    this.speedX = Math.random() * 1 - 0.5;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 2 - 1;
    this.opacity = Math.random() * 0.6 + 0.2;
    this.color = Math.random() > 0.35 ? "#7B1025" : "#D4AF37";
  }
  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.y * 0.01) + this.speedX;
    this.rotation += this.rotationSpeed;
    if (this.y > canvas.height + 20) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 40; i++) {
  petals.push(new Petal());
}

function animatePetals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  petals.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animatePetals);
}

window.onload = function () {
  animatePetals();
  renderBouquets();
  updateBadges();
  initGSAP();
};

/* ==========================================================================
           4. RENDER CATALOG GRID & FILTERING
           ========================================================================== */
const bouquetGrid = document.getElementById("bouquetGrid");

function renderBouquets() {
  bouquetGrid.innerHTML = "";

  const filtered = BOUQUET_DATA.filter((item) => {
    const matchesCategory =
      state.currentFilter === "all" || item.category === state.currentFilter;
    const matchesPrice = item.price <= state.maxPrice;
    return matchesCategory && matchesPrice;
  });

  if (filtered.length === 0) {
    bouquetGrid.innerHTML = `
                    <div class="col-span-full text-center py-16 text-silk/50">
                        <i class="fa-solid fa-leaf text-4xl mb-3 text-gold/40"></i>
                        <p class="text-sm">No floral arrangements found matching your selected price filter.</p>
                    </div>
                `;
    return;
  }

  filtered.forEach((item) => {
    const isLiked = state.wishlist.some((w) => w.id === item.id);

    const card = document.createElement("div");
    card.className =
      "glass-card rounded-2xl overflow-hidden group flex flex-col justify-between relative";
    card.innerHTML = `
                    <button onclick="toggleWishlist(${item.id}, event)" class="absolute top-4 right-4 z-20 w-9 h-9 rounded-full glass-panel flex items-center justify-center text-silk/80 hover:text-gold transition-colors ${isLiked ? "text-gold" : ""}">
                        <i class="${isLiked ? "fa-solid" : "fa-regular"} fa-heart text-sm"></i>
                    </button>

                    <div class="relative h-72 overflow-hidden cursor-pointer" onclick="openProductModal(${item.id})">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                        <div class="absolute inset-0 bg-gradient-to-t from-burgundy-950/80 via-transparent to-transparent opacity-60"></div>
                        <span class="absolute bottom-3 left-3 px-3 py-1 glass-panel text-[10px] uppercase tracking-wider text-gold font-medium rounded-full border border-gold/20">
                            ${item.badge}
                        </span>
                    </div>

                    <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                            <div class="flex items-center justify-between mb-1">
                                <h3 onclick="openProductModal(${item.id})" class="font-serif text-xl text-silk hover:text-gold transition-colors cursor-pointer">${item.name}</h3>
                                <span class="text-gold font-serif text-lg font-medium">${formatPrice(item.price)}</span>
                            </div>
                            <p class="text-[11px] text-silk/60 line-clamp-2 font-light">${item.description}</p>
                        </div>

                        <div class="pt-2 flex items-center gap-2 border-t border-gold/15">
                            <button onclick="addToCart(${item.id})" class="flex-1 py-2.5 rounded-xl bg-gold/15 border border-gold/30 text-gold hover:bg-gold hover:text-burgundy-950 font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2">
                                <i class="fa-solid fa-bag-shopping"></i>
                                <span>Add To Cart</span>
                            </button>
                            <button onclick="openProductModal(${item.id})" class="p-2.5 rounded-xl glass-panel text-silk/70 hover:text-gold border border-gold/20 transition-colors" title="Quick View">
                                <i class="fa-solid fa-expand text-xs"></i>
                            </button>
                        </div>
                    </div>
                `;
    bouquetGrid.appendChild(card);
  });
}

/* Filter Tab Listeners */
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => {
      b.classList.remove(
        "active",
        "glass-panel",
        "border-gold/50",
        "text-gold",
      );
      b.classList.add("text-silk/70");
    });
    btn.classList.add("active", "glass-panel", "border-gold/50", "text-gold");
    btn.classList.remove("text-silk/70");

    state.currentFilter = btn.dataset.category;
    renderBouquets();
  });
});

/* Price Range Listener */
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
priceRange.addEventListener("input", (e) => {
  state.maxPrice = parseInt(e.target.value);
  priceValue.textContent = formatPrice(state.maxPrice);
  renderBouquets();
});

/* ==========================================================================
           5. CART & WISHLIST LOGIC
           ========================================================================== */
function addToCart(productId, customData = {}) {
  const product = BOUQUET_DATA.find((p) => p.id === productId);
  const existing = state.cart.find(
    (item) => item.id === productId && item.vase === customData.vase,
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      ...product,
      quantity: 1,
      vase: customData.vase || "handblown",
      cardMsg: customData.cardMsg || "",
      deliveryDate: customData.deliveryDate || "",
    });
  }

  saveState();
  renderCartDrawer();
  showToast(`Added "${product.name}" to your selection.`);
  openCart();
}

function updateCartQuantity(index, delta) {
  if (state.cart[index]) {
    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
    }
    saveState();
    renderCartDrawer();
  }
}

function toggleWishlist(productId, e) {
  if (e) e.stopPropagation();
  const product = BOUQUET_DATA.find((p) => p.id === productId);
  const index = state.wishlist.findIndex((w) => w.id === productId);

  if (index > -1) {
    state.wishlist.splice(index, 1);
    showToast(`Removed "${product.name}" from saved list.`);
  } else {
    state.wishlist.push(product);
    showToast(`Saved "${product.name}" to favorites.`);
  }

  saveState();
  renderBouquets();
  renderWishlistDrawer();
}

function updateBadges() {
  const cartCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartBadge = document.getElementById("cartBadge");
  if (cartCount > 0) {
    cartBadge.textContent = cartCount;
    cartBadge.classList.remove("hidden");
  } else {
    cartBadge.classList.add("hidden");
  }

  const wishlistCount = state.wishlist.length;
  const wishlistBadge = document.getElementById("wishlistBadge");
  if (wishlistCount > 0) {
    wishlistBadge.textContent = wishlistCount;
    wishlistBadge.classList.remove("hidden");
  } else {
    wishlistBadge.classList.add("hidden");
  }
}

function renderCartDrawer() {
  const container = document.getElementById("cartItemsList");
  if (state.cart.length === 0) {
    container.innerHTML = `
                    <div class="text-center py-16 text-silk/40 space-y-3">
                        <i class="fa-solid fa-bag-shopping text-4xl text-gold/30"></i>
                        <p class="text-sm">Your floral selection is empty.</p>
                        <a href="#collections" onclick="closeCart()" class="inline-block text-xs uppercase tracking-widest text-gold underline pt-2">Explore Catalog</a>
                    </div>
                `;
  } else {
    container.innerHTML = state.cart
      .map(
        (item, idx) => `
                    <div class="flex space-x-4 bg-burgundy-950/70 p-3.5 rounded-2xl border border-gold/15 items-center">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl border border-gold/20">
                        <div class="flex-1">
                            <h4 class="font-serif text-sm text-silk">${item.name}</h4>
                            <p class="text-xs text-gold font-serif mt-0.5">${formatPrice(item.price)}</p>
                            ${item.deliveryDate ? `<p class="text-[10px] text-silk/50">Delivery: ${item.deliveryDate}</p>` : ""}
                            
                            <div class="flex items-center space-x-2 mt-2">
                                <button onclick="updateCartQuantity(${idx}, -1)" class="w-5 h-5 rounded bg-burgundy-800 text-silk text-xs flex items-center justify-center hover:bg-gold hover:text-burgundy-950">-</button>
                                <span class="text-xs text-silk font-medium px-2">${item.quantity}</span>
                                <button onclick="updateCartQuantity(${idx}, 1)" class="w-5 h-5 rounded bg-burgundy-800 text-silk text-xs flex items-center justify-center hover:bg-gold hover:text-burgundy-950">+</button>
                            </div>
                        </div>
                        <button onclick="updateCartQuantity(${idx}, -${item.quantity})" class="text-silk/40 hover:text-red-400 text-xs p-2">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                `,
      )
      .join("");
  }
  const subtotal = state.cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const discountAmt = subtotal * state.discountRate;
  const total = subtotal - discountAmt;

  document.getElementById("cartSubtotal").textContent = formatPrice(subtotal);
  document.getElementById("cartTotal").textContent = formatPrice(total);
}

function renderWishlistDrawer() {
  const container = document.getElementById("wishlistItemsList");
  if (state.wishlist.length === 0) {
    container.innerHTML = `
                    <div class="text-center py-16 text-silk/40 space-y-3">
                        <i class="fa-regular fa-heart text-4xl text-gold/30"></i>
                        <p class="text-sm">No saved arrangements.</p>
                    </div>
                `;
  } else {
    container.innerHTML = state.wishlist
      .map(
        (item) => `
                    <div class="flex items-center justify-between bg-burgundy-950/70 p-3.5 rounded-2xl border border-gold/15">
                        <div class="flex items-center space-x-3">
                            <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-xl">
                            <div>
                                <h4 class="font-serif text-sm text-silk">${item.name}</h4>
                                <p class="text-xs text-gold font-serif">${formatPrice(item.price)}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button onclick="addToCart(${item.id})" class="p-2.5 bg-gold/20 text-gold hover:bg-gold hover:text-burgundy-950 rounded-xl text-xs" title="Move to Cart">
                                <i class="fa-solid fa-bag-shopping"></i>
                            </button>
                            <button onclick="toggleWishlist(${item.id})" class="p-2 text-silk/40 hover:text-red-400 rounded-xl text-xs">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>
                `,
      )
      .join("");
  }
}

/* ==========================================================================
           6. DRAWER CONTROLS & PROMO CODES
           ========================================================================== */
const cartDrawer = document.getElementById("cartDrawer");
const wishlistDrawer = document.getElementById("wishlistDrawer");

function openCart() {
  renderCartDrawer();
  cartDrawer.classList.remove("pointer-events-none", "opacity-0");
  cartDrawer
    .querySelector(".drawer-slide")
    .classList.remove("translate-x-full");
}

function closeCart() {
  cartDrawer.querySelector(".drawer-slide").classList.add("translate-x-full");
  setTimeout(() => {
    cartDrawer.classList.add("pointer-events-none", "opacity-0");
  }, 300);
}

function openWishlist() {
  renderWishlistDrawer();
  wishlistDrawer.classList.remove("pointer-events-none", "opacity-0");
  wishlistDrawer
    .querySelector(".drawer-slide")
    .classList.remove("translate-x-full");
}

function closeWishlist() {
  wishlistDrawer
    .querySelector(".drawer-slide")
    .classList.add("translate-x-full");
  setTimeout(() => {
    wishlistDrawer.classList.add("pointer-events-none", "opacity-0");
  }, 300);
}

document.getElementById("openCartBtn").addEventListener("click", openCart);
document.getElementById("closeCartBtn").addEventListener("click", closeCart);
document.getElementById("cartBackdrop").addEventListener("click", closeCart);

document
  .getElementById("openWishlistBtn")
  .addEventListener("click", openWishlist);
document
  .getElementById("closeWishlistBtn")
  .addEventListener("click", closeWishlist);
document
  .getElementById("wishlistBackdrop")
  .addEventListener("click", closeWishlist);

document.getElementById("applyPromoBtn").addEventListener("click", () => {
  const code = document.getElementById("promoInput").value.trim().toUpperCase();
  const msg = document.getElementById("promoMessage");

  if (code === "MAISON10") {
    state.discountRate = 0.1;
    msg.textContent = "10% Maison VIP Discount Applied!";
    msg.classList.remove("hidden", "text-red-400");
    msg.classList.add("text-gold");
  } else {
    msg.textContent = "Invalid promo code.";
    msg.classList.remove("hidden", "text-gold");
    msg.classList.add("text-red-400");
  }
  renderCartDrawer();
});

/* ==========================================================================
           7. PRODUCT DETAIL MODAL & ADD-ONS
           ========================================================================== */
const productModal = document.getElementById("productModal");

function openProductModal(id) {
  const item = BOUQUET_DATA.find((p) => p.id === id);
  if (!item) return;

  state.selectedProduct = item;

  document.getElementById("modalProductImg").src = item.image;
  document.getElementById("modalProductTitle").textContent = item.name;
  document.getElementById("modalProductPrice").textContent = formatPrice(
    item.price,
  );
  document.getElementById("modalProductBadge").textContent = item.badge;
  document.getElementById("modalProductDesc").textContent = item.description;
  document.getElementById("modalStemCount").textContent = item.stemCount;
  document.getElementById("modalFragrance").textContent = item.aroma;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById("deliveryDatePicker").value = tomorrow
    .toISOString()
    .split("T")[0];

  productModal.classList.remove("pointer-events-none", "opacity-0");
}

function closeProductModal() {
  productModal.classList.add("pointer-events-none", "opacity-0");
}

document
  .getElementById("closeProductModalBtn")
  .addEventListener("click", closeProductModal);
document.getElementById("modalAddToCartBtn").addEventListener("click", () => {
  if (state.selectedProduct) {
    const vase = document.getElementById("modalVaseOption").value;
    const cardMsg = document.getElementById("modalCardMsg").value;
    const dateVal = document.getElementById("deliveryDatePicker").value;

    addToCart(state.selectedProduct.id, {
      vase,
      cardMsg,
      deliveryDate: dateVal,
    });
    closeProductModal();
  }
});

/* ==========================================================================
           8. BESPOKE CONCIERGE WIZARD LOGIC
           ========================================================================== */
let conciergeData = { occasion: "", palette: "" };

function selectConciergeOption(type, value) {
  conciergeData[type] = value;

  if (type === "occasion") {
    document.getElementById("step1Content").classList.add("hidden");
    document.getElementById("step2Content").classList.remove("hidden");
    document.getElementById("wizardStepText").textContent =
      "Step 2 of 3: Botanical Color Palette";
    document
      .getElementById("dot2")
      .classList.replace("bg-burgundy-800", "bg-gold");
  } else if (type === "palette") {
    document.getElementById("step2Content").classList.add("hidden");
    document.getElementById("step3Content").classList.remove("hidden");
    document.getElementById("wizardStepText").textContent =
      "Step 3 of 3: Tailored Recommendation";
    document
      .getElementById("dot3")
      .classList.replace("bg-burgundy-800", "bg-gold");

    // Determine Recommendation
    let recItem = BOUQUET_DATA[0];
    if (value === "blush") recItem = BOUQUET_DATA[1];
    if (value === "gold") recItem = BOUQUET_DATA[3];
    if (conciergeData.occasion === "wedding") recItem = BOUQUET_DATA[2];

    document.getElementById("conciergeResult").innerHTML = `
                    <img src="${recItem.image}" class="w-32 h-32 object-cover rounded-2xl border border-gold/30">
                    <div class="space-y-2 text-left flex-1">
                        <span class="text-[10px] uppercase tracking-widest text-gold font-semibold">${recItem.badge}</span>
                        <h4 class="font-serif text-2xl text-silk">${recItem.name}</h4>
                        <p class="text-xs text-silk/70 font-light">${recItem.description}</p>
                        <div class="pt-2 flex items-center justify-between">
                            <span class="text-gold font-serif text-xl">${formatPrice(recItem.price)}</span>
                            <button onclick="addToCart(${recItem.id})" class="px-5 py-2 bg-gold text-burgundy-950 font-medium text-xs rounded-xl hover:bg-gold-light transition-colors uppercase">Select Arrangement</button>
                        </div>
                    </div>
                `;
  }
}

function resetConcierge() {
  conciergeData = { occasion: "", palette: "" };
  document.getElementById("step3Content").classList.add("hidden");
  document.getElementById("step1Content").classList.remove("hidden");
  document.getElementById("wizardStepText").textContent =
    "Step 1 of 3: Select Occasion";
  document
    .getElementById("dot2")
    .classList.replace("bg-gold", "bg-burgundy-800");
  document
    .getElementById("dot3")
    .classList.replace("bg-gold", "bg-burgundy-800");
}

/* ==========================================================================
           9. SEARCH OVERLAY & MOBILE MENU
           ========================================================================== */
const searchModal = document.getElementById("searchModal");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

document.getElementById("openSearchBtn").addEventListener("click", () => {
  searchModal.classList.remove("pointer-events-none", "opacity-0");
  searchInput.focus();
});

document.getElementById("closeSearchBtn").addEventListener("click", () => {
  searchModal.classList.add("pointer-events-none", "opacity-0");
});

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();

  if (!query) {
    searchResults.innerHTML =
      '<p class="text-silk/50 text-center py-8 text-sm">Type to explore our boutique floral catalog...</p>';
    return;
  }

  const matches = BOUQUET_DATA.filter(
    (b) =>
      b.name.toLowerCase().includes(query) ||
      b.description.toLowerCase().includes(query),
  );

  if (matches.length === 0) {
    searchResults.innerHTML =
      '<p class="text-silk/50 text-center py-8 text-sm">No floral arrangements match your search query.</p>';
  } else {
    searchResults.innerHTML = matches
      .map(
        (item) => `
                    <div onclick="openProductModal(${item.id}); searchModal.classList.add('pointer-events-none', 'opacity-0')" class="flex items-center space-x-4 p-3 rounded-2xl hover:bg-burgundy-900 border border-transparent hover:border-gold/20 cursor-pointer transition-colors">
                        <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-xl">
                        <div class="flex-1">
                            <h4 class="font-serif text-sm text-silk">${item.name}</h4>
                            <p class="text-xs text-silk/50">${item.badge}</p>
                        </div>
                        <span class="text-gold font-serif text-sm">${formatPrice(item.price)}</span>
                    </div>
                `,
      )
      .join("");
  }
});

const mobileMenu = document.getElementById("mobileMenu");
document.getElementById("mobileMenuBtn").addEventListener("click", () => {
  mobileMenu.classList.remove("pointer-events-none", "opacity-0");
});
document.getElementById("closeMobileMenuBtn").addEventListener("click", () => {
  mobileMenu.classList.add("pointer-events-none", "opacity-0");
});
document.querySelectorAll(".mobile-nav-link").forEach((l) => {
  l.addEventListener("click", () => {
    mobileMenu.classList.add("pointer-events-none", "opacity-0");
  });
});

/* ==========================================================================
           10. TOAST NOTIFICATIONS & CHECKOUT SIMULATION
           ========================================================================== */
function showToast(message) {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className =
    "glass-panel px-5 py-3 rounded-2xl border border-gold/40 text-silk text-xs flex items-center space-x-3 shadow-2xl transition-all transform translate-y-4 opacity-0";
  toast.innerHTML = `
                <i class="fa-solid fa-circle-check text-gold"></i>
                <span>${message}</span>
            `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("translate-y-4", "opacity-0");
  }, 10);

  setTimeout(() => {
    toast.classList.add("translate-y-4", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

document.getElementById("newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("newsletterSuccess").classList.remove("hidden");
  e.target.reset();
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (state.cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }
  closeCart();
  document.getElementById("orderRefNum").textContent =
    `#MR-${Math.floor(1000 + Math.random() * 9000)}`;
  document
    .getElementById("checkoutModal")
    .classList.remove("pointer-events-none", "opacity-0");
  state.cart = [];
  saveState();
});

function closeCheckoutModal() {
  document
    .getElementById("checkoutModal")
    .classList.add("pointer-events-none", "opacity-0");
}

/* ==========================================================================
           11. GSAP ANIMATIONS & SCROLL TRIGGER
           ========================================================================== */
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from("#navbar", {
    y: -100,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
  });

  gsap.from("#collections h2", {
    scrollTrigger: "#collections",
    y: 30,
    opacity: 0,
    duration: 0.9,
  });

  gsap.from("#rouge-prive img", {
    scrollTrigger: "#rouge-prive",
    scale: 0.9,
    opacity: 0,
    duration: 1.2,
    ease: "power2.out",
  });
}
// Scroll to Top Functionality
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    // إظهار الزر عند النزول أكثر من 300 بكسل
    scrollToTopBtn.classList.remove("opacity-0", "pointer-events-none");
    scrollToTopBtn.classList.add("opacity-100", "pointer-events-auto");
  } else {
    // إخفاء الزر عند العودة للأعلى
    scrollToTopBtn.classList.add("opacity-0", "pointer-events-none");
    scrollToTopBtn.classList.remove("opacity-100", "pointer-events-auto");
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // صعود ناعم وسلس
  });
});
