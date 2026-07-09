// ======================================
// STYLEBOX AI — script.js (Fixed Version)
// ======================================
// NOTE: Make sure this <script> tag is placed just before </body>,
// OR add the `defer` attribute if kept in <head>. Otherwise
// document.getElementById calls below will return null and crash.

// ==============================
// DEMO DATA
// ==============================
const demoWardrobe = [
  {
    id: 1,
    name: "White T-Shirt",
    brand: "Nike",
    category: "Top",
    color: "White",
    season: "Summer",
    occasion: "Casual",
    image: "assets/images/clothes/shirt1.png",
    favorite: true,
  },
  {
    id: 2,
    name: "Black Hoodie",
    brand: "Adidas",
    category: "Top",
    color: "Black",
    season: "Winter",
    occasion: "Casual",
    image: "assets/images/clothes/shirt2.png",
    favorite: false,
  },
  {
    id: 3,
    name: "Blue Jeans",
    brand: "Levi's",
    category: "Bottom",
    color: "Blue",
    season: "Summer",
    occasion: "Casual",
    image: "assets/images/clothes/jeans1.png",
    favorite: true,
  },
  {
    id: 4,
    name: "Formal Pants",
    brand: "Zara",
    category: "Bottom",
    color: "Black",
    season: "Winter",
    occasion: "Formal",
    image: "assets/images/clothes/bottom2.png",
    favorite: false,
  },
  {
    id: 5,
    name: "White Sneakers",
    brand: "Puma",
    category: "Shoes",
    color: "White",
    season: "Summer",
    occasion: "Casual",
    image: "assets/images/clothes/shoes1.png",
    favorite: false,
  },
  {
    id: 6,
    name: "Black Boots",
    brand: "Timberland",
    category: "Shoes",
    color: "Black",
    season: "Winter",
    occasion: "Formal",
    image: "assets/images/clothes/shoes2.png",
    favorite: false,
  },
  {
    id: 7,
    name: "Silver Watch",
    brand: "Casio",
    category: "Accessory",
    color: "Silver",
    season: "Summer",
    occasion: "Formal",
    image: "assets/images/clothes/watch1.png",
    favorite: true,
  },
  {
    id: 8,
    name: "Leather Handbag",
    brand: "Gucci",
    category: "Accessory",
    color: "Brown",
    season: "Winter",
    occasion: "Party",
    image: "assets/images/clothes/accessory2.png",
    favorite: false,
  },
  {
    id: 9,
    name: "Pink Dress",
    brand: "Sapphire",
    category: "Top",
    color: "Pink",
    season: "summer",
    occasion: "casual",
    image: "assets/images/clothes/dress1.png",
    favorite: true,
  },
];

let wardrobe = JSON.parse(localStorage.getItem("wardrobe"));

if (!wardrobe || wardrobe.length === 0) {
  wardrobe = [...demoWardrobe];
  localStorage.setItem("wardrobe", JSON.stringify(wardrobe));
}

let editingId = null;
const form = document.getElementById("itemForm");
const clothesGrid = document.getElementById("clothesGrid");
const totalItems = document.getElementById("totalItems");
const totalCategories = document.getElementById("totalCategories");
const favorites = document.getElementById("favorites");
const darkBtn = document.getElementById("darkMode");
const searchInput = document.getElementById("searchInput");

// ==============================
// SAVE DATA
// ==============================
function saveData() {
  localStorage.setItem("wardrobe", JSON.stringify(wardrobe));
}

// Make sure data is persisted on very first run
if (!localStorage.getItem("wardrobe")) {
  saveData();
}

// ==============================
// UPDATE DASHBOARD
// ==============================
function updateDashboard() {
  totalItems.textContent = wardrobe.length;
  const cats = [...new Set(wardrobe.map((item) => item.category))];
  totalCategories.textContent = cats.length;
  const fav = wardrobe.filter((item) => item.favorite);
  favorites.textContent = fav.length;
}

// ==============================
// RENDER ITEMS — helpers
// Small, focused builders keep the main render loop easy to follow.
// ==============================

