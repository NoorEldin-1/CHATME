import { useDispatch, useSelector } from "react-redux";
import { setDialog } from "../../store/dialogSlice";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { IoIosPersonAdd } from "react-icons/io";
import guestImg from "../../assets/waiter_8560763.png";
import { useCallback, useEffect, useMemo, useRef, memo } from "react";
import { addFriend, clearSearchUsers, search } from "../../store/userSlice";
import Loader from "./Loader";
import { FaUserFriends } from "react-icons/fa";

// Memoized User Item Component to prevent re-renders of unchanged items
const UserItem = memo(({ user, addFriendLoading, dispatch }) => {
  const handleAddFriend = useCallback(() => {
    dispatch(addFriend(user.id));
  }, [dispatch, user.id]);

  return (
    <div
      key={user.id}
      className="flex items-center gap-2 border border-white/10 rounded-md p-2"
    >
      <img
        src={user.image || guestImg}
        alt={`${user.fullName}'s profile`}
        className="w-10 h-10 rounded-full object-cover"
        loading="lazy"
      />
      <div className="flex-1 flex flex-col justify-center text-white min-w-0">
        <p className="text-lg font-bold truncate">{user.fullName}</p>
        <p className="text-sm font-bold text-white/50 italic truncate">
          @{user.username}
        </p>
      </div>
      {addFriendLoading ? (
        <Loader />
      ) : user.is_pending ? (
        <button
          disabled
          className="px-4 py-2 text-sm font-medium text-black bg-gray-100/50 hover:bg-gray-400 duration-300 rounded-md uppercase cursor-not-allowed flex gap-1 items-center justify-center"
        >
          <span>pending</span>
        </button>
      ) : user.is_friend ? (
        <button className="px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded-md uppercase flex gap-1 items-center justify-center">
          <FaUserFriends />
        </button>
      ) : (
        <button
          onClick={handleAddFriend}
          className="px-4 py-2 text-sm font-medium text-black bg-gray-100 hover:bg-gray-400 duration-300 rounded-md uppercase cursor-pointer flex gap-1 items-center justify-center"
        >
          <span>add</span>
          <IoIosPersonAdd />
        </button>
      )}
    </div>
  );
});

UserItem.displayName = "UserItem";

// Memoized Empty State Component
const EmptyState = memo(() => (
  <div className="grid place-content-center h-full">
    <p className="text-xl font-bold uppercase text-white">no users here.</p>
  </div>
));

EmptyState.displayName = "EmptyState";

const FindUserDialog = () => {
  const dialog = useSelector((state) => state.dialog);
  const dispatch = useDispatch();

  // Selective useSelector to minimize re-renders
  const loading = useSelector((state) => state.user.searchLoading);
  const searchUsers = useSelector((state) => state.user.searchUsers);
  const addFriendLoading = useSelector((state) => state.user.addFriendLoading);

  const timeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Optimized search with proper cleanup and debouncing
  const handleSearch = useCallback(
    (e) => {
      const searchValue = e.target.value.trim().toLowerCase();

      if (searchValue.length <= 0) {
        dispatch(clearSearchUsers());
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        dispatch(search(searchValue));
      }, 500);
    },
    [dispatch]
  );

  // Memoized users list with stable references
  const users = useMemo(() => {
    if (!searchUsers || searchUsers.length === 0) {
      return <EmptyState />;
    }

    return searchUsers.map((user) => (
      <UserItem
        key={user.id}
        user={user}
        addFriendLoading={addFriendLoading}
        dispatch={dispatch}
      />
    ));
  }, [searchUsers, addFriendLoading, dispatch]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Memoized dialog close handler
  const handleCloseDialog = useCallback(() => {
    dispatch(clearSearchUsers());
    dispatch(setDialog(null));
  }, [dispatch]);

  // Early return if dialog is not open
  if (dialog !== "findUserDialog") {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="fixed inset-0 bg-black/25 bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <div
          className="bg-black/50 backdrop-blur-sm rounded-lg shadow-xl max-w-md w-full mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-gray-200/10">
            <h3 className="text-lg font-medium text-white capitalize">
              find new user
            </h3>
          </div>
          <div className="px-6 py-4 flex flex-col gap-4">
            <input
              ref={inputRef}
              type="text"
              onChange={handleSearch}
              placeholder="Search..."
              className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
            />
            <div className="flex flex-col gap-4 h-80 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="grid place-content-center h-full">
                  <Loader />
                </div>
              ) : (
                users
              )}
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200/10 flex justify-end space-x-3">
            <button
              onClick={handleCloseDialog}
              className="px-4 py-2 text-sm font-medium text-white hover:bg-gray-100 hover:text-black rounded-md uppercase cursor-pointer"
            >
              close
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(FindUserDialog);
