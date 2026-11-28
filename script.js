import data from "./data/data-pretty.json" with { type: "json" };

let cart = [];

function renderView(view) {
  const views = document.querySelectorAll(".view");
  views.forEach((v) => {
    v.classList.add("hidden");
  });
  const viewElement = document.querySelector(`#${view}`);
  if (viewElement) {
    viewElement.classList.remove("hidden");
  }
}

function updateCartCount() {
  const cartCount = document.querySelector("#cartCount");
  cartCount.textContent = cart.length;
  cartCount.classList.toggle("hidden", cart.length === 0);
}

function createStars(rating) {
  const stars = document.createElement("div");
  stars.classList.add("stars");
  stars.title = `${rating} / 5`;
  const rounded = Math.round(rating * 2) / 2;

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("img");
    star.classList.add("star");
    if (rounded >= i) {
      star.src = "assets/star_full.svg";
      star.classList.add("fullStar");
    } else if (rounded >= i - 0.5) {
      star.src = "assets/star_half.svg";
    } else {
      star.src = "assets/star.svg";
    }
    star.alt = "";
    stars.appendChild(star);
  }
  return stars;
}

function pickRandomProducts(count) {
  const remaining = [...data.products];
  const picked = [];
  while (picked.length < count && remaining.length > 0) {
    const index = Math.floor(Math.random() * remaining.length);
    picked.push(remaining.splice(index, 1)[0]);
  }
  return picked;
}

function createFeaturedCard(product) {
  const card = document.createElement("div");
  const label = document.createElement("span");
  const image = document.createElement("img");
  const title = document.createElement("h3");
  const price = document.createElement("p");
  const buyButton = document.createElement("button");

  card.classList.add("featuredCard");
  label.classList.add("featuredLabel");
  image.classList.add("featuredImage");
  buyButton.classList.add("buyNowButton");

  label.textContent = "FEATURED";
  image.src = product.images[0];
  image.alt = product.title;
  title.textContent = product.brand
    ? `The ${product.title} from ${product.brand}!`
    : `The ${product.title}!`;
  price.textContent = `$${product.price.toFixed(2)}`;
  buyButton.textContent = "BUY IT NOW";
  buyButton.addEventListener("click", () => {
    cart.push(product);
    cartView();
  });

  card.appendChild(label);
  card.appendChild(image);
  card.appendChild(title);
  card.appendChild(price);
  card.appendChild(createStars(product.rating));
  card.appendChild(buyButton);
  return card;
}

function homeView() {
  renderView("homeView");
  const featuredSection = document.querySelector("#featured");
  featuredSection.innerHTML = "";
  pickRandomProducts(3).forEach((product) => {
    featuredSection.appendChild(createFeaturedCard(product));
  });
}
function getCategories() {
  return [...new Set(data.products.map((p) => p.category))];
}

function formatCategory(category) {
  let text = category.replace(/-/g, " ");
  text = text.charAt(0).toUpperCase() + text.slice(1);
  return text.replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildCategoryFilters() {
  const categoryFilters = document.querySelector("#categoryFilters");
  getCategories().forEach((category) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = category;
    checkbox.addEventListener("change", browseView);
    label.classList.add("categoryFilter");
    label.appendChild(checkbox);
    label.append(formatCategory(category));
    categoryFilters.appendChild(label);
  });
}

function updateRatingDisplay() {
  const value = Number(document.querySelector("#ratingSlider").value);
  const ratingDisplay = document.querySelector("#ratingDisplay");
  ratingDisplay.innerHTML = "";
  ratingDisplay.appendChild(createStars(value));
  if (value != 5) {
    ratingDisplay.append(`${value}+ stars`);
  } else {
    ratingDisplay.append(`${value} stars`);
  }
}

