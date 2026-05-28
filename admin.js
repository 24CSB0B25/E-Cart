/* ═══════════════════════════════════════════════════════════════
   ADMIN.JS — Admin Dashboard: Add, Edit, Delete Products
   ═══════════════════════════════════════════════════════════════ */

// ── GUARD: ADMIN ONLY ─────────────────────────────────────────
function requireAdmin() {
  if (!State.currentUser) { navigate('login'); return false; }
  if (State.currentUser.role !== 'admin') {
    showToast('Access denied. Admin only.', 'error');
    navigate('home');
    return false;
  }
  return true;
}

// ── RENDER ADMIN DASHBOARD ────────────────────────────────────
function renderAdmin() {
  if (!requireAdmin()) return;

  // Reload fresh products
  State.products = LS.get('ecart_products', []);

  const categories = ['Electronics', 'Fashion', 'Home', 'Books', 'Sports'];
  const catCounts = {};
  categories.forEach(c => { catCounts[c] = State.products.filter(p => p.category === c).length; });

  const totalRevenue = State.products.reduce((s, p) => s + p.price, 0);
  const avgRating = State.products.length
    ? (State.products.reduce((s, p) => s + p.rating, 0) / State.products.length).toFixed(1)
    : '0.0';

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="admin-wrap fade-in">
      <!-- HEADER -->
      <div class="admin-header">
        <div>
          <h1 class="admin-title">Admin Dashboard</h1>
          <div class="admin-subtitle">Manage your product catalog</div>
        </div>
        <button class="btn-add-product" onclick="navigate('admin-form')">
          <span>＋</span> Add New Product
        </button>
      </div>

      <!-- STATS -->
      <div class="admin-stats">
        <div class="admin-stat-card">
          <div class="admin-stat-icon">📦</div>
          <div class="admin-stat-num">${State.products.length}</div>
          <div class="admin-stat-lbl">Total Products</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-icon">⚡</div>
          <div class="admin-stat-num">${catCounts['Electronics'] || 0}</div>
          <div class="admin-stat-lbl">Electronics</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-icon">👗</div>
          <div class="admin-stat-num">${catCounts['Fashion'] || 0}</div>
          <div class="admin-stat-lbl">Fashion</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-icon">🏠</div>
          <div class="admin-stat-num">${catCounts['Home'] || 0}</div>
          <div class="admin-stat-lbl">Home</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-icon">📚</div>
          <div class="admin-stat-num">${catCounts['Books'] || 0}</div>
          <div class="admin-stat-lbl">Books</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-icon">🏃</div>
          <div class="admin-stat-num">${catCounts['Sports'] || 0}</div>
          <div class="admin-stat-lbl">Sports</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-icon">⭐</div>
          <div class="admin-stat-num">${avgRating}</div>
          <div class="admin-stat-lbl">Avg Rating</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-icon">💰</div>
          <div class="admin-stat-num" style="font-size:1.1rem;">₹${(totalRevenue/1000).toFixed(0)}K</div>
          <div class="admin-stat-lbl">Catalog Value</div>
        </div>
      </div>

      <!-- TABLE -->
      <div class="admin-table-wrap">
        <div class="admin-table-toolbar">
          <input class="admin-search-input" id="admin-search" type="text" placeholder="🔍 Search products…" oninput="filterAdminTable()" />
          <select class="admin-cat-filter" id="admin-cat-filter" onchange="filterAdminTable()">
            <option value="">All Categories</option>
            ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
        <div style="overflow-x:auto;">
          <table class="admin-table" id="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Reviews</th>
                <th>Badge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="admin-table-body">
              ${renderAdminTableRows(State.products)}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
}

