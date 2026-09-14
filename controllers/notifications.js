const Notification = require("../models/notification");

// Get notifications for current user
module.exports.index = async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .limit(30);

    if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
        return res.json({ success: true, notifications });
    }

    res.render("notifications/index.ejs", { notifications });
};

// Mark single notification as read
module.exports.markAsRead = async (req, res) => {
    const { id } = req.params;
    await Notification.findOneAndUpdate({ _id: id, recipient: req.user._id }, { isRead: true });

    if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
        return res.json({ success: true });
    }

    res.redirect("/notifications");
};

// Mark all as read
module.exports.markAllAsRead = async (req, res) => {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });

    if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
        return res.json({ success: true });
    }

    req.flash("success", "All notifications marked as read.");
    res.redirect("/notifications");
};

// Get unread notification count (for dynamic badge in navbar)
module.exports.getUnreadCount = async (req, res) => {
    if (!req.user) {
        return res.json({ unreadCount: 0 });
    }
    const count = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
    res.json({ unreadCount: count });
};
