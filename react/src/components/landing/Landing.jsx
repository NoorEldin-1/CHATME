import { lazy, Suspense, useCallback } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router";
import Button from "../library/Button";
import BgAnimation from "../library/BgAnimation";
import { IoMdLogIn } from "react-icons/io";
import { CgLogIn } from "react-icons/cg";
import { FaArrowRight } from "react-icons/fa";

// Lazy load heavy components
const Login = lazy(() => import("../auth/Login"));
const Signup = lazy(() => import("../auth/Signup"));

// Memoized static content to prevent re-renders
const Header = () => (
  <div className="sticky top-0 left-0 w-full flex justify-between items-center bg-black/25 backdrop-blur-xs border-b-1 border-white/25 py-4 px-2 shadow-lg">
    <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-white font-extrabold text-xl select-none">
      CHATME.
    </h1>
  </div>
);

const HeroContent = ({ goToSignup }) => (
  <div className="relative grid place-content-center flex-1 text-center px-2">
    <h2 className="uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-white font-extrabold text-3xl select-none">
      Welcome to CHATME!
    </h2>
    <p className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-800 font-extrabold text-lg select-none my-4 max-w-[500px] mx-auto">
      Experience a cleaner, faster, and more reliable way to chat. Dive into
      seamless messaging with CHATME.
    </p>
    <div className="grid place-content-center">
      <Button
        variant="gradient"
        icon={<FaArrowRight className="text-sm" />}
        onClick={goToSignup}
      >
        get started
      </Button>
    </div>
  </div>
);

// Loading fallback for lazy components
const AuthFallback = () => (
  <div className="flex items-center justify-center h-full text-white font-bold">
    <div className="animate-pulse">wait</div>
  </div>
);

const Landing = () => {
  const navigate = useNavigate();

  // Memoized navigation handlers
  const goToLogin = useCallback(() => navigate("/login"), [navigate]);
  const goToSignup = useCallback(() => navigate("/signup"), [navigate]);

  return (
    <div className="h-screen overflow-hidden flex flex-col font-notoSansArabic">
      <BgAnimation />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <div className="absolute top-4 right-2 z-10">
                <div className="flex gap-2 items-center">
                  <Button
                    variant="gradient"
                    icon={<IoMdLogIn className="text-sm" />}
                    onClick={goToLogin}
                  >
                    login
                  </Button>
                  <Button
                    variant="gradient"
                    icon={<CgLogIn className="text-sm" />}
                    onClick={goToSignup}
                  >
                    signup
                  </Button>
                </div>
              </div>
              <HeroContent goToSignup={goToSignup} />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<AuthFallback />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/signup"
          element={
            <Suspense fallback={<AuthFallback />}>
              <Signup />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default Landing;
