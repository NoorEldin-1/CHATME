import { useDispatch, useSelector } from "react-redux";
import { setDialog } from "../../store/dialogSlice";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { IoIosPersonAdd } from "react-icons/io";
import guestImg from "../../assets/waiter_8560763.png";

const FindUserDialog = () => {
  const dialog = useSelector((state) => state.dialog);
  const dispatch = useDispatch();

  return (
    <div>
      <AnimatePresence>
        {dialog === "findUserDialog" && (
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
                  type="text"
                  placeholder="Search..."
                  className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
                />
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 border border-white/10 rounded-md p-2">
                    <img
                      src={guestImg}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 flex flex-col justify-center text-white">
                      <p className="text-lg font-bold">full name</p>
                      <p className="text-sm font-bold text-white/50 italic">
                        @username
                      </p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-black bg-gray-100 hover:bg-gray-400 duration-300 rounded-md uppercase cursor-pointer flex gap-1 items-center justify-center">
                      <span>add</span>
                      <IoIosPersonAdd />
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200/10 flex justify-end space-x-3">
                <button
                  onClick={() => dispatch(setDialog(null))}
                  className="px-4 py-2 text-sm font-medium text-white hover:bg-gray-100 hover:text-black rounded-md uppercase cursor-pointer"
                >
                  close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FindUserDialog;
