// components/profile.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { MicrophoneIcon } from "@heroicons/react/24/outline";

type ProfileMicProps = {
  avatar?: string;
  onToggle?: (muted: boolean) => void; // Add this
};

export default function ProfileMic({ avatar, onToggle }: ProfileMicProps) {
  const [muted, setMuted] = useState(false);

  const handleToggle = async () => {
    const newMuted = !muted;
    setMuted(newMuted);
    if (onToggle) {
      await onToggle(newMuted); // call parent callback
    }
  };

  return (
    <div className="relative">
      {/* Avatar */}
      <Image
        src={avatar || "/customers/profile.png"}
        alt="User"
        width={32}
        height={32}
        className="rounded-full border-2 border-gray-200 object-cover"
      />

      {/* Mic overlay */}
      <button
        onClick={handleToggle}
        className="absolute bottom-0 right-0 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
      >
        <MicrophoneIcon
          className={`w-4 h-4 ${muted ? "text-red-500" : "text-green-500"}`}
        />
        {muted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[1px] h-4 bg-white rotate-45"></div>
          </div>
        )}
      </button>
    </div>
  );
}