// ── RENDER TABLE ROWS ─────────────────────────────────────────
function renderAdminTableRows(products) {
  if (products.length === 0) {
    return `<tr><td colspan="8" style="text-align:center; padding:40px; color:var(--clr-text3);">No products found.</td></tr>`;
  }
  return products.map(p => `
    <tr id="admin-row-${p.id}">
      <td><img class="admin-prod-img" src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/48?text=?'"/></td>
      <td style="max-width:220px;">
        <div style="font-weight:600; color:var(--clr-text); line-height:1.3;">${p.name}</div>
      </td>
      <td><span class="product-badge badge-new" style="font-size:.7rem;">${p.category}</span></td>
      <td style="font-weight:700; color:var(--clr-white);">${formatPrice(p.price)}</td>
      <td>
        <div style="display:flex; align-items:center; gap:4px;">
          <span style="color:var(--clr-gold);">★</span>
          <span style="font-weight:600;">${p.rating}</span>
        </div>
      </td>
      <td style="color:var(--clr-text3);">${(p.reviews || 0).toLocaleString()}</td>
      <td>${p.badge ? `<span class="product-badge ${getBadgeCls(p.badge)}" style="font-size:.65rem;">${p.badge}</span>` : '<span style="color:var(--clr-text3); font-size:.8rem;">—</span>'}</td>
      <td>
        <div class="admin-actions">
          <button class="btn-edit" onclick="navigate('admin-form', {productId:'${p.id}'})">✏️ Edit</button>
          <button class="btn-delete" onclick="confirmDeleteProduct('${p.id}', '${p.name.replace(/'/g, "\\'")}')">🗑️ Delete</button>
        </div>
      </td>
    </tr>`).join('');
}

function getBadgeCls(badge) {
  const map = { 'Best Seller':'badge-bestseller', "Amazon's Choice":'badge-choice', 'Deal':'badge-deal', 'New':'badge-new', 'Top Rated':'badge-toprated', 'Popular':'badge-popular', 'Premium':'badge-premium', 'Classic':'badge-classic' };
  return map[badge] || 'badge-new';
}

// ── FILTER TABLE ──────────────────────────────────────────────
function filterAdminTable() {
  const q = document.getElementById('admin-search')?.value.toLowerCase() || '';
  const cat = document.getElementById('admin-cat-filter')?.value || '';
  let filtered = [...State.products];
  if (q) filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  if (cat) filtered = filtered.filter(p => p.category === cat);
  const tbody = document.getElementById('admin-table-body');
  if (tbody) tbody.innerHTML = renderAdminTableRows(filtered);
}

// ── CONFIRM DELETE ────────────────────────────────────────────
function confirmDeleteProduct(productId, productName) {
  openModal(
    'Delete Product',
    `Are you sure you want to delete "<strong>${productName}</strong>"? This action cannot be undone.`,
    '🗑️ Delete',
    () => deleteProduct(productId, productName)
  );
}

// ── DELETE PRODUCT ────────────────────────────────────────────
function deleteProduct(productId, productName) {
  State.products = State.products.filter(p => p.id !== productId);
  LS.set('ecart_products', State.products);
  showToast(`"${productName.slice(0, 40)}" deleted successfully.`, 'success');
  renderAdmin();
}