/** Fallback image when a wardrobe item's image fails to load. */
const DEFAULT_CLOTH_IMAGE = "assets/images/clothes/default.png";

/** HTML for the grid when the list is empty. */
function getEmptyStateHTML() {
  return `
    <div class="empty-state">
      <i class="fa-solid fa-shirt"></i>
      <h3>No Clothes Found</h3>
      <p>Add some clothing items.</p>
    </div>
  `;
}

/** Heart icon class based on favorite state. */
function getFavoriteIconClass(isFavorite) {
  return isFavorite ? "solid" : "regular";
}

/** Inner HTML for one wardrobe card (image, meta tags, action buttons). */
function buildClothCardHTML(item) {
  const heartIcon = getFavoriteIconClass(item.favorite);

  return `
    <div class="favorite" onclick="toggleFavorite(${item.id})">
      <i class="fa-${heartIcon} fa-heart"></i>
    </div>
    <div class="cloth-image">
      <img src="${item.image}" alt="${item.name}"
           onerror="this.onerror=null; this.src='${DEFAULT_CLOTH_IMAGE}';">
    </div>
    <div class="cloth-content">
      <h3>${item.name}</h3>
      <p class="brand">${item.brand}</p>
      <div class="meta">
        <span>${item.category}</span>
        <span>${item.color}</span>
        <span>${item.season}</span>
      </div>
      <div class="card-actions">
        <button class="edit-btn" onclick="editItem(${item.id})">Edit</button>
        <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
      </div>
    </div>
  `;
}

/** Creates a DOM element for a single wardrobe item. */
function createClothCard(item) {
  const card = document.createElement("div");
  card.className = "cloth-card";
  card.innerHTML = buildClothCardHTML(item);
  return card;
}

// ==============================
// RENDER ITEMS (base renderer)
// FIX #5: renamed this to renderItemsBase so we don't reassign
// a function declaration later — cleaner and safer than the
// "const oldRender = renderItems; renderItems = ..." pattern.
// ==============================
function renderItemsBase(list = wardrobe) {
  clothesGrid.innerHTML = "";

  if (list.length === 0) {
    clothesGrid.innerHTML = getEmptyStateHTML();
    updateDashboard();
    return;
  }

  list.forEach((item) => {
    clothesGrid.appendChild(createClothCard(item));
  });

  updateDashboard();
}

// ==============================
// RENDER ITEMS (public wrapper)
// Entry point for the rest of the app: render the grid, then refresh stats.
// ==============================
function renderItems(list = wardrobe) {
  renderItemsBase(list);
  updateExtraStats();
}

// ==============================
// LOAD PAGE
// ==============================
renderItems();

// ==============================
// ADD NEW ITEM
// ==============================
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("itemName").value.trim();
  const brand = document.getElementById("itemBrand").value.trim();
  const category = document.getElementById("itemCategory").value;
  const color = document.getElementById("itemColor").value.trim();
  const season = document.getElementById("itemSeason").value;
  const occasion = document.getElementById("itemOccasion").value;
  const imageInput = document.getElementById("itemImage");

  function saveItem(imageData) {
    const item = {
      id: editingId || Date.now(),
      name,
      brand,
      category,
      color,
      season,
      occasion,
      image: imageData,
      favorite: false,
    };

    if (editingId) {
      const index = wardrobe.findIndex((x) => x.id === editingId);
      item.favorite = wardrobe[index].favorite;
      wardrobe[index] = item;
      editingId = null;
    } else {
      wardrobe.push(item);
    }

    saveData();
    renderItems();
    form.reset();
    const preview = document.getElementById("preview");
    if (preview) preview.style.display = "none";
  }

  if (imageInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      saveItem(e.target.result);
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    saveItem(
      editingId
        ? wardrobe.find((x) => x.id === editingId).image
        : "assets/images/clothes/default.png",
    );
  }
});

// ==============================
// DELETE ITEM
// ==============================
function deleteItem(id) {
  const check = confirm("Delete this clothing item?");
  if (!check) return;
  wardrobe = wardrobe.filter((item) => item.id !== id);
  saveData();
  renderItems();
}