function browseView() {
  console.log("browse");
  renderView("browseView");

  const selectedCategories = [
    ...document.querySelectorAll("#categoryFilters input:checked"),
  ].map((input) => input.value);
  let products = data.products;
  if (selectedCategories.length > 0) {
    products = products.filter((p) => selectedCategories.includes(p.category));
  }
  const minRating = Number(document.querySelector("#ratingSlider").value);
  products = products.filter((p) => Math.round(p.rating * 2) / 2 >= minRating);
  const minPrice = document.querySelector("#minPrice").value;
  const maxPrice = document.querySelector("#maxPrice").value;
  if (minPrice !== "") {
    products = products.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice !== "") {
    products = products.filter((p) => p.price <= Number(maxPrice));
  }
  const search = document
    .querySelector("#sidebarSearch")
    .value.trim()
    .toLowerCase();
  if (search !== "") {
    products = products.filter((p) => p.title.toLowerCase().includes(search));
  }

  const itemBoxes = document.querySelector("#itemBoxes");
  itemBoxes.innerHTML = "";

  const sortValue = document.querySelector("#sortSelect").value;
  if (sortValue) {
    const sortedBox = document.createElement("div");
    sortedBox.classList.add("categoryBox");
    sortProducts(products, sortValue).forEach((product) => {
      sortedBox.appendChild(createProductCard(product));
    });
    itemBoxes.appendChild(sortedBox);
    return;
  }

  const categories = getCategories();
  const categoryBoxes = new Map();
  categories.forEach((category) => {
    const categoryBox = document.createElement("div");
    const categoryHeader = document.createElement("h2");
    categoryBox.classList.add("categoryBox");
    categoryHeader.classList.add("categoryHeader");
    categoryHeader.textContent = formatCategory(category);
    categoryBox.appendChild(categoryHeader);
    categoryBoxes.set(category, categoryBox);
    itemBoxes.appendChild(categoryBox);
  });
  console.log(categories);

  products.forEach((product) => {
    categoryBoxes.get(product.category).appendChild(createProductCard(product));
  });

  categoryBoxes.forEach((categoryBox) => {
    if (categoryBox.childElementCount === 1) {
      categoryBox.classList.add("hidden");
    }
  });
}

const sortKeys = {
  title: (p) => p.title,
  price: (p) => p.price,
  rating: (p) => p.rating,
  stock: (p) => p.stock,
  size: (p) => p.dimensions.width * p.dimensions.height * p.dimensions.depth,
};

function sortProducts(products, sortValue) {
  const [key, direction] = sortValue.split("-");
  const getValue = sortKeys[key];
  return [...products].sort((a, b) => {
    const x = getValue(a);
    const y = getValue(b);
    const result = typeof x === "string" ? x.localeCompare(y) : x - y;
    return direction === "desc" ? -result : result;
  });
}

function createProductCard(product) {
  const productCard = document.createElement("div");
  const img = document.createElement("img");
  const productCardBody = document.createElement("div");
  const cardTitle = document.createElement("h3");
  const brand = document.createElement("p");
  const stars = createStars(product.rating);
  const priceRow = document.createElement("div");
  const price = document.createElement("p");
  const addButton = document.createElement("button");

  brand.classList.add("brand");
  priceRow.classList.add("priceRow");
  brand.textContent = product.brand ?? "";

  priceRow.appendChild(price);
  priceRow.appendChild(addButton);
  productCardBody.appendChild(cardTitle);
  productCardBody.appendChild(brand);
  productCardBody.appendChild(stars);
  productCardBody.appendChild(priceRow);

  img.src = product.images[0];
  img.alt = product.title;
  const cartIcon = document.createElement("img");
  cartIcon.src = "assets/cart_add.svg";
  cartIcon.alt = "";
  cartIcon.classList.add("icon");
  addButton.textContent = "Add to cart ";
  addButton.appendChild(cartIcon);

  addButton.addEventListener("click", (e) => {
    e.stopPropagation();
    cart.push(product);
    updateCartCount();
    console.log(cart);
  });

  productCard.addEventListener("click", () => {
    showSingleProduct(product);
  });

  img.classList.add("productImage");
  productCard.classList.add("productCard");
  productCardBody.classList.add("productCardBody");
  addButton.classList.add("addButton");

  cardTitle.textContent = product.title;

  price.textContent = `$${product.price.toFixed(2)}`;

  productCard.appendChild(img);
  productCard.appendChild(productCardBody);
  return productCard;
}
let currentProduct = null;
let currentImageIndex = 0;

function showProductImage(step) {
  const images = currentProduct.images;
  currentImageIndex =
    (currentImageIndex + step + images.length) % images.length;
  const image = document.querySelector("#singleProductImage");
  image.src = images[currentImageIndex];
  image.alt = currentProduct.title;
}

function addSingleProductToCart() {
  const input = document.querySelector("#singleProductPurchaseBox input");
  const quantity = input.value.trim() === "" ? 1 : Number(input.value);
  if (quantity < 1) {
    return;
  }
  for (let i = 0; i < quantity; i++) {
    cart.push(currentProduct);
  }
  updateCartCount();
  input.value = "";
}

