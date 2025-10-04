import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDialog } from "../../store/dialogSlice";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { deleteMessage } from "../../store/messageSlice";
import Loader from "./Loader";

// Memoize the component to prevent unnecessary re-renders
const DeleteMessageDialog = memo(() => {
  const dispatch = useDispatch();

  // Use precise selectors to minimize re-renders
  const dialog = useSelector((state) => state.dialog);
  const activeMessage = useSelector((state) => state.message.activeMessage);
  const loading = useSelector((state) => state.message.deleteLoading);

  // Memoize event handlers to prevent recreation on every render
  const handleCloseDialog = useCallback(() => {
    dispatch(setDialog(null));
  }, [dispatch]);

  const handleDeleteMessage = useCallback(() => {
    if (!activeMessage) return;

    dispatch(
      deleteMessage({
        chatID: activeMessage.chat_id,
        messageID: activeMessage.id,
      })
    );
  }, [dispatch, activeMessage]);

  // Early return if not the correct dialog - reduces unnecessary DOM calculations
  if (dialog !== "deleteMessageDialog") {
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
          className="bg-black/50 rounded-lg shadow-xl max-w-md w-full mx-auto backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-gray-200/10">
            <h3 className="text-lg font-medium text-white capitalize">
              delete this message
            </h3>
          </div>
          <div className="px-6 py-4">
            <p className="text-white capitalize text-center">
              if you delete this message it will delete forever.
            </p>
          </div>
          <div className="px-6 py-4 border-t border-gray-200/10 flex justify-end space-x-3">
            {loading ? (
              <Loader />
            ) : (
              <>
                <button
                  onClick={handleCloseDialog}
                  className="px-4 py-2 text-sm font-medium text-white hover:bg-gray-100 hover:text-black rounded-md uppercase cursor-pointer duration-300"
                >
                  cancel
                </button>
                <button
                  onClick={handleDeleteMessage}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-800 hover:bg-red-900 rounded-md uppercase cursor-pointer duration-300"
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

// Display name for debugging
DeleteMessageDialog.displayName = "DeleteMessageDialog";

export default DeleteMessageDialog;
