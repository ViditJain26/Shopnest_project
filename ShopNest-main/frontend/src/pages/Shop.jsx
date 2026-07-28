import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../styles/product.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        // Safely extract products array whether API returns direct array or { products: [...] }
        const productList = Array.isArray(data) ? data : data.products || [];

        // Reverse array so newly added products show up at the top
        setProducts(productList.reverse());
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Safe filter using optional chaining and fallback empty string
  const filteredProducts = products.filter((p) => {
    const name = p?.name || p?.title || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="shop-container">
      <h2>All Products</h2>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="no-products">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Shop;
