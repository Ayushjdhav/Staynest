const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const notificationsController = require("../controllers/notifications");

// Notifications List
router.get("/", isLoggedIn, wrapAsync(notificationsController.index));

// Unread Count (Navbar badge)
router.get("/unread-count", wrapAsync(notificationsController.getUnreadCount));

// Mark Single as Read
router.post("/:id/read", isLoggedIn, wrapAsync(notificationsController.markAsRead));

// Mark All as Read
router.post("/read-all", isLoggedIn, wrapAsync(notificationsController.markAllAsRead));

module.exports = router;
