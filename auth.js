/* ═══════════════════════════════════════════════════════════════
   AUTH.JS — Login, Signup, Logout
   ═══════════════════════════════════════════════════════════════ */

// ── RENDER LOGIN ──────────────────────────────────────────────
function renderLogin(redirectCallback) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-wrap fade-in">
      <div class="auth-card">
        <div class="auth-logo">
          <span class="logo-e">E</span><span class="logo-cart">-Cart</span>
        </div>
        <h1 class="auth-title">Welcome back</h1>
        <p class="auth-sub">Sign in to your account</p>

        <form id="login-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="login-email">Email address</label>
            <input class="form-input" type="email" id="login-email" placeholder="you@example.com" autocomplete="email" />
            <span class="form-error" id="login-email-err"></span>
          </div>
          <div class="form-group">
            <label class="form-label" for="login-password">Password</label>
            <input class="form-input" type="password" id="login-password" placeholder="Enter your password" autocomplete="current-password" />
            <span class="form-error" id="login-pass-err"></span>
          </div>
          <div style="margin-bottom:6px; text-align:right;">
            <span style="font-size:.78rem; color:var(--clr-blue); cursor:pointer;">Forgot password?</span>
          </div>
          <button type="submit" class="auth-btn" id="login-btn">Sign In</button>
        </form>

        <div class="auth-divider">or</div>

        <div style="background:var(--clr-bg2); border:1px solid var(--clr-border); border-radius:var(--radius-md); padding:14px 18px; margin-bottom:4px;">
          <div style="font-size:.78rem; color:var(--clr-text3); margin-bottom:6px;">🔑 Demo Credentials</div>
          <div style="font-size:.82rem; color:var(--clr-text2);">
            <strong style="color:var(--clr-orange);">Admin:</strong> admin@ecart.com / admin123
          </div>
        </div>

        <div class="auth-switch">
          New to E-Cart? <a onclick="navigate('signup')">Create account</a>
        </div>
      </div>
    </div>`;

  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    handleLogin(redirectCallback);
  });
}

// ── HANDLE LOGIN ──────────────────────────────────────────────
function handleLogin(redirectCallback) {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  let valid = true;

  // Clear errors
  document.getElementById('login-email-err').textContent = '';
  document.getElementById('login-pass-err').textContent = '';
  document.getElementById('login-email').classList.remove('error');
  document.getElementById('login-password').classList.remove('error');

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('login-email-err').textContent = 'Please enter a valid email address.';
    document.getElementById('login-email').classList.add('error');
    valid = false;
  }
  if (!password) {
    document.getElementById('login-pass-err').textContent = 'Password is required.';
    document.getElementById('login-password').classList.add('error');
    valid = false;
  }
  if (!valid) return;

  const users = LS.get('ecart_users', []);
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    document.getElementById('login-pass-err').textContent = 'Incorrect email or password.';
    document.getElementById('login-password').classList.add('error');
    return;
  }

  // Set session
  State.currentUser = user;
  LS.set('ecart_session', user.id);

  // Load user's cart & orders
  State.cart = LS.get('ecart_cart_' + user.id, []);
  State.orders = LS.get('ecart_orders_' + user.id, []);

  updateNavbar();
  showToast(`Welcome back, ${user.name.split(' ')[0]}! 👋`, 'success');

  if (typeof redirectCallback === 'function') redirectCallback();
  else navigate('home');
}

// ── RENDER SIGNUP ─────────────────────────────────────────────
function renderSignup() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-wrap fade-in">
      <div class="auth-card">
        <div class="auth-logo">
          <span class="logo-e">E</span><span class="logo-cart">-Cart</span>
        </div>
        <h1 class="auth-title">Create your account</h1>
        <p class="auth-sub">Join millions of happy shoppers</p>

        <form id="signup-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="signup-name">Full Name</label>
            <input class="form-input" type="text" id="signup-name" placeholder="Your full name" autocomplete="name" />
            <span class="form-error" id="signup-name-err"></span>
          </div>
          <div class="form-group">
            <label class="form-label" for="signup-email">Email address</label>
            <input class="form-input" type="email" id="signup-email" placeholder="you@example.com" autocomplete="email" />
            <span class="form-error" id="signup-email-err"></span>
          </div>
          <div class="form-group">
            <label class="form-label" for="signup-password">Password</label>
            <input class="form-input" type="password" id="signup-password" placeholder="Min 6 characters" autocomplete="new-password" />
            <span class="form-error" id="signup-pass-err"></span>
          </div>
          <div class="form-group">
            <label class="form-label" for="signup-confirm">Confirm Password</label>
            <input class="form-input" type="password" id="signup-confirm" placeholder="Re-enter password" autocomplete="new-password" />
            <span class="form-error" id="signup-confirm-err"></span>
          </div>
          <button type="submit" class="auth-btn" id="signup-btn">Create Account</button>
        </form>

        <div class="auth-switch">
          Already have an account? <a onclick="navigate('login')">Sign in</a>
        </div>
      </div>
    </div>`;

  document.getElementById('signup-form').addEventListener('submit', e => {
    e.preventDefault();
    handleSignup();
  });
}

// ── HANDLE SIGNUP ─────────────────────────────────────────────
function handleSignup() {
  const name     = document.getElementById('signup-name').value.trim();
  const email    = document.getElementById('signup-email').value.trim().toLowerCase();
  const password = document.getElementById('signup-password').value;
  const confirm  = document.getElementById('signup-confirm').value;
  let valid = true;

  // Clear
  ['name','email','pass','confirm'].forEach(f => {
    const el = document.getElementById('signup-' + (f === 'pass' ? 'password' : f));
    const err = document.getElementById('signup-' + f + '-err');
    if (el) el.classList.remove('error');
    if (err) err.textContent = '';
  });

  if (!name || name.length < 2) {
    document.getElementById('signup-name-err').textContent = 'Please enter your full name.';
    document.getElementById('signup-name').classList.add('error');
    valid = false;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('signup-email-err').textContent = 'Please enter a valid email.';
    document.getElementById('signup-email').classList.add('error');
    valid = false;
  }
  if (!password || password.length < 6) {
    document.getElementById('signup-pass-err').textContent = 'Password must be at least 6 characters.';
    document.getElementById('signup-password').classList.add('error');
    valid = false;
  }
  if (password !== confirm) {
    document.getElementById('signup-confirm-err').textContent = 'Passwords do not match.';
    document.getElementById('signup-confirm').classList.add('error');
    valid = false;
  }
  if (!valid) return;

  const users = LS.get('ecart_users', []);
  if (users.find(u => u.email === email)) {
    document.getElementById('signup-email-err').textContent = 'An account with this email already exists.';
    document.getElementById('signup-email').classList.add('error');
    return;
  }

  const newUser = {
    id: genId(),
    name,
    email,
    password,
    role: 'user',
    createdAt: Date.now(),
  };
  users.push(newUser);
  LS.set('ecart_users', users);

  // Auto login
  State.currentUser = newUser;
  LS.set('ecart_session', newUser.id);
  State.cart = [];
  State.orders = [];

  updateNavbar();
  showToast(`Welcome to E-Cart, ${name.split(' ')[0]}! 🎉`, 'success');
  navigate('home');
}
