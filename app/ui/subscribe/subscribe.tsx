"use client";
import { useState } from "react";

type SubscribeButtonProps = {
  initialCount?: number;
};

export default function SubscribeButton({
  initialCount = 0,
}: SubscribeButtonProps) {
  const [subscribed, setSubscribed] = useState(false);
  const [count, setCount] = useState(initialCount);

  const handleClick = () => {
    setSubscribed((prev) => !prev);
    setCount((prev) => (subscribed ? prev - 1 : prev + 1));
  };

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left: Subscribe Button */}
      <button
        onClick={handleClick}
        className={`px-3 py-1 rounded-full text-white text-xs sm:text-sm font-medium transition-colors ${
          subscribed ? "bg-blue-600" : "bg-black"
        }`}
      >
        {subscribed ? "Subscribed" : "Subscribe"}
      </button>

      {/* Right: Count */}
      <span className="text-sm font-medium">18.K</span>
    </div>
  );
}
