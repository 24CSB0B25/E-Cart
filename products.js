/* ═══════════════════════════════════════════════════════════════
   PRODUCTS.JS — Browse, Detail, Search, Filter
   ═══════════════════════════════════════════════════════════════ */

// ── RENDER HOME ───────────────────────────────────────────────
function renderHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="hero fade-in" id="hero-section">
      <div class="hero-content">
        <div class="hero-tag">🚀 India's Favourite Online Store</div>
        <h1>Everything You Need,<br><span>Delivered Fast</span></h1>
        <p>Shop from millions of products across Electronics, Fashion, Home, Books & More</p>
        <div class="hero-btns">
          <button class="btn-primary" onclick="document.getElementById('products-grid-section').scrollIntoView({behavior:'smooth'})">
            Shop Now →
          </button>
          <button class="btn-secondary" onclick="navigate('signup')">Join Free Today</button>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat-item"><div class="stat-num">24+</div><div class="stat-lbl">Products</div></div>
        <div class="stat-item"><div class="stat-num">5</div><div class="stat-lbl">Categories</div></div>
        <div class="stat-item"><div class="stat-num">4.7★</div><div class="stat-lbl">Avg Rating</div></div>
        <div class="stat-item"><div class="stat-num">Free</div><div class="stat-lbl">Delivery ₹499+</div></div>
      </div>
    </section>

    <div class="deals-banner fade-in">
      <div class="deals-banner-icon">🔥</div>
      <div class="deals-banner-text">
        <h3>Today's Top Deals — Up to 40% Off!</h3>
        <p>Limited time offers on Electronics, Fashion & Home products</p>
      </div>
    </div>

    <section class="products-section fade-in" id="products-grid-section">
      <div class="section-header">
        <div class="section-title" id="section-title-text">All Products</div>
        <div class="filter-bar">
          <select class="filter-select" id="sort-select">
            <option value="">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="reviews">Most Reviewed</option>
          </select>
          <select class="filter-select" id="price-filter">
            <option value="">All Prices</option>
            <option value="0-999">Under ₹999</option>
            <option value="1000-4999">₹1,000 – ₹4,999</option>
            <option value="5000-19999">₹5,000 – ₹19,999</option>
            <option value="20000-99999">₹20,000 – ₹99,999</option>
            <option value="100000-999999">₹1,00,000+</option>
          </select>
        </div>
      </div>
      <div class="product-grid" id="product-grid"></div>
    </section>`;

  renderProductGrid();

  document.getElementById('sort-select').addEventListener('change', renderProductGrid);
  document.getElementById('price-filter').addEventListener('change', renderProductGrid);
}

// ── RENDER PRODUCT GRID ───────────────────────────────────────
function renderProductGrid() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  let products = [...State.products];

  // Category filter
  if (State.activeCategory) {
    products = products.filter(p => p.category === State.activeCategory);
  }

  // Search filter
  if (State.searchQuery) {
    const q = State.searchQuery.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // Price filter
  const priceFilter = document.getElementById('price-filter')?.value || '';
  if (priceFilter) {
    const [min, max] = priceFilter.split('-').map(Number);
    products = products.filter(p => p.price >= min && p.price <= max);
  }

  // Sort
  const sort = document.getElementById('sort-select')?.value || '';
  if (sort === 'price-asc') products.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') products.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') products.sort((a, b) => b.rating - a.rating);
  else if (sort === 'reviews') products.sort((a, b) => b.reviews - a.reviews);

  // Update section title
  const titleEl = document.getElementById('section-title-text');
  if (titleEl) {
    const catLabel = State.activeCategory || 'All Products';
    const searchLabel = State.searchQuery ? ` — "${State.searchQuery}"` : '';
    titleEl.textContent = catLabel + searchLabel + ` (${products.length})`;
  }

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column:1/-1">
        <div style="font-size:4rem; margin-bottom:16px; opacity:.4">🔍</div>
        <h3>No products found</h3>
        <p>Try adjusting your search or filters</p>
        <button class="btn-primary" style="margin-top:20px" onclick="clearFilters()">Clear Filters</button>
      </div>`;
    return;
  }

  grid.innerHTML = products.map(p => renderProductCard(p)).join('');

  // Animate cards
  grid.querySelectorAll('.product-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.04}s`;
    card.classList.add('fade-in');
  });
}

function clearFilters() {
  State.searchQuery = '';
  State.activeCategory = '';
  document.getElementById('main-search-input').value = '';
  document.getElementById('search-cat-select').value = '';
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.toggle('active', p.dataset.cat === ''));
  renderProductGrid();
}

// ── PRODUCT CARD HTML ─────────────────────────────────────────
function renderProductCard(p) {
  return `
    <div class="product-card" id="card-${p.id}" onclick="navigate('product', {productId:'${p.id}'})">
      <div class="product-card-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'"/>
      </div>
      <div class="product-card-body">
        ${p.badge ? badgeHtml(p.badge) : ''}
        <div class="product-name">${p.name}</div>
        <div class="star-row">
          ${renderStars(p.rating)}
          <span class="review-count">(${p.reviews ? p.reviews.toLocaleString() : 0})</span>
        </div>
        <div class="product-price">${formatPrice(p.price)}</div>
      </div>
      <div class="product-card-footer">
        <button class="btn-add-cart" id="add-cart-${p.id}" onclick="event.stopPropagation(); addToCart('${p.id}', 1)">
          Add to Cart
        </button>
      </div>
    </div>`;
}

