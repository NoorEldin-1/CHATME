import React, { useEffect, useMemo, useState } from "react";
import guestImg from "../../assets/waiter_8560763.png";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdSend } from "react-icons/io";
import { CiTimer } from "react-icons/ci";
import UserMenu from "../library/UserMenu";
import { AnimatePresence } from "motion/react";
import MessageMenu from "../library/MessageMenu";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  allMessages,
  sendMessage,
  setActiveMessage,
} from "../../store/messageSlice";
import Loader from "../library/Loader";

const MainWidget = React.memo(() => {
  // const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message.messages);
  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);
  const loading = useSelector((state) => state.message.getAllMessagesLoading);
  const [messageText, setMessageText] = useState("");
  const sendLoading = useSelector((state) => state.message.sendLoading);

  const [anchorElMessageMenu, setAnchorElMessageMenu] = useState(null);
  const openMessageMenu = Boolean(anchorElMessageMenu);

  const activeChat = useSelector((state) => state.chat.activeChat);

  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenMessageMenu = (event) => {
    setAnchorElMessageMenu(event.currentTarget);
  };

  const handleCloseMessageMenu = () => {
    setAnchorElMessageMenu(null);
  };

  const handleSendMessage = () => {
    if (messageText.trim().length === 0) return;
    dispatch(
      sendMessage({
        chatID: activeChat.id,
        content: messageText,
      })
    );
    setMessageText("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (anchorEl && !anchorEl.contains(event.target)) {
        handleCloseUserMenu();
      }
    };

    const handleScroll = () => {
      if (anchorEl) {
        handleCloseUserMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [anchorEl]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (anchorElMessageMenu && !anchorElMessageMenu.contains(event.target)) {
        handleCloseMessageMenu();
      }
    };

    const handleScroll = () => {
      if (anchorElMessageMenu) {
        handleCloseMessageMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [anchorElMessageMenu]);

  useEffect(() => {
    dispatch(allMessages(activeChat.id));
  }, [activeChat.id, dispatch]);

  const messagesElements = useMemo(() => {
    if (messages.length === 0) {
      return (
        <div className="w-full h-full grid place-content-center">
          <p className="text-center font-bold uppercase">no messages yet.</p>
        </div>
      );
    } else {
      return messages.map((message) => {
        return (
          <div
            key={message.id}
            className={`w-[75%] p-2 rounded-2xl ${
              message.user_id === window.localStorage.getItem("userId")
                ? "bg-blue-600/25"
                : "bg-red-500/25 ml-auto"
            }`}
          >
            {message.user_id === window.localStorage.getItem("userId") && (
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  handleOpenMessageMenu(event);
                  dispatch(setActiveMessage(message));
                }}
                className="ml-auto w-8 h-8 rounded-full bg-transparent hover:bg-white/25 duration-300 cursor-pointer hover:scale-95 flex items-center justify-center"
              >
                <HiDotsVertical />
              </div>
            )}
            <p>{message.content}</p>
            <p className="italic font-bold text-xs flex items-center justify-end gap-2 mt-2 text-white/75">
              <span>{message.created_at}</span> <CiTimer className="text-lg" />
            </p>
          </div>
        );
      });
    }
  }, [dispatch, messages]);

  return (
    <div className="bg-black/25 backdrop-blur-lg relative flex-1 overflow-y-auto overflow-x-hidden text-white flex flex-col">
      <div className="relative z-50 h-16 bg-black/50 backdrop-blur-lg flex items-center gap-3 p-2 border-b border-white/25">
        <div className="relative">
          <img
            src={
              activeChat.other_user.image === null
                ? guestImg
                : activeChat.other_user.image
            }
            className="w-12 h-12 relative rounded-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col relative">
          <p className="font-bold text-sm">{activeChat.other_user.fullName}</p>
          <p className="text-xs text-white/50">
            @{activeChat.other_user.username}
          </p>
        </div>
        <div
          onClick={handleOpenUserMenu}
          className="w-10 h-10 bg-transparent hover:bg-white/25 duration-300 flex items-center justify-center rounded-full cursor-pointer text-2xl"
        >
          <HiDotsVertical />
        </div>
        <AnimatePresence>
          {openUserMenu && <UserMenu anchorEl={anchorEl} />}
        </AnimatePresence>
      </div>
      <div className="custom-scrollbar flex flex-col gap-4 relative overflow-auto flex-1 p-2">
        {loading ? (
          <div className="w-full h-full grid place-content-center">
            <Loader />
          </div>
        ) : (
          messagesElements
        )}
        <AnimatePresence>
          {openMessageMenu && <MessageMenu anchorEl={anchorElMessageMenu} />}
        </AnimatePresence>
      </div>
      <div className="flex gap-4 items-center border-t border-white/25 w-full p-4">
        <textarea
          disabled={sendLoading}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          type="text"
          className="input-custom-scrollbar resize-none flex-1 outline-0 placeholder:duration-300 focus:placeholder:text-transparent border border-white/25 rounded-2xl p-2 h-20"
          placeholder="Write your message..."
        />
        <div className="flex flex-col justify-center gap-1">
          {sendLoading ? (
            <Loader />
          ) : (
            <div
              onClick={handleSendMessage}
              className="cursor-pointer text-2xl duration-300 hover:scale-95 bg-transparent text-white hover:bg-white/25 rounded-full w-10 h-10 flex items-center justify-center"
            >
              <IoMdSend className="text-blue-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default MainWidget;