function showSingleProduct(product) {
  currentProduct = product;
  currentImageIndex = 0;

  document.querySelector("#singleProductBreadcrumb").textContent =
    `Home > ${formatCategory(product.category)} > ${product.title}`;

  showProductImage(0);
  const singleImage = product.images.length <= 1;
  document
    .querySelector("#singleProductImageNext")
    .classList.toggle("hidden", singleImage);
  document
    .querySelector("#singleProductImageBack")
    .classList.toggle("hidden", singleImage);

  document.querySelector("#singleProductTitle").textContent = product.title;
  document.querySelector("#singleProductBrand").textContent =
    product.brand ?? "";
  document.querySelector("#singleProductPrice").textContent =
    `$${product.price.toFixed(2)}`;

  const sku = document.querySelector("#singleProductSku");
  sku.innerHTML = "";
  sku.append(`SKU: ${product.sku}`);
  sku.appendChild(createStars(product.rating));

  const categories = document.querySelector("#singleProductCategories");
  categories.innerHTML = "";
  product.tags.forEach((tag) => {
    const tagText = document.createElement("p");
    tagText.textContent = formatCategory(tag);
    categories.appendChild(tagText);
  });

  document.querySelector("#singleProductDescription").textContent =
    product.description;
  document.querySelector("#singleProductPurchaseBox input").value = "";

  document.querySelector("#singleProductView").showModal();
}
function groupCart() {
  const grouped = new Map();
  cart.forEach((item) => {
    if (grouped.has(item.id)) {
      grouped.get(item.id).quantity++;
    } else {
      grouped.set(item.id, { product: item, quantity: 1 });
    }
  });
  return grouped;
}
const shippingRates = {
  standard: { canada: 10, american: 15, international: 20 },
  express: { canada: 25, american: 25, international: 30 },
  priority: { canada: 35, american: 50, international: 50 },
};

function updateSummary() {
  const shippingType = document.querySelector("#shippingSelect").value;
  const country = document.querySelector("#countrySelect").value;

  const merchandise = cart.reduce((total, item) => total + item.price, 0);
  let shipping = shippingRates[shippingType][country];
  if (merchandise > 500 || cart.length === 0) {
    shipping = 0;
  }
  const tax = country === "canada" ? merchandise * 0.05 : 0;
  const total = merchandise + shipping + tax;

  document.querySelector("#summaryMerchandise").textContent =
    `$${merchandise.toFixed(2)}`;
  document.querySelector("#summaryShipping").textContent =
    `$${shipping.toFixed(2)}`;
  document.querySelector("#summaryTax").textContent = `$${tax.toFixed(2)}`;
  document.querySelector("#summaryTotal").textContent = `$${total.toFixed(2)}`;
  document.querySelector("#checkoutButton").disabled = cart.length === 0;
}

function checkout() {
  if (cart.length === 0) {
    return;
  }
  cart = [];
  updateCartCount();
  alert("Your order was placed successfully!");
  homeView();
}

function cartView() {
  renderView("shoppingCartView");
  updateCartCount();
  const cartList = document.querySelector("#cartList");
  cartList.innerHTML = "";

  updateSummary();

  const grouped = groupCart();

  grouped.forEach(({ product, quantity }) => {
    const row = document.createElement("div");
    const removeButton = document.createElement("button");
    const thumbnail = document.createElement("img");
    const title = document.createElement("span");
    const price = document.createElement("span");
    const qtyBox = document.createElement("div");
    const qty = document.createElement("span");
    const addButton = document.createElement("button");
    const subtotal = document.createElement("span");
    const removeAllButton = document.createElement("button");

    removeAllButton.textContent = "Remove all";
    removeAllButton.classList.add("removeAllButton");
    removeAllButton.addEventListener("click", () => {
      cart = cart.filter((item) => item.id !== product.id);
      cartView();
    });

    row.classList.add("cartRow");
    qtyBox.classList.add("qtyBox");
    removeButton.classList.add("qtyButton");
    addButton.classList.add("qtyButton");
    thumbnail.classList.add("thumbnail");

    removeButton.textContent = "-";
    removeButton.addEventListener("click", () => {
      const index = cart.findLastIndex((item) => item.id === product.id);
      if (index !== -1) {
        cart.splice(index, 1);
      }
      cartView();
    });
    addButton.textContent = "+";
    addButton.addEventListener("click", () => {
      cart.push(product);
      cartView();
    });
    thumbnail.src = product.images[0];
    thumbnail.alt = product.title;
    title.textContent = product.title;
    price.textContent = `$${product.price.toFixed(2)}`;
    qty.textContent = quantity;
    subtotal.textContent = `$${(product.price * quantity).toFixed(2)}`;

    qtyBox.appendChild(removeButton);
    qtyBox.appendChild(qty);
    qtyBox.appendChild(addButton);

    row.appendChild(thumbnail);
    row.appendChild(title);
    row.appendChild(price);
    row.appendChild(qtyBox);
    row.appendChild(subtotal);
    row.appendChild(removeAllButton);
    cartList.appendChild(row);
  });
}
function openAbout() {
  document.querySelector("#aboutDialog").showModal();
}

