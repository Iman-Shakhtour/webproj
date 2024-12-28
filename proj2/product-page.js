
function showToast(message, iconClass = "fa-check-circle") {
  const toast = $(`
    <div class="toast">
      <i class="fa-solid ${iconClass}"></i>
      <span>${message}</span>
    </div>
  `);
  $("#toastBox").append(toast);
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

function updateCartCount() {
  let cart = getCart();
  let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  $("#number-cart").text(totalQuantity);
}

// Add to cart
function addToCart(product, quantity = 1) {
  let cart = getCart();
  let existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  setCart(cart);
  updateCartCount();
  showToast("Product added to cart");
}

$(document).ready(function () {
  updateCartCount();

  let urlParams = new URLSearchParams(window.location.search);
  let productId = parseInt(urlParams.get("id"), 10);

  $.ajax({
    url: "product.json",
    dataType: "json",
    success: function (data) {
      let allProducts = data.all || [];
      let product = allProducts.find((p) => p.id === productId);
      if (!product) {
        $(".grid.product").html("<p>Product not found.</p>");
        return;
      }
      $("#product-image").attr("src", `images/${product.image_id}`);
      $("#product-title").text(product.title);
      $("#product-price").text(`$${product.price.toFixed(2)}`);
      let catText = "Other";
      if (product.category === "men") catText = "Men";
      else if (product.category === "women") catText = "Women";
      $("#product-category").text(catText);
      $("#product-description").text(product.description);

      $("#add-to-cart-btn").on("click", function () {
        let qtyVal = parseInt($("#quantity").val(), 10);
        if (isNaN(qtyVal) || qtyVal < 1) {
          qtyVal = 1;
        }
        addToCart(product, qtyVal);
      });
    },
    error: function (err) {
      console.error("Error loading product data:", err);
    },
  });
});
