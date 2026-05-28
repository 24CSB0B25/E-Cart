// ─── Seed Products ────────────────────────────────────────────────────────────
const SEED_PRODUCTS = [
  // Electronics
  {
    id: "p001", name: "Sony WH-1000XM5 Wireless Headphones", category: "Electronics",
    price: 24999, rating: 4.8, reviews: 3842,
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&q=80",
    description: "Industry-leading noise cancellation with crystal-clear hands-free calling. 30-hour battery life with quick charge. Soft-fit leather earpads for long-lasting comfort. Multipoint connection — pair with 2 devices simultaneously.",
    badge: "Best Seller"
  },
  {
    id: "p002", name: "Apple MacBook Air M2", category: "Electronics",
    price: 114900, rating: 4.9, reviews: 5120,
    image: "https://images.unsplash.com/photo-1611186871525-4abe8f9b3b93?w=500&q=80",
    description: "Supercharged by the next-generation M2 chip. Up to 18 hours of battery life. Strikingly thin design with MagSafe charging. Liquid Retina display with 500 nits brightness.",
    badge: "Amazon's Choice"
  },
  {
    id: "p003", name: "Samsung 65\" 4K QLED Smart TV", category: "Electronics",
    price: 89990, rating: 4.6, reviews: 2105,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80",
    description: "Quantum Dot technology delivers brilliant color. Real Game Enhancer for smooth gameplay. Multi Voice Assistant with Alexa. Ultra slim design with no-gap wall mount.",
    badge: "Deal"
  },
  {
    id: "p004", name: "iPhone 15 Pro Max 256GB", category: "Electronics",
    price: 159900, rating: 4.7, reviews: 8934,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80",
    description: "A17 Pro chip — a monster win for gaming. Titanium design. Customizable Action button. Most powerful iPhone camera system ever.",
    badge: "Top Rated"
  },
  {
    id: "p005", name: "Canon EOS R6 Mark II Mirrorless Camera", category: "Electronics",
    price: 239990, rating: 4.8, reviews: 1234,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80",
    description: "40fps continuous shooting. 6K RAW video output. Dual card slots. Subject detection with eye, face, animal, and vehicle recognition.",
    badge: "New"
  },
  // Fashion
  {
    id: "p006", name: "Levi's 511 Slim Fit Jeans", category: "Fashion",
    price: 3499, rating: 4.5, reviews: 12450,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80",
    description: "Classic 5-pocket styling. Sits below waist, slim through the thigh, straight leg. Stretch denim for all-day comfort. Available in multiple washes.",
    badge: "Best Seller"
  },
  {
    id: "p007", name: "Nike Air Max 270 Sneakers", category: "Fashion",
    price: 12995, rating: 4.6, reviews: 6711,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    description: "Max Air unit in the heel for all-day comfort. Engineered mesh upper for breathability. Foam midsole for lightweight cushioning.",
    badge: "Popular"
  },
  {
    id: "p008", name: "Ray-Ban Aviator Classic Sunglasses", category: "Fashion",
    price: 8990, rating: 4.7, reviews: 4523,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
    description: "Crystal green lenses provide superior optical clarity. Classic gold metal frame. 100% UV protection. Timeless style since 1937.",
    badge: null
  },
  {
    id: "p009", name: "Men's Premium Cotton Formal Shirt", category: "Fashion",
    price: 1299, rating: 4.3, reviews: 8923,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
    description: "100% premium cotton. Regular fit. Full sleeve with button-down collar. Machine washable. Wrinkle-resistant fabric.",
    badge: "Deal"
  },
  {
    id: "p010", name: "Fossil Gen 6 Smartwatch", category: "Fashion",
    price: 22995, rating: 4.4, reviews: 3321,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    description: "Wear OS by Google. 1.28\" AMOLED display. Heart rate, SpO2, sleep tracking. GPS enabled. Fast charging.",
    badge: null
  },
  // Home
  {
    id: "p011", name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker", category: "Home",
    price: 8999, rating: 4.7, reviews: 25000,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80",
    description: "7 appliances in one: pressure cooker, slow cooker, rice cooker, steamer, sauté, food warmer, and yogurt maker. 6-quart capacity. 14 one-touch programs.",
    badge: "Amazon's Choice"
  },
  {
    id: "p012", name: "Dyson V15 Detect Cordless Vacuum", category: "Home",
    price: 52900, rating: 4.6, reviews: 4120,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    description: "Laser reveals microscopic dust. Piezo sensor counts and measures particles. HEPA filtration. 60-minute run time. Auto adapts suction.",
    badge: "Premium"
  },
  {
    id: "p013", name: "Philips Hue Smart Bulb Starter Kit", category: "Home",
    price: 5999, rating: 4.5, reviews: 7832,
    image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500&q=80",
    description: "16 million colors. Control from anywhere with the Hue app. Works with Alexa, Google Home, and Apple HomeKit. Includes bridge and 3 color bulbs.",
    badge: null
  },
  {
    id: "p014", name: "IKEA MALM King Bed Frame", category: "Home",
    price: 14999, rating: 4.3, reviews: 5601,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&q=80",
    description: "High-gloss finish. Adjustable bed sides — the bed can be used with or without the slatted bed base. 4 practical storage boxes included.",
    badge: null
  },
  {
    id: "p015", name: "Nespresso Vertuo Next Coffee Machine", category: "Home",
    price: 14799, rating: 4.8, reviews: 11234,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80",
    description: "Centrifusion technology for perfect extraction. 5 cup sizes from espresso to alto. Bluetooth enabled. 30-second heat-up time.",
    badge: "Best Seller"
  },
  // Books
  {
    id: "p016", name: "Atomic Habits by James Clear", category: "Books",
    price: 399, rating: 4.9, reviews: 45231,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80",
    description: "An easy and proven way to build good habits and break bad ones. No. 1 New York Times bestseller. Over 15 million copies sold worldwide.",
    badge: "Best Seller"
  },
  {
    id: "p017", name: "The Psychology of Money", category: "Books",
    price: 299, rating: 4.7, reviews: 23120,
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500&q=80",
    description: "Timeless lessons on wealth, greed, and happiness. 19 short stories exploring the ways people think about money and how to make better financial decisions.",
    badge: "Popular"
  },
  {
    id: "p018", name: "Deep Work by Cal Newport", category: "Books",
    price: 349, rating: 4.6, reviews: 18900,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80",
    description: "Rules for focused success in a distracted world. Learn to work without distraction and produce at an elite level.",
    badge: null
  },
  {
    id: "p019", name: "The Alchemist by Paulo Coelho", category: "Books",
    price: 199, rating: 4.8, reviews: 67432,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80",
    description: "A magical fable about following your dreams. One of the best-selling books in history. Translated into 70+ languages.",
    badge: "Classic"
  },
  {
    id: "p020", name: "Clean Code by Robert C. Martin", category: "Books",
    price: 599, rating: 4.7, reviews: 9870,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&q=80",
    description: "A handbook of agile software craftsmanship. Learn to write code that humans can read and understand. Essential reading for every developer.",
    badge: "Top Rated"
  },
  // Sports
  {
    id: "p021", name: "Yoga Mat Premium Non-Slip 6mm", category: "Sports",
    price: 1299, rating: 4.5, reviews: 15234,
    image: "https://images.unsplash.com/photo-1601925228000-7af8b4ab3ed4?w=500&q=80",
    description: "Extra thick 6mm for joint support. Non-slip texture on both sides. Includes carrying strap. 183cm × 61cm. Eco-friendly TPE material.",
    badge: "Best Seller"
  },
  {
    id: "p022", name: "Adjustable Dumbbell Set 2-24kg", category: "Sports",
    price: 8999, rating: 4.6, reviews: 4521,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80",
    description: "Replaces 15 sets of weights. Dial-select system for quick adjustments. Ergonomic handle. Space-saving design. 2-24kg range in 2kg increments.",
    badge: "Deal"
  },
  {
    id: "p023", name: "Garmin Forerunner 255 GPS Running Watch", category: "Sports",
    price: 27990, rating: 4.7, reviews: 3211,
    image: "https://images.unsplash.com/photo-1434494879577-86c23bcb06b9?w=500&q=80",
    description: "Advanced training metrics. Up to 14 days battery life. Multi-band GPS for precise location. Daily suggested workouts. Recovery advisor.",
    badge: null
  },
  {
    id: "p024", name: "Decathlon Artengo Tennis Racket", category: "Sports",
    price: 2499, rating: 4.4, reviews: 6789,
    image: "https://images.unsplash.com/photo-1617883861744-45dbc1a5a510?w=500&q=80",
    description: "Carbon fiber reinforced frame. Pre-strung at 55 lbs. Suitable for intermediate players. Includes carry bag. Weight: 275g.",
    badge: null
  }
];
