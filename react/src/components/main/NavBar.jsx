import React, { useCallback, useMemo } from "react";
import { IoMdSettings } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import { LuUserSearch } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { setDialog } from "../../store/dialogSlice";

// Memoize icon components to prevent unnecessary re-renders
const MemoizedNotificationsIcon = React.memo(IoIosNotifications);
const MemoizedUserSearchIcon = React.memo(LuUserSearch);
const MemoizedSettingsIcon = React.memo(IoMdSettings);

const NavBar = React.memo(() => {
  const dispatch = useDispatch();

  // Use a more specific selector to minimize re-renders
  const notificationsCount = useSelector(
    (state) => state.user.notifications?.length || 0
  );

  // Memoize the fullName to avoid localStorage access on every render
  const fullName = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("fullName") || "";
    }
    return "";
  }, []);

  // Memoize click handlers to prevent unnecessary re-renders of child components
  const handleNotificationsClick = useCallback(() => {
    dispatch(setDialog("notificationsDialog"));
  }, [dispatch]);

  const handleFindUserClick = useCallback(() => {
    dispatch(setDialog("findUserDialog"));
  }, [dispatch]);

  const handleSettingsClick = useCallback(() => {
    dispatch(setDialog("settingDialog"));
  }, [dispatch]);

  // Pre-compute the notification badge to avoid conditional rendering complexity
  const notificationBadge = useMemo(() => {
    if (notificationsCount > 0) {
      return (
        <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center absolute top-[-5px] left-[-5px] text-xs">
          {notificationsCount}
        </span>
      );
    }
    return null;
  }, [notificationsCount]);

  return (
    <div className="overflow-hidden w-full h-16 bg-black/25 backdrop-blur-lg flex items-center justify-between relative text-white border-b border-white/25 p-4">
      <p className="font-bold text-lg whitespace-nowrap truncate max-w-[200px]">
        {fullName}
      </p>
      <div className="flex gap-2">
        <div
          onClick={handleNotificationsClick}
          className="relative cursor-pointer duration-300 hover:[&>svg]:text-yellow-600 hover:scale-95"
          role="button"
          tabIndex={0}
          aria-label="Notifications"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleNotificationsClick();
            }
          }}
        >
          <MemoizedNotificationsIcon className="text-yellow-300 text-3xl relative" />
          {notificationBadge}
        </div>

        <MemoizedUserSearchIcon
          onClick={handleFindUserClick}
          className="text-blue-600 text-3xl cursor-pointer duration-300 hover:text-blue-900 hover:scale-95"
          role="button"
          tabIndex={0}
          aria-label="Find User"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleFindUserClick();
            }
          }}
        />

        <MemoizedSettingsIcon
          onClick={handleSettingsClick}
          className="text-3xl cursor-pointer duration-300 hover:text-white/50 hover:scale-95"
          role="button"
          tabIndex={0}
          aria-label="Settings"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleSettingsClick();
            }
          }}
        />
      </div>
    </div>
  );
});

NavBar.displayName = "NavBar";

export default NavBar;
