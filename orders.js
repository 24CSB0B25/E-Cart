/* ═══════════════════════════════════════════════════════════════
   ORDERS.JS — Order History Page
   ═══════════════════════════════════════════════════════════════ */

function renderOrders() {
  if (!State.currentUser) { navigate('login'); return; }

  // Reload latest orders from storage
  State.orders = LS.get('ecart_orders_' + State.currentUser.id, []);

  const app = document.getElementById('app');

  if (State.orders.length === 0) {
    app.innerHTML = `
      <div class="orders-wrap fade-in">
        <h1 class="orders-title">Your Orders</h1>
        <div class="no-orders">
          <div class="no-orders-icon">📦</div>
          <h3 style="margin-bottom:8px; font-size:1.3rem;">No orders yet</h3>
          <p style="color:var(--clr-text3); margin-bottom:24px;">You haven't placed any orders yet. Start shopping!</p>
          <button class="btn-primary" onclick="navigate('home')">Shop Now</button>
        </div>
      </div>`;
    return;
  }

  const statusConfig = {
    placed:     { label: 'Order Placed',  cls: 'status-placed',     icon: '📋' },
    processing: { label: 'Processing',    cls: 'status-processing',  icon: '⚙️' },
    shipped:    { label: 'Shipped',        cls: 'status-processing',  icon: '🚚' },
    delivered:  { label: 'Delivered',     cls: 'status-delivered',   icon: '✅' },
  };

  const payLabels = { upi: '📱 UPI', card: '💳 Card', netbanking: '🏦 Net Banking', cod: '💵 Cash on Delivery' };

  const ordersHtml = State.orders.map(order => {
    const statusInfo = statusConfig[order.status] || statusConfig['placed'];
    const itemsHtml = order.items.map(item => `
      <div class="order-product-row">
        <img class="order-product-img" src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/64?text=?'"/>
        <div style="flex:1;">
          <div class="order-product-name">${item.name}</div>
          <div class="order-product-qty">Qty: ${item.qty}</div>
        </div>
        <div class="order-product-price">${formatPrice(item.price * item.qty)}</div>
      </div>`).join('');

    return `
      <div class="order-card fade-in">
        <div class="order-card-header">
          <div class="order-meta">
            <span class="order-meta-label">Order Placed</span>
            <span class="order-meta-val">${formatDate(order.placedAt)}</span>
          </div>
          <div class="order-meta">
            <span class="order-meta-label">Total</span>
            <span class="order-meta-val">${formatPrice(order.total)}</span>
          </div>
          <div class="order-meta">
            <span class="order-meta-label">Payment</span>
            <span class="order-meta-val">${payLabels[order.paymentMethod] || order.paymentMethod}</span>
          </div>
          <div class="order-meta">
            <span class="order-meta-label">Deliver to</span>
            <span class="order-meta-val">${order.address.name}</span>
          </div>
          <div class="order-status ${statusInfo.cls}">${statusInfo.icon} ${statusInfo.label}</div>
        </div>

        <div class="order-card-body">${itemsHtml}</div>

        <div class="order-card-footer">
          <div style="font-size:.82rem; color:var(--clr-text3);">
            Order ID: <span style="font-weight:600; color:var(--clr-orange);">${order.id}</span>
          </div>
          <div class="order-total">Total: ${formatPrice(order.total)}</div>
        </div>
      </div>`;
  }).join('');

  app.innerHTML = `
    <div class="orders-wrap fade-in">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
        <div>
          <h1 class="orders-title" style="margin-bottom:4px;">Your Orders</h1>
          <p style="font-size:.85rem; color:var(--clr-text3);">${State.orders.length} order${State.orders.length !== 1 ? 's' : ''} placed</p>
        </div>
        <button class="btn-primary" onclick="navigate('home')" style="padding:10px 22px; font-size:.9rem;">Continue Shopping</button>
      </div>
      ${ordersHtml}
    </div>`;
}
