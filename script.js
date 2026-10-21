
"use strict";

// ==========================================
// BIRYANI BLISS - RESTAURANT CONFIGURATION
// ==========================================

const RESTAURANT = {
  name: "Biryani Bliss",

  // Replace these demo details with verified details.
  address: "Jharsuguda, Odisha, India",
  phone: "9114681680",
  whatsappNumber: "9114681680",
  zomatoUrl: "",

  // Use the exact address of the real restaurant.
  mapQuery: "Jharsuguda, Odisha, India"
};

// ==========================================
// INDIAN FOOD MENU
// Prices are examples for the demo website.
// ==========================================

const menu = [
  {
    id: 1,
    name: "Hyderabadi Chicken Dum Biryani",
    category: "Biryani",
    price: 249,
    vegetarian: false,
    description: "Fragrant basmati rice, tender chicken and aromatic dum spices.",
    image: "https://i.pinimg.com/1200x/93/36/00/9336004aaec4e5e852fbac853dfa13cd.jpg"
  },
  {
    id: 2,
    name: "Royal Mutton Biryani",
    category: "Biryani",
    price: 349,
    vegetarian: false,
    description: "A rich, royal-style biryani layered with fragrant rice and spices.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=85"
  },
  {
    
    
    id: 3,
    name: "Paneer Dum Biryani",
   
    price: 219,
    vegetarian: true,
    description: "Basmati rice, paneer and a flavourful blend of Indian masalas.",
    image: "https://i.pinimg.com/736x/66/8a/14/668a146466ef2df0cb8611c3f1206964.jpg"
  },
  {
    id: 4,
    name: "Classic Veg Biryani",
    category: "Biryani",
    price: 179,
    vegetarian: true,
    description: "Seasonal vegetables, aromatic basmati rice and whole spices.",
    image: "https://i.pinimg.com/736x/7d/3c/5f/7d3c5fa45884ac4f66ce95f5586ad0fc.jpg"
  },
  {
    id: 5,
    name: "Chicken Seekh Kebab",
    category: "Starters",
    price: 229,
    vegetarian: false,
    description: "Indian-style spiced kebabs served with mint chutney.",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 6,
    name: "Paneer Tikka",
    category: "Starters",
    price: 199,
    vegetarian: true,
    description: "Spiced paneer with smoky flavours and traditional seasoning.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 7,
    name: "Butter Chicken",
    category: "Main Course",
    price: 279,
    vegetarian: false,
    description: "Tender chicken in a rich tomato and butter gravy.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 8,
    name: "Butter Naan",
    category: "Breads",
    price: 35,
    vegetarian: true,
    description: "Soft Indian bread finished with butter.",
    image: "https://i.pinimg.com/736x/e7/2b/52/e72b52f0aaa60ad695eb8026e26986c2.jpg"
  },
  {
    id: 9,
    name: "Gulab Jamun",
    category: "Desserts",
    price: 89,
    vegetarian: true,
    description: "Soft, syrup-soaked Indian sweets served as a dessert.",
    image: "https://i.pinimg.com/736x/9d/e3/1a/9de31acf6c888e75efc734565ca67cfb.jpg"
  },
  {
    id: 10,
    name: "Mango Lassi",
    category: "Drinks",
    price: 99,
    vegetarian: true,
    description: "A chilled, creamy mango and yoghurt drink.",
    image: "https://i.pinimg.com/736x/28/d3/9d/28d39d72021912f7a12c7ac8248752be.jpg"
  },
  {
    id: 11,
    name: "chocoloate shake",
    category: "Drinks",
    price: 109,
    vegetarian: true,
    description: "A chilled, creamy chocolate and milk drink.",
    image: "https://i.pinimg.com/1200x/1b/5f/26/1b5f2657567cc771932f765078db8ba1.jpg"
  }
];

// ==========================================
// CART STORAGE
// ==========================================

const CART_KEY = "biryaniBlissCartV1";

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "{}");

    if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
      return {};
    }

    const result = {};

    for (const [id, quantity] of Object.entries(saved)) {
      const item = menu.find(food => food.id === Number(id));

      if (
        item &&
        Number.isInteger(quantity) &&
        quantity > 0 &&
        quantity <= 99
      ) {
        result[id] = quantity;
      }
    }

    return result;
  } catch {
    return {};
  }
}

let cart = loadCart();
let selectedCategory = "All";
let searchTerm = "";
let toastTimer;

const menuGrid = document.getElementById("menuGrid");
const menuMessage = document.getElementById("menuMessage");
const menuSearch = document.getElementById("menuSearch");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

const money = amount =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

