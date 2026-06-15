export const CATEGORIES = [
  { id: "electronics", name: "Electronics", icon: "Laptop", count: 18, image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600&auto=format&fit=crop" },
  { id: "fashion", name: "Fashion", icon: "Shirt", count: 24, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop" },
  { id: "home", name: "Home", icon: "Home", count: 15, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop" },
  { id: "books", name: "Books", icon: "BookOpen", count: 12, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop" },
  { id: "sports", name: "Sports", icon: "Dumbbell", count: 9, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop" },
  { id: "grocery", name: "Grocery", icon: "Apple", count: 32, image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop" },
  { id: "beauty", name: "Beauty", icon: "Sparkles", count: 14, image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=600&auto=format&fit=crop" },
  { id: "furniture", name: "Furniture", icon: "Armchair", count: 8, image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600&auto=format&fit=crop" }
];

export const PRODUCTS = [
  {
    id: "prod-1",
    name: "iPhone 15 Pro",
    price: 999.00,
    discount: 10,
    rating: 4.8,
    stock: 25,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565849906461-0e443307986c?q=80&w=600&auto=format&fit=crop"
    ],
    description: "The iPhone 15 Pro features a strong and light aerospace-grade titanium design. Powered by the A17 Pro chip, this device redefines high performance, battery efficiency, and photo quality.",
    specifications: [
      { name: "Processor", value: "A17 Pro Chip" },
      { name: "Display", value: "6.1 inches Super Retina XDR OLED" },
      { name: "Camera", value: "48MP Main | 12MP Ultra Wide | 12MP Telephoto" },
      { name: "Weight", value: "187g" },
      { name: "Build", value: "Titanium Frame, Ceramic Shield Front" }
    ],
    reviews: [
      { rating: 5, author: "Sarah M.", date: "2026-05-12", comment: "Absolutely love the titanium body, feels so light!" },
      { rating: 4, author: "John D.", date: "2026-05-18", comment: "Amazing performance, though battery life is similar to iPhone 14." }
    ],
    popular: true,
    newest: true,
    deals: true
  },
  {
    id: "prod-2",
    name: "MacBook Air M3",
    price: 1299.00,
    discount: 8,
    rating: 4.9,
    stock: 12,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Supercharged by the next-generation M3 chip, the redesigned MacBook Air offers incredible speed, up to 18 hours of battery life, and a beautiful liquid retina display in a super-thin aluminum enclosure.",
    specifications: [
      { name: "Processor", value: "Apple M3 Chip (8-core CPU, 10-core GPU)" },
      { name: "RAM", value: "8GB Unified Memory (Configurable)" },
      { name: "Storage", value: "512GB SSD" },
      { name: "Display", value: "13.6-inch Liquid Retina Display" },
      { name: "Battery", value: "Up to 18 hours" }
    ],
    reviews: [
      { rating: 5, author: "David K.", date: "2026-06-01", comment: "The M3 chip handles everything I throw at it silently. Highly recommended." }
    ],
    popular: true,
    newest: true,
    deals: false
  },
  {
    id: "prod-3",
    name: "Noise Cancelling Headphones",
    price: 299.00,
    discount: 15,
    rating: 4.7,
    stock: 40,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Premium wireless over-ear headphones featuring industry-leading noise cancellation, custom audio presets, crystal clear call quality, and soft ergonomic memory foam earcups.",
    specifications: [
      { name: "Battery Life", value: "Up to 30 hours" },
      { name: "Bluetooth Version", value: "5.2" },
      { name: "Weight", value: "250g" },
      { name: "Driver Size", value: "40mm" }
    ],
    reviews: [
      { rating: 5, author: "Elena R.", date: "2026-04-10", comment: "The ANC is magical. Commutes are peaceful now." }
    ],
    popular: true,
    newest: false,
    deals: true
  },
  {
    id: "prod-4",
    name: "Minimalist Leather Backpack",
    price: 120.00,
    discount: 0,
    rating: 4.6,
    stock: 8,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Handcrafted from full-grain vegetable-tanned leather, this minimalist backpack fits laptops up to 15 inches. It features heavy-duty brass zippers and padded shoulder straps for durability and style.",
    specifications: [
      { name: "Material", value: "Full-Grain Leather" },
      { name: "Capacity", value: "18L" },
      { name: "Dimensions", value: "42 x 30 x 12 cm" }
    ],
    reviews: [
      { rating: 4, author: "Marcus T.", date: "2026-05-25", comment: "Stunning leather quality. The leather smells great and holds its shape." }
    ],
    popular: false,
    newest: true,
    deals: false
  },
  {
    id: "prod-5",
    name: "Classic Chronograph Watch",
    price: 180.00,
    discount: 20,
    rating: 4.5,
    stock: 15,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"
    ],
    description: "A timeless wrist piece featuring a stainless steel case, sapphire crystal glass, three sub-dials, water resistance up to 50m, and an interchangeable genuine leather strap.",
    specifications: [
      { name: "Case Size", value: "40mm" },
      { name: "Strap Material", value: "Genuine Leather" },
      { name: "Water Resistance", value: "5 ATM" }
    ],
    reviews: [
      { rating: 5, author: "Leo G.", date: "2026-05-30", comment: "Looks much more expensive than it is. Highly recommend!" }
    ],
    popular: true,
    newest: false,
    deals: true
  },
  {
    id: "prod-6",
    name: "Minimalist Table Lamp",
    price: 65.00,
    discount: 10,
    rating: 4.4,
    stock: 3,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Add a soft warm glow to your office or nightstand with this minimalist table lamp featuring a solid oak base, textured fabric drum shade, and a tactile inline switch.",
    specifications: [
      { name: "Light Source", value: "E26 LED bulb included (2700K)" },
      { name: "Base Material", value: "Solid White Oak" },
      { name: "Height", value: "35 cm" }
    ],
    reviews: [
      { rating: 4, author: "Emma B.", date: "2026-03-15", comment: "Gives a warm ambient light. Perfect for reading." }
    ],
    popular: false,
    newest: false,
    deals: true
  },
  {
    id: "prod-7",
    name: "Atomic Habits",
    price: 18.00,
    discount: 15,
    rating: 4.9,
    stock: 100,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop"
    ],
    description: "An easy and proven way to build good habits and break bad ones. World-renowned habits expert James Clear reveals practical strategies to form good habits and break bad ones.",
    specifications: [
      { name: "Author", value: "James Clear" },
      { name: "Publisher", value: "Penguin Random House" },
      { name: "Format", value: "Hardcover" },
      { name: "Pages", value: "320" }
    ],
    reviews: [
      { rating: 5, author: "Chris L.", date: "2026-06-03", comment: "Literally changed my daily routine. A must-read." }
    ],
    popular: true,
    newest: false,
    deals: false
  },
  {
    id: "prod-8",
    name: "Smart Hydration Water Bottle",
    price: 45.00,
    discount: 0,
    rating: 4.3,
    stock: 30,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Keep track of your hydration goals with this smart water bottle. Features double-walled vacuum insulation, Bluetooth sync with health apps, and a glowing base reminder.",
    specifications: [
      { name: "Capacity", value: "650 ml" },
      { name: "Material", value: "18/8 Stainless Steel" },
      { name: "Battery Life", value: "Up to 14 days" }
    ],
    reviews: [
      { rating: 4, author: "Alex J.", date: "2026-05-11", comment: "The glow reminder is super helpful to remember to drink water during office hours." }
    ],
    popular: false,
    newest: true,
    deals: false
  },
  {
    id: "prod-9",
    name: "Ergonomic Office Chair",
    price: 349.00,
    discount: 12,
    rating: 4.7,
    stock: 0, // out of stock to test filter
    category: "Furniture",
    images: [
      "https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Designed for ultimate support and comfort, this ergonomic office chair features adjustable 3D armrests, dynamic lumbar support, breathable mesh backrest, and smooth tilt mechanism.",
    specifications: [
      { name: "Maximum Load", value: "150 kg" },
      { name: "Frame Material", value: "Reinforced Nylon & Steel" },
      { name: "Casters", value: "PU Silent Wheels" }
    ],
    reviews: [
      { rating: 5, author: "Kevin W.", date: "2026-05-22", comment: "My lower back pain has completely vanished since I started using this chair." }
    ],
    popular: true,
    newest: false,
    deals: false
  },
  {
    id: "prod-10",
    name: "Premium Scented Candle",
    price: 24.00,
    discount: 5,
    rating: 4.5,
    stock: 45,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Hand-poured natural soy wax candle scented with organic lavender, amber, and vanilla essential oils. Slow burning with a clean cotton wick.",
    specifications: [
      { name: "Burn Time", value: "Approx. 50 hours" },
      { name: "Wax Type", value: "100% Natural Soy Wax" },
      { name: "Weight", value: "220g" }
    ],
    reviews: [
      { rating: 5, author: "Rachel P.", date: "2026-06-08", comment: "Smells divine! It filled my entire living room with a calming scent." }
    ],
    popular: false,
    newest: false,
    deals: false
  },
  {
    id: "prod-11",
    name: "Organic Matcha Powder",
    price: 32.00,
    discount: 10,
    rating: 4.8,
    stock: 50,
    category: "Grocery",
    images: [
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Ceremonial-grade Japanese organic matcha powder. Stone-ground from pure shade-grown green tea leaves. Rich in antioxidants and L-theanine.",
    specifications: [
      { name: "Grade", value: "Ceremonial Grade" },
      { name: "Origin", value: "Uji, Kyoto, Japan" },
      { name: "Weight", value: "100g" }
    ],
    reviews: [
      { rating: 5, author: "Nora S.", date: "2026-06-05", comment: "Bright green color and smooth sweet taste. Best matcha I have purchased online." }
    ],
    popular: true,
    newest: true,
    deals: true
  },
  {
    id: "prod-12",
    name: "Hydrating Face Serum",
    price: 28.00,
    discount: 0,
    rating: 4.6,
    stock: 60,
    category: "Beauty",
    images: [
      "https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=600&auto=format&fit=crop"
    ],
    description: "A lightweight daily serum formulated with 2% Pure Hyaluronic Acid, Vitamin B5, and soothing chamomile extract to lock in moisture and plump skin.",
    specifications: [
      { name: "Skin Type", value: "All skin types" },
      { name: "Key Ingredients", value: "Hyaluronic Acid, Panthenol" },
      { name: "Volume", value: "50 ml" }
    ],
    reviews: [
      { rating: 5, author: "Tina H.", date: "2026-05-14", comment: "Sinks in beautifully and doesn't feel sticky. Skin is glowing!" }
    ],
    popular: false,
    newest: false,
    deals: false
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Sophia Carter",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    review: "Shopping on QuickCart is lightning fast. The checkout flow is clean and premium, and the delivery arrived early!"
  },
  {
    id: 2,
    name: "Liam Henderson",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    review: "Outstanding quality. The user interface looks just as modern as Apple or Stripe. Highly recommend their smart devices!"
  },
  {
    id: 3,
    name: "Amara Jenkins",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop",
    review: "Easy navigation, beautiful search experience, and high-quality customer support. Truly a cloud-ready platform."
  }
];

export const WHY_CHOOSE_US = [
  {
    icon: "Truck",
    title: "Fast Delivery",
    desc: "Free 2-day shipping on all items over $50, delivered straight to your doorstep."
  },
  {
    icon: "ShieldCheck",
    title: "Secure Payments",
    desc: "End-to-end encrypted transactions via major cards, UPI, and internet banking."
  },
  {
    icon: "Cloud",
    title: "Cloud Powered",
    desc: "Built on optimized serverless technology for sub-second page loads."
  },
  {
    icon: "Star",
    title: "Trusted Products",
    desc: "All catalog listings are curated and verified for authentic quality control."
  },
  {
    icon: "RefreshCw",
    title: "Easy Returns",
    desc: "30-day hassle-free return policy with prepaid shipping labels."
  },
  {
    icon: "Headphones",
    title: "24/7 Support",
    desc: "Round-the-clock live chat customer support to assist you with order inquiries."
  }
];
