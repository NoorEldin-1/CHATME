import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import guestImg from "../../assets/waiter_8560763.png";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdSend } from "react-icons/io";
import { CiTimer } from "react-icons/ci";
import UserMenu from "../library/UserMenu";
import { AnimatePresence } from "motion/react";
import MessageMenu from "../library/MessageMenu";
import { useDispatch, useSelector } from "react-redux";
import {
  allMessages,
  pushNewMessage,
  removeMessage,
  sendMessage,
  setActiveMessage,
} from "../../store/messageSlice";
import Loader from "../library/Loader";
import echo from "../../echo";
import RelativeTime from "../library/RelativeTime";

// Memoized message component to prevent unnecessary re-renders
const MessageItem = React.memo(({ message, onOpenMessageMenu, dispatch }) => {
  const isOwnMessage =
    message.user_id === window.localStorage.getItem("userId");

  return (
    <div
      className={`w-fit max-w-[75%] p-2 rounded-2xl ${
        isOwnMessage ? "bg-blue-600/25 mr-auto" : "bg-red-500/25 ml-auto"
      }`}
    >
      {isOwnMessage && (
        <div
          onClick={(event) => {
            event.stopPropagation();
            onOpenMessageMenu(event);
            dispatch(setActiveMessage(message));
          }}
          className="ml-auto w-8 h-8 rounded-full bg-transparent hover:bg-white/25 duration-300 cursor-pointer hover:scale-95 flex items-center justify-center"
        >
          <HiDotsVertical />
        </div>
      )}
      <p className="break-all">{message.content}</p>
      <p className="italic font-bold text-xs flex items-center justify-end gap-2 mt-2 text-white/75">
        <RelativeTime timestamp={message.created_at} />
        <CiTimer className="text-lg" />
      </p>
    </div>
  );
});

// Empty state component
const EmptyMessages = () => (
  <div className="w-full h-full grid place-content-center">
    <p className="text-center font-bold uppercase">no messages yet.</p>
  </div>
);

const MainWidget = React.memo(() => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message.messages);
  const loading = useSelector((state) => state.message.getAllMessagesLoading);
  const sendLoading = useSelector((state) => state.message.sendLoading);
  const activeChat = useSelector((state) => state.chat.activeChat);

  // State declarations
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElMessageMenu, setAnchorElMessageMenu] = useState(null);
  const [messageText, setMessageText] = useState("");

  const openUserMenu = Boolean(anchorEl);
  const openMessageMenu = Boolean(anchorElMessageMenu);
  const messagesContainerRef = useRef(null);

  // Memoized selectors for derived data
  const { otherUserImage, otherUserFullName, otherUserUsername } = useMemo(
    () => ({
      otherUserImage:
        activeChat?.other_user?.image === null
          ? guestImg
          : activeChat?.other_user?.image,
      otherUserFullName: activeChat?.other_user?.fullName,
      otherUserUsername: activeChat?.other_user?.username,
    }),
    [
      activeChat?.other_user?.image,
      activeChat?.other_user?.fullName,
      activeChat?.other_user?.username,
    ]
  );

  const activeChatId = activeChat?.id;

  // Event handlers with useCallback
  const handleOpenUserMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleCloseUserMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleOpenMessageMenu = useCallback((event) => {
    setAnchorElMessageMenu(event.currentTarget);
  }, []);

  const handleCloseMessageMenu = useCallback(() => {
    setAnchorElMessageMenu(null);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (messageText.trim().length === 0 || !activeChatId) return;
    dispatch(
      sendMessage({
        chatID: activeChatId,
        content: messageText,
      })
    );
    setMessageText("");
  }, [messageText, activeChatId, dispatch]);

  // Generic click outside handler
  const useClickOutside = (anchorElement, closeHandler) => {
    useEffect(() => {
      if (!anchorElement) return;

      const handleClickOutside = (event) => {
        if (anchorElement && !anchorElement.contains(event.target)) {
          closeHandler();
        }
      };

      const handleScroll = () => {
        closeHandler();
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleScroll, true);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("scroll", handleScroll, true);
      };
    }, [anchorElement, closeHandler]);
  };

  // Use the generic click outside handler
  useClickOutside(anchorEl, handleCloseUserMenu);
  useClickOutside(anchorElMessageMenu, handleCloseMessageMenu);

  // WebSocket effects with proper cleanup
  useEffect(() => {
    if (!activeChatId) return;

    const messageDeleteChannel = echo.private(`message-delete.${activeChatId}`);
    const handleMessageDeleted = (e) => {
      dispatch(removeMessage(Number(e.message_id)));
    };

    messageDeleteChannel.listen("MessageDelete", handleMessageDeleted);

    return () => {
      messageDeleteChannel.stopListening("MessageDelete", handleMessageDeleted);
      echo.leaveChannel(messageDeleteChannel.name);
    };
  }, [activeChatId, dispatch]);

  useEffect(() => {
    if (!activeChatId) return;

    const messageSentChannel = echo.private(`chat.${activeChatId}`);
    const handleMessageSent = (e) => {
      dispatch(pushNewMessage(e.message));
    };

    messageSentChannel.listen("MessageSent", handleMessageSent);

    return () => {
      messageSentChannel.stopListening("MessageSent", handleMessageSent);
      echo.leaveChannel(messageSentChannel.name);
    };
  }, [activeChatId, dispatch]);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (!activeChatId) return;
    dispatch(allMessages(activeChatId));
  }, [activeChatId, dispatch]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (!messagesContainerRef.current) return;
    const container = messagesContainerRef.current;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  // Memoized messages rendering
  const messagesElements = useMemo(() => {
    if (messages.length === 0) {
      return <EmptyMessages />;
    }

    return messages.map((message) => (
      <MessageItem
        key={message.id}
        message={message}
        onOpenMessageMenu={handleOpenMessageMenu}
        dispatch={dispatch}
      />
    ));
  }, [messages, handleOpenMessageMenu, dispatch]);

  // Handle textarea key press for Enter key submission
  const handleTextareaKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  if (!activeChat) {
    return (
      <div className="bg-black/25 backdrop-blur-lg relative flex-1 overflow-y-auto overflow-x-hidden text-white flex flex-col">
        <div className="w-full h-full grid place-content-center">
          <p className="text-center font-bold uppercase">
            Select a chat to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/25 backdrop-blur-lg relative flex-1 overflow-y-auto overflow-x-hidden text-white flex flex-col">
      {/* Header */}
      <div className="relative z-50 h-16 bg-black/50 backdrop-blur-lg flex items-center gap-3 p-2 border-b border-white/25">
        <div className="relative">
          <img
            src={otherUserImage}
            className="w-12 h-12 relative rounded-full object-cover"
            alt={`${otherUserFullName}'s profile`}
          />
        </div>
        <div className="flex-1 flex flex-col relative">
          <p className="font-bold text-sm">{otherUserFullName}</p>
          <p className="text-xs text-white/50">@{otherUserUsername}</p>
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

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="custom-scrollbar flex flex-col gap-4 relative overflow-auto flex-1 p-2"
      >
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

      {/* Message Input */}
      <div className="flex gap-4 items-center border-t border-white/25 w-full p-4">
        <textarea
          disabled={sendLoading}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleTextareaKeyPress}
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
