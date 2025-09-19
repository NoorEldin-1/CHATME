import Button from "../library/Button";
import BgAnimation from "../library/BgAnimation";
import { IoMdLogIn } from "react-icons/io";
import { CgLogIn } from "react-icons/cg";
import { FaArrowRight } from "react-icons/fa";
import { Routes, Route, useNavigate } from "react-router";
import Login from "../auth/Login";
import Signup from "../auth/Signup";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen overflow-hidden flex flex-col font-notoSansArabic">
      <BgAnimation />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="sticky top-0 left-0 w-full flex justify-between items-center bg-black/25 backdrop-blur-xs border-b-1 border-white/25 py-4 px-2 shadow-lg">
                <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-white font-extrabold text-xl select-none">
                  CHATME.
                </h1>
                <div className="flex gap-2 items-center">
                  <Button
                    variant="gradient"
                    icon={<IoMdLogIn className="text-sm" />}
                    onClick={() => navigate("/login")}
                  >
                    login
                  </Button>
                  <Button
                    variant="gradient"
                    icon={<CgLogIn className="text-sm" />}
                    onClick={() => navigate("/signup")}
                  >
                    signup
                  </Button>
                </div>
              </div>
              <div className="relative grid place-content-center flex-1 text-center px-2">
                <h2 className="uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-white font-extrabold text-3xl select-none">
                  Welcome to CHATME!
                </h2>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-800 font-extrabold text-lg select-none my-4 max-w-[500px] mx-auto">
                  Experience a cleaner, faster, and more reliable way to chat.
                  Dive into seamless messaging with CHATME.
                </p>
                <Button
                  variant="gradient"
                  className="mx-auto"
                  icon={<FaArrowRight className="text-sm" />}
                  onClick={() => navigate("/signup")}
                >
                  get started
                </Button>
              </div>
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};

export default Landing;
