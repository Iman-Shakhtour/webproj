
let allProductsData = [];

function updateCartCount() {
  let cart = getCart();
  let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  $("#number-cart").text(totalQuantity);
}

function showToast(message, iconClass = 'fa-check-circle') {
  const toast = $(`
      <div class="toast">
          <i class="fa-solid ${iconClass}"></i>
          <span>${message}</span>
      </div>
  `);
  $('#toastBox').append(toast);

  setTimeout(() => {
      toast.fadeOut(500, () => {
          toast.remove();
      });
  }, 3000);
}

function getCart() {
  let cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

function setCart(cartArray) {
  localStorage.setItem("cart", JSON.stringify(cartArray));
}

function addToCart(product, quantity = 1) {
  let cart = getCart();
  let existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  setCart(cart);
  updateCartCount();
  showToast('Product added to cart', 'fa-check-circle');
}

function createProductCard(product) {
  return `
    <div class="custom-product-card">
      <div class="img-box">
        <a href="product.html?id=${product.id}">
          <img src="images/${product.image_id}" alt="${product.title}"/>
        </a>
        <button class="add-button" data-id="${product.id}">
          <i class="fa-solid fa-bag-shopping"></i> ADD
        </button>
      </div>
      <div class="card-info">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p class="price">$${product.price.toFixed(2)}</p>
      </div>
    </div>
  `;
}

function filterByCategory(products, category) {
  if (category === "all") return products;
  return products.filter(prod => prod.category === category);
}

$(document).ready(function () {
  updateCartCount();

  $.ajax({
    url: "product.json",
    dataType: "json",
    success: function (data) {
      allProductsData = data.all || [];

      if ($(".product-listing .product-grid").length) {
        let currentSearchTerm = "";
        let currentCategory = "all";

        function renderProducts() {
          let catFiltered = filterByCategory(allProductsData, currentCategory);

          const searched = catFiltered.filter(product =>
            product.title.toLowerCase().includes(currentSearchTerm)
          );

          const container = $(".product-listing .product-grid");
          container.empty();
          searched.forEach((p) => {
            container.append(createProductCard(p));
          });
        }

        renderProducts();

        $("#category-select").on("change", function () {
          currentCategory = $(this).val();
          renderProducts();
        });

        $("#search-bar").on("input", function () {
          currentSearchTerm = $(this).val().toLowerCase();
          renderProducts();
        });
      }

      if ($(".best-selling .product-grid").length) {
        const menSubset = allProductsData.filter(p => p.category === "men").slice(0, 2);
        const womenSubset = allProductsData.filter(p => p.category === "women").slice(0, 2);
        const featured = [...menSubset, ...womenSubset];

        const container = $(".best-selling .product-grid");
        container.empty();
        featured.forEach((p) => {
          container.append(createProductCard(p));
        });
      }
    },
    error: function (error) {
      console.error("Error loading product data:", error);
    }
  });

  $(document).on("click", ".add-button", function () {
    const productId = parseInt($(this).data("id"), 10);
    const product = allProductsData.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
    } else {
      showToast('Product not found', 'fa-exclamation-circle');
    }
  });

  $("#bars").on("click", function () {
    $("#nav-list").toggleClass("active");
  });
});
function toggleMenu() {
  let navList = document.getElementById('nav-list');
  // إذا الكلاس موجود، أحذفه، وإذا مش موجود أضيفه
  navList.classList.toggle('active');
}
