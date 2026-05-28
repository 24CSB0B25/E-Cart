/* ═══════════════════════════════════════════════════════════════
   CART.JS — Add, Remove, Update, Render Cart Page
   ═══════════════════════════════════════════════════════════════ */

// ── ADD TO CART ───────────────────────────────────────────────
function addToCart(productId, qty = 1, showToastMsg = true) {
  const product = State.products.find(p => p.id === productId);
  if (!product) return;

  const existing = State.cart.find(i => i.productId === productId);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, 10);
  } else {
    State.cart.push({ productId, qty: Math.min(qty, 10) });
  }

  saveCart();

  if (showToastMsg) {
    showToast(`"${product.name.slice(0, 36)}…" added to cart 🛒`, 'success');
  }

  // Animate cart button
  const cartBtn = document.getElementById('nav-cart-btn');
  cartBtn.style.transform = 'scale(1.2)';
  setTimeout(() => cartBtn.style.transform = '', 250);
}

// ── REMOVE FROM CART ──────────────────────────────────────────
function removeFromCart(productId) {
  State.cart = State.cart.filter(i => i.productId !== productId);
  saveCart();
  if (State.currentView === 'cart') renderCart();
}

// ── UPDATE QUANTITY ───────────────────────────────────────────
function updateCartQty(productId, delta) {
  const item = State.cart.find(i => i.productId === productId);
  if (!item) return;
  item.qty = Math.max(1, Math.min(10, item.qty + delta));
  saveCart();
  if (State.currentView === 'cart') renderCart();
}

// ── CART TOTALS ───────────────────────────────────────────────
function getCartTotals() {
  let subtotal = 0;
  State.cart.forEach(item => {
    const product = State.products.find(p => p.id === item.productId);
    if (product) subtotal += product.price * item.qty;
  });
  const shipping = subtotal >= 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

// ── RENDER CART PAGE ──────────────────────────────────────────
function renderCart() {
  const app = document.getElementById('app');

  if (State.cart.length === 0) {
    app.innerHTML = `
      <div class="cart-wrap fade-in">
        <h1 class="cart-title">Shopping Cart</h1>
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet. Start shopping!</p>
          <button class="btn-primary" onclick="navigate('home')">Continue Shopping</button>
        </div>
      </div>`;
    return;
  }

  const { subtotal, shipping, tax, total } = getCartTotals();
  const itemCount = State.cart.reduce((s, i) => s + i.qty, 0);

  const itemsHtml = State.cart.map(item => {
    const product = State.products.find(p => p.id === item.productId);
    if (!product) return '';
    return `
      <div class="cart-item" id="cart-item-${product.id}">
        <div class="cart-item-img" onclick="navigate('product', {productId:'${product.id}'})">
          <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/110x110?text=?'"/>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name" onclick="navigate('product', {productId:'${product.id}'})">${product.name}</div>
          <div class="cart-item-cat">${product.category}</div>
          <div class="star-row" style="margin-top:2px;">${renderStars(product.rating)} <span class="review-count">(${(product.reviews||0).toLocaleString()})</span></div>
          <div style="margin-top:4px; font-size:.78rem; color:var(--clr-green);">✓ In Stock · Free Delivery</div>
          <div class="cart-item-actions">
            <div class="qty-ctrl">
              <button class="qty-btn" onclick="updateCartQty('${product.id}', -1)" aria-label="Decrease">−</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="updateCartQty('${product.id}', 1)" aria-label="Increase">+</button>
            </div>
            <button class="btn-remove-item" onclick="confirmRemoveCartItem('${product.id}', '${product.name.replace(/'/g, "\\'")}')">Remove</button>
          </div>
        </div>
        <div class="cart-item-price">${formatPrice(product.price * item.qty)}</div>
      </div>`;
  }).join('');

  app.innerHTML = `
    <div class="cart-wrap fade-in">
      <h1 class="cart-title">Shopping Cart <span style="font-size:1rem; font-weight:400; color:var(--clr-text3);">(${itemCount} item${itemCount !== 1 ? 's' : ''})</span></h1>
      <div class="cart-layout">
        <div>
          <div class="cart-items">${itemsHtml}</div>
          <div style="margin-top:16px; text-align:right; font-size:1.1rem; font-weight:700; color:var(--clr-text);">
            Subtotal (${itemCount} item${itemCount !== 1 ? 's' : ''}): <span style="color:var(--clr-white);">${formatPrice(subtotal)}</span>
          </div>
        </div>

        <div class="cart-summary">
          <div class="cart-summary-title">Order Summary</div>
          <div class="summary-row"><span>Subtotal (${itemCount} items)</span><span>${formatPrice(subtotal)}</span></div>
          <div class="summary-row"><span>Delivery</span><span>${shipping === 0 ? '<span style="color:var(--clr-green)">FREE</span>' : formatPrice(shipping)}</span></div>
          <div class="summary-row"><span>GST (18%)</span><span>${formatPrice(tax)}</span></div>
          <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
          ${subtotal < 499 ? `<div style="font-size:.75rem; color:var(--clr-gold); text-align:center;">Add ${formatPrice(499 - subtotal)} more for FREE delivery!</div>` : '<div style="font-size:.75rem; color:var(--clr-green); text-align:center;">🎉 You qualify for FREE delivery!</div>'}
          <button class="btn-checkout" onclick="requireLogin(() => navigate('checkout'))">
            Proceed to Checkout →
          </button>
          <button class="btn-secondary" style="width:100%; padding:10px; border-radius:var(--radius-xl); font-size:.9rem;" onclick="navigate('home')">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>`;
}

// ── CONFIRM REMOVE ────────────────────────────────────────────
function confirmRemoveCartItem(productId, productName) {
  openModal(
    'Remove Item',
    `Remove "<strong>${productName}</strong>" from your cart?`,
    'Remove',
    () => {
      removeFromCart(productId);
      showToast('Item removed from cart', 'info');
    }
  );
}