// ==============================
// EDIT ITEM
// ==============================
function editItem(id) {
  const item = wardrobe.find((x) => x.id === id);
  if (!item) return;

  editingId = id;
  document.getElementById("itemName").value = item.name;
  document.getElementById("itemBrand").value = item.brand;
  document.getElementById("itemCategory").value = item.category;
  document.getElementById("itemColor").value = item.color;
  document.getElementById("itemSeason").value = item.season;
  document.getElementById("itemOccasion").value = item.occasion;

  const preview = document.getElementById("preview");
  if (preview) {
    preview.src = item.image;
    preview.style.display = "block";
  }

  window.scrollTo({
    top: document.querySelector(".add-clothes").offsetTop - 80,
    behavior: "smooth",
  });
}

// ==============================
// FAVORITE
// ==============================
function toggleFavorite(id) {
  const item = wardrobe.find((x) => x.id === id);
  if (!item) return;
  item.favorite = !item.favorite;
  saveData();
  renderItems();
}

// ==============================
// SEARCH
// ==============================
if (searchInput) {
  searchInput.addEventListener("keyup", function () {
    const value = this.value.toLowerCase();
    const filtered = wardrobe.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.brand.toLowerCase().includes(value) ||
        item.category.toLowerCase().includes(value) ||
        item.color.toLowerCase().includes(value) ||
        item.season.toLowerCase().includes(value) ||
        item.occasion.toLowerCase().includes(value),
    );
    renderItems(filtered);
  });
}

// ==============================
// FILTER BUTTONS
// ==============================
const filterButtons = document.querySelectorAll(".filters button");
filterButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    filterButtons.forEach((b) => b.classList.remove("active"));
    this.classList.add("active");

    const category = this.innerText;
    if (category === "All") {
      renderItems();
      return;
    }

    const filtered = wardrobe.filter(
      (item) =>
        item.category === category ||
        item.season === category ||
        item.occasion === category,
    );
    renderItems(filtered);
  });
});

// ==============================
// DARK MODE
// ==============================
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light",
  );
});

// ==============================
// AI OUTFIT GENERATOR
// ==============================
const generateBtn = document.querySelector(".generate");
generateBtn.addEventListener("click", generateOutfit);

function generateOutfit() {
  const top = randomItem("Top");
  const bottom = randomItem("Bottom");
  const shoes = randomItem("Shoes");
  const accessory = randomItem("Accessory");

  const cards = document.querySelectorAll(".outfit-card");
  cards[0].innerHTML = outfitHTML(top, "👕", "Top");
  cards[1].innerHTML = outfitHTML(bottom, "👖", "Bottom");
  cards[2].innerHTML = outfitHTML(shoes, "👟", "Shoes");
  cards[3].innerHTML = outfitHTML(accessory, "⌚", "Accessory");

  showCompatibility(top, bottom, shoes);
}