// ==========================================
// NOTIFICATIONS
// ==========================================

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("visible");

  toastTimer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2500);
}

// ==========================================
// DISPLAY MENU
// ==========================================

function renderMenu() {
  const filtered = menu.filter(item => {
    const matchesCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory;

    const searchableText =
      `${item.name} ${item.category} ${item.description}`.toLowerCase();

    return matchesCategory && searchableText.includes(searchTerm);
  });

  menuGrid.replaceChildren();

  if (filtered.length === 0) {
    menuMessage.textContent =
      "No dishes found. Try another search or category.";
    return;
  }

  menuMessage.textContent = "";

  filtered.forEach(item => {
    const article = document.createElement("article");
    article.className = "food-card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "food-image";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name;
    image.loading = "lazy";

    image.addEventListener("error", () => {
      image.alt = `${item.name} photo unavailable`;
      image.style.display = "none";
    }, { once: true });

    const category = document.createElement("span");
    category.className = "food-category";
    category.textContent = item.category;

    imageWrap.append(image, category);

    const info = document.createElement("div");
    info.className = "food-info";

    const heading = document.createElement("h3");
    heading.textContent = item.name;

    const dietary = document.createElement("small");
    dietary.style.color = "#73766e";
    dietary.style.fontSize = "11px";

    if (item.vegetarian) {
      dietary.innerHTML =
        '<span class="veg-dot"></span>Vegetarian';
    } else {
      dietary.textContent = "Non-vegetarian";
    }

    const description = document.createElement("p");
    description.textContent = item.description;

    const bottom = document.createElement("div");
    bottom.className = "food-bottom";

    const price = document.createElement("span");
    price.className = "food-price";
    price.textContent = money(item.price);

    const addButton = document.createElement("button");
    addButton.className = "add-button";
    addButton.type = "button";
    addButton.textContent = "+";
    addButton.setAttribute("aria-label", `Add ${item.name} to cart`);
    addButton.addEventListener("click", () => addToCart(item.id));

    bottom.append(price, addButton);
    info.append(heading, dietary, description, bottom);
    article.append(imageWrap, info);
    menuGrid.append(article);
  });
}

// ==========================================
// CART TOTALS
// ==========================================

function getCartCount() {
  return Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0
  );
}

function getCartTotal() {
  return Object.entries(cart).reduce((total, [id, quantity]) => {
    const item = menu.find(food => food.id === Number(id));
    return total + (item ? item.price * quantity : 0);
  }, 0);
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    showToast("Cart could not be saved in this browser.");
  }
}

function addToCart(id) {
  const item = menu.find(food => food.id === id);
  if (!item) return;

  if ((cart[id] || 0) >= 99) {
    showToast("Maximum quantity reached.");
    return;
  }

  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  showToast(`${item.name} added to your cart.`);
}

function changeQuantity(id, change) {
  const next = (cart[id] || 0) + change;

  if (next <= 0) {
    delete cart[id];
  } else if (next <= 99) {
    cart[id] = next;
  } else {
    showToast("Maximum quantity reached.");
    return;
  }

  saveCart();
  renderCart();
}

// ==========================================
// DISPLAY CART
// ==========================================

function renderCart() {
  cartCount.textContent = getCartCount();
  cartItems.replaceChildren();

  const entries = Object.entries(cart).filter(
    ([id, quantity]) =>
      quantity > 0 &&
      menu.some(item => item.id === Number(id))
  );

  if (entries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-cart";
    empty.textContent =
      "Your cart is empty. Let's add something delicious!";
    cartItems.append(empty);
  }

  entries.forEach(([id, quantity]) => {
    const item = menu.find(food => food.id === Number(id));

    const row = document.createElement("div");
    row.className = "cart-row";

    const info = document.createElement("div");

    const name = document.createElement("h3");
    name.textContent = item.name;

    const unitPrice = document.createElement("p");
    unitPrice.textContent = `${money(item.price)} each`;

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", `Remove one ${item.name}`);
    decrease.addEventListener("click", () =>
      changeQuantity(item.id, -1)
    );

    const count = document.createElement("span");
    count.textContent = quantity;

    const increase = document.createElement("button");
    increase.type = "button";
    increase.textContent = "+";
    increase.setAttribute("aria-label", `Add one ${item.name}`);
    increase.addEventListener("click", () =>
      changeQuantity(item.id, 1)
    );

    controls.append(decrease, count, increase);
    info.append(name, unitPrice, controls);

    const lineTotal = document.createElement("strong");
    lineTotal.textContent = money(item.price * quantity);

    row.append(info, lineTotal);
    cartItems.append(row);
  });

  cartTotal.textContent = money(getCartTotal());
}

