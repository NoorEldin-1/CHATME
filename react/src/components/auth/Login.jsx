import { useNavigate } from "react-router";
import Button from "../library/Button";
import React, { useCallback, useState, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { handleLogin } from "../../store/authSlice";
import Loader from "../library/Loader";

// Memoized form inputs to prevent unnecessary re-renders
const UsernameInput = React.memo(({ value, onChange, validationClass }) => (
  <div className="flex flex-col gap-2">
    <input
      value={value}
      type="text"
      placeholder="username"
      onChange={onChange}
      className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
    />
    <p className={`text-xs capitalize ${validationClass}`}>
      username must be at least 4 characters
    </p>
  </div>
));

const PasswordInput = React.memo(({ onChange, validationClass }) => (
  <div className="flex flex-col gap-2">
    <input
      type="password"
      placeholder="password"
      onChange={onChange}
      className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
    />
    <p className={`text-xs capitalize ${validationClass}`}>
      password must be at least 8 characters
    </p>
  </div>
));

const Login = React.memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Batch selector calls
  const { loading, errorMsg } = useSelector(
    (state) => ({
      loading: state.auth.loginLoading,
      errorMsg: state.auth.loginErrorMsg,
    }),
    shallowEqual
  );

  const [info, setInfo] = useState({
    username: "",
    password: "",
  });

  const [validate, setValidate] = useState({
    username: "text-gray-500",
    password: "text-gray-500",
  });

  // Memoized validation states
  const isFormValid = useMemo(
    () => info.username.trim().length >= 4 && info.password.trim().length >= 8,
    [info.username, info.password]
  );

  const login = useCallback(
    (e) => {
      if (e) e.preventDefault();
      if (!isFormValid) return;
      dispatch(handleLogin({ info }));
    },
    [dispatch, info, isFormValid]
  );

  // Optimized change handlers with batched updates
  const handleUsernameChange = useCallback((e) => {
    const value = e.target.value;
    setInfo((prev) => ({ ...prev, username: value }));

    const isValid = value.trim().length >= 4;
    setValidate((prev) => ({
      ...prev,
      username: isValid ? "text-green-500" : "text-red-500",
    }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const value = e.target.value;
    setInfo((prev) => ({ ...prev, password: value }));

    const isValid = value.trim().length >= 8;
    setValidate((prev) => ({
      ...prev,
      password: isValid ? "text-green-500" : "text-red-500",
    }));
  }, []);

  // Memoized message component
  const Message = useMemo(
    () =>
      errorMsg ? (
        <p className="text-red-700 font-bold text-sm capitalize text-center">
          {errorMsg}
        </p>
      ) : (
        <p className="text-white/50 font-bold text-xs capitalize text-center">
          please enter your credentials to login.
        </p>
      ),
    [errorMsg]
  );

  // Memoized submit button
  const SubmitButton = useMemo(
    () =>
      loading ? (
        <Loader />
      ) : (
        <Button variant="gradient" className="w-full" disabled={!isFormValid}>
          login
        </Button>
      ),
    [loading, isFormValid]
  );

  return (
    <div className="relative grid place-content-center flex-1 select-none">
      <div className="bg-black/50 backdrop-blur-xs flex flex-col gap-1 w-[300px] sm:w-[600px] p-3 rounded-lg border border-white/10 shadow-lg">
        <h3 className="text-center font-bold text-2xl uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-white select-none">
          login
        </h3>
        <form className="flex flex-col gap-6 my-3" onSubmit={login}>
          {Message}

          <UsernameInput
            value={info.username}
            onChange={handleUsernameChange}
            validationClass={validate.username}
          />

          <PasswordInput
            onChange={handlePasswordChange}
            validationClass={validate.password}
          />

          {SubmitButton}
        </form>
        <p
          className="text-white text-xs capitalize cursor-pointer hover:underline"
          onClick={() => navigate("/signup")}
        >
          you don't have an account?
        </p>
      </div>
    </div>
  );
});

Login.displayName = "Login";
UsernameInput.displayName = "UsernameInput";
PasswordInput.displayName = "PasswordInput";

export default Login;
