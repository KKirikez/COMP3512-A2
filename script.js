import data from "./data/data-pretty.json" with { type: "json" };

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
      alert(
        `You clicked on ${product.title}, which has an ID of ${product.id}`,
      );
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
    itemBoxes.appendChild(productCard);
  });
}
function cartView() {
  renderView("shoppingCartView");
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
