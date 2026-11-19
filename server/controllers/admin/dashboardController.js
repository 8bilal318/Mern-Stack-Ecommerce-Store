import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";

const ACTIVE_ORDER_STATUSES = ["pending", "confirmed", "shipped"];

function getMonthRange(offset = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);
  return { start, end };
}

function percentChange(current, previous) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}

function formatTrend(value) {
  const rounded = Math.round(value * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded}%`;
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  const ranges = [
    { label: "year", secs: 31536000 },
    { label: "month", secs: 2592000 },
    { label: "day", secs: 86400 },
    { label: "hour", secs: 3600 },
    { label: "minute", secs: 60 },
  ];

  for (const range of ranges) {
    const count = Math.floor(seconds / range.secs);
    if (count >= 1) {
      return `${count} ${range.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

// Admin dashboard ke liye live stats (revenue, orders, products, customers) aur recent activity
export const getDashboardStats = async (req, res) => {
  try {
    const thisMonth = getMonthRange(0);
    const lastMonth = getMonthRange(-1);

    const [
      totalProducts,
      totalCustomers,
      productsThisMonth,
      productsLastMonth,
      customersThisMonth,
      customersLastMonth,
      activeOrders,
      allOrders,
    ] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: "user" }),
      Product.countDocuments({ createdAt: { $gte: thisMonth.start, $lt: thisMonth.end } }),
      Product.countDocuments({ createdAt: { $gte: lastMonth.start, $lt: lastMonth.end } }),
      User.countDocuments({ role: "user", createdAt: { $gte: thisMonth.start, $lt: thisMonth.end } }),
      User.countDocuments({ role: "user", createdAt: { $gte: lastMonth.start, $lt: lastMonth.end } }),
      Order.countDocuments({ orderStatus: { $in: ACTIVE_ORDER_STATUSES } }),
      Order.find().sort({ createdAt: -1 }),
    ]);

    // Revenue: sirf paid orders count hongi
    const paidOrders = allOrders.filter((order) => order.paymentStatus === "paid");
    const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const revenueThisMonth = paidOrders
      .filter((o) => o.createdAt >= thisMonth.start && o.createdAt < thisMonth.end)
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const revenueLastMonth = paidOrders
      .filter((o) => o.createdAt >= lastMonth.start && o.createdAt < lastMonth.end)
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const ordersThisMonth = allOrders.filter(
      (o) => o.createdAt >= thisMonth.start && o.createdAt < thisMonth.end
    ).length;
    const ordersLastMonth = allOrders.filter(
      (o) => o.createdAt >= lastMonth.start && o.createdAt < lastMonth.end
    ).length;

    const recentOrders = allOrders.slice(0, 5);
    const userIds = [...new Set(recentOrders.map((o) => String(o.userId)))];
    const users = await User.find({ _id: { $in: userIds } }).select("username");
    const userMap = new Map(users.map((u) => [String(u._id), u.username]));

    const recentActivity = recentOrders.map((order) => ({
      id: order._id,
      username: userMap.get(String(order.userId)) || "Guest",
      amount: order.totalAmount,
      status: order.orderStatus,
      timeAgo: timeAgo(order.createdAt),
      createdAt: order.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalRevenueTrend: formatTrend(percentChange(revenueThisMonth, revenueLastMonth)),
        activeOrders,
        activeOrdersTrend: formatTrend(percentChange(ordersThisMonth, ordersLastMonth)),
        totalProducts,
        totalProductsTrend: formatTrend(percentChange(productsThisMonth, productsLastMonth)),
        totalCustomers,
        totalCustomersTrend: formatTrend(percentChange(customersThisMonth, customersLastMonth)),
        recentActivity,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching dashboard stats" });
  }
};