// ── RENDER ADMIN FORM (ADD / EDIT) ────────────────────────────
function renderAdminForm(productId) {
  if (!requireAdmin()) return;

  const isEdit = Boolean(productId);
  const p = isEdit ? State.products.find(pr => pr.id === productId) : null;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="admin-form-wrap fade-in">
      <div class="admin-form-card">
        <h1 class="admin-form-title">${isEdit ? '✏️ Edit Product' : '＋ Add New Product'}</h1>

        <div class="form-group">
          <label class="form-label" for="af-name">Product Name *</label>
          <input class="form-input" id="af-name" type="text" placeholder="e.g. Sony WH-1000XM5 Headphones" value="${p ? escHtml(p.name) : ''}" />
          <span class="form-error" id="af-name-err"></span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="af-category">Category *</label>
            <select class="form-input" id="af-category">
              <option value="">Select Category</option>
              ${['Electronics','Fashion','Home','Books','Sports'].map(c => `<option value="${c}" ${p?.category === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
            <span class="form-error" id="af-category-err"></span>
          </div>
          <div class="form-group">
            <label class="form-label" for="af-badge">Badge (optional)</label>
            <select class="form-input" id="af-badge">
              <option value="">No Badge</option>
              ${['Best Seller',"Amazon's Choice",'Deal','New','Top Rated','Popular','Premium','Classic'].map(b => `<option value="${b}" ${p?.badge === b ? 'selected' : ''}>${b}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-row-3">
          <div class="form-group">
            <label class="form-label" for="af-price">Price (₹) *</label>
            <input class="form-input" id="af-price" type="number" min="1" placeholder="e.g. 24999" value="${p ? p.price : ''}" />
            <span class="form-error" id="af-price-err"></span>
          </div>
          <div class="form-group">
            <label class="form-label" for="af-rating">Rating (0–5) *</label>
            <input class="form-input" id="af-rating" type="number" min="0" max="5" step="0.1" placeholder="e.g. 4.5" value="${p ? p.rating : ''}" />
            <span class="form-error" id="af-rating-err"></span>
          </div>
          <div class="form-group">
            <label class="form-label" for="af-reviews">Review Count</label>
            <input class="form-input" id="af-reviews" type="number" min="0" placeholder="e.g. 1200" value="${p ? p.reviews : '0'}" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="af-image">Image URL *</label>
          <input class="form-input" id="af-image" type="url" placeholder="https://images.unsplash.com/…" value="${p ? p.image : ''}" oninput="previewAdminImage(this.value)" />
          <span class="form-error" id="af-image-err"></span>
          <div class="img-preview-wrap">
            <img class="img-preview" id="af-img-preview" src="${p ? p.image : ''}" alt="Preview" onerror="this.style.display='none'" style="${p?.image ? '' : 'display:none'}" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="af-description">Description *</label>
          <textarea class="form-input" id="af-description" rows="4" placeholder="Describe the product features…" style="resize:vertical;">${p ? escHtml(p.description || '') : ''}</textarea>
          <span class="form-error" id="af-description-err"></span>
        </div>

        <div class="admin-form-actions">
          <button class="btn-cancel-form" onclick="navigate('admin')">Cancel</button>
          <button class="btn-save" onclick="saveProduct('${productId || ''}')">
            ${isEdit ? '💾 Save Changes' : '✅ Add Product'}
          </button>
        </div>
      </div>
    </div>`;
}

// ── IMAGE PREVIEW ─────────────────────────────────────────────
function previewAdminImage(url) {
  const img = document.getElementById('af-img-preview');
  if (!img) return;
  img.style.display = url ? '' : 'none';
  img.src = url;
}

// ── SAVE PRODUCT (CREATE OR UPDATE) ──────────────────────────
function saveProduct(editId) {
  let valid = true;
  const clearErr = id => {
    const el = document.getElementById(id);
    const err = document.getElementById(id + '-err');
    if (el) el.classList.remove('error');
    if (err) err.textContent = '';
  };
  const setErr = (id, msg) => {
    const el = document.getElementById(id);
    const err = document.getElementById(id + '-err');
    if (el) el.classList.add('error');
    if (err) err.textContent = msg;
    valid = false;
  };

  ['af-name','af-category','af-price','af-rating','af-image','af-description'].forEach(clearErr);

  const name    = document.getElementById('af-name').value.trim();
  const cat     = document.getElementById('af-category').value;
  const price   = parseFloat(document.getElementById('af-price').value);
  const rating  = parseFloat(document.getElementById('af-rating').value);
  const reviews = parseInt(document.getElementById('af-reviews').value) || 0;
  const image   = document.getElementById('af-image').value.trim();
  const desc    = document.getElementById('af-description').value.trim();
  const badge   = document.getElementById('af-badge').value || null;

  if (!name || name.length < 3)         setErr('af-name',        'Product name must be at least 3 characters.');
  if (!cat)                              setErr('af-category',    'Please select a category.');
  if (!price || price <= 0)             setErr('af-price',       'Price must be a positive number.');
  if (isNaN(rating) || rating < 0 || rating > 5) setErr('af-rating', 'Rating must be between 0 and 5.');
  if (!image || !/^https?:\/\/.+/.test(image))   setErr('af-image',  'Please enter a valid image URL (starts with http).');
  if (!desc || desc.length < 10)        setErr('af-description', 'Description must be at least 10 characters.');

  if (!valid) { showToast('Please fix the errors above.', 'error'); return; }

  // Animate button
  const btn = document.querySelector('.btn-save');
  const origText = btn.textContent;
  btn.textContent = '⏳ Saving…'; btn.disabled = true;

  setTimeout(() => {
    if (editId) {
      // Update existing
      const idx = State.products.findIndex(p => p.id === editId);
      if (idx !== -1) {
        State.products[idx] = { ...State.products[idx], name, category: cat, price, rating, reviews, image, description: desc, badge };
      }
      showToast('Product updated successfully! ✅', 'success');
    } else {
      // Create new
      const newProduct = {
        id: genId(),
        name, category: cat, price, rating, reviews, image, description: desc, badge,
      };
      State.products.unshift(newProduct);
      showToast('Product added successfully! 🎉', 'success');
    }

    LS.set('ecart_products', State.products);
    navigate('admin');
  }, 600);
}

// ── HTML ESCAPE ───────────────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
