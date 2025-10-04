import { memo, useCallback, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { useDispatch } from "react-redux";
import { setDialog } from "../../store/dialogSlice";

const UserMenu = memo(({ anchorEl }) => {
  const dispatch = useDispatch();

  const handleDeleteClick = useCallback(() => {
    dispatch(setDialog("deleteUserDialog"));
  }, [dispatch]);

  const menuStyle = useMemo(() => {
    if (!anchorEl) return null;

    const rect = anchorEl.getBoundingClientRect();
    return {
      top: rect.bottom - 50,
      right: window.innerWidth - rect.right,
    };
  }, [anchorEl]);

  if (!anchorEl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="fixed w-56 bg-white/90 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-[1000]"
      style={menuStyle}
    >
      <div className="py-1">
        <button
          onClick={handleDeleteClick}
          className="font-bold block w-full text-left px-4 py-2 text-sm text-black cursor-pointer capitalize hover:bg-black/25"
        >
          delete friend
        </button>
      </div>
    </motion.div>
  );
});

UserMenu.displayName = "UserMenu";

export default UserMenu;
