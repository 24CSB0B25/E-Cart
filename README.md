# E-Cart — Premium Amazon-Like E-Commerce Platform

E-Cart is a fully-featured, responsive, and visually stunning client-side e-commerce web application inspired by Amazon. It is built using pure **HTML**, **CSS (Vanilla)**, and **JavaScript (ES6)** with no external frameworks or dependencies, making it perfect for a lightweight college project or demonstration.

All data persists locally in the browser via `localStorage` (no database server or backend required), meaning the site can be run completely offline or hosted for free on **GitHub Pages**.

---

## 🎨 Key Features & Visual Design

- **Dark Mode Premium Theme**: Deep navy background (`#0f1111`) with curated gold (`#f0c14b`) and orange (`#ff9900`) accents, styled with modern typography (Google Fonts **Inter**).
- **Interactive Search Suggestions**: Search input shows matching products dynamically as you type, complete with images, categories, price, and highlighted text matches.
- **Real-Time Product Grid Filtering**: Home page updates automatically as you type in the search bar.
- **SPA Routing**: Single Page Application structure with smooth routing, modals, and toasts.
- **User Flow**: Registration/Login, search and filter by category/price, product details, quantity-controlled cart, checkout form, mock payment, order placement, and order history.
- **Admin Dashboard**: Manage the catalog in real-time (Add, Edit, and Delete products) with automatically updated catalog statistics.

---

## 🌐 How to Host on GitHub Pages (Free)

Since E-Cart is a static web application (HTML, CSS, and JS only), it can be deployed directly to GitHub Pages for free in less than 2 minutes.

Here are the two ways to upload and host the project:

### Method 1: Upload via GitHub Website (No Git Command Line Required)
1. Go to [github.com](https://github.com/) and sign in.
2. Click the green **New** button to create a new repository.
3. Name your repository (e.g., `e-cart`), select **Public**, and click **Create repository**.
4. In the setup screen, click the link that says **"uploading an existing file"** (located under the Quick Setup section).
5. Drag and drop all the files from your local `E-Cart` folder into the upload box on GitHub.
   * *Note: Drag files like `index.html`, `styles.css`, `app.js`, etc. directly, not the parent folder.*
6. Wait for the files to upload, type a commit message (e.g., `Initial commit`), and click **Commit changes**.

### Method 2: Upload via Git Command Line
If you have Git installed, open your terminal (PowerShell or Git Bash) inside the `E-Cart` folder and run the following commands:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Rename branch to main
git branch -M main

# Link to your remote GitHub repository (Replace username and repo-name)
git remote add origin https://github.com/your-username/repo-name.git

# Push files to GitHub
git push -u origin main
```

---

## 🚀 How to Enable GitHub Pages
Once your files are uploaded to GitHub:

1. Click on the **Settings** tab at the top of your GitHub repository.
2. In the left-hand sidebar, click on **Pages** (under the "Code and automation" section).
3. Under the **Build and deployment** section, locate the **Branch** setting:
   - Change it from **None** to **`main`** (or `master`).
   - Leave the folder option as **`/ (root)`**.
   - Click **Save**.
4. Wait about 30–60 seconds, then refresh the page.
5. You will see a banner at the top of the Page settings saying: **"Your site is live at..."** with a clickable link (e.g., `https://your-username.github.io/repo-name/`).
6. Click that link to open your project live online!

---

## 🔑 Default Credentials

To access the admin features of the platform:

- **Admin Login**: `admin@ecart.com`
- **Admin Password**: `admin123`
- **User Login**: Sign up with any email address and password of your choice.
