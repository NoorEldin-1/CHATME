import { useNavigate } from "react-router";
import Button from "../library/Button";
import React, { useCallback, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { handleLogin } from "../../store/authSlice";
import Loader from "../library/Loader";

const Login = React.memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loginLoading, shallowEqual);
  const errorMsg = useSelector(
    (state) => state.auth.loginErrorMsg,
    shallowEqual
  );
  const [info, setInfo] = useState({
    username: "",
    password: "",
  });
  const [validate, setValidate] = useState({
    username: "text-white/50",
    password: "text-white/50",
  });

  const login = useCallback(() => {
    if (info.username.trim().length < 4 || info.password.trim().length < 8)
      return;
    dispatch(handleLogin({ info }));
  }, [dispatch, info]);

  const handleUsernameChange = useCallback((e) => {
    setInfo((prev) => ({ ...prev, username: e.target.value }));
    if (e.target.value.trim().length >= 4) {
      setValidate((prev) => ({
        ...prev,
        username: "text-green-500",
      }));
    } else {
      setValidate((prev) => ({
        ...prev,
        username: "text-red-500",
      }));
    }
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setInfo((prev) => ({ ...prev, password: e.target.value }));
    if (e.target.value.trim().length >= 8) {
      setValidate((prev) => ({
        ...prev,
        password: "text-green-500",
      }));
    } else {
      setValidate((prev) => ({
        ...prev,
        password: "text-red-500",
      }));
    }
  }, []);

  return (
    <div className="relative grid place-content-center flex-1 select-none">
      <div className="bg-black/50 backdrop-blur-xs flex flex-col gap-1 w-[300px] sm:w-[600px] p-3 rounded-lg border border-white/10 shadow-lg">
        <h3 className="text-center font-bold text-2xl uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-white select-none">
          login
        </h3>
        <form
          className="flex flex-col gap-6 my-3"
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          {errorMsg ? (
            <p className="text-red-700 font-bold text-sm capitalize text-center">
              {errorMsg}
            </p>
          ) : (
            <p className="text-white/50 font-bold text-xs capitalize text-center">
              please enter your credentials to login.
            </p>
          )}
          <div className="flex flex-col gap-2">
            <input
              value={info.username}
              type="text"
              placeholder="username"
              onChange={handleUsernameChange}
              className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
            />
            <p className={`text-xs capitalize ${validate.username}`}>
              username must be at least 4 characters
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="password"
              placeholder="password"
              onChange={handlePasswordChange}
              className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
            />
            <p className={`text-xs capitalize ${validate.password}`}>
              password must be at least 8 characters
            </p>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <Button
              variant="gradient"
              className="w-full"
              disabled={
                info.username.trim().length < 4 ||
                info.password.trim().length < 8
                  ? true
                  : false
              }
            >
              login
            </Button>
          )}
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
export default Login;
