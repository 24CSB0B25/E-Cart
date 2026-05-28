/* ═══════════════════════════════════════════════════════════════
   APP.JS — Router, State Management, Utilities, Init
   ═══════════════════════════════════════════════════════════════ */

// ── GLOBAL STATE ──────────────────────────────────────────────
const State = {
  currentUser: null,
  products: [],
  cart: [],
  orders: [],
  currentView: 'home',
  currentProduct: null,
  searchQuery: '',
  activeCategory: '',
};

// ── LOCAL STORAGE HELPERS ─────────────────────────────────────
const LS = {
  get: (key, fallback = null) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
  remove: (key) => { try { localStorage.removeItem(key); } catch {} },
};

// ── ROUTER ────────────────────────────────────────────────────
function navigate(view, params = {}) {
  State.currentView = view;
  State.currentProduct = params.productId || null;

  // Hide cat-bar on some pages
  const hideCat = ['login', 'signup', 'checkout', 'order-confirm', 'admin', 'admin-form'];
  document.getElementById('cat-bar').style.display = hideCat.includes(view) ? 'none' : '';

  // Hide footer on auth pages
  const hideFooter = ['login', 'signup'];
  document.getElementById('site-footer').style.display = hideFooter.includes(view) ? 'none' : '';

  // Render
  window.scrollTo({ top: 0, behavior: 'smooth' });

  switch (view) {
    case 'home':        renderHome(); break;
    case 'product':     renderProductDetail(params.productId); break;
    case 'cart':        renderCart(); break;
    case 'checkout':    renderCheckout(); break;
    case 'order-confirm': renderOrderConfirm(params.order); break;
    case 'orders':      renderOrders(); break;
    case 'login':       renderLogin(params.redirect); break;
    case 'signup':      renderSignup(); break;
    case 'admin':       renderAdmin(); break;
    case 'admin-form':  renderAdminForm(params.productId); break;
    default:            renderHome();
  }
}

// ── REQUIRE LOGIN GUARD ───────────────────────────────────────
function requireLogin(callback) {
  if (State.currentUser) { callback(); }
  else { navigate('login', { redirect: callback }); }
}

// ── UTILITY: RENDER STARS ─────────────────────────────────────
function renderStars(rating) {
  let html = '<div class="stars">';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) html += '<span class="star full">★</span>';
    else if (rating >= i - 0.5) html += '<span class="star half">★</span>';
    else html += '<span class="star empty">★</span>';
  }
  html += '</div>';
  return html;
}

// ── UTILITY: FORMAT PRICE ─────────────────────────────────────
function formatPrice(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

// ── UTILITY: GENERATE ID ─────────────────────────────────────
function genId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

// ── UTILITY: FORMAT DATE ─────────────────────────────────────
function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── BADGE HTML ────────────────────────────────────────────────
function badgeHtml(badge) {
  if (!badge) return '';
  const map = {
    'Best Seller': 'badge-bestseller',
    "Amazon's Choice": 'badge-choice',
    'Deal': 'badge-deal',
    'New': 'badge-new',
    'Top Rated': 'badge-toprated',
    'Popular': 'badge-popular',
    'Premium': 'badge-premium',
    'Classic': 'badge-classic',
  };
  const cls = map[badge] || 'badge-new';
  return `<span class="product-badge ${cls}">${badge}</span>`;
}

// ── TOAST NOTIFICATIONS ───────────────────────────────────────
function showToast(msg, type = 'info', duration = 2800) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastIn .3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── MODAL ─────────────────────────────────────────────────────
function openModal(title, text, confirmText, onConfirm) {
  const overlay = document.getElementById('modal-overlay');
  const box = document.getElementById('modal-box');
  box.innerHTML = `
    <div class="modal-title">${title}</div>
    <div class="modal-text">${text}</div>
    <div class="modal-actions">
      <button class="btn-modal-cancel" onclick="closeModal()">Cancel</button>
      <button class="btn-modal-confirm" id="modal-confirm-btn">${confirmText}</button>
    </div>`;
  overlay.classList.add('active');
  box.classList.add('active');
  document.getElementById('modal-confirm-btn').onclick = () => { closeModal(); onConfirm(); };
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.getElementById('modal-box').classList.remove('active');
}

// ── NAVBAR UPDATE ─────────────────────────────────────────────
function updateNavbar() {
  const user = State.currentUser;
  const usernameEl = document.getElementById('nav-username');
  const ddLogout = document.getElementById('dd-logout');
  const ddAdmin = document.getElementById('dd-admin-link');
  const ddAuthSection = document.getElementById('dropdown-auth-section');

  if (user) {
    usernameEl.textContent = user.name.split(' ')[0];
    ddLogout.style.display = '';
    ddAdmin.style.display = user.role === 'admin' ? '' : 'none';
    ddAuthSection.innerHTML = `
      <div style="padding:10px 18px 6px; font-size:.8rem; color:var(--clr-text3);">Signed in as</div>
      <div style="padding:0 18px 8px; font-size:.88rem; font-weight:700; color:var(--clr-orange);">${user.email}</div>`;
  } else {
    usernameEl.textContent = 'Sign in';
    ddLogout.style.display = 'none';
    ddAdmin.style.display = 'none';
    ddAuthSection.innerHTML = `
      <button class="dropdown-item" onclick="navigate('login')">Sign In</button>
      <button class="dropdown-item" onclick="navigate('signup')" style="font-size:.8rem; color:var(--clr-text3);">New customer? Start here</button>`;
  }
  updateCartBadge();
}

function updateCartBadge() {
  const count = State.cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cart-count').textContent = count;
}

// ── UTILITY: HIGHLIGHT SEARCH MATCH ───────────────────────────
function highlightMatch(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// ── CATEGORY BAR SETUP ────────────────────────────────────────
function setupCategoryBar() {
  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.dataset.cat;
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      State.activeCategory = cat;
      const catSel = document.getElementById('search-cat-select');
      if (catSel) catSel.value = cat;

      if (State.currentView !== 'home') navigate('home');
      else renderProductGrid();
    });
  });
}

