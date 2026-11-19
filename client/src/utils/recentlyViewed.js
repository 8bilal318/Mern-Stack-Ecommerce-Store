const STORAGE_KEY = "recentlyViewedProducts";
const MAX_ITEMS = 4;

// LocalStorage se recently viewed products nikalta hai
export function getRecentlyViewed() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

// Naya product recently viewed list ke start mein add karta hai (duplicate hatakar)
export function addRecentlyViewed(product) {
  if (!product?._id) return;

  const existing = getRecentlyViewed().filter(
    (item) => item._id !== product._id,
  );

  const updated = [product, ...existing].slice(0, MAX_ITEMS);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Same tab ke andar Home page ko turant update karne ke liye custom event
  window.dispatchEvent(new Event("recentlyViewedUpdated"));
}
