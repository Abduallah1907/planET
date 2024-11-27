import React, { useState, useEffect } from "react";
import { IoIosNotifications } from "react-icons/io";
import "./notifications.css";
import NotificationService from "../services/NotificationService";
import { useAppSelector } from "../store/hooks";

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const user = useAppSelector((state) => state.user);

  const getNotificationsByEmail = async (email: string) => {
    try {
      const response = await NotificationService.getNotificationsByEmail(email);
      console.log("Notifications API response:", response);

      const notificationList = response.data; // Adjust if response is nested
      setNotifications(notificationList);
      console.log("Notification list:", notifications);
      updateUnreadCount(notifications.filter((notif:any) => !notif.read_flag));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]); // Prevent undefined state
    }
  };

  const getNotificationNumber = async (email: string) => {
    try {
      const response = await NotificationService.getNotificationNumber(email);
      console.log("Notification number API response:", response);
      setUnreadCount(response.data);
    } catch (error) {
      console.error("Failed to fetch notification number:", error);
      setUnreadCount(0); // Prevent undefined state
    }
  };

  const updateUnreadCount = (notifications: any[]) => {
    const unread = notifications.filter((notif) => !notif.isRead).length;
    setUnreadCount(unread);
  };

  useEffect(() => {
    if (user?.email) {
      getNotificationNumber(user.email);
    }
  }, [user]);

  const toggleDropdown = () => {
    if (user?.email && !showDropdown) {
      getNotificationsByEmail(user.email);
    }
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="notification-container">
      <div className="notification-icon" onClick={toggleDropdown}>
        <IoIosNotifications size={28} />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </div>
      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
          </div>
          <ul>
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <li key={notif._id || Math.random()} className="notification-item">
                  {notif.message || "No details available"}
                </li>
              ))
            ) : (
              <li>No notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;
