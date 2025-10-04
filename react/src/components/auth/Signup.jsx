import { useNavigate } from "react-router";
import Button from "../library/Button";
import React, { useCallback, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleSignup } from "../../store/authSlice";
import Loader from "../library/Loader";

const Signup = React.memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.signupLoading);
  const errorMsg = useSelector((state) => state.auth.signupErrorMsg);

  const [info, setInfo] = useState({
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  // Memoized validation states to prevent unnecessary recalculations
  const validationStates = useMemo(() => {
    const isUsernameValid = info.username.trim().length >= 4;
    const isFullNameValid = info.fullName.trim().length >= 4;
    const isPasswordValid = info.password.trim().length >= 8;
    const isConfirmPasswordValid = info.password === info.confirmPassword;

    return {
      isUsernameValid,
      isFullNameValid,
      isPasswordValid,
      isConfirmPasswordValid,
      isFormValid:
        isUsernameValid &&
        isFullNameValid &&
        isPasswordValid &&
        isConfirmPasswordValid,
    };
  }, [info.username, info.fullName, info.password, info.confirmPassword]);

  // Single optimized change handler
  const handleInputChange = useCallback(
    (field) => (e) => {
      const value = e.target.value;
      setInfo((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Optimized signup function
  const signup = useCallback(
    (e) => {
      e?.preventDefault();
      if (!validationStates.isFormValid) return;
      dispatch(handleSignup({ info }));
    },
    [dispatch, info, validationStates.isFormValid]
  );

  // Memoized validation classes
  const validationClasses = useMemo(
    () => ({
      username: validationStates.isUsernameValid
        ? "text-green-500"
        : "text-gray-500",
      fullName: validationStates.isFullNameValid
        ? "text-green-500"
        : "text-gray-500",
      password: validationStates.isPasswordValid
        ? "text-green-500"
        : "text-gray-500",
      confirmPassword: validationStates.isConfirmPasswordValid
        ? "text-green-500"
        : "text-gray-500",
    }),
    [validationStates]
  );

  // Memoized form content to prevent unnecessary re-renders
  const formContent = useMemo(
    () => (
      <form
        onSubmit={signup}
        className="bg-black/50 backdrop-blur-xs flex flex-col gap-1 w-[300px] sm:w-[600px] p-3 rounded-lg border border-white/10 shadow-lg"
      >
        <h3 className="text-center font-bold text-2xl uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-white select-none">
          signup
        </h3>
        <div className="flex flex-col gap-6 my-3">
          {errorMsg ? (
            <p className="text-red-700 font-bold text-sm capitalize text-center">
              {errorMsg}
            </p>
          ) : (
            <p className="text-white/50 font-bold text-xs capitalize text-center">
              please enter valid information to create an account.
            </p>
          )}

          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={info.username}
              onChange={handleInputChange("username")}
              placeholder="username"
              className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
            />
            <p className={`text-xs capitalize ${validationClasses.username}`}>
              username must be at least 4 characters
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={info.fullName}
              onChange={handleInputChange("fullName")}
              placeholder="full name"
              className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
            />
            <p className={`text-xs capitalize ${validationClasses.fullName}`}>
              full name must be at least 4 characters
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="password"
              autoComplete="new-password"
              value={info.password}
              onChange={handleInputChange("password")}
              placeholder="password"
              className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
            />
            <p className={`text-xs capitalize ${validationClasses.password}`}>
              password must be at least 8 characters
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="password"
              autoComplete="new-password"
              value={info.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              placeholder="confirm password"
              className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
            />
            <p
              className={`text-xs capitalize ${validationClasses.confirmPassword}`}
            >
              passwords must match
            </p>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <Button
              variant="gradient"
              className="w-full"
              type="submit"
              disabled={!validationStates.isFormValid}
            >
              signup
            </Button>
          )}
        </div>
        <p
          className="text-white text-xs capitalize cursor-pointer hover:underline"
          onClick={() => navigate("/login")}
        >
          already have an account?
        </p>
      </form>
    ),
    [
      errorMsg,
      handleInputChange,
      info.confirmPassword,
      info.fullName,
      info.password,
      info.username,
      loading,
      navigate,
      signup,
      validationClasses.confirmPassword,
      validationClasses.fullName,
      validationClasses.password,
      validationClasses.username,
      validationStates.isFormValid,
    ]
  );

  return (
    <div className="relative grid place-content-center flex-1 select-none">
      {formContent}
    </div>
  );
});

export default Signup;