// ── SEARCH BAR SETUP ─────────────────────────────────────────
function setupSearch() {
  const input = document.getElementById('main-search-input');
  const btn = document.getElementById('main-search-btn');
  const catSel = document.getElementById('search-cat-select');
  const suggestionsContainer = document.getElementById('search-suggestions');

  let selectedIndex = -1;

  const doSearch = () => {
    State.searchQuery = input.value.trim();
    const cat = catSel.value;
    State.activeCategory = cat;
    
    // Sync UI cat pills
    document.querySelectorAll('.cat-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.cat === cat);
    });

    hideSuggestions();
    if (State.currentView !== 'home') navigate('home');
    else renderProductGrid();
  };

  const getFilteredProducts = (q) => {
    if (!q) return [];
    const cat = catSel.value;
    let list = [...State.products];
    if (cat) {
      list = list.filter(p => p.category === cat);
    }
    const query = q.toLowerCase();
    return list.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query))
    );
  };

  const showSuggestions = () => {
    const q = input.value.trim();
    if (!q) {
      hideSuggestions();
      return;
    }

    const matches = getFilteredProducts(q).slice(0, 8);
    if (matches.length === 0) {
      suggestionsContainer.innerHTML = `<div class="suggestion-no-results">No products found for "${q}"</div>`;
    } else {
      let html = `<div class="suggestion-header-title">Matching Products (${matches.length})</div>`;
      html += matches.map((p, idx) => {
        const highlightedName = highlightMatch(p.name, q);
        return `
          <div class="suggestion-item" data-id="${p.id}" data-index="${idx}">
            <img class="suggestion-img" src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/100x100?text=No+Image'" />
            <div class="suggestion-info">
              <div class="suggestion-name">${highlightedName}</div>
              <div class="suggestion-meta">
                <span class="suggestion-category">${p.category}</span>
                ${p.badge ? `<span class="suggestion-badge ${p.badge === 'Best Seller' ? 'badge-bestseller' : p.badge === 'Deal' ? 'badge-deal' : 'badge-new'}">${p.badge}</span>` : ''}
              </div>
            </div>
            <div class="suggestion-price">${formatPrice(p.price)}</div>
          </div>
        `;
      }).join('');
      suggestionsContainer.innerHTML = html;
    }

    suggestionsContainer.style.display = 'block';
    selectedIndex = -1;
    updateSuggestionSelection();
  };

  const hideSuggestions = () => {
    suggestionsContainer.style.display = 'none';
    suggestionsContainer.innerHTML = '';
    selectedIndex = -1;
  };

  const updateSuggestionSelection = () => {
    const items = suggestionsContainer.querySelectorAll('.suggestion-item');
    items.forEach((item, idx) => {
      item.classList.toggle('selected', idx === selectedIndex);
      if (idx === selectedIndex) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  };

  // Input event: Show suggestions & filter homepage in real-time
  input.addEventListener('input', () => {
    showSuggestions();
    
    // Real-time homepage filtering
    if (State.currentView === 'home') {
      State.searchQuery = input.value.trim();
      const cat = catSel.value;
      State.activeCategory = cat;
      document.querySelectorAll('.cat-pill').forEach(p => {
        p.classList.toggle('active', p.dataset.cat === cat);
      });
      renderProductGrid();
    }
  });

  // Category Selector Change: Refresh suggestions & filter homepage in real-time
  catSel.addEventListener('change', () => {
    if (input.value.trim()) {
      showSuggestions();
    }
    if (State.currentView === 'home') {
      State.activeCategory = catSel.value;
      document.querySelectorAll('.cat-pill').forEach(p => {
        p.classList.toggle('active', p.dataset.cat === catSel.value);
      });
      renderProductGrid();
    }
  });

  // Focus event: Re-show suggestions if has input
  input.addEventListener('focus', () => {
    if (input.value.trim()) {
      showSuggestions();
    }
  });

  // Click handler on suggestions dropdown
  suggestionsContainer.addEventListener('click', e => {
    const item = e.target.closest('.suggestion-item');
    if (item) {
      const productId = item.dataset.id;
      hideSuggestions();
      navigate('product', { productId });
    }
  });

  // Keyboard navigation
  input.addEventListener('keydown', e => {
    const items = suggestionsContainer.querySelectorAll('.suggestion-item');
    
    if (suggestionsContainer.style.display === 'block' && items.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSuggestionSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSuggestionSelection();
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          const item = items[selectedIndex];
          const productId = item.dataset.id;
          hideSuggestions();
          navigate('product', { productId });
        } else {
          doSearch();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        hideSuggestions();
        input.blur();
      }
    } else {
      if (e.key === 'Enter') {
        doSearch();
      }
    }
  });

  // Click outside listener
  document.addEventListener('click', e => {
    const searchWrap = document.querySelector('.nav-search-wrap');
    if (searchWrap && !searchWrap.contains(e.target)) {
      hideSuggestions();
    }
  });

  btn.addEventListener('click', doSearch);
}

