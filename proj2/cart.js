
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
  
  // Update cart count in header
  function updateCartCount() {
    let cart = getCart();
    let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    $("#number-cart").text(totalQuantity);
  }
  
  // Remove item from cart
  function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    setCart(cart);
    renderCart();
    updateCartCount();
    showToast('Item removed', 'fa-trash');
  }
  
  // Update item quantity
  function updateQuantity(productId, newQty) {
    let cart = getCart();
    let item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity = newQty;
      setCart(cart);
      renderCart();
      updateCartCount();
      showToast('Quantity updated', 'fa-check-circle');
    }
  }
  
  // Calculate subtotal
  function calculateSubtotal(cart) {
    return cart.reduce((sum, item) => {
      return sum + (item.price) * item.quantity;
    }, 0);
  }
  
  // Render cart
  function renderCart() {
    let cart = getCart();
    const $container = $("#cart-items-container");
    const $subtotal = $("#subtotal");
    const $shipping = $("#shipping");
    const $total = $("#total");
  
    $container.empty();
  
    if (cart.length === 0) {
      $container.append(`<p>Your cart is empty!</p>`);
      $subtotal.text('$0.00');
      $shipping.text('$0.00');
      $total.text('$0.00');
      return;
    }
  
    const shippingCost = 10.00;
    let subtotalValue = calculateSubtotal(cart);
    let totalValue = subtotalValue + shippingCost;
  
    cart.forEach(item => {
      const lineTotal = item.price * item.quantity;
  
      const cardHtml = `
        <div class="cart-item-card" data-id="${item.id}">
          <div class="cart-item-header">
            <img src="images/${item.image_id}" alt="${item.title}">
            <div class="cart-item-details">
              <h4>${item.title}</h4>
              <span>$${item.price.toFixed(2)}</span>
            </div>
          </div>
          <div class="cart-item-body">
            <input type="number" class="quantity-input" min="1" value="${item.quantity}">
            <span>$${lineTotal.toFixed(2)}</span>
            <button class="remove-item-btn"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `;
      $container.append(cardHtml);
    });
  
    $subtotal.text(`$${subtotalValue.toFixed(2)}`);
    $shipping.text(`$${shippingCost.toFixed(2)}`);
    $total.text(`$${totalValue.toFixed(2)}`);
  
    // Remove
    $(".remove-item-btn").off("click").on("click", function () {
      let productId = parseInt($(this).closest(".cart-item-card").data("id"), 10);
      removeFromCart(productId);
    });
  
    // Update qty
    $(".quantity-input").off("change").on("change", function () {
      let newQty = parseInt($(this).val(), 10);
      if (isNaN(newQty) || newQty < 1) {
        showToast('Invalid quantity', 'fa-exclamation-circle');
        $(this).val(1);
        newQty = 1;
      }
      let productId = parseInt($(this).closest(".cart-item-card").data("id"), 10);
      updateQuantity(productId, newQty);
    });
  }
  
  $(document).ready(function () {
    renderCart();
    updateCartCount();
  });
  