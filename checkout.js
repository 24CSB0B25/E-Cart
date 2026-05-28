/* ═══════════════════════════════════════════════════════════════
   CHECKOUT.JS — Checkout Form, Order Placement, Confirmation
   ═══════════════════════════════════════════════════════════════ */

// ── RENDER CHECKOUT ───────────────────────────────────────────
function renderCheckout() {
  if (!State.currentUser) { navigate('login'); return; }
  if (State.cart.length === 0) { navigate('cart'); return; }

  const { subtotal, shipping, tax, total } = getCartTotals();
  const itemCount = State.cart.reduce((s, i) => s + i.qty, 0);

  // Build order summary items
  const summaryItemsHtml = State.cart.map(item => {
    const p = State.products.find(pr => pr.id === item.productId);
    if (!p) return '';
    return `
      <div class="summary-item">
        <img class="summary-item-img" src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/44?text=?'"/>
        <span class="summary-item-name">${p.name} × ${item.qty}</span>
        <span class="summary-item-price">${formatPrice(p.price * item.qty)}</span>
      </div>`;
  }).join('');

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="checkout-wrap fade-in">
      <h1 class="checkout-title">Checkout</h1>

      <div class="checkout-steps">
        <div class="checkout-step done">✓ Cart</div>
        <div class="checkout-step active">📦 Delivery</div>
        <div class="checkout-step">💳 Payment</div>
        <div class="checkout-step">✅ Confirm</div>
      </div>

      <div class="checkout-layout">
        <!-- LEFT: FORMS -->
        <div style="display:flex; flex-direction:column; gap:20px;">

          <!-- DELIVERY ADDRESS -->
          <div class="checkout-form-section">
            <div class="form-section-title"><span>📦</span> Delivery Address</div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="co-fname">First Name *</label>
                <input class="form-input" id="co-fname" type="text" placeholder="Rahul" value="${State.currentUser.name.split(' ')[0] || ''}" />
                <span class="form-error" id="co-fname-err"></span>
              </div>
              <div class="form-group">
                <label class="form-label" for="co-lname">Last Name *</label>
                <input class="form-input" id="co-lname" type="text" placeholder="Sharma" value="${State.currentUser.name.split(' ').slice(1).join(' ') || ''}" />
                <span class="form-error" id="co-lname-err"></span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="co-email">Email *</label>
              <input class="form-input" id="co-email" type="email" placeholder="rahul@example.com" value="${State.currentUser.email}" />
              <span class="form-error" id="co-email-err"></span>
            </div>
            <div class="form-group">
              <label class="form-label" for="co-phone">Phone Number *</label>
              <input class="form-input" id="co-phone" type="tel" placeholder="10-digit mobile number" maxlength="10" />
              <span class="form-error" id="co-phone-err"></span>
            </div>
            <div class="form-group">
              <label class="form-label" for="co-address">Street Address *</label>
              <input class="form-input" id="co-address" type="text" placeholder="House No., Street, Area" />
              <span class="form-error" id="co-address-err"></span>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="co-city">City *</label>
                <input class="form-input" id="co-city" type="text" placeholder="Mumbai" />
                <span class="form-error" id="co-city-err"></span>
              </div>
              <div class="form-group">
                <label class="form-label" for="co-state">State *</label>
                <select class="form-input" id="co-state">
                  <option value="">Select State</option>
                  ${['Andhra Pradesh','Assam','Bihar','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal'].map(s => `<option>${s}</option>`).join('')}
                </select>
                <span class="form-error" id="co-state-err"></span>
              </div>
            </div>
            <div class="form-group" style="max-width:200px;">
              <label class="form-label" for="co-pincode">Pincode *</label>
              <input class="form-input" id="co-pincode" type="text" placeholder="400001" maxlength="6" />
              <span class="form-error" id="co-pincode-err"></span>
            </div>
          </div>

          <!-- PAYMENT -->
          <div class="checkout-form-section">
            <div class="form-section-title"><span>💳</span> Payment Method</div>
            <div class="payment-options" id="payment-options">
              <label class="payment-option selected" id="pay-upi-label">
                <input type="radio" name="payment" value="upi" checked id="pay-upi" />
                <span class="payment-icon">📱</span>
                <div>
                  <div class="payment-label">UPI / PhonePe / GPay</div>
                  <div style="font-size:.75rem; color:var(--clr-text3);">Pay using any UPI app</div>
                </div>
              </label>
              <label class="payment-option" id="pay-card-label">
                <input type="radio" name="payment" value="card" id="pay-card" />
                <span class="payment-icon">💳</span>
                <div>
                  <div class="payment-label">Credit / Debit Card</div>
                  <div style="font-size:.75rem; color:var(--clr-text3);">Visa, Mastercard, RuPay</div>
                </div>
              </label>
              <label class="payment-option" id="pay-netbanking-label">
                <input type="radio" name="payment" value="netbanking" id="pay-netbanking" />
                <span class="payment-icon">🏦</span>
                <div>
                  <div class="payment-label">Net Banking</div>
                  <div style="font-size:.75rem; color:var(--clr-text3);">All major banks supported</div>
                </div>
              </label>
              <label class="payment-option" id="pay-cod-label">
                <input type="radio" name="payment" value="cod" id="pay-cod" />
                <span class="payment-icon">💵</span>
                <div>
                  <div class="payment-label">Cash on Delivery</div>
                  <div style="font-size:.75rem; color:var(--clr-text3);">Pay when you receive</div>
                </div>
              </label>
            </div>
            <span class="form-error" id="co-payment-err" style="margin-top:8px; display:block;"></span>
          </div>
        </div>

        <!-- RIGHT: ORDER SUMMARY -->
        <div class="order-summary">
          <div class="order-summary-title">Order Summary</div>
          <div class="summary-items">${summaryItemsHtml}</div>
          <hr class="summary-divider"/>
          <div class="summary-row"><span>Subtotal (${itemCount} items)</span><span>${formatPrice(subtotal)}</span></div>
          <div class="summary-row"><span>Delivery</span><span>${shipping === 0 ? '<span style="color:var(--clr-green)">FREE</span>' : formatPrice(shipping)}</span></div>
          <div class="summary-row"><span>GST (18%)</span><span>${formatPrice(tax)}</span></div>
          <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
          <button class="btn-place-order" id="place-order-btn" onclick="placeOrder()">
            🔒 Place Order — ${formatPrice(total)}
          </button>
          <div style="font-size:.72rem; color:var(--clr-text3); text-align:center; line-height:1.5;">
            By placing this order, you agree to E-Cart's Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>`;

  // Payment option toggle style
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
      radio.closest('.payment-option').classList.add('selected');
    });
  });
}

