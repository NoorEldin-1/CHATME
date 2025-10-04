import { memo, useCallback, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { useDispatch } from "react-redux";
import { setDialog } from "../../store/dialogSlice";

const MessageMenu = memo(({ anchorEl }) => {
  const dispatch = useDispatch();

  const handleDeleteClick = useCallback(() => {
    dispatch(setDialog("deleteMessageDialog"));
  }, [dispatch]);

  const menuStyle = useMemo(() => {
    if (!anchorEl) return null;

    const rect = anchorEl.getBoundingClientRect();
    return {
      top: rect.bottom - 50,
      right: window.innerWidth - rect.right - 100,
    };
  }, [anchorEl]);

  if (!anchorEl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="fixed w-56 bg-white/90 rounded-md z-50"
      style={menuStyle}
    >
      <div className="py-1">
        <button
          onClick={handleDeleteClick}
          className="block w-full text-left px-4 py-2 text-sm text-black capitalize cursor-pointer font-bold hover:bg-black/25"
        >
          delete message
        </button>
      </div>
    </motion.div>
  );
});

MessageMenu.displayName = "MessageMenu";

export default MessageMenu;
