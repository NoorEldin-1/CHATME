import React, { useEffect, useMemo, useState } from "react";
import guestImg from "../../assets/waiter_8560763.png";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdSend } from "react-icons/io";
import { CiTimer } from "react-icons/ci";

const MainWidget = React.memo(() => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages(Array.from({ length: 100 }));
  }, []);

  const messagesElements = useMemo(() => {
    if (messages.length === 0) {
      return (
        <p className="text-center font-bold uppercase">no messages yet.</p>
      );
    } else {
      return messages.map((_, i) => {
        return (
          <div
            key={i}
            className={`w-[75%] p-2 rounded-2xl ${
              i % 2 === 0 ? "bg-blue-600/25" : "bg-red-500/25 ml-auto"
            }`}
          >
            {i % 2 === 0 && (
              <div className="ml-auto w-8 h-8 rounded-full bg-transparent hover:bg-white/25 duration-300 cursor-pointer hover:scale-95 flex items-center justify-center">
                <HiDotsVertical />
              </div>
            )}
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptates fugit minima, illum voluptas eos, modi itaque animi
              accusantium id numquam sint repudiandae perspiciatis accusamus
              suscipit est omnis odit nemo quasi.
            </p>
            <p className="italic font-bold text-xs flex items-center justify-end gap-2 mt-2 text-white/75">
              <span>10 secondes ago</span> <CiTimer className="text-lg" />
            </p>
          </div>
        );
      });
    }
  }, [messages]);
  return (
    <div className="bg-black/25 backdrop-blur-lg relative flex-1 overflow-y-auto overflow-x-hidden text-white flex flex-col">
      <div className="h-16 bg-black/50 backdrop-blur-lg flex items-center gap-3 p-2 border-b border-white/25">
        <div className="relative">
          <span className="w-3 h-3 rounded-full bg-green-500 absolute top-[0px] right-[0px] z-10"></span>
          <img src={guestImg} className="w-12 h-12 relative" />
        </div>
        <div className="flex-1 flex flex-col relative">
          <p className="font-bold text-sm">fullName</p>
          <p className="text-xs text-white/50">@username</p>
        </div>
        <div className="w-10 h-10 bg-transparent hover:bg-white/25 duration-300 flex items-center justify-center rounded-full cursor-pointer text-2xl">
          <HiDotsVertical />
        </div>
      </div>
      <div className="custom-scrollbar flex flex-col gap-4 relative overflow-auto flex-1 p-2">
        {messagesElements}
      </div>
      <div className="flex gap-4 items-center border-t border-white/25 w-full p-4">
        <textarea
          type="text"
          className="input-custom-scrollbar resize-none flex-1 outline-0 placeholder:duration-300 focus:placeholder:text-transparent border border-white/25 rounded-2xl p-2 h-20"
          placeholder="Write your message..."
        />
        <div className="cursor-pointer text-2xl duration-300 hover:scale-95 bg-transparent text-white hover:bg-white/25 rounded-full w-10 h-10 flex items-center justify-center">
          <IoMdSend className="text-blue-600" />
        </div>
      </div>
    </div>
  );
});

export default MainWidget;
