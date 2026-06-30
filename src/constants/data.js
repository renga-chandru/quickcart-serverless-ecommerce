export const CATEGORIES = [
  { id: "electronics", name: "Electronics", icon: "Laptop", count: 3, image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600&auto=format&fit=crop" },
  { id: "fashion", name: "Fashion", icon: "Shirt", count: 2, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop" },
  { id: "home", name: "Home & Kitchen", icon: "Home", count: 2, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop" },
  { id: "books", name: "Books", icon: "BookOpen", count: 1, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop" },
  { id: "sports", name: "Sports", icon: "Dumbbell", count: 1, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop" },
  { id: "grocery", name: "Groceries", icon: "Apple", count: 1, image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop" },
  { id: "beauty", name: "Beauty & Personal Care", icon: "Sparkles", count: 1, image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=600&auto=format&fit=crop" },
  { id: "furniture", name: "Furniture", icon: "Armchair", count: 1, image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600&auto=format&fit=crop" },
  { id: "mobiles", name: "Mobiles", icon: "Smartphone", count: 4, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop" },
  { id: "laptops", name: "Laptops", icon: "Laptop", count: 4, image: "https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?q=80&w=600&auto=format&fit=crop" },
  { id: "headphones", name: "Headphones", icon: "Headphones", count: 4, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop" },
  { id: "smartwatches", name: "Smartwatches", icon: "Watch", count: 4, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop" },
  { id: "accessories", name: "Accessories", icon: "Keyboard", count: 4, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop" },
  { id: "clothing", name: "Clothing", icon: "Shirt", count: 4, image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&auto=format&fit=crop" },
  { id: "shoes", name: "Shoes", icon: "Footprints", count: 4, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop" }
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
    category: "Home & Kitchen",
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
    stock: 10,
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
    category: "Home & Kitchen",
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
    category: "Groceries",
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
    category: "Beauty & Personal Care",
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
  },
  // Mobiles (prod-13 to prod-16)
  {
    id: "prod-13",
    name: "Samsung Galaxy S24 Ultra",
    price: 1299.00,
    discount: 10,
    rating: 4.8,
    stock: 20,
    category: "Mobiles",
    brand: "Samsung",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Experience the ultimate smartphone with the Samsung Galaxy S24 Ultra, featuring Galaxy AI, a built-in S Pen, and a 200MP camera system.",
    specifications: [
      { name: "Brand", value: "Samsung" },
      { name: "Processor", value: "Snapdragon 8 Gen 3" },
      { name: "Display", value: "6.8 inches Dynamic AMOLED 2X" },
      { name: "Camera", value: "200MP Main | 50MP Telephoto | 12MP Ultra Wide" },
      { name: "Storage", value: "256GB" }
    ],
    reviews: [
      { rating: 5, author: "Aron P.", date: "2026-06-10", comment: "The AI photo editor is pure magic. S Pen is very handy!" }
    ],
    popular: true,
    newest: true,
    deals: true
  },
  {
    id: "prod-14",
    name: "Google Pixel 8 Pro",
    price: 999.00,
    discount: 15,
    rating: 4.7,
    stock: 15,
    category: "Mobiles",
    brand: "Google",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Google's pro-level smartphone powered by Google Tensor G3. Features advanced photo and video editing capabilities and 7 years of OS updates.",
    specifications: [
      { name: "Brand", value: "Google" },
      { name: "Processor", value: "Google Tensor G3" },
      { name: "Display", value: "6.7 inches Super Actua Display" },
      { name: "Camera", value: "50MP Main | 48MP Telephoto | 48MP Ultra Wide" },
      { name: "Storage", value: "128GB" }
    ],
    reviews: [
      { rating: 5, author: "Lily K.", date: "2026-06-11", comment: "Best Android experience. Camera is unparalleled." }
    ],
    popular: false,
    newest: true,
    deals: true
  },
  {
    id: "prod-15",
    name: "OnePlus 12",
    price: 799.00,
    discount: 5,
    rating: 4.6,
    stock: 22,
    category: "Mobiles",
    brand: "OnePlus",
    images: [
      "https://images.unsplash.com/photo-1565849906461-0e443307986c?q=80&w=600&auto=format&fit=crop"
    ],
    description: "The OnePlus 12 features the Snapdragon 8 Gen 3, a 2K Oriental Screen, and 4th Gen Hasselblad Camera System for Mobile.",
    specifications: [
      { name: "Brand", value: "OnePlus" },
      { name: "Processor", value: "Snapdragon 8 Gen 3" },
      { name: "Display", value: "6.82 inches 2K AMOLED" },
      { name: "Camera", value: "50MP Main | 64MP Telephoto | 48MP Ultra Wide" },
      { name: "Storage", value: "256GB" }
    ],
    reviews: [
      { rating: 4, author: "Marcus V.", date: "2026-06-12", comment: "Charges incredibly fast with the 100W charger. Great screen." }
    ],
    popular: true,
    newest: false,
    deals: false
  },
  {
    id: "prod-16",
    name: "Apple iPhone 15",
    price: 799.00,
    discount: 0,
    rating: 4.8,
    stock: 30,
    category: "Mobiles",
    brand: "Apple",
    images: [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Featuring Dynamic Island, a 48MP Main camera, and USB-C, all in a durable color-infused glass and aluminum design.",
    specifications: [
      { name: "Brand", value: "Apple" },
      { name: "Processor", value: "A16 Bionic chip" },
      { name: "Display", value: "6.1 inches Super Retina XDR OLED" },
      { name: "Camera", value: "48MP Main | 12MP Ultra Wide" },
      { name: "Storage", value: "128GB" }
    ],
    reviews: [
      { rating: 5, author: "John S.", date: "2026-06-14", comment: "Solid upgrade, Dynamic Island is extremely useful and USB-C makes life simple." }
    ],
    popular: false,
    newest: true,
    deals: false
  },
  // Laptops (prod-17 to prod-20)
  {
    id: "prod-17",
    name: "Dell XPS 15",
    price: 1599.00,
    discount: 8,
    rating: 4.7,
    stock: 10,
    category: "Laptops",
    brand: "Dell",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600&auto=format&fit=crop"
    ],
    description: "The Dell XPS 15 delivers high performance in a sleek, lightweight aluminum and carbon fiber design, featuring a stunning InfinityEdge display.",
    specifications: [
      { name: "Brand", value: "Dell" },
      { name: "Processor", value: "Intel Core i7-13700H" },
      { name: "RAM", value: "16GB DDR5" },
      { name: "Storage", value: "1TB NVMe SSD" },
      { name: "Graphics", value: "NVIDIA GeForce RTX 4050" }
    ],
    reviews: [
      { rating: 5, author: "Tyler W.", date: "2026-06-05", comment: "Perfect balance of power and portability. The screen is gorgeous." }
    ],
    popular: true,
    newest: true,
    deals: true
  },
  {
    id: "prod-18",
    name: "Lenovo ThinkPad X1 Carbon",
    price: 1799.00,
    discount: 10,
    rating: 4.8,
    stock: 8,
    category: "Laptops",
    brand: "Lenovo",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop"
    ],
    description: "The ultimate business laptop. Ultralight carbon fiber chassis, legendary keyboard comfort, and robust security features.",
    specifications: [
      { name: "Brand", value: "Lenovo" },
      { name: "Processor", value: "Intel Core i7-1355U" },
      { name: "RAM", value: "32GB LPDDR5" },
      { name: "Storage", value: "1TB NVMe SSD" },
      { name: "Battery", value: "Up to 15 hours" }
    ],
    reviews: [
      { rating: 5, author: "Evelyn R.", date: "2026-06-08", comment: "The keyboard is absolutely the best in the industry. Highly durable." }
    ],
    popular: false,
    newest: false,
    deals: false
  },
  {
    id: "prod-19",
    name: "HP Spectre x360",
    price: 1399.00,
    discount: 12,
    rating: 4.6,
    stock: 12,
    category: "Laptops",
    brand: "HP",
    images: [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Premium convertible 2-in-1 laptop featuring a gorgeous OLED touch display, premium audio, and exceptional battery life.",
    specifications: [
      { name: "Brand", value: "HP" },
      { name: "Processor", value: "Intel Core i7-1360P" },
      { name: "RAM", value: "16GB LPDDR5" },
      { name: "Storage", value: "512GB NVMe SSD" },
      { name: "Display", value: "13.5-inch 3K2K OLED Touch" }
    ],
    reviews: [
      { rating: 4, author: "Rachel S.", date: "2026-06-09", comment: "Stunning build quality. Tablet mode works incredibly well with the stylus." }
    ],
    popular: true,
    newest: true,
    deals: true
  },
  {
    id: "prod-20",
    name: "ASUS ROG Zephyrus G14",
    price: 1499.00,
    discount: 5,
    rating: 4.9,
    stock: 15,
    category: "Laptops",
    brand: "ASUS",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Powerful 14-inch gaming laptop that balances portability with high-end AMD Ryzen processors and NVIDIA graphics.",
    specifications: [
      { name: "Brand", value: "ASUS" },
      { name: "Processor", value: "AMD Ryzen 9 7940HS" },
      { name: "RAM", value: "16GB DDR5" },
      { name: "Storage", value: "1TB PCIe 4.0 SSD" },
      { name: "Graphics", value: "NVIDIA GeForce RTX 4060" }
    ],
    reviews: [
      { rating: 5, author: "Gabriel T.", date: "2026-06-15", comment: "Best gaming laptop. Thin, light, runs all games at max settings smoothly." }
    ],
    popular: true,
    newest: false,
    deals: false
  },
  // Headphones (prod-21 to prod-24)
  {
    id: "prod-21",
    name: "Sony WH-1000XM5",
    price: 399.00,
    discount: 10,
    rating: 4.8,
    stock: 30,
    category: "Headphones",
    brand: "Sony",
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Industry-leading noise cancelling wireless over-ear headphones with auto noise-cancelling optimizer and crystal clear hands-free calling.",
    specifications: [
      { name: "Brand", value: "Sony" },
      { name: "Battery Life", value: "Up to 30 hours" },
      { name: "Charging", value: "USB-C Fast Charge" },
      { name: "Driver Size", value: "30mm" },
      { name: "Bluetooth Version", value: "5.2" }
    ],
    reviews: [
      { rating: 5, author: "Michael B.", date: "2026-06-03", comment: "Absolute silence in the plane. Sound quality is superb!" }
    ],
    popular: true,
    newest: true,
    deals: true
  },
  {
    id: "prod-22",
    name: "Bose QuietComfort Ultra",
    price: 429.00,
    discount: 8,
    rating: 4.7,
    stock: 25,
    category: "Headphones",
    brand: "Bose",
    images: [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Premium spatial audio headphones with world-class noise cancellation, CustomTune technology, and luxurious materials.",
    specifications: [
      { name: "Brand", value: "Bose" },
      { name: "Battery Life", value: "Up to 24 hours" },
      { name: "Spatial Audio", value: "Yes (Immersive Audio Mode)" },
      { name: "Bluetooth Version", value: "5.3" },
      { name: "Weight", value: "250g" }
    ],
    reviews: [
      { rating: 5, author: "Chloe F.", date: "2026-06-05", comment: "So comfortable, I can wear them all day. The spatial audio is fascinating." }
    ],
    popular: true,
    newest: false,
    deals: false
  },
  {
    id: "prod-23",
    name: "Apple AirPods Max",
    price: 549.00,
    discount: 5,
    rating: 4.8,
    stock: 18,
    category: "Headphones",
    brand: "Apple",
    images: [
      "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Apple-designed dynamic driver provides high-fidelity audio. Active Noise Cancellation blocks outside noise, and Transparency mode lets it in.",
    specifications: [
      { name: "Brand", value: "Apple" },
      { name: "Driver Type", value: "Dynamic" },
      { name: "Battery Life", value: "Up to 20 hours" },
      { name: "Chip", value: "Apple H1 chip (in each ear cup)" },
      { name: "Weight", value: "385g" }
    ],
    reviews: [
      { rating: 5, author: "James N.", date: "2026-06-11", comment: "Integration with Apple ecosystem is amazing. Material quality is top tier." }
    ],
    popular: false,
    newest: true,
    deals: false
  },
  {
    id: "prod-24",
    name: "Sennheiser Momentum 4",
    price: 349.00,
    discount: 15,
    rating: 4.9,
    stock: 20,
    category: "Headphones",
    brand: "Sennheiser",
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Sennheiser Signature Sound with custom EQ. Features Adaptive Noise Cancellation and a phenomenal 60-hour battery life.",
    specifications: [
      { name: "Brand", value: "Sennheiser" },
      { name: "Battery Life", value: "Up to 60 hours" },
      { name: "Driver Size", value: "42mm" },
      { name: "Bluetooth Version", value: "5.2" },
      { name: "Codecs Supported", value: "SBC, AAC, aptX, aptX Adaptive" }
    ],
    reviews: [
      { rating: 5, author: "George L.", date: "2026-06-14", comment: "60 hours battery life is not a joke. Best audio reproduction in this class." }
    ],
    popular: true,
    newest: true,
    deals: true
  },
  // Smartwatches (prod-25 to prod-28)
  {
    id: "prod-25",
    name: "Apple Watch Series 9",
    price: 399.00,
    discount: 0,
    rating: 4.8,
    stock: 25,
    category: "Smartwatches",
    brand: "Apple",
    images: [
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Features the S9 SiP chip, double tap gesture, bright Always-On Retina display, and advanced health sensors.",
    specifications: [
      { name: "Brand", value: "Apple" },
      { name: "Chip", value: "S9 SiP" },
      { name: "Display Size", value: "45mm" },
      { name: "Sensors", value: "ECG, Blood Oxygen, Temperature" },
      { name: "Water Resistance", value: "50m" }
    ],
    reviews: [
      { rating: 5, author: "Sophia V.", date: "2026-06-10", comment: "The double tap gesture is incredibly convenient when holding groceries." }
    ],
    popular: true,
    newest: true,
    deals: false
  },
  {
    id: "prod-26",
    name: "Samsung Galaxy Watch 6",
    price: 299.00,
    discount: 10,
    rating: 4.6,
    stock: 20,
    category: "Smartwatches",
    brand: "Samsung",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Monitor sleep quality, body composition, heart rate, and steps with a sleek dynamic AMOLED display.",
    specifications: [
      { name: "Brand", value: "Samsung" },
      { name: "Processor", value: "Exynos W930" },
      { name: "Display", value: "1.4 inches Super AMOLED" },
      { name: "OS", value: "Wear OS Powered by Samsung" },
      { name: "RAM", value: "2GB" }
    ],
    reviews: [
      { rating: 4, author: "Ian G.", date: "2026-06-12", comment: "Beautiful bezel and sleep coaching really works well. Battery lasts about 1.5 days." }
    ],
    popular: false,
    newest: true,
    deals: true
  },
  {
    id: "prod-27",
    name: "Garmin Fenix 7",
    price: 699.00,
    discount: 5,
    rating: 4.9,
    stock: 12,
    category: "Smartwatches",
    brand: "Garmin",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Rugged multi-sport GPS watch featuring solar charging, preloaded topo maps, and intensive training analysis.",
    specifications: [
      { name: "Brand", value: "Garmin" },
      { name: "Lens Material", value: "Power Glass (Solar Charging)" },
      { name: "Battery Life", value: "Up to 22 days in smartwatch mode" },
      { name: "GPS", value: "Multi-band GNSS" },
      { name: "Weight", value: "79g" }
    ],
    reviews: [
      { rating: 5, author: "Nathan D.", date: "2026-06-13", comment: "A beast of a watch. Battery life is incredible with solar helper. Highly durable." }
    ],
    popular: true,
    newest: false,
    deals: false
  },
  {
    id: "prod-28",
    name: "Fitbit Sense 2",
    price: 229.00,
    discount: 15,
    rating: 4.5,
    stock: 25,
    category: "Smartwatches",
    brand: "Fitbit",
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Advanced health and fitness smartwatch with stress detection, sleep profile tracker, ECG, and built-in Google Maps.",
    specifications: [
      { name: "Brand", value: "Fitbit" },
      { name: "Battery Life", value: "Up to 6 days" },
      { name: "Sensors", value: "cEDA (stress tracker), ECG, SpO2" },
      { name: "Compatibilty", value: "iOS and Android" },
      { name: "Charge Time", value: "2 hours" }
    ],
    reviews: [
      { rating: 5, author: "Alice M.", date: "2026-06-15", comment: "Light, great battery life, and stress alerts help me pause throughout the day." }
    ],
    popular: false,
    newest: false,
    deals: true
  },
  // Accessories (prod-29 to prod-32)
  {
    id: "prod-29",
    name: "Anker GaNPrime 120W Charger",
    price: 79.00,
    discount: 10,
    rating: 4.8,
    stock: 50,
    category: "Accessories",
    brand: "Anker",
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Powerful 3-port wall charger powered by GaNPrime technology, supporting simultaneous fast charging for up to 3 devices.",
    specifications: [
      { name: "Brand", value: "Anker" },
      { name: "Output Power", value: "120W Max" },
      { name: "Ports", value: "2x USB-C | 1x USB-A" },
      { name: "Technology", value: "GaNPrime, PowerIQ 4.0" },
      { name: "Dimensions", value: "43 x 32 x 80 mm" }
    ],
    reviews: [
      { rating: 5, author: "Luke H.", date: "2026-06-08", comment: "Replaced all my travel bricks. Power is enough to charge my laptop and phone fast." }
    ],
    popular: true,
    newest: true,
    deals: true
  },
  {
    id: "prod-30",
    name: "Logitech MX Master 3S",
    price: 99.00,
    discount: 5,
    rating: 4.9,
    stock: 40,
    category: "Accessories",
    brand: "Logitech",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Iconic ergonomic performance wireless mouse featuring Quiet Click switches and 8,000 DPI tracking on glass.",
    specifications: [
      { name: "Brand", value: "Logitech" },
      { name: "Sensor Resolution", value: "200 to 8000 DPI" },
      { name: "Scroll Wheel", value: "MagSpeed electromagnetic scroll wheel" },
      { name: "Connectivity", value: "Bluetooth & Logi Bolt Receiver" },
      { name: "Battery Life", value: "Up to 70 days on full charge" }
    ],
    reviews: [
      { rating: 5, author: "Kevin F.", date: "2026-06-10", comment: "Extremely comfortable for my hands. Scroll wheel feels like engineering art." }
    ],
    popular: true,
    newest: false,
    deals: false
  },
  {
    id: "prod-31",
    name: "Keychron K2 Mechanical Keyboard",
    price: 89.00,
    discount: 0,
    rating: 4.7,
    stock: 30,
    category: "Accessories",
    brand: "Keychron",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Compact 75% layout wireless mechanical keyboard with Gateron G Pro switches and double-shot keycaps.",
    specifications: [
      { name: "Brand", value: "Keychron" },
      { name: "Layout", value: "75% Layout (84 keys)" },
      { name: "Switch Type", value: "Gateron Brown (Hot-swappable)" },
      { name: "Backlight", value: "RGB backlighting (18 presets)" },
      { name: "Compatibility", value: "macOS, Windows, iOS, Android" }
    ],
    reviews: [
      { rating: 5, author: "Sam T.", date: "2026-06-12", comment: "Great typing feel. Works flawlessly with my Mac out of the box." }
    ],
    popular: false,
    newest: true,
    deals: false
  },
  {
    id: "prod-32",
    name: "Belkin 3-in-1 Wireless Charger",
    price: 149.00,
    discount: 10,
    rating: 4.6,
    stock: 25,
    category: "Accessories",
    brand: "Belkin",
    images: [
      "https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Charge your iPhone, Apple Watch, and AirPods simultaneously with MagSafe fast wireless charging up to 15W.",
    specifications: [
      { name: "Brand", value: "Belkin" },
      { name: "Technology", value: "Official MagSafe" },
      { name: "Output Power", value: "15W MagSafe | 5W Watch | 5W AirPods" },
      { name: "Design", value: "Premium chrome architectural finish" },
      { name: "Compatibility", value: "iPhone 12+ series, Apple Watch, AirPods" }
    ],
    reviews: [
      { rating: 4, author: "Julia W.", date: "2026-06-13", comment: "Looks wonderful on my bedside table. MagSafe magnet is very strong." }
    ],
    popular: true,
    newest: true,
    deals: true
  },
  // Clothing (prod-33 to prod-36)
  {
    id: "prod-33",
    name: "Organic Cotton Classic T-Shirt",
    price: 35.00,
    discount: 0,
    rating: 4.5,
    stock: 100,
    category: "Clothing",
    brand: "Everlane",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop"
    ],
    description: "A timeless t-shirt crafted from 100% GOTS-certified organic cotton. Extremely soft, breathable, and pre-shrunk for the perfect fit.",
    specifications: [
      { name: "Brand", value: "Everlane" },
      { name: "Material", value: "100% Organic Cotton" },
      { name: "Fit", value: "Standard Fit" },
      { name: "Weight", value: "160 gsm" },
      { name: "Care Instructions", value: "Machine wash cold, tumble dry low" }
    ],
    reviews: [
      { rating: 5, author: "Chris E.", date: "2026-06-02", comment: "Super soft shirt. Retains shape after washing." }
    ],
    popular: false,
    newest: true,
    deals: false
  },
  {
    id: "prod-34",
    name: "Levi's Premium Denim Jacket",
    price: 98.00,
    discount: 15,
    rating: 4.7,
    stock: 45,
    category: "Clothing",
    brand: "Levi's",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600&auto=format&fit=crop"
    ],
    description: "An iconic denim jacket made with premium heavy-weight cotton denim, featuring buttoned chest pockets and side welt pockets.",
    specifications: [
      { name: "Brand", value: "Levi's" },
      { name: "Material", value: "100% Cotton Denim" },
      { name: "Pockets", value: "2 chest pockets, 2 side welt pockets" },
      { name: "Fit", value: "Regular Fit" },
      { name: "Weight", value: "12.5 oz Denim" }
    ],
    reviews: [
      { rating: 5, author: "James B.", date: "2026-06-08", comment: "A timeless classic. Runs slightly small, order a size up." }
    ],
    popular: true,
    newest: false,
    deals: true
  },
  {
    id: "prod-35",
    name: "Patagonia Merino Wool Sweater",
    price: 129.00,
    discount: 10,
    rating: 4.8,
    stock: 25,
    category: "Clothing",
    brand: "Patagonia",
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Warm, breathable, and responsibly sourced merino wool crewneck sweater. Naturally odor-resistant and soft on skin.",
    specifications: [
      { name: "Brand", value: "Patagonia" },
      { name: "Material", value: "100% Responsibly Sourced Merino Wool" },
      { name: "Knit Type", value: "Fine knit crewneck" },
      { name: "Care", value: "Hand wash cold, dry flat" },
      { name: "Weight", value: "280g" }
    ],
    reviews: [
      { rating: 5, author: "Sarah C.", date: "2026-06-11", comment: "Warm and looks elegant. No scratchiness at all, feels very soft." }
    ],
    popular: true,
    newest: true,
    deals: false
  },
  {
    id: "prod-36",
    name: "Nike Athletic Training Shorts",
    price: 40.00,
    discount: 0,
    rating: 4.6,
    stock: 80,
    category: "Clothing",
    brand: "Nike",
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Designed for intensive training, featuring sweat-wicking Dri-FIT fabric and breathable mesh panels for dynamic movement.",
    specifications: [
      { name: "Brand", value: "Nike" },
      { name: "Material", value: "100% Recycled Polyester" },
      { name: "Inseam", value: "7 inches" },
      { name: "Technology", value: "Dri-FIT moisture-wicking" },
      { name: "Pockets", value: "Zippered side pockets" }
    ],
    reviews: [
      { rating: 4, author: "Alex L.", date: "2026-06-13", comment: "Great training shorts. Pocket zippers are solid." }
    ],
    popular: false,
    newest: true,
    deals: false
  },
  // Shoes (prod-37 to prod-40)
  {
    id: "prod-37",
    name: "Adidas UltraBoost Running Shoes",
    price: 190.00,
    discount: 10,
    rating: 4.9,
    stock: 35,
    category: "Shoes",
    brand: "Adidas",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop"
    ],
    description: "High-performance running shoes featuring responsive Boost cushioning, Primeknit upper, and Continental Rubber outsole.",
    specifications: [
      { name: "Brand", value: "Adidas" },
      { name: "Midsole Technology", value: "Boost energy return" },
      { name: "Upper Material", value: "Primeknit (50% Parley Ocean Plastic)" },
      { name: "Outsole", value: "Continental Better Rubber" },
      { name: "Weight", value: "310g" }
    ],
    reviews: [
      { rating: 5, author: "David P.", date: "2026-06-05", comment: "Feels like walking on clouds. Highly recommended for long runs." }
    ],
    popular: true,
    newest: true,
    deals: true
  },
  {
    id: "prod-38",
    name: "Nike Classic Leather Sneakers",
    price: 85.00,
    discount: 5,
    rating: 4.7,
    stock: 50,
    category: "Shoes",
    brand: "Nike",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Retro-style classic leather sneakers offering retro court aesthetics with modern padded sockliners.",
    specifications: [
      { name: "Brand", value: "Nike" },
      { name: "Upper Material", value: "Full-Grain Leather" },
      { name: "Outsole", value: "Non-marking herringbone rubber" },
      { name: "Design Theme", value: "Retro Court Heritage" },
      { name: "Lining", value: "Soft textile lining" }
    ],
    reviews: [
      { rating: 5, author: "Mason J.", date: "2026-06-10", comment: "Goes with almost everything. Simple, clean, durable." }
    ],
    popular: true,
    newest: false,
    deals: false
  },
  {
    id: "prod-39",
    name: "Columbia Waterproof Hiking Boots",
    price: 130.00,
    discount: 15,
    rating: 4.8,
    stock: 20,
    category: "Shoes",
    brand: "Columbia",
    images: [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Heavy-duty waterproof hiking boots featuring Techlite lightweight midsoles and Omni-Grip advanced traction rubber outsoles.",
    specifications: [
      { name: "Brand", value: "Columbia" },
      { name: "Waterproof Level", value: "Omni-Tech waterproof bootie membrane" },
      { name: "Midsole", value: "Techlite lightweight cushion" },
      { name: "Outsole", value: "Omni-Grip non-marking traction rubber" },
      { name: "Weight", value: "480g" }
    ],
    reviews: [
      { rating: 5, author: "Erick M.", date: "2026-06-12", comment: "Kept my feet dry during a rainy hike. Extremely comfortable on rocky paths." }
    ],
    popular: false,
    newest: true,
    deals: true
  },
  {
    id: "prod-40",
    name: "Ugg Cozy Suede Slippers",
    price: 100.00,
    discount: 0,
    rating: 4.6,
    stock: 30,
    category: "Shoes",
    brand: "Ugg",
    images: [
      "https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Premium slip-on slippers featuring soft suede, genuine UGGpure wool lining, and lightweight flexible EVA outsoles.",
    specifications: [
      { name: "Brand", value: "Ugg" },
      { name: "Material", value: "Genuine Suede Upper" },
      { name: "Lining", value: "UGGpure wool lining" },
      { name: "Outsole", value: "Treadlite by UGG EVA" },
      { name: "Type", value: "Slip-on indoor/outdoor" }
    ],
    reviews: [
      { rating: 5, author: "Emma K.", date: "2026-06-14", comment: "Unbelievably warm. Perfect for cold mornings." }
    ],
    popular: true,
    newest: true,
    deals: false
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Menon – Kochi",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    review: "Shopping on QuickCart is extremely convenient and fast. The checkout flow is very smooth, and my delivery arrived a day early in Kochi!"
  },
  {
    id: 2,
    name: "Rahul Kumar – Chennai",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    review: "Outstanding quality. The user interface is very clean and easy to navigate. Highly recommend their home & kitchen catalog!"
  },
  {
    id: 3,
    name: "Ananya Sharma – Bengaluru",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop",
    review: "Excellent collection of products, fast delivery, and very responsive customer support. Truly the best shopping platform."
  }
];

export const WHY_CHOOSE_US = [
  {
    icon: "Truck",
    title: "Fast Delivery",
    desc: "Free shipping across India on all orders over ₹499, delivered straight to your doorstep."
  },
  {
    icon: "ShieldCheck",
    title: "Secure Payments",
    desc: "End-to-end encrypted transactions via major cards, UPI, and net banking."
  },
  {
    icon: "Star",
    title: "100% Genuine Products",
    desc: "All catalog listings are curated and verified directly from trusted brands for authentic quality."
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
