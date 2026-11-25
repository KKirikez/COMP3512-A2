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

function homeView() {
  console.log("home");
  renderView("homeView");
}
function browseView() {
  console.log("browse");
  renderView("browseView");
  let products = data.products;

  const itemBoxes = document.querySelector("#itemBoxes");
  itemBoxes.innerHTML = "";

  const categories = [...new Set(data.products.map((p) => p.category))];
  const categoryBoxes = new Map();
  categories.forEach((category) => {
    const categoryBox = document.createElement("div");
    const categoryHeader = document.createElement("h2");
    categoryBox.classList.add("categoryBox");
    categoryHeader.classList.add("categoryHeader");
    let text = category.replace(/-/g, " ");
    text = text.charAt(0).toUpperCase() + text.slice(1);
    text = text.replace(/\b\w/g, (c) => c.toUpperCase());
    categoryHeader.textContent = text;
    categoryBox.appendChild(categoryHeader);
    categoryBoxes.set(category, categoryBox);
    itemBoxes.appendChild(categoryBox);
  });
  console.log(categories);

  products.slice(0, 20).forEach((product) => {
    const productCard = document.createElement("div");
    const img = document.createElement("img");
    const productCardBody = document.createElement("div");
    const cardTitle = document.createElement("h3");
    const price = document.createElement("p");
    const text = document.createElement("div");
    const addButton = document.createElement("button");

    productCard.appendChild(img);

    text.appendChild(cardTitle);
    text.appendChild(price);
    productCardBody.appendChild(text);
    productCardBody.appendChild(addButton);

    img.src = product.images[0];
    img.alt = product.title;
    addButton.textContent = "+";

    addButton.addEventListener("click", () => {
      cart.push(product);
      console.log(cart);
    });

    img.addEventListener("click", () => {
      alert(`This product has an ID of ${product.id}`);
    });

    img.classList.add("productImage");
    productCard.classList.add("productCard");
    productCardBody.classList.add("productCardBody");
    addButton.classList.add("addButton");

    cardTitle.textContent = product.title;

    price.textContent = `$${product.price.toFixed(2)}`;

    productCard.appendChild(img);
    productCard.appendChild(productCardBody);
    categoryBoxes.get(product.category).appendChild(productCard);
  });

  categoryBoxes.forEach((categoryBox) => {
    if (categoryBox.childElementCount === 1) {
      categoryBox.classList.add("hidden");
    }
  });
}
function cartView() {
  renderView("shoppingCartView");
  const cartList = document.querySelector("#cartList");
  cartList.innerHTML = "";

  const grouped = new Map();
  cart.forEach((item) => {
    if (grouped.has(item.id)) {
      grouped.get(item.id).quantity++;
    } else {
      grouped.set(item.id, { product: item, quantity: 1 });
    }
  });

  const header = document.createElement("div");
  header.classList.add("cartRow", "cartHeader");
  ["Items", "", "Price", "Quantity", "Subtotal"].forEach((label) => {
    const cell = document.createElement("span");
    cell.textContent = label;
    header.appendChild(cell);
  });
  cartList.appendChild(header);

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
    cartList.appendChild(row);
  });
}
function aboutView() {
  renderView("aboutView");
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
  cartButton.addEventListener("click", cartView);
  aboutButton.addEventListener("click", aboutView);
});
