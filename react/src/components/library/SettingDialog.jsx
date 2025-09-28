import { useDispatch, useSelector } from "react-redux";
import { setDialog } from "../../store/dialogSlice";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useCallback, useRef, useState } from "react";
import { handleUpdate, uploadProfileImage } from "../../store/authSlice";
import Loader from "./Loader";
import { IoCloseCircle } from "react-icons/io5";
import guestImg from "../../assets/waiter_8560763.png";

const SettingDialog = () => {
  const dialog = useSelector((state) => state.dialog);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.updateLoading);
  const [info, setInfo] = useState({
    fullName: "",
    password: "",
    password_confirmation: "",
  });
  const [validate, setValidate] = useState({
    fullName: "text-white/50",
    password: "text-white/50",
    password_confirmation: "text-white/50",
  });

  const [profileImage, setProfileImage] = useState(null);
  const profileImageInputRef = useRef(null);

  const update = useCallback(async () => {
    try {
      if (profileImage) {
        await dispatch(uploadProfileImage(profileImage)).unwrap();
        setProfileImage(null);
      }

      const dataToSend = {};

      if (info.fullName && info.fullName.trim()) {
        if (info.fullName.trim().length < 4) {
          console.error("Full name must be at least 4 characters");
          return;
        }
        dataToSend.fullName = info.fullName.trim();
      }

      if (info.password && info.password.trim()) {
        if (info.password.trim().length < 8) {
          console.error("Password must be at least 8 characters");
          return;
        }
        dataToSend.password = info.password.trim();
        dataToSend.password_confirmation = info.password_confirmation.trim();
      }

      if (Object.keys(dataToSend).length > 0) {
        if (
          dataToSend.password &&
          dataToSend.password !== dataToSend.password_confirmation
        ) {
          console.error("Password confirmation must match password");
          return;
        }
        await dispatch(handleUpdate(dataToSend)).unwrap();
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  }, [dispatch, info, profileImage]);

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
              <div className="flex justify-center items-center">
                <img
                  src={
                    window.localStorage.getItem("image")
                      ? window.localStorage.getItem("image")
                      : guestImg
                  }
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
              <div className="px-6 py-4 flex flex-col gap-4 h-80 overflow-y-auto custom-scrollbar">
                <input
                  type="text"
                  value={`@${window.localStorage.getItem("username")}`}
                  disabled
                  placeholder="Username"
                  className="opacity-50 select-none cursor-not-allowed outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
                />
                <div>
                  <input
                    type="text"
                    value={info.fullName}
                    onChange={(e) => {
                      setInfo((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }));

                      if (e.target.value.length < 4) {
                        setValidate((prev) => ({
                          ...prev,
                          fullName: "text-red-700",
                        }));
                      } else {
                        setValidate((prev) => ({
                          ...prev,
                          fullName: "text-green-700",
                        }));
                      }
                    }}
                    placeholder="New Full Name"
                    className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
                  />
                  <p className={`${validate.fullName} text-sm`}>
                    at least 4 characters
                  </p>
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={info.password}
                    onChange={(e) => {
                      setInfo((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                      if (e.target.value.length < 8) {
                        setValidate((prev) => ({
                          ...prev,
                          password: "text-red-700",
                        }));
                      } else {
                        setValidate((prev) => ({
                          ...prev,
                          password: "text-green-700",
                        }));
                      }
                    }}
                    className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
                  />
                  <p className={`${validate.password} text-sm`}>
                    at least 8 characters
                  </p>
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={info.password_confirmation}
                    onChange={(e) => {
                      setInfo((prev) => ({
                        ...prev,
                        password_confirmation: e.target.value,
                      }));
                      if (e.target.value.length != info.password) {
                        setValidate((prev) => ({
                          ...prev,
                          password_confirmation: "text-red-700",
                        }));
                      } else {
                        setValidate((prev) => ({
                          ...prev,
                          password_confirmation: "text-green-700",
                        }));
                      }
                    }}
                    className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
                  />
                  <p className={`${validate.password_confirmation} text-sm`}>
                    same to password
                  </p>
                </div>
                <input
                  hidden
                  ref={profileImageInputRef}
                  type="file"
                  onChange={(e) => {
                    if (e.target.files[0].type.startsWith("image/")) {
                      setProfileImage(e.target.files[0]);
                      console.log(e.target.files[0]);
                    } else {
                      console.log("it's not image");
                    }
                  }}
                />
                {profileImage && (
                  <div className="flex flex-col w-fit gap-1 items-center">
                    <img
                      src={URL.createObjectURL(profileImage)}
                      className="w-20 h-20"
                    />
                    <IoCloseCircle
                      onClick={() => setProfileImage(null)}
                      className="text-2xl text-red-600 cursor-pointer duration-300 hover:text-red-800"
                    />
                  </div>
                )}
                <div
                  onClick={() => profileImageInputRef.current.click()}
                  className="h-20 p-2 cursor-pointer flex flex-col items-center justify-center border-2 border-dotted border-white duration-300 hover:border-white/50 hover:*:text-white/50 *:duration-300"
                >
                  <FaCloudUploadAlt className="text-white text-4xl" />
                  <span className="text-white capitalize font-bold text-sm">
                    upload profile image
                  </span>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200/10 flex justify-between space-x-3 items-center">
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    <button
                      onClick={() => dispatch(setDialog("logoutDialog"))}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-800 hover:bg-red-900 rounded-md uppercase cursor-pointer"
                    >
                      logout
                    </button>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => dispatch(setDialog(null))}
                        className="px-4 py-2 text-sm font-medium text-white hover:bg-gray-100 hover:text-black rounded-md uppercase cursor-pointer"
                      >
                        cancel
                      </button>
                      <button
                        onClick={update}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-800 hover:bg-green-900 rounded-md uppercase cursor-pointer"
                      >
                        change
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingDialog;
