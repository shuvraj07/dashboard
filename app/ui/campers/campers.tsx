"use client";

import React, { useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "@/app/firebase";

// Replace with your Agora App ID
const APP_ID = "b48c972faec9438c88c4dfff718dc4f0";

type UserInfo = {
  uid: number;
  name: string;
  avatar: string;
  muted: boolean;
};

type Toast = { id: number; message: string };

const Campers = ({ channelName }: { channelName: string }) => {
  const [client, setClient] = useState<any>(null);
  const [localTrack, setLocalTrack] = useState<any>(null);
  const [remoteUsers, setRemoteUsers] = useState<UserInfo[]>([]);
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(true);
  const [uid, setUid] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Show toast notifications
  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Track Firebase login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // Initialize Agora when logged in
  useEffect(() => {
    if (!user) return;

    let mounted = true;

    const initAgora = async () => {
      const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
      const rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setClient(rtcClient);

      // Generate stable UID
      const userId = parseInt(user.uid.slice(0, 6), 36);
      setUid(userId);

      // Join channel
      await rtcClient.join(APP_ID, channelName, null, userId);
      setJoined(true);

      // Create local mic track (start muted)
      const micTrack = await AgoraRTC.createMicrophoneAudioTrack({
        AEC: true,
        AGC: true,
        ANS: true,
      });
      setLocalTrack(micTrack);
      await rtcClient.publish([micTrack]);
      micTrack.setEnabled(false); // Start muted

      // Add self to remoteUsers for UI
      addRemoteUser({
        uid: userId,
        name: user.displayName || "Me",
        muted: true,
        avatar: user.photoURL || `https://i.pravatar.cc/150?u=${userId}`,
      });

      // Subscribe to remote users already in room
      Object.values(rtcClient.remoteUsers).forEach(async (remoteUser: any) => {
        await rtcClient.subscribe(remoteUser, "audio");
        remoteUser.audioTrack?.play();
        addRemoteUser({
          uid: remoteUser.uid,
          name: remoteUser.uid.toString(),
          muted: false,
          avatar: `https://i.pravatar.cc/150?u=${remoteUser.uid}`,
        });
        showToast(`User ${remoteUser.uid} is already in the room`);
      });

      // Handle new users joining
      rtcClient.on("user-published", async (remoteUser: any, mediaType) => {
        await rtcClient.subscribe(remoteUser, mediaType);
        if (mediaType === "audio") remoteUser.audioTrack?.play();
        addRemoteUser({
          uid: remoteUser.uid,
          name: remoteUser.uid.toString(),
          muted: false,
          avatar: `https://i.pravatar.cc/150?u=${remoteUser.uid}`,
        });
        showToast(`User ${remoteUser.uid} joined the room`);
      });

      // Handle users leaving
      rtcClient.on("user-unpublished", (remoteUser: any) => {
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== remoteUser.uid));
        showToast(`User ${remoteUser.uid} left the room`);
      });
    };

    initAgora();

    return () => {
      mounted = false;
      leaveChannel();
    };
  }, [user]);

  const addRemoteUser = (remoteUser: UserInfo) => {
    setRemoteUsers((prev) => {
      if (prev.find((u) => u.uid === remoteUser.uid)) return prev;
      return [...prev, remoteUser];
    });
  };

  // Toggle mic on/off (Clubhouse-style)
  const toggleMute = async () => {
    if (!localTrack) return;

    await localTrack.setEnabled(muted); // true = unmute, false = mute
    setMuted(!muted);
    showToast(muted ? "You unmuted" : "You muted");

    // Update own muted status in remoteUsers for UI
    setRemoteUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, muted: !muted } : u))
    );
  };

  // Leave the channel
  const leaveChannel = async () => {
    if (!client) return;
    if (localTrack) {
      await client.unpublish([localTrack]);
      localTrack.stop();
      localTrack.close();
      setLocalTrack(null);
    }
    await client.leave();
    setJoined(false);
    setRemoteUsers([]);
    setUid(null);
    showToast("You left the room");
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col h-full relative">
      <h2 className="text-xl font-bold mb-4">Campers Room</h2>

      {/* Toasts */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-black text-white px-4 py-2 rounded shadow-lg animate-fade-in"
          >
            {t.message}
          </div>
        ))}
      </div>

      {/* User grid */}
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-auto">
        {remoteUsers.map((u) => (
          <div
            key={u.uid}
            className="flex flex-col items-center p-3 rounded-lg bg-gray-100"
          >
            <img
              src={u.avatar}
              alt={u.name}
              className="w-16 h-16 rounded-full"
            />
            <span className="mt-2 text-sm font-medium">{u.name}</span>
            <span className="text-xs text-gray-500">
              {u.uid === uid ? "(You)" : "In Room"}
            </span>
            <span className="mt-1 text-xs">
              {u.muted ? "Muted" : "Speaking"}
            </span>
          </div>
        ))}
      </div>

      {/* Controls */}
      {joined && (
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={toggleMute}
            className={`px-4 py-2 rounded text-white ${
              muted ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            onClick={leaveChannel}
            className="px-4 py-2 rounded bg-gray-700 text-white"
          >
            Leave Room
          </button>
        </div>
      )}
    </div>
  );
};

export default Campers;