// ── RENDER PRODUCT DETAIL ─────────────────────────────────────
function renderProductDetail(productId) {
  const p = State.products.find(pr => pr.id === productId);
  if (!p) { navigate('home'); return; }

  // Related products (same category, exclude current)
  const related = State.products.filter(pr => pr.category === p.category && pr.id !== p.id).slice(0, 4);

  // Parse description into feature bullets
  const sentences = (p.description || '').split('. ').filter(Boolean);

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="detail-wrap fade-in">
      <div class="detail-breadcrumb">
        <a onclick="navigate('home')">Home</a> ›
        <a onclick="State.activeCategory='${p.category}'; navigate('home')">${p.category}</a> ›
        <span style="color:var(--clr-text)">${p.name}</span>
      </div>

      <div class="detail-grid">
        <!-- IMAGES -->
        <div class="detail-images">
          <div class="detail-main-img">
            <img src="${p.image}" alt="${p.name}" id="detail-img-main" onerror="this.src='https://via.placeholder.com/500x500?text=No+Image'"/>
          </div>
        </div>

        <!-- INFO -->
        <div class="detail-info">
          <div class="detail-badge-row">
            ${p.badge ? badgeHtml(p.badge) : ''}
            <span class="product-badge badge-new">${p.category}</span>
          </div>
          <h1 class="detail-name">${p.name}</h1>
          <div class="detail-brand">by <span style="cursor:pointer; text-decoration:underline;">${p.category} Store</span></div>

          <div class="detail-rating-row">
            ${renderStars(p.rating)}
            <span class="detail-rating-num">${p.rating}</span>
            <span class="detail-review-cnt">${(p.reviews || 0).toLocaleString()} ratings</span>
          </div>

          <div class="detail-price-row">
            <div class="detail-price">${formatPrice(p.price)}</div>
            <div class="detail-price-sub">Inclusive of all taxes · Free delivery on orders above ₹499</div>
          </div>

          <p class="detail-desc">${p.description || ''}</p>

          <ul class="detail-feat-list">
            ${sentences.map(s => `<li>${s.trim().replace(/\.$/, '')}</li>`).join('')}
          </ul>

          <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:8px;">
            <div style="background:var(--clr-surface); border:1px solid var(--clr-border); border-radius:var(--radius-sm); padding:10px 16px; text-align:center; flex:1; min-width:120px;">
              <div style="font-size:1.2rem; margin-bottom:4px;">🚚</div>
              <div style="font-size:.75rem; color:var(--clr-text3);">Free Delivery</div>
              <div style="font-size:.8rem; font-weight:600; color:var(--clr-text);">On ₹499+</div>
            </div>
            <div style="background:var(--clr-surface); border:1px solid var(--clr-border); border-radius:var(--radius-sm); padding:10px 16px; text-align:center; flex:1; min-width:120px;">
              <div style="font-size:1.2rem; margin-bottom:4px;">↩️</div>
              <div style="font-size:.75rem; color:var(--clr-text3);">Easy Returns</div>
              <div style="font-size:.8rem; font-weight:600; color:var(--clr-text);">10 Days</div>
            </div>
            <div style="background:var(--clr-surface); border:1px solid var(--clr-border); border-radius:var(--radius-sm); padding:10px 16px; text-align:center; flex:1; min-width:120px;">
              <div style="font-size:1.2rem; margin-bottom:4px;">🔒</div>
              <div style="font-size:.75rem; color:var(--clr-text3);">Secure Pay</div>
              <div style="font-size:.8rem; font-weight:600; color:var(--clr-text);">100% Safe</div>
            </div>
          </div>
        </div>

        <!-- BUY BOX -->
        <div class="detail-buy-box">
          <div class="buy-price">${formatPrice(p.price)}</div>
          <div class="buy-stock">✓ In Stock</div>
          <div class="buy-deliver">
            Deliver to <strong>India</strong> · Usually ships in 1-2 business days
          </div>
          <div class="qty-row">
            <span class="qty-label">Qty:</span>
            <select class="qty-select" id="detail-qty">
              ${[1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}">${n}</option>`).join('')}
            </select>
          </div>
          <button class="btn-add-cart-lg" id="detail-add-cart" onclick="addToCartDetail('${p.id}')">
            🛒 Add to Cart
          </button>
          <button class="btn-buy-now" onclick="buyNow('${p.id}')">
            Buy Now
          </button>
          <div class="buy-secure">🔒 Secure transaction · Sold by E-Cart</div>

          <hr style="border:none; border-top:1px solid var(--clr-border);" />

          <div style="font-size:.8rem; color:var(--clr-text3); display:flex; flex-direction:column; gap:6px;">
            <div>Ships from <strong style="color:var(--clr-text)">E-Cart Fulfillment</strong></div>
            <div>Sold by <strong style="color:var(--clr-text)">E-Cart Direct</strong></div>
            <div>Return policy: <strong style="color:var(--clr-green)">Eligible for Return</strong></div>
          </div>
        </div>
      </div>

      <!-- RELATED PRODUCTS -->
      ${related.length > 0 ? `
      <div style="margin-top:48px;">
        <div class="section-header">
          <div class="section-title">Related Products</div>
        </div>
        <div class="product-grid">
          ${related.map(r => renderProductCard(r)).join('')}
        </div>
      </div>` : ''}
    </div>`;
}

function addToCartDetail(productId) {
  const qty = parseInt(document.getElementById('detail-qty').value) || 1;
  addToCart(productId, qty);
}

function buyNow(productId) {
  const qty = parseInt(document.getElementById('detail-qty')?.value) || 1;
  addToCart(productId, qty, false);
  requireLogin(() => navigate('checkout'));
}
