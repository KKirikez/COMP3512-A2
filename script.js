import data from "./data/data-pretty.json" with { type: "json" };

function renderView(view) {
  const views = document.querySelectorAll(".view");
  views.forEach((v) => {
    v.style.display = "none";
  });

  const viewElement = document.querySelector(`#${view}`);
  if (viewElement) {
    viewElement.style.display = "block";
  }
}

function homeView() {
  renderView("homeView");
}
function browserView() {
  renderView("browserView");
  let products = data.products;

  const itemBoxes = document.querySelector("#itemBoxes");
  products.slice(0, 20).forEach((product) => {
    console.log(product);
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
  renderView("cartView");
}
function checkoutView() {
  // Could be cool to add, not in assignment spec
  renderView("checkoutView");
}
function aboutView() {
  renderView("aboutView");
}

document.addEventListener("DOMContentLoaded", () => {
  const homeButton = document.querySelector("#homeButton");
  const logoButton = document.querySelector("#logo");
  const browserButton = document.querySelector("#browserButton");
  const cartButton = document.querySelector("#cartButton");
  const checkoutButton = document.querySelector("#checkoutButton");
  const aboutButton = document.querySelector("#aboutButton");

  homeButton.addEventListener("click", homeView);
  logoButton.addEventListener("click", homeView);
  browserButton.addEventListener("click", browserView);
  cartButton.addEventListener("click", cartView);
  checkoutButton.addEventListener("click", checkoutView);
  aboutButton.addEventListener("click", aboutView);
});