// ==============================
// RANDOM ITEM
// ==============================
function randomItem(category) {
  const list = wardrobe.filter((item) => item.category === category);
  if (list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
}

// ==============================
// OUTFIT CARD — helpers
// ==============================

/** Inline styles applied to outfit preview images (matches original markup). */
const OUTFIT_IMAGE_STYLE =
  "width:100%;height:170px;object-fit:cover;border-radius:15px;";

/** Placeholder shown when a category has no matching wardrobe item. */
function buildEmptyOutfitSlotHTML(emoji, title) {
  return `<h3>${emoji}</h3><h4>${title}</h4><p>No Item</p>`;
}

/** Filled outfit slot: image, name, and color. */
function buildOutfitItemHTML(item) {
  return `
    <img src="${item.image}" alt="${item.name}"
         style="${OUTFIT_IMAGE_STYLE}"
         onerror="this.onerror=null; this.src='${DEFAULT_CLOTH_IMAGE}';">
    <h3>${item.name}</h3>
    <p>${item.color}</p>
  `;
}

// ==============================
// OUTFIT CARD
// Returns HTML for one outfit slot (filled or empty).
// ==============================
function outfitHTML(item, emoji, title) {
  if (item == null) {
    return buildEmptyOutfitSlotHTML(emoji, title);
  }
  return buildOutfitItemHTML(item);
}

// ==============================
// COMPATIBILITY SCORE
// FIX #3: old logic contradicted itself — it rewarded matching
// top/bottom colors AND matching bottom/shoes colors, but then
// rewarded a MISMATCHED top/shoes color. Now the rule is
// consistent: matching colors across all three pairs = a more
// coordinated outfit = higher score. Capped at 100.
// ==============================
function showCompatibility(top, bottom, shoes) {
  let score = 70;

  if (top && bottom && top.color === bottom.color) score += 10;
  if (bottom && shoes && bottom.color === shoes.color) score += 10;
  if (top && shoes && top.color === shoes.color) score += 10;

  score = Math.min(score, 100);

  let result = document.getElementById("matchScore");
  if (!result) {
    result = document.createElement("div");
    result.id = "matchScore";
    result.style.marginTop = "30px";
    result.style.fontSize = "22px";
    result.style.fontWeight = "700";
    document.querySelector(".outfit").appendChild(result);
  }
  result.innerHTML = `⭐ Match Score : ${score}%`;
  return score; 
}

// ==============================
// ENTER KEY SEARCH (prevent accidental form submit)
// ==============================
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && document.activeElement === searchInput) {
    e.preventDefault();
  }
});

// ==============================
// AUTO SAVE
// ==============================
window.addEventListener("beforeunload", () => {
  saveData();
});

console.log("StyleBox AI Loaded Successfully");

// ==============================
// EXTRA FEATURES
// ==============================

// Export Wardrobe Data
function exportWardrobe() {
  const data = JSON.stringify(wardrobe, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "wardrobe-data.json";
  link.click();
}

// ==============================
// IMPORT DATA
// ==============================
function importWardrobe(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      wardrobe = JSON.parse(e.target.result);
      saveData();
      renderItems();
    } catch (err) {
      alert("Invalid wardrobe file. Please upload a valid JSON export.");
    }
  };
  reader.readAsText(file);
}

// ==============================
// CLEAR ALL DATA
// ==============================
function clearWardrobe() {
  const ask = confirm("Delete all wardrobe items?");
  if (!ask) return;
  wardrobe = [];
  saveData();
  renderItems();
}

// ==============================
// SORTING
// ==============================
function sortByName() {
  wardrobe.sort((a, b) => a.name.localeCompare(b.name));
  renderItems();
}

function sortNewest() {
  wardrobe.sort((a, b) => b.id - a.id);
  renderItems();
}

// ==============================
// TOTAL COLORS / MOST USED COLOR
// ==============================
function mostUsedColor() {
  if (wardrobe.length === 0) return "-";
  const colors = {};
  wardrobe.forEach((item) => {
    colors[item.color] = (colors[item.color] || 0) + 1;
  });
  return Object.keys(colors).reduce((a, b) => (colors[a] > colors[b] ? a : b));
}

// ==============================
// UPDATE COLOR STAT
// ==============================
function updateExtraStats() {
  const colorBox = document.getElementById("popularColor");
  if (colorBox) {
    colorBox.textContent = mostUsedColor();
  }
}

// ==============================
// IMAGE PREVIEW
// ==============================
const imageInput = document.getElementById("itemImage");
if (imageInput) {
  imageInput.addEventListener("change", function () {
    const preview = document.getElementById("preview");
    if (!preview || !this.files[0]) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(this.files[0]);
  });
}

console.log("🚀 StyleBox AI Ready!");
// ==============================
// TEST EXPORTS (added for Assignment 4)
// This block only runs under Node/Jest — `module` does not exist
// in the browser, so this has zero effect on the live app.
// ==============================
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    wardrobe,
    demoWardrobe,
    randomItem,
    mostUsedColor,
    showCompatibility,
    outfitHTML,
    buildEmptyOutfitSlotHTML,
    buildOutfitItemHTML,
    getFavoriteIconClass,
  };
}