"use client";

import { useEffect, useState } from "react";

type PresentationProps = {
  interval?: number; // time in ms
};

export default function Presentation({ interval = 3000 }: PresentationProps) {
  const [currentUrl, setCurrentUrl] = useState<string>("");

  const getRandomImageUrl = () => {
    // Using picsum.photos to get a random image of size 800x400
    return `https://picsum.photos/800/400?random=${Math.floor(
      Math.random() * 1000
    )}`;
  };

  useEffect(() => {
    // Set initial image
    setCurrentUrl(getRandomImageUrl());

    const slideInterval = setInterval(() => {
      setCurrentUrl(getRandomImageUrl());
    }, interval);

    return () => clearInterval(slideInterval);
  }, [interval]);

  if (!currentUrl) return null;

  return (
    <div className="h-64 rounded-lg bg-gray-100 overflow-hidden relative flex items-center justify-center text-gray-500">
      <img
        src={currentUrl}
        alt="Random Slide"
        className="w-full h-full object-cover rounded-lg transition-all duration-700"
      />
    </div>
  );
}
