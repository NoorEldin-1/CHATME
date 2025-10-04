import { useDispatch, useSelector } from "react-redux";
import { setDialog } from "../../store/dialogSlice";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useCallback, useEffect, useMemo, memo, useRef } from "react";
import {
  acceptNotification,
  addNotification,
  notifications,
  removeNotification,
} from "../../store/userSlice";
import Loader from "./Loader";
import echo from "../../echo";
import guestImg from "../../assets/waiter_8560763.png";

// Memoized notification item component to prevent re-renders of unchanged items
const NotificationItem = memo(
  ({ notification, onAccept, onRemove, loading }) => {
    const handleAccept = useCallback(() => {
      onAccept(notification.id);
    }, [notification.id, onAccept]);

    const handleRemove = useCallback(() => {
      onRemove(notification.id);
    }, [notification.id, onRemove]);

    return (
      <div className="flex items-center gap-2 border border-white/10 rounded-md p-2">
        <img
          src={notification.from_user.image || guestImg}
          alt={`${notification.from_user.username}'s profile`}
          className="w-10 h-10 rounded-full"
          loading="lazy"
        />
        <div className="flex-1 flex flex-col justify-center text-white min-w-0">
          <p className="text-sm font-bold uppercase truncate">
            new friend request
          </p>
          <p className="text-sm font-bold text-white/50 italic truncate">
            {notification.from_user.username}
          </p>
        </div>
        <div className="flex gap-4 items-center flex-shrink-0">
          {loading ? (
            <Loader />
          ) : (
            <>
              <FaCheckCircle
                onClick={handleAccept}
                className="text-3xl text-green-600 cursor-pointer duration-300 hover:text-green-800"
                aria-label="Accept friend request"
              />
              <MdCancel
                onClick={handleRemove}
                className="text-4xl text-red-700 cursor-pointer duration-300 hover:text-red-900"
                aria-label="Reject friend request"
              />
            </>
          )}
        </div>
      </div>
    );
  }
);

NotificationItem.displayName = "NotificationItem";

const NotificationsDialog = () => {
  const dialog = useSelector((state) => state.dialog);
  const dispatch = useDispatch();

  // Selective useSelector to avoid unnecessary re-renders
  const notificationsUsers = useSelector((state) => state.user.notifications);
  const loading = useSelector((state) => state.user.handleNotificationLoading);

  const channelRef = useRef(null);

  // WebSocket connection effect
  useEffect(() => {
    const userId = window.localStorage.getItem("userId");
    if (!userId) return;

    channelRef.current = echo.private(`notification.${userId}`);

    const handleNotification = (e) => {
      dispatch(addNotification(e.notification));
    };

    channelRef.current.listen("NotificationSent", handleNotification);

    return () => {
      if (channelRef.current) {
        channelRef.current.stopListening(
          "NotificationSent",
          handleNotification
        );
        echo.leaveChannel(channelRef.current.name);
      }
    };
  }, [dispatch]);

  // Fetch notifications only when dialog is open
  useEffect(() => {
    if (dialog === "notificationsDialog") {
      dispatch(notifications());
    }
  }, [dispatch, dialog]);

  // Memoized callbacks with stable references
  const removeNotify = useCallback(
    (id) => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  const acceptNotify = useCallback(
    (id) => {
      dispatch(acceptNotification(id));
    },
    [dispatch]
  );

  // Optimized notifications rendering
  const notificationsElements = useMemo(() => {
    if (notificationsUsers.length === 0) {
      return (
        <p className="text-white text-center text-sm font-semibold uppercase">
          no notifications here.
        </p>
      );
    }

    return notificationsUsers.map((notification) => (
      <NotificationItem
        key={notification.id}
        notification={notification}
        onAccept={acceptNotify}
        onRemove={removeNotify}
        loading={loading}
      />
    ));
  }, [notificationsUsers, acceptNotify, removeNotify, loading]);

  const handleBackdropClick = useCallback(() => {
    dispatch(setDialog(null));
  }, [dispatch]);

  const handleDialogClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  // Early return if dialog is not open
  if (dialog !== "notificationsDialog") {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="fixed inset-0 bg-black/25 bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div
          className="bg-black/50 backdrop-blur-sm rounded-lg shadow-xl max-w-md w-full mx-auto max-h-[80vh] overflow-hidden flex flex-col"
          onClick={handleDialogClick}
        >
          <div className="px-6 py-4 border-b border-gray-200/10 flex-shrink-0">
            <h3 className="text-lg font-medium text-white capitalize">
              notifications ({notificationsUsers.length})
            </h3>
          </div>
          <div className="px-6 py-4 flex flex-col gap-4 overflow-y-auto flex-1">
            {notificationsElements}
          </div>
          <div className="px-6 py-4 border-t border-gray-200/10 flex justify-end space-x-3 flex-shrink-0">
            <button
              onClick={handleBackdropClick}
              className="px-4 py-2 text-sm font-medium text-white hover:bg-gray-100 hover:text-black rounded-md uppercase cursor-pointer transition-colors duration-200"
            >
              close
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(NotificationsDialog);
