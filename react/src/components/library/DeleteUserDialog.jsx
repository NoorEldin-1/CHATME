import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDialog } from "../../store/dialogSlice";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import Loader from "./Loader";
import { chatDelete } from "../../store/chatSlice";

// Memoize the component to prevent unnecessary re-renders
const DeleteUserDialog = memo(() => {
  const dispatch = useDispatch();

  // Use selective useSelector with equality functions to minimize re-renders
  const dialog = useSelector((state) => state.dialog);
  const activeChatId = useSelector((state) => state.chat.activeChat?.id);
  const loading = useSelector((state) => state.chat.deleteChatLoading);

  // Memoize event handlers to prevent recreation on every render
  const handleBackdropClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleCancel = useCallback(() => {
    dispatch(setDialog(null));
  }, [dispatch]);

  const handleDelete = useCallback(() => {
    if (activeChatId) {
      dispatch(chatDelete(activeChatId));
    }
  }, [dispatch, activeChatId]);

  const showDialog = dialog === "deleteUserDialog";

  // Early return if dialog is not visible
  if (!showDialog) {
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
          onClick={handleBackdropClick}
        >
          <div className="px-6 py-4 border-b border-gray-200/10">
            <h3 className="text-lg font-medium text-white capitalize">
              delete this user
            </h3>
          </div>
          <div className="px-6 py-4">
            <p className="text-white capitalize text-center">
              if you delete this user it will delete all messages and
              conversation forever.
            </p>
          </div>
          <div className="px-6 py-4 border-t border-gray-200/10 flex justify-end space-x-3">
            {loading ? (
              <Loader />
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-white hover:bg-gray-100 hover:text-black rounded-md uppercase cursor-pointer"
                >
                  cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-800 hover:bg-red-900 rounded-md uppercase cursor-pointer"
                >
                  delete
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

// Add display name for better debugging
DeleteUserDialog.displayName = "DeleteUserDialog";

export default DeleteUserDialog;
