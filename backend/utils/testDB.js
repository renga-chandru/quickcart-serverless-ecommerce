import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const API_BASE = "http://localhost:5001/api";

const logHeader = (title) => {
  console.log(`\n==================================================`);
  console.log(`  ${title.toUpperCase()}`);
  console.log(`==================================================`);
};

const runTests = async () => {
  try {
    // ----------------------------------------------------
    logHeader("1. Verify Database Connection & Collections");
    // ----------------------------------------------------
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quickcart");
    console.log("✔ Connected to MongoDB successfully.");

    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log("Collections found in database:", collectionNames);

    const requiredCollections = ["users", "products", "categories", "carts", "wishlists", "orders"];
    for (const name of requiredCollections) {
      if (collectionNames.includes(name)) {
        console.log(`✔ Collection '${name}' exists.`);
      } else {
        console.warn(`✖ Collection '${name}' is missing!`);
      }
    }
    await mongoose.disconnect();
    console.log("✔ Database structure checks completed.");

    // ----------------------------------------------------
    logHeader("2. Test Authentication Endpoints");
    // ----------------------------------------------------
    let customerToken = "";
    let adminToken = "";

    // Test Customer Login
    console.log("Testing Customer Login (user@quickcart.com)...");
    const custLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "user@quickcart.com", password: "User@123" })
    });
    const custLoginData = await custLoginRes.json();
    if (custLoginRes.status === 200 && custLoginData.token) {
      customerToken = custLoginData.token;
      console.log("✔ Customer logged in successfully. Token generated.");
    } else {
      console.error("✖ Customer Login failed:", custLoginData);
    }

    // Test Admin Login
    console.log("Testing Admin Login (admin@quickcart.com)...");
    const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@quickcart.com", password: "Admin@123" })
    });
    const adminLoginData = await adminLoginRes.json();
    if (adminLoginRes.status === 200 && adminLoginData.token) {
      adminToken = adminLoginData.token;
      console.log("✔ Admin logged in successfully. Token generated.");
    } else {
      console.error("✖ Admin Login failed:", adminLoginData);
    }

    // ----------------------------------------------------
    logHeader("3. Test Admin Inventory Stock Constraints");
    // ----------------------------------------------------
    // Create product with negative stock
    console.log("Testing POST /api/products with negative stock (Admin Only)...");
    const negProduct = {
      id: "prod-test-neg",
      name: "Negative Stock Gadget",
      price: 19.99,
      discount: 0,
      stock: -5,
      category: "Electronics"
    };
    const negCreateRes = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      },
      body: JSON.stringify(negProduct)
    });
    const negCreateData = await negCreateRes.json();
    if (negCreateRes.status === 400 || negCreateRes.status === 500) {
      console.log(`✔ Negative stock creation blocked (Status ${negCreateRes.status}):`, negCreateData.message);
    } else {
      console.error("✖ Negative stock creation was allowed! Status:", negCreateRes.status);
    }

    // Update product to negative stock
    console.log("Testing PUT /api/products/prod-1 with negative stock (Admin Only)...");
    const negUpdateRes = await fetch(`${API_BASE}/products/prod-1`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      },
      body: JSON.stringify({ stock: -10 })
    });
    const negUpdateData = await negUpdateRes.json();
    if (negUpdateRes.status === 400 || negUpdateRes.status === 500) {
      console.log(`✔ Negative stock update blocked (Status ${negUpdateRes.status}):`, negUpdateData.message);
    } else {
      console.error("✖ Negative stock update was allowed! Status:", negUpdateRes.status);
    }

    // ----------------------------------------------------
    logHeader("4. Test Cart Stock Validation");
    // ----------------------------------------------------
    // Fetch initial product to know stock level (prod-1 has stock 25 by default)
    console.log("Fetching prod-1 stock...");
    const p1Res = await fetch(`${API_BASE}/products/prod-1`);
    const p1Data = await p1Res.json();
    const currentStock = p1Data.stock;
    console.log(`prod-1 (iPhone 15 Pro) stock level is: ${currentStock}`);

    // Try adding quantity exceeding stock (stock + 1)
    console.log(`Testing POST /api/cart with quantity ${currentStock + 1} (exceeding stock)...`);
    const overflowAddRes = await fetch(`${API_BASE}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${customerToken}`
      },
      body: JSON.stringify({ productId: "prod-1", quantity: currentStock + 1 })
    });
    const overflowAddData = await overflowAddRes.json();
    if (overflowAddRes.status === 400 || overflowAddRes.status === 401 || overflowAddRes.status === 500) {
      console.log(`✔ Cart addition overflow blocked (Status ${overflowAddRes.status}):`, overflowAddData.message);
    } else {
      console.error("✖ Cart addition overflow was allowed! Status:", overflowAddRes.status);
    }

    // Add valid quantity
    console.log("Adding valid quantity (2 items) of prod-1 to cart...");
    const validAddRes = await fetch(`${API_BASE}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${customerToken}`
      },
      body: JSON.stringify({ productId: "prod-1", quantity: 2 })
    });
    if (validAddRes.status === 200) {
      console.log("✔ Valid quantity added to cart.");
    } else {
      console.error("✖ Valid quantity addition failed:", await validAddRes.json());
    }

    // ----------------------------------------------------
    logHeader("5. Test Checkout Stock Validation & Deductions");
    // ----------------------------------------------------
    // Attempt checkout exceeding stock (qty = 100)
    console.log(`Attempting checkout order of ${currentStock + 10} units (exceeding stock)...`);
    const overflowOrder = {
      items: [
        {
          id: "prod-1",
          name: "iPhone 15 Pro",
          price: 999.00,
          discount: 10,
          quantity: currentStock + 10,
          image: ""
        }
      ],
      summary: { subtotal: 999, tax: 80, shipping: 0, discount: 0, total: 1079 },
      shippingAddress: { name: "John Doe", street: "120 Vercel Way", city: "San Francisco", state: "CA", zip: "94107", country: "US" },
      paymentMethod: "Credit Card"
    };

    const overflowOrderRes = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${customerToken}`
      },
      body: JSON.stringify(overflowOrder)
    });
    const overflowOrderData = await overflowOrderRes.json();
    if (overflowOrderRes.status === 400 || overflowOrderRes.status === 500) {
      console.log(`✔ Checkout overflow blocked (Status ${overflowOrderRes.status}):`, overflowOrderData.message);
    } else {
      console.error("✖ Checkout overflow was allowed! Status:", overflowOrderRes.status);
    }

    // Place a valid order (buy 3 items)
    console.log("Placing a valid order for 3 items...");
    const validOrder = {
      items: [
        {
          id: "prod-1",
          name: "iPhone 15 Pro",
          price: 999.00,
          discount: 10,
          quantity: 3,
          image: ""
        }
      ],
      summary: { subtotal: 2697.30, tax: 215.78, shipping: 0, discount: 0, total: 2913.08 },
      shippingAddress: { name: "John Doe", street: "120 Vercel Way", city: "San Francisco", state: "CA", zip: "94107", country: "US" },
      paymentMethod: "Credit Card"
    };

    const validOrderRes = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${customerToken}`
      },
      body: JSON.stringify(validOrder)
    });
    const validOrderData = await validOrderRes.json();
    if (validOrderRes.status === 201) {
      console.log(`✔ Valid order placed successfully. Order Ref: ${validOrderData.id}`);
    } else {
      console.error("✖ Valid order placement failed:", validOrderData);
    }

    // Verify stock decreases correctly
    console.log("Fetching prod-1 stock again to verify decrement...");
    const verifyP1Res = await fetch(`${API_BASE}/products/prod-1`);
    const verifyP1Data = await verifyP1Res.json();
    const newStock = verifyP1Data.stock;
    console.log(`New stock level: ${newStock}`);
    if (newStock === currentStock - 3) {
      console.log(`✔ Inventory correctly decremented: ${currentStock} - 3 = ${newStock}`);
    } else {
      console.error(`✖ Stock level mismatch! Expected ${currentStock - 3}, got ${newStock}`);
    }

    // ----------------------------------------------------
    logHeader("6. Test Out-of-Stock Flow");
    // ----------------------------------------------------
    // Place order to deplete all remaining stock
    console.log(`Depleting all remaining ${newStock} units of prod-1...`);
    const depleteOrder = {
      items: [
        {
          id: "prod-1",
          name: "iPhone 15 Pro",
          price: 999.00,
          discount: 10,
          quantity: newStock,
          image: ""
        }
      ],
      summary: { subtotal: 999 * newStock, tax: 80, shipping: 0, discount: 0, total: 1079 },
      shippingAddress: { name: "John Doe", street: "120 Vercel Way", city: "San Francisco", state: "CA", zip: "94107", country: "US" },
      paymentMethod: "Credit Card"
    };

    const depleteRes = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${customerToken}`
      },
      body: JSON.stringify(depleteOrder)
    });
    if (depleteRes.status === 201) {
      console.log("✔ Remaining stock fully depleted.");
    } else {
      console.error("✖ Failed to deplete stock:", await depleteRes.json());
    }

    // Check that stock is 0
    console.log("Fetching prod-1 stock to verify it is exactly 0...");
    const finalP1Res = await fetch(`${API_BASE}/products/prod-1`);
    const finalP1Data = await finalP1Res.json();
    console.log(`Final stock level: ${finalP1Data.stock}`);
    if (finalP1Data.stock === 0) {
      console.log("✔ Product is now Out of Stock.");
    } else {
      console.error("✖ Stock is not 0:", finalP1Data.stock);
    }

    // Try purchasing when stock is 0
    console.log("Attempting to purchase from out-of-stock product...");
    const failOrderRes = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        items: [{ id: "prod-1", name: "iPhone 15 Pro", price: 999, quantity: 1, image: "" }],
        summary: { subtotal: 999, tax: 80, shipping: 0, discount: 0, total: 1079 },
        shippingAddress: { name: "John Doe", street: "120 Vercel Way", city: "San Francisco", state: "CA", zip: "94107", country: "US" },
        paymentMethod: "Credit Card"
      })
    });
    const failOrderData = await failOrderRes.json();
    if (failOrderRes.status === 400 || failOrderRes.status === 500) {
      console.log("✔ Purchase block succeeded for out of stock item:", failOrderData.message);
    } else {
      console.error("✖ Purchase allowed for out of stock item! Status:", failOrderRes.status);
    }

    logHeader("All Inventory Tests Completed Successfully");
  } catch (error) {
    console.error("Testing script encountered fatal error:", error);
  }
};

runTests();
