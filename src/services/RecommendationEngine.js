const RECENTLY_VIEWED_KEY = "quickcart_recently_viewed";

const RecommendationEngine = {
  // Track recently viewed products in localStorage
  trackProductView: (productId) => {
    if (!productId) return;
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      let list = stored ? JSON.parse(stored) : [];
      
      // Filter out this product if already in list, then insert at start
      list = list.filter((id) => id !== productId);
      list.unshift(productId);
      
      // Keep only the 10 most recent views
      if (list.length > 10) {
        list = list.slice(0, 10);
      }
      
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list));
    } catch (err) {
      console.error("Error tracking product view:", err);
    }
  },

  // Get list of recently viewed product IDs
  getRecentlyViewed: () => {
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Error reading recently viewed products:", err);
      return [];
    }
  },

  // Generate recommendations
  getRecommendations: (allProducts, currentProduct = null, cartItems = []) => {
    if (!allProducts || allProducts.length === 0) return [];

    const recentlyViewedIds = RecommendationEngine.getRecentlyViewed();
    const cartProductIds = cartItems.map((item) => item.product?.id || item.id);
    const currentProductId = currentProduct?.id;

    // Filter out products currently in cart or currently being viewed
    let candidates = allProducts.filter((p) => {
      if (currentProductId && p.id === currentProductId) return false;
      if (cartProductIds.includes(p.id)) return false;
      return true;
    });

    // If no candidates remain, return empty
    if (candidates.length === 0) return [];

    // Get categories of cart items and recently viewed items
    const cartCategories = cartItems.map((item) => item.product?.category || item.category).filter(Boolean);
    
    // Find the actual product objects for recently viewed to get their categories
    const recentlyViewedProducts = allProducts.filter((p) => recentlyViewedIds.includes(p.id));
    const recentlyViewedCategories = recentlyViewedProducts.map((p) => p.category).filter(Boolean);

    // Calculate score for each candidate
    const scoredCandidates = candidates.map((product) => {
      let score = 0;

      // 1. Category similarity with Cart Items
      if (cartCategories.includes(product.category)) {
        score += 4.0;
      }

      // 2. Category similarity with Recently Viewed Items
      if (recentlyViewedCategories.includes(product.category)) {
        score += 3.0;
      }

      // 3. Category similarity with Current Product page
      if (currentProduct && product.category === currentProduct.category) {
        score += 2.0;
      }

      // 4. Rating weight
      if (product.rating) {
        score += product.rating * 0.5; // Up to 2.5 points
      }

      // 5. Discount weight (shoppers prefer discounts)
      if (product.discount > 0) {
        score += 1.5;
      }

      // 6. Direct views score (if recently viewed itself, show it higher but not at the very top of recommendations unless high score)
      if (recentlyViewedIds.includes(product.id)) {
        const viewIndex = recentlyViewedIds.indexOf(product.id);
        score += Math.max(0, 2.0 - (viewIndex * 0.2)); // Up to 2 points for very recently viewed
      }

      return {
        product,
        score,
        // Match percentage calculation (purely cosmetic/high visual impact for the UI)
        matchPercentage: Math.min(99, Math.max(70, Math.round(70 + (score * 3.5))))
      };
    });

    // Sort by score descending
    scoredCandidates.sort((a, b) => b.score - a.score);

    // If there is no search/click history, or scores are all very low (e.g. baseline),
    // fallback to sorting by rating/discount (trending products)
    const hasHistory = cartCategories.length > 0 || recentlyViewedCategories.length > 0 || currentProduct;
    
    if (!hasHistory) {
      // Sort candidates by rating * discount multiplier or just general popularity
      const trending = candidates.map((p) => {
        let trendScore = (p.rating || 0) + (p.discount ? p.discount * 0.05 : 0);
        return {
          product: p,
          matchPercentage: Math.min(98, Math.max(85, Math.round(85 + (trendScore * 1.5))))
        };
      });
      trending.sort((a, b) => b.product.rating - a.product.rating);
      return trending.slice(0, 4);
    }

    return scoredCandidates.slice(0, 4);
  }
};

export default RecommendationEngine;
