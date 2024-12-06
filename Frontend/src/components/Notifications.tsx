import React, { useState, useEffect } from "react";
import { IoIosNotifications, IoIosNotificationsOff } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import "./notifications.css";
import NotificationService from "../services/NotificationService";
import { useAppSelector } from "../store/hooks";

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // Track notifications state
  const user = useAppSelector((state) => state.user);

  const getNotificationsByEmail = async (email: string) => {
    try {
      const response = await NotificationService.getNotificationsByEmail(email);
      const notificationList = response.data;
      setNotifications(notificationList);
      updateUnreadCount(notificationList.filter((notif: any) => !notif.read_flag));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    }
  };

  const getNotificationNumber = async (email: string) => {
    try {
      const response = await NotificationService.getNotificationNumber(email);
      setUnreadCount(response.data);
    } catch (error) {
      console.error("Failed to fetch notification number:", error);
      setUnreadCount(0);
    }
  };

  const updateUnreadCount = (notifications: any[]) => {
    const unread = notifications.filter((notif) => !notif.isRead).length;
    setUnreadCount(unread);
  };

  useEffect(() => {
    if (user?.email && notificationsEnabled) {
      getNotificationNumber(user.email);
      if (notificationsEnabled) {
        // Fetch notifications as soon as they are enabled
        getNotificationsByEmail(user.email);
      }
    }
  }, [user, notificationsEnabled]); // Watch for changes in notificationsEnabled

  const toggleDropdown = () => {
    if (user?.email && !showDropdown && notificationsEnabled) {
      getNotificationsByEmail(user.email);
    }
    setShowDropdown(!showDropdown);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    setShowSettings(false); // Close the settings dropdown after selection
    if (!notificationsEnabled) {
      getNotificationNumber(user.email); // Re-fetch if enabled again
    } else {
      setUnreadCount(0);
      setNotifications([]); // Clear notifications when disabled
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
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
            <div className="settings-icon-container" onClick={toggleSettings}>
              {showSettings ? (
                <div className="toggle-container">
                  <span
                    className="notification-toggle"
                    onClick={toggleNotifications}
                  >
                    {notificationsEnabled ? (
                      <IoIosNotifications size={20} />
                    ) : (
                      <IoIosNotificationsOff size={20} />
                    )}
                  </span>
                </div>
              ) : (
                <IoSettingsSharp size={20} />
              )}
            </div>
          </div>
          <ul className="notification-list p-0">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <li key={notif._id || Math.random()} className="notification-item ps-4">
                  {notif.message || "No details available"}
                </li>
              ))
            ) : (
              <li className="no-notifications text-center mt-2">No notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;
