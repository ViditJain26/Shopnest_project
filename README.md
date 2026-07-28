<div align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/3514/3514491.png" alt="ShopNest Logo" width="80" />
  <h1>ShopNest - Full-Stack MERN E-Commerce App</h1>
  <p>A professionally engineered, full-stack E-commerce platform built strictly using modern standard React (CRA) on the frontend and Express/MongoDB on the backend.</p>
</div>

---

## 🛠 Tech Stack Details

- **Frontend:** Pure React.js (`react-scripts`), Redux Toolkit (for Cart state management), AuthContext API (for JWT user sessions).
- **Backend:** Node.js, Express.js architecture mapped with middleware-based routing.
- **Database:** MongoDB (via Mongoose schemas).
- **Features:** Unified Admin Dashboard, Direct Cloudinary Content Maps, Personal User Profiles matching mapped Order Histories.
- **Payments:** Razorpay fully implemented (utilize your test metrics or placeholder).
- **Cloud Storage:** Cloudinary integration for Product image uploading securely via Multer.

---

## 🚀 Quick Start / Local Development Guide

The workspace is configured beautifully using a monorepo-friendly setup with `concurrently`, enabling you to start everything from the very root folder.

### 1️⃣ Dependencies & Environments
Make sure you have MongoDB running locally, or map it to a remote database string.

Inside the `backend/` folder, ensure your `.env` looks like this:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/shopnest
JWT_SECRET=super_secret_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret