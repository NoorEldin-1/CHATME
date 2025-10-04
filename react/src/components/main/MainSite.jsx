import { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import DeleteMessageDialog from "../library/DeleteMessageDialog";
import DeleteUserDialog from "../library/DeleteUserDialog";
import FindUserDialog from "../library/FindUserDialog";
import LogoutDialog from "../library/LogoutDialog";
import NotificationsDialog from "../library/NotificationsDialog";
import SettingDialog from "../library/SettingDialog";
import MainWidget from "./MainWidget";
import NavBar from "./NavBar";
import Side from "./Side";

const MainSite = memo(() => {
  const activeChat = useSelector((state) => state.chat.activeChat);

  const backgroundStyle = useMemo(
    () => ({
      backgroundImage: `radial-gradient(circle 500px at 50% 200px, #3e3e3e, transparent)`,
    }),
    []
  );

  const emptyStateContent = useMemo(
    () => (
      <div className="w-full h-full grid place-content-center relative">
        <p className="text-white font-bold text-2xl uppercase text-center">
          select someone to chat with.
        </p>
      </div>
    ),
    []
  );

  const mainContent = useMemo(
    () => (activeChat ? <MainWidget /> : emptyStateContent),
    [activeChat, emptyStateContent]
  );

  return (
    <div className="h-screen w-full bg-[#020617] relative select-none">
      <div className="absolute inset-0 z-0" style={backgroundStyle} />
      <div className="h-full w-full flex overflow-hidden">
        <Side />
        <div className="flex-1 h-full flex flex-col overflow-hidden">
          <NavBar />
          {mainContent}
        </div>
      </div>
      <DeleteMessageDialog />
      <DeleteUserDialog />
      <SettingDialog />
      <FindUserDialog />
      <NotificationsDialog />
      <LogoutDialog />
    </div>
  );
});

MainSite.displayName = "MainSite";

export default MainSite;
