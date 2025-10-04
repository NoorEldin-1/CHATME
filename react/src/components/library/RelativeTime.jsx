import React, { useEffect, useState, useCallback, useMemo } from "react";

// Memoized time calculation function
const calculateRelativeTime = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = Date.now();
  const diffInSeconds = Math.floor((now - date.getTime()) / 1000);

  // Early returns for most common cases
  if (diffInSeconds < 60) return "just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;

  // Use Intl.DateTimeFormat for better performance than toLocaleDateString
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const RelativeTime = ({ timestamp }) => {
  const relativeTime = useRelativeTime(timestamp);
  return <span>{relativeTime}</span>;
};

const useRelativeTime = (timestamp) => {
  const [relativeTime, setRelativeTime] = useState("");

  // Memoize the update function
  const updateRelativeTime = useCallback(() => {
    setRelativeTime(calculateRelativeTime(timestamp));
  }, [timestamp]);

  // Memoize the calculated time to avoid unnecessary recalculations
  const initialTime = useMemo(
    () => calculateRelativeTime(timestamp),
    [timestamp]
  );

  useEffect(() => {
    if (!timestamp) {
      setRelativeTime("");
      return;
    }

    // Set initial value
    setRelativeTime(initialTime);

    // Calculate optimal update interval based on time difference
    const date = new Date(timestamp);
    const now = Date.now();
    const diffInSeconds = Math.floor((now - date.getTime()) / 1000);

    let interval = 60000; // Default: 1 minute

    if (diffInSeconds > 86400) {
      // More than 1 day
      interval = 3600000; // Update every hour
    } else if (diffInSeconds > 604800) {
      // More than 1 week
      interval = 86400000; // Update once per day
    } else if (diffInSeconds < 3600) {
      // Less than 1 hour
      interval = 30000; // Update every 30 seconds for recent times
    }

    // Only set interval if needed (not for dates older than a week)
    if (diffInSeconds < 604800) {
      const intervalId = setInterval(updateRelativeTime, interval);
      return () => clearInterval(intervalId);
    }
  }, [timestamp, initialTime, updateRelativeTime]);

  return relativeTime;
};

// Export memoized component to prevent unnecessary re-renders
export default React.memo(RelativeTime);
