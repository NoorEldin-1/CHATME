import { useDispatch, useSelector } from "react-redux";
import { setDialog } from "../../store/dialogSlice";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { FaCloudUploadAlt } from "react-icons/fa";

const SettingDialog = () => {
  const dialog = useSelector((state) => state.dialog);
  const dispatch = useDispatch();

  return (
    <div>
      <AnimatePresence>
        {dialog === "settingDialog" && (
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
                  settings
                </h3>
              </div>
              <div className="px-6 py-4 flex flex-col gap-4">
                <input
                  type="text"
                  value={"@username"}
                  disabled
                  placeholder="Username"
                  className="opacity-50 select-none cursor-not-allowed outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
                />
                <input
                  type="text"
                  placeholder="New Full Name"
                  className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
                />
                <div className="h-20 cursor-pointer flex flex-col items-center justify-center border-2 border-dotted border-white duration-300 hover:border-white/50 hover:*:text-white/50 *:duration-300">
                  <FaCloudUploadAlt className="text-white text-4xl" />
                  <span className="text-white capitalize font-bold text-sm">
                    upload profile image
                  </span>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200/10 flex justify-end space-x-3">
                <button
                  onClick={() => dispatch(setDialog(null))}
                  className="px-4 py-2 text-sm font-medium text-white hover:bg-gray-100 hover:text-black rounded-md uppercase cursor-pointer"
                >
                  cancel
                </button>
                <button
                  onClick={() => dispatch(setDialog(null))}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-800 hover:bg-green-900 rounded-md uppercase cursor-pointer"
                >
                  change
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingDialog;
