import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (res.ok) {
          setFormData({
            name: data.name || "",
            description: data.description || "",
            price: data.price || "",
            category: data.category || "",
            stock: data.stock || "",
          });
          setCurrentImageUrl(data.image || "");
        } else {
          alert(data.message || "Product not found");
          navigate("/admin/products");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    if (image) {
      data.append("image", image);
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user.token}` },
        body: data,
      });
      const responseData = await res.json();

      if (res.ok) {
        alert("Product updated successfully!");
        navigate("/admin/products");
      } else {
        alert(responseData.message || "Error updating product");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ textAlign: "center", margin: "50px 0", color: "#f97316" }}>
        Loading product details...
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ color: "#f97316", marginBottom: "20px" }}>Edit Product</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="text"
          placeholder="Product Name"
          value={formData.name}
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={inputStyle}
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          required
          rows="4"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          required
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          required
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Stock Quantity"
          value={formData.stock}
          required
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          style={inputStyle}
        />

        {currentImageUrl && (
          <div style={{ marginBottom: "10px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#a1a1aa",
              }}
            >
              Current Image:
            </label>
            <img
              src={currentImageUrl}
              alt="Current product"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #27272a",
              }}
            />
          </div>
        )}

        <div
          style={{
            padding: "15px",
            border: "1px dashed #f97316",
            borderRadius: "8px",
          }}
        >
          <label
            style={{ display: "block", marginBottom: "10px", color: "#a1a1aa" }}
          >
            Replace Product Image (Optional - Cloudinary)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ color: "#fff" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn"
          style={{ marginTop: "10px" }}
        >
          {loading ? "Updating Product..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

const containerStyle = {
  maxWidth: "600px",
  margin: "40px auto",
  background: "#18181b",
  padding: "40px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.05)",
};

const inputStyle = {
  padding: "12px",
  background: "#09090b",
  border: "1px solid #27272a",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "15px",
  outline: "none",
};

export default EditProduct;
