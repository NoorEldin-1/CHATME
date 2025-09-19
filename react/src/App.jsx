import "./App.css";
import Landing from "./components/landing/Landing";
import MainSite from "./components/main/MainSite";

function App() {
  return (
    <>{window.localStorage.getItem("token") ? <MainSite /> : <Landing />}</>
  );
}

export default App;
