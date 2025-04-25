import React from "react";

const BlinkBlur = ({ color, size, text, textColor }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 ${size === "medium" ? "h-6 w-6" : "h-4 w-4"} ${
          color || "border-blue-500"
        }`}
      ></div>
      {text && <span className={`ml-2 ${textColor || "text-gray-700"}`}>{text}</span>}
    </div>
  );
};

export default BlinkBlur;