// ── VALIDATE CHECKOUT FORM ────────────────────────────────────
function validateCheckout() {
  let valid = true;
  const fields = [
    { id: 'co-fname',    errId: 'co-fname-err',    label: 'First name',    minLen: 2 },
    { id: 'co-lname',    errId: 'co-lname-err',    label: 'Last name',     minLen: 2 },
    { id: 'co-email',    errId: 'co-email-err',    label: 'Email',         email: true },
    { id: 'co-phone',    errId: 'co-phone-err',    label: 'Phone',         phone: true },
    { id: 'co-address',  errId: 'co-address-err',  label: 'Address',       minLen: 5 },
    { id: 'co-city',     errId: 'co-city-err',     label: 'City',          minLen: 2 },
    { id: 'co-state',    errId: 'co-state-err',    label: 'State',         required: true },
    { id: 'co-pincode',  errId: 'co-pincode-err',  label: 'Pincode',       pincode: true },
  ];

  fields.forEach(f => {
    const el = document.getElementById(f.id);
    const err = document.getElementById(f.errId);
    el.classList.remove('error');
    err.textContent = '';
    const val = el.value.trim();

    if (f.required && !val) {
      err.textContent = `${f.label} is required.`; el.classList.add('error'); valid = false;
    } else if (f.minLen && val.length < f.minLen) {
      err.textContent = `${f.label} must be at least ${f.minLen} characters.`; el.classList.add('error'); valid = false;
    } else if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      err.textContent = 'Please enter a valid email.'; el.classList.add('error'); valid = false;
    } else if (f.phone && !/^\d{10}$/.test(val)) {
      err.textContent = 'Enter a valid 10-digit number.'; el.classList.add('error'); valid = false;
    } else if (f.pincode && !/^\d{6}$/.test(val)) {
      err.textContent = 'Enter a valid 6-digit pincode.'; el.classList.add('error'); valid = false;
    }
  });

  return valid;
}

