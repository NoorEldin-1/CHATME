import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";
import guestImg from "../../assets/waiter_8560763.png";
import { useDispatch, useSelector } from "react-redux";
import {
  allChats,
  pushNewChat,
  removeChat,
  setActiveChat,
} from "../../store/chatSlice";
import Loader from "../library/Loader";
import echo from "../../echo";

// Memoized chat item component to prevent unnecessary re-renders
const ChatItem = React.memo(({ chat, isCollapsed, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(chat);
  }, [chat, onSelect]);

  const imageSrc = chat.other_user.image || guestImg;

  return (
    <div
      onClick={handleClick}
      className={`flex items-center ${
        isCollapsed ? "justify-center" : ""
      } gap-3 duration-100 hover:bg-white/25 cursor-pointer p-2`}
    >
      <div className="relative">
        <img
          src={imageSrc}
          alt={chat.other_user.fullName}
          className="w-12 h-12 relative rounded-full object-cover"
          loading="lazy" // Lazy load images
        />
      </div>
      {!isCollapsed && (
        <div className="flex-1 flex flex-col relative min-w-0">
          {" "}
          {/* min-w-0 prevents text overflow */}
          <p className="font-bold text-sm truncate">
            {chat.other_user.fullName}
          </p>
          <p className="text-xs text-white/50 truncate">
            @{chat.other_user.username}
          </p>
        </div>
      )}
    </div>
  );
});

ChatItem.displayName = "ChatItem";

const Side = React.memo(() => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const dispatch = useDispatch();

  // Optimized selectors - extract only needed data
  const chats = useSelector((state) => state.chat.chats);
  const loading = useSelector((state) => state.chat.allChatsLoading);

  const userId = window.localStorage.getItem("userId"); // Cache userId

  // Combined real-time listeners to reduce useEffect calls
  useEffect(() => {
    if (!userId) return;

    const channels = [
      echo.private(`chat-delete.${userId}`),
      echo.private(`chat-create.${userId}`),
    ];

    channels[0].listen("ChatDelete", (e) => {
      dispatch(removeChat(Number(e.chat)));
    });

    channels[1].listen("ChatCreate", (e) => {
      dispatch(pushNewChat(e.chat));
    });

    return () => {
      channels.forEach((channel) => echo.leaveChannel(channel.name));
    };
  }, [dispatch, userId]); // Added userId dependency

  // Fetch chats only once on component mount
  useEffect(() => {
    dispatch(allChats());
  }, [dispatch]);

  const handleChatSelect = useCallback(
    (chat) => {
      dispatch(setActiveChat(chat));
    },
    [dispatch]
  );

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  // Optimized chats rendering with proper keys and memoization
  const chatsElement = useMemo(() => {
    if (chats.length === 0) {
      return <p className="text-center mt-4 font-bold uppercase">no users</p>;
    }

    return chats.map((chat) => (
      <ChatItem
        key={chat.id}
        chat={chat}
        isCollapsed={isCollapsed}
        onSelect={handleChatSelect}
      />
    ));
  }, [chats, isCollapsed, handleChatSelect]);

  const widthClass = isCollapsed ? "w-[70px]" : "w-[300px]";
  const headerJustifyClass = isCollapsed ? "justify-center" : "justify-end";

  return (
    <div
      className={`${widthClass} h-full flex flex-col bg-black/50 backdrop-blur-lg relative overflow-hidden text-white border-r border-white/25 duration-300`}
    >
      <div
        className={`duration-300 h-16 border-b border-white/25 flex items-center ${headerJustifyClass} p-4`}
      >
        {isCollapsed ? (
          <FaRegArrowAltCircleRight
            className="text-4xl cursor-pointer duration-300 hover:text-white/50 hover:scale-95"
            onClick={toggleSidebar}
          />
        ) : (
          <FaRegArrowAltCircleLeft
            className="text-4xl cursor-pointer duration-300 hover:text-white/50 hover:scale-95"
            onClick={toggleSidebar}
          />
        )}
      </div>

      <div className="h-full overflow-y-auto overflow-x-hidden flex flex-col gap-5 custom-scrollbar flex-1">
        {loading ? (
          <div className="grid place-content-center w-full h-full">
            <Loader />
          </div>
        ) : (
          chatsElement
        )}
      </div>
    </div>
  );
});

Side.displayName = "Side";
export default Side;
