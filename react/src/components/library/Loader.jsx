import { memo } from "react";

const Loader = () => {
  return (
    <div
      className="flex justify-center items-center"
      role="status"
      aria-label="Loading"
    >
      <svg
        width="24"
        height="30"
        viewBox="0 0 24 30"
        className="enable-background:new 0 0 50 50"
        aria-hidden="true"
      >
        <rect x="0" y="0" width="4" height="10" className="fill-blue-600">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 20; 0 0"
            begin="0"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="10" y="0" width="4" height="10" className="fill-blue-700">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 20; 0 0"
            begin="0.2s"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="20" y="0" width="4" height="10" className="fill-blue-800">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 20; 0 0"
            begin="0.4s"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
  );
};

export default memo(Loader);