// ==========================================
// OPEN AND CLOSE CART
// ==========================================

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("visible");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
  document.getElementById("closeCart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("visible");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
  document.getElementById("openCart").focus();
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.getElementById("clearCart").addEventListener("click", () => {
  cart = {};
  saveCart();
  renderCart();
  showToast("Cart cleared.");
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cartDrawer.classList.contains("open")) {
    closeCart();
  }
});

// ==========================================
// CATEGORY FILTERS AND SEARCH
// ==========================================

document.getElementById("categories").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  selectedCategory = button.dataset.category;

  document.querySelectorAll(".category").forEach(category => {
    const active = category === button;
    category.classList.toggle("active", active);
    category.setAttribute("aria-pressed", String(active));
  });

  renderMenu();
});

menuSearch.addEventListener("input", () => {
  searchTerm = menuSearch.value.trim().toLowerCase();
  renderMenu();
});

// ==========================================
// RESTAURANT CONTACT AND LOCATION
// ==========================================

function configureRestaurant() {
  document.title = `${RESTAURANT.name} | The Royal Taste of Biryani`;

  const address = document.getElementById("restaurantAddress");
  const phone = document.getElementById("restaurantPhone");
  const callLink = document.getElementById("callLink");
  const directionsLink = document.getElementById("directionsLink");
  const mapFrame = document.getElementById("mapFrame");
  const zomatoButton = document.getElementById("zomatoButton");
  const whatsappButton = document.getElementById("whatsappButton");

  address.textContent = RESTAURANT.address;

  const location = encodeURIComponent(
    RESTAURANT.mapQuery || RESTAURANT.address
  );

  mapFrame.src =
    `https://www.google.com/maps?q=${location}&output=embed`;

  directionsLink.href =
    `https://www.google.com/maps/dir/?api=1&destination=${location}`;

  if (RESTAURANT.phone) {
    phone.textContent = RESTAURANT.phone;
    callLink.href =
      `tel:${RESTAURANT.phone.replace(/[^\d+]/g, "")}`;
    callLink.hidden = false;
  } else {
    phone.textContent = "9114681680,9468376332";
    callLink.hidden = true;
  }

  if (RESTAURANT.zomatoUrl) {
    try {
      const url = new URL(RESTAURANT.zomatoUrl);

      if (
        url.protocol === "https:" &&
        (url.hostname === "zomato.com" ||
         url.hostname.endsWith(".zomato.com"))
      ) {
        zomatoButton.href = url.href;
        zomatoButton.hidden = false;
      } else {
        zomatoButton.hidden = true;
      }
    } catch {
      zomatoButton.hidden = true;
    }
  } else {
    zomatoButton.hidden = true;
  }

  const whatsappDigits =
    RESTAURANT.whatsappNumber.replace(/\D/g, "");

  if (/^\d{10,15}$/.test(whatsappDigits)) {
    whatsappButton.href = `https://wa.me/${whatsappDigits}`;
    whatsappButton.hidden = false;
  } else {
    whatsappButton.hidden = true;
  }
}

// ==========================================
// MOBILE NAVIGATION
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});

navigation.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

// ==========================================
// CHECKOUT ENQUIRY
// This demo does not submit a real order.
// ==========================================

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (getCartCount() === 0) {
    showToast("Please add a dish to your cart first.");
    return;
  }

  const digits = RESTAURANT.whatsappNumber.replace(/\D/g, "");

  if (!/^\d{10,15}$/.test(digits)) {
    showToast("Demo cart only. Configure WhatsApp to send an enquiry.");
    return;
  }

  const lines = Object.entries(cart).map(([id, quantity]) => {
    const item = menu.find(food => food.id === Number(id));
    return `${item.name} x ${quantity} = ${money(item.price * quantity)}`;
  });

  const message = [
    `Hello ${RESTAURANT.name}, I would like to enquire about:`,
    "",
    ...lines,
    "",
    `Item subtotal: ${money(getCartTotal())}`,
    "",
    "Please confirm availability, delivery charges and final price."
  ].join("\n");

  const url =
    `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
});

// ==========================================
// INITIALISE WEBSITE
// ==========================================

document.getElementById("year").textContent =
  new Date().getFullYear();

configureRestaurant();
renderMenu();
renderCart();

document.getElementById("copyCoupon")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("NAWABI10");
    alert("Coupon NAWABI10 copied!");
  } catch {
    alert("Your coupon code is NAWABI10");
  }
});

document.getElementById("copyCoupon2")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("FEAST75");
    alert("Coupon FEAST75 copied!");
  } catch {
    alert("Your coupon code is FEAST75");
  }
});