document.addEventListener("DOMContentLoaded", () => {
  const homeButton = document.querySelector("#homeButton");
  const logoButton = document.querySelector("#logo");
  const browseButton = document.querySelector("#browseButton");
  const cartButton = document.querySelector("#cartButton");
  const aboutButton = document.querySelector("#aboutButton");

  homeButton.addEventListener("click", homeView);
  logoButton.addEventListener("click", homeView);
  browseButton.addEventListener("click", browseView);
  buildCategoryFilters();
  updateRatingDisplay();
  document.querySelector("#ratingSlider").addEventListener("input", () => {
    updateRatingDisplay();
    browseView();
  });
  const sidebarSearch = document.querySelector("#sidebarSearch");
  sidebarSearch.addEventListener("input", browseView);
  document.querySelector("#minPrice").addEventListener("input", browseView);
  document.querySelector("#maxPrice").addEventListener("input", browseView);
  document.querySelector("#sortSelect").addEventListener("change", browseView);
  document.querySelector("#clearSort").addEventListener("click", () => {
    document.querySelector("#sortSelect").value = "";
    document
      .querySelectorAll("#categoryFilters input")
      .forEach((input) => (input.checked = false));
    document.querySelector("#ratingSlider").value = 1;
    document.querySelector("#minPrice").value = "";
    document.querySelector("#maxPrice").value = "";
    sidebarSearch.value = "";
    updateRatingDisplay();
    browseView();
  });
  cartButton.addEventListener("click", cartView);
  const aboutDialog = document.querySelector("#aboutDialog");
  const closeAbout = document.querySelector("#closeAbout");
  const cartDialog = document.querySelector("#cartPopup");

  cartButton.addEventListener("mouseenter", () => {
    if (cart.length > 0) {
      cartDialog.show();
      const cartPopupItems = document.querySelector("#cartPopupItems");
      cartPopupItems.innerHTML = "";
      groupCart().forEach(({ product: item, quantity }) => {
        const itemBox = document.createElement("div");
        itemBox.classList.add("popupItemBox");
        const thumbnail = document.createElement("img");
        const title = document.createElement("p");
        const count = document.createElement("p");
        thumbnail.src = item.images[0];
        title.textContent = item.title;
        count.textContent = `x${quantity}`;

        itemBox.appendChild(thumbnail);
        itemBox.appendChild(title);
        itemBox.appendChild(count);
        cartPopupItems.appendChild(itemBox);
      });
    }
  });
  cartButton.addEventListener("mouseleave", () => {
    cartDialog.close();
  });

  aboutButton.addEventListener("click", openAbout);
  closeAbout.addEventListener("click", () => aboutDialog.close());
  aboutDialog.addEventListener("click", (e) => {
    if (e.target === aboutDialog) {
      aboutDialog.close();
    }
  });
  document
    .querySelector("#singleProductImageNext")
    .addEventListener("click", () => showProductImage(1));
  document
    .querySelector("#singleProductImageBack")
    .addEventListener("click", () => showProductImage(-1));
  document
    .querySelector("#singleProductPurchaseBox button")
    .addEventListener("click", addSingleProductToCart);
  const singleProductView = document.querySelector("#singleProductView");
  singleProductView.addEventListener("click", (e) => {
    if (e.target === singleProductView) {
      singleProductView.close();
    }
  });

  document
    .querySelector("#shippingSelect")
    .addEventListener("change", updateSummary);
  document
    .querySelector("#countrySelect")
    .addEventListener("change", updateSummary);
  document.querySelector("#checkoutButton").addEventListener("click", checkout);

  homeView();
});