// ── PLACE ORDER ───────────────────────────────────────────────
function placeOrder() {
  if (!validateCheckout()) {
    showToast('Please fill all required fields correctly.', 'error');
    return;
  }

  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'upi';
  const { total, subtotal, shipping, tax } = getCartTotals();

  const address = {
    name: document.getElementById('co-fname').value.trim() + ' ' + document.getElementById('co-lname').value.trim(),
    phone: document.getElementById('co-phone').value.trim(),
    address: document.getElementById('co-address').value.trim(),
    city: document.getElementById('co-city').value.trim(),
    state: document.getElementById('co-state').value.trim(),
    pincode: document.getElementById('co-pincode').value.trim(),
  };

  // Build order items snapshot
  const items = State.cart.map(ci => {
    const p = State.products.find(pr => pr.id === ci.productId);
    return { productId: ci.productId, name: p?.name || '', image: p?.image || '', price: p?.price || 0, qty: ci.qty };
  });

  const order = {
    id: 'ORD-' + Date.now(),
    userId: State.currentUser.id,
    items,
    address,
    paymentMethod,
    subtotal, shipping, tax, total,
    status: 'placed',
    placedAt: Date.now(),
  };

  // Animate button
  const btn = document.getElementById('place-order-btn');
  if (btn) { btn.textContent = '⏳ Placing Order…'; btn.disabled = true; }

  setTimeout(() => {
    State.orders.unshift(order);
    saveOrders();

    // Clear cart
    State.cart = [];
    saveCart();

    navigate('order-confirm', { order });
  }, 1200);
}

// ── RENDER ORDER CONFIRM ──────────────────────────────────────
function renderOrderConfirm(order) {
  if (!order) { navigate('orders'); return; }
  const app = document.getElementById('app');

  const itemsHtml = order.items.map(i => `
    <div class="confirm-item">
      <img src="${i.image}" alt="${i.name}" onerror="this.src='https://via.placeholder.com/40?text=?'"/>
      <span style="flex:1">${i.name} × ${i.qty}</span>
      <strong>${formatPrice(i.price * i.qty)}</strong>
    </div>`).join('');

  const payIcons = { upi: '📱', card: '💳', netbanking: '🏦', cod: '💵' };

  app.innerHTML = `
    <div class="order-confirm-wrap fade-in">
      <div class="confirm-icon">🎉</div>
      <h1 class="confirm-title">Order Placed Successfully!</h1>
      <p class="confirm-sub">
        Thank you, <strong>${State.currentUser?.name?.split(' ')[0] || 'Customer'}</strong>!
        Your order has been placed and will be delivered in 3–5 business days.
      </p>

      <div class="confirm-order-box">
        <div class="confirm-order-id">Order ID</div>
        <div class="confirm-order-num">${order.id}</div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:16px; font-size:.82rem;">
          <div>
            <div style="color:var(--clr-text3); margin-bottom:3px;">Deliver to</div>
            <div style="color:var(--clr-text); font-weight:600;">${order.address.name}</div>
            <div style="color:var(--clr-text2);">${order.address.address}, ${order.address.city}</div>
            <div style="color:var(--clr-text2);">${order.address.state} – ${order.address.pincode}</div>
          </div>
          <div>
            <div style="color:var(--clr-text3); margin-bottom:3px;">Payment</div>
            <div style="color:var(--clr-text); font-weight:600;">${payIcons[order.paymentMethod] || '💳'} ${order.paymentMethod.toUpperCase()}</div>
            <div style="color:var(--clr-green); font-weight:700; margin-top:6px;">Total: ${formatPrice(order.total)}</div>
          </div>
        </div>

        <div class="confirm-items-list">${itemsHtml}</div>
      </div>

      <div style="background:var(--clr-surface); border:1px solid var(--clr-green); border-radius:var(--radius-md); padding:16px; margin-bottom:28px; display:flex; align-items:center; gap:12px;">
        <span style="font-size:1.6rem;">🚚</span>
        <div style="font-size:.85rem; color:var(--clr-text2);">
          <strong style="color:var(--clr-green);">Expected Delivery:</strong>
          ${formatDate(Date.now() + 4 * 24 * 60 * 60 * 1000)} – ${formatDate(Date.now() + 6 * 24 * 60 * 60 * 1000)}
        </div>
      </div>

      <div class="confirm-btns">
        <button class="btn-primary" onclick="navigate('orders')">View My Orders</button>
        <button class="btn-secondary" onclick="navigate('home')">Continue Shopping</button>
      </div>
    </div>`;
}
