import MainWidget from "./MainWidget";
import NavBar from "./NavBar";
import Side from "./Side";

const MainSite = () => {
  return (
    <div className="h-screen w-full bg-[#020617] relative select-none">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle 500px at 50% 200px, #3e3e3e, transparent)`,
        }}
      />
      <div className="h-full w-full flex overflow-hidden">
        <Side />
        <div className="flex-1 h-full flex flex-col overflow-hidden">
          <NavBar />
          <MainWidget />
        </div>
      </div>
    </div>
  );
};
export default MainSite;
