import { useDispatch, useSelector } from "react-redux";
import { setDialog } from "../../store/dialogSlice";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { FaCloudUploadAlt } from "react-icons/fa";
import React, {
  useCallback,
  useRef,
  useState,
  useMemo,
  useEffect,
} from "react";
import { handleUpdate, uploadProfileImage } from "../../store/authSlice";
import Loader from "./Loader";
import { IoCloseCircle } from "react-icons/io5";
import guestImg from "../../assets/waiter_8560763.png";

// Memoized constants
const DIALOG_NAME = "settingDialog";
const INITIAL_INFO = {
  fullName: "",
  password: "",
  password_confirmation: "",
};
const INITIAL_VALIDATE = {
  fullName: "text-white/50",
  password: "text-white/50",
  password_confirmation: "text-white/50",
};

// Memoized input component to prevent unnecessary re-renders
const MemoizedInput = React.memo(
  ({ type, value, onChange, placeholder, disabled, className }) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
    />
  )
);

const SettingDialog = () => {
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.dialog);
  const loading = useSelector((state) => state.auth.updateLoading);

  const [info, setInfo] = useState(INITIAL_INFO);
  const [validate, setValidate] = useState(INITIAL_VALIDATE);
  const [profileImage, setProfileImage] = useState(null);

  const profileImageInputRef = useRef(null);

  // Memoized user data from localStorage
  const userData = useMemo(
    () => ({
      username: window.localStorage.getItem("username") || "",
      image: window.localStorage.getItem("image") || guestImg,
    }),
    []
  );

  // Optimized validation functions
  const validateFullName = useCallback((value) => {
    return value.length < 4 ? "text-red-700" : "text-green-700";
  }, []);

  const validatePassword = useCallback((value) => {
    return value.length < 8 ? "text-red-700" : "text-green-700";
  }, []);

  const validatePasswordConfirmation = useCallback((value, password) => {
    return value !== password ? "text-red-700" : "text-green-700";
  }, []);

  // Optimized update handler
  const update = useCallback(async () => {
    try {
      // Upload profile image first if exists
      if (profileImage) {
        await dispatch(uploadProfileImage(profileImage)).unwrap();
        setProfileImage(null);
      }

      // Prepare data to send
      const dataToSend = {};
      const trimmedFullName = info.fullName.trim();
      const trimmedPassword = info.password.trim();
      const trimmedPasswordConfirmation = info.password_confirmation.trim();

      // Validate and add fullName
      if (trimmedFullName) {
        if (trimmedFullName.length < 4) {
          console.error("Full name must be at least 4 characters");
          return;
        }
        dataToSend.fullName = trimmedFullName;
      }

      // Validate and add password
      if (trimmedPassword) {
        if (trimmedPassword.length < 8) {
          console.error("Password must be at least 8 characters");
          return;
        }
        if (trimmedPassword !== trimmedPasswordConfirmation) {
          console.error("Password confirmation must match password");
          return;
        }
        dataToSend.password = trimmedPassword;
        dataToSend.password_confirmation = trimmedPasswordConfirmation;
      }

      // Send update if there's data
      if (Object.keys(dataToSend).length > 0) {
        await dispatch(handleUpdate(dataToSend)).unwrap();
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  }, [dispatch, info, profileImage]);

  // Optimized change handlers
  const handleFullNameChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInfo((prev) => ({ ...prev, fullName: value }));
      setValidate((prev) => ({ ...prev, fullName: validateFullName(value) }));
    },
    [validateFullName]
  );

  const handlePasswordChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInfo((prev) => ({ ...prev, password: value }));
      setValidate((prev) => ({
        ...prev,
        password: validatePassword(value),
        password_confirmation: validatePasswordConfirmation(
          prev.password_confirmation === "text-red-700"
            ? ""
            : info.password_confirmation,
          value
        ),
      }));
    },
    [validatePassword, validatePasswordConfirmation, info.password_confirmation]
  );

  const handlePasswordConfirmationChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInfo((prev) => ({ ...prev, password_confirmation: value }));
      setValidate((prev) => ({
        ...prev,
        password_confirmation: validatePasswordConfirmation(
          value,
          info.password
        ),
      }));
    },
    [validatePasswordConfirmation, info.password]
  );

  const handleProfileImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("image/")) {
      setProfileImage(file);
    }
  }, []);

  const removeProfileImage = useCallback(() => {
    setProfileImage(null);
    // Reset file input
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = "";
    }
  }, []);

  const openFileInput = useCallback(() => {
    profileImageInputRef.current?.click();
  }, []);

  const closeDialog = useCallback(() => {
    dispatch(setDialog(null));
  }, [dispatch]);

  const openLogoutDialog = useCallback(() => {
    dispatch(setDialog("logoutDialog"));
  }, [dispatch]);

  // Reset form when dialog closes
  useEffect(() => {
    if (dialog !== DIALOG_NAME) {
      setInfo(INITIAL_INFO);
      setValidate(INITIAL_VALIDATE);
      setProfileImage(null);
    }
  }, [dialog]);

  // Memoized common classes
  const inputClassName =
    "outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full";
  const disabledInputClassName =
    "opacity-50 select-none cursor-not-allowed outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full";

  if (dialog !== DIALOG_NAME) return null;

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
              settings
            </h3>
          </div>

          <div className="flex justify-center items-center">
            <img
              src={userData.image}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>

          <div className="px-6 py-4 flex flex-col gap-4 h-80 overflow-y-auto custom-scrollbar">
            <MemoizedInput
              type="text"
              value={`@${userData.username}`}
              disabled
              placeholder="Username"
              className={disabledInputClassName}
            />

            <div>
              <MemoizedInput
                type="text"
                value={info.fullName}
                onChange={handleFullNameChange}
                placeholder="New Full Name"
                className={inputClassName}
              />
              <p className={`${validate.fullName} text-sm`}>
                at least 4 characters
              </p>
            </div>

            <div>
              <MemoizedInput
                type="password"
                placeholder="New Password"
                value={info.password}
                onChange={handlePasswordChange}
                className={inputClassName}
              />
              <p className={`${validate.password} text-sm`}>
                at least 8 characters
              </p>
            </div>

            <div>
              <MemoizedInput
                type="password"
                placeholder="Confirm New Password"
                value={info.password_confirmation}
                onChange={handlePasswordConfirmationChange}
                className={inputClassName}
              />
              <p className={`${validate.password_confirmation} text-sm`}>
                same to password
              </p>
            </div>

            <input
              hidden
              ref={profileImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
            />

            {profileImage && (
              <div className="flex flex-col w-fit gap-1 items-center">
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt="Preview"
                  className="w-20 h-20"
                />
                <IoCloseCircle
                  onClick={removeProfileImage}
                  className="text-2xl text-red-600 cursor-pointer duration-300 hover:text-red-800"
                />
              </div>
            )}

            <div
              onClick={openFileInput}
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
                  onClick={openLogoutDialog}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-800 hover:bg-red-900 rounded-md uppercase cursor-pointer"
                >
                  logout
                </button>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={closeDialog}
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
    </AnimatePresence>
  );
};

export default React.memo(SettingDialog);