// ── APP INITIALIZATION ────────────────────────────────────────
function initApp() {
  // Load / seed products
  let stored = LS.get('ecart_products');
  if (!stored || stored.length === 0) {
    LS.set('ecart_products', SEED_PRODUCTS);
    stored = SEED_PRODUCTS;
  }
  State.products = stored;

  // Seed admin user if not exists
  let users = LS.get('ecart_users', []);
  if (!users.find(u => u.email === 'admin@ecart.com')) {
    users.push({
      id: 'admin_001',
      name: 'Admin User',
      email: 'admin@ecart.com',
      password: 'admin123',
      role: 'admin',
      createdAt: Date.now(),
    });
    LS.set('ecart_users', users);
  }

  // Restore session
  const session = LS.get('ecart_session');
  if (session) {
    const freshUsers = LS.get('ecart_users', []);
    State.currentUser = freshUsers.find(u => u.id === session) || null;
  }

  // Load cart & orders
  State.cart = LS.get('ecart_cart_' + (State.currentUser?.id || 'guest'), []);
  State.orders = LS.get('ecart_orders_' + (State.currentUser?.id || 'guest'), []);

  setupCategoryBar();
  setupSearch();
  updateNavbar();
  navigate('home');

  // Hide loader
  document.getElementById('page-loader').style.display = 'none';
}

// ── SAVE CART & ORDERS HELPERS ────────────────────────────────
function saveCart() {
  LS.set('ecart_cart_' + (State.currentUser?.id || 'guest'), State.cart);
  updateCartBadge();
}
function saveOrders() {
  LS.set('ecart_orders_' + (State.currentUser?.id || 'guest'), State.orders);
}

// ── LOGOUT ────────────────────────────────────────────────────
function logout() {
  LS.remove('ecart_session');
  State.currentUser = null;
  State.cart = [];
  State.orders = [];
  updateNavbar();
  showToast('Signed out successfully', 'info');
  navigate('home');
}

// ── BOOT ─────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', initApp);
