import React, { useEffect, useMemo, useState } from "react";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import guestImg from "../../assets/waiter_8560763.png";

const Side = React.memo(() => {
  const [width, setWidth] = useState("w-[70px]");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(Array.from({ length: 50 }));
  }, []);

  const usersElement = useMemo(() => {
    if (users.length === 0) {
      return <p className="text-center mt-4 font-bold uppercase">no users</p>;
    } else {
      return users.map((_, i) => {
        return (
          <div
            key={i}
            className={`flex items-center ${
              width === "w-[70px]" ? "justify-center" : ""
            } gap-3 duration-100 hover:bg-white/25 cursor-pointer p-2`}
          >
            {width === "w-[70px]" ? (
              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-green-500 absolute top-[0px] right-[0px] z-10"></span>
                <img src={guestImg} className="w-12 h-12 relative" />
              </div>
            ) : (
              <>
                <div className="relative">
                  <span className="w-3 h-3 rounded-full bg-green-500 absolute top-[0px] right-[0px] z-10"></span>
                  <img src={guestImg} className="w-12 h-12 relative" />
                </div>
                <div className="flex-1 flex flex-col relative">
                  <p className="font-bold text-sm">fullName</p>
                  <p className="text-xs text-white/50">
                    this is last message...
                  </p>
                </div>
                <span className="w-3 h-3 rounded-full bg-green-500 relative"></span>
              </>
            )}
          </div>
        );
      });
    }
  }, [users, width]);

  return (
    <div
      className={`${width} h-full flex flex-col bg-black/50 backdrop-blur-lg relative overflow-hidden text-white border-r border-white/25 duration-300`}
    >
      <div
        className={`duration-300 h-16 border-b border-white/25 flex items-center ${
          width === "w-[300px]" ? "justify-end" : "justify-center"
        } p-4`}
      >
        {width === "w-[300px]" ? (
          <FaRegArrowAltCircleLeft
            className="text-4xl cursor-pointer duration-300 hover:text-white/50 hover:scale-95"
            onClick={() => setWidth("w-[70px]")}
          />
        ) : (
          <FaRegArrowAltCircleRight
            className="text-4xl cursor-pointer duration-300 hover:text-white/50 hover:scale-95"
            onClick={() => setWidth("w-[300px]")}
          />
        )}
      </div>
      <div className="h-full overflow-y-auto overflow-x-hidden flex flex-col gap-5 custom-scrollbar flex-1">
        {usersElement}
      </div>
    </div>
  );
});
export default Side;
