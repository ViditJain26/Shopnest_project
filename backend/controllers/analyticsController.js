const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const getAdminStats = async (req, res) => {
  try {
    // Run all count and aggregation queries concurrently
    const [totalOrders, totalProducts, totalUsers, revenueAgg] =
      await Promise.all([
        Order.countDocuments({}),
        Product.countDocuments({}),
        User.countDocuments({ role: "user" }),
        Order.aggregate([
          // If you only want to sum completed/paid orders, uncomment the line below:
          // { $match: { isPaid: true } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: { $ifNull: ["$totalAmount", 0] } },
            },
          },
        ]),
      ]);

    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    res.status(200).json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Server error fetching admin stats" });
  }
};

module.exports = { getAdminStats };
