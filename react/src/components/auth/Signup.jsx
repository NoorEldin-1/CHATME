import { useNavigate } from "react-router";
import Button from "../library/Button";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleSignup } from "../../store/authSlice";
import Loader from "../library/Loader";

const Signup = () => {
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
  const [validate, setValidate] = useState({
    username: "text-white/50",
    fullName: "text-white/50",
    password: "text-white/50",
    confirmPassword: "text-white/50",
  });
  const signup = useCallback(() => {
    if (
      info.username.trim().length < 4 ||
      info.fullName.trim().length < 4 ||
      info.password.trim().length < 8 ||
      info.password !== info.confirmPassword
    )
      return;
    dispatch(handleSignup({ info }));
  }, [dispatch, info]);
  return (
    <div className="relative grid place-content-center flex-1 select-none">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signup();
        }}
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
              onChange={(e) => {
                setInfo({ ...info, username: e.target.value });
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
              }}
              placeholder="username"
              className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
            />
            <p className={`text-xs capitalize ${validate.username}`}>
              username must be at least 4 characters
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={info.fullName}
              onChange={(e) => {
                setInfo({ ...info, fullName: e.target.value });
                if (e.target.value.trim().length >= 4) {
                  setValidate((prev) => ({
                    ...prev,
                    fullName: "text-green-500",
                  }));
                } else {
                  setValidate((prev) => ({
                    ...prev,
                    fullName: "text-red-500",
                  }));
                }
              }}
              placeholder="full name"
              className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
            />
            <p className={`text-xs capitalize ${validate.fullName}`}>
              full name must be at least 4 characters
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="password"
              autoComplete="new-password"
              value={info.password}
              onChange={(e) => {
                setInfo({ ...info, password: e.target.value });
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
              }}
              placeholder="password"
              className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
            />
            <p className={`text-xs capitalize ${validate.password}`}>
              password must be at least 8 characters
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="password"
              autoComplete="new-password"
              value={info.confirmPassword}
              onChange={(e) => {
                setInfo({ ...info, confirmPassword: e.target.value });
                if (e.target.value === info.password) {
                  setValidate((prev) => ({
                    ...prev,
                    confirmPassword: "text-green-500",
                  }));
                } else {
                  setValidate((prev) => ({
                    ...prev,
                    confirmPassword: "text-red-500",
                  }));
                }
              }}
              placeholder="confirm password"
              className="outline-none bg-transparent border border-white/30 p-2 rounded-md text-white placeholder:duration-300 focus:placeholder:text-transparent w-full"
            />
            <p className={`text-xs capitalize ${validate.confirmPassword}`}>
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
              disabled={
                info.username.trim().length < 4 ||
                info.fullName.trim().length < 4 ||
                info.password.trim().length < 8 ||
                info.password !== info.confirmPassword
                  ? true
                  : false
              }
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
    </div>
  );
};
export default Signup;
