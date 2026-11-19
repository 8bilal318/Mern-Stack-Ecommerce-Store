import Notification from "../../models/Notification.js";

// Admin bell icon ke liye recent notifications + unread count
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({ isRead: false });

    res.status(200).json({
      success: true,
      data: { notifications, unreadCount },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching notifications" });
  }
};

// Saari notifications ko "read" mark karna (bell icon click hone par)
export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });

    res
      .status(200)
      .json({ success: true, message: "Notifications marked as read" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error updating notifications" });
  }
};
