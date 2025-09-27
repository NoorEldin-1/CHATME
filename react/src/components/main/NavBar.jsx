import React from "react";
import { IoMdSettings } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import { LuUserSearch } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { setDialog } from "../../store/dialogSlice";

const NavBar = React.memo(() => {
  const dispatch = useDispatch();
  return (
    <div className="overflow-hidden w-full h-16 bg-black/25 backdrop-blur-lg flex items-center justify-between relative text-white border-b border-white/25 p-4">
      <p className="font-bold text-lg whitespace-nowrap">
        {window.localStorage.getItem("fullName")}
      </p>
      <div className="flex gap-2">
        <div
          onClick={() => dispatch(setDialog("notificationsDialog"))}
          className="relative cursor-pointer duration-300 hover:[&>svg]:text-yellow-600 hover:scale-95"
        >
          <IoIosNotifications className="text-yellow-300 text-3xl relative" />
          <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center absolute top-[-5px] left-[-5px] text-xs">
            10
          </span>
        </div>
        <LuUserSearch
          onClick={() => dispatch(setDialog("findUserDialog"))}
          className="text-blue-600 text-3xl cursor-pointer duration-300 hover:text-blue-900 hover:scale-95"
        />
        <IoMdSettings
          onClick={() => dispatch(setDialog("settingDialog"))}
          className="text-3xl cursor-pointer duration-300 hover:text-white/50 hover:scale-95"
        />
      </div>
    </div>
  );
});

export default NavBar;
