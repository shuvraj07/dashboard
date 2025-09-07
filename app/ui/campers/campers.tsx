"use client";

import React, { useEffect, useState } from "react";
import ProfileMic from "../profile";
import { auth, onAuthStateChanged } from "@/app/firebase";

const APP_ID = "b48c972faec9438c88c4dfff718dc4f0"; // Your Agora App ID

type CampersProps = {
  channelName: string; // Unique channel per arena (use arena ID)
};

const Campers: React.FC<CampersProps> = ({ channelName }) => {
  const [client, setClient] = useState<any>(null);
  const [localTrack, setLocalTrack] = useState<any>(null);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(false);
  const [uid, setUid] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null); // Firebase logged-in user

  // Track Firebase user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Initialize Agora
  useEffect(() => {
    if (typeof window === "undefined") return;

    let mounted = true;
    const initAgora = async () => {
      try {
        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
        const rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        setClient(rtcClient);

        const micTrack = await AgoraRTC.createMicrophoneAudioTrack({
          AEC: true,
          AGC: true,
          ANS: true,
        });
        setLocalTrack(micTrack);

        const userId = Math.floor(Math.random() * 100000);
        setUid(userId);

        // Join the unique channel (arena ID)
        await rtcClient.join(APP_ID, channelName, null, userId);
        await rtcClient.publish([micTrack]);
        setJoined(true);

        // Subscribe to remote users
        rtcClient.on(
          "user-published",
          async (
            remoteUser: any,
            mediaType: "audio" | "video" | "datachannel"
          ) => {
            if (remoteUser.uid === userId) return;
            await rtcClient.subscribe(remoteUser, mediaType);
            if (mediaType === "audio") remoteUser.audioTrack?.play();
            if (mounted)
              setRemoteUsers([
                ...rtcClient.remoteUsers.filter((u) => u.uid !== userId),
              ]);
          }
        );

        rtcClient.on("user-unpublished", () => {
          if (mounted)
            setRemoteUsers([
              ...rtcClient.remoteUsers.filter((u) => u.uid !== userId),
            ]);
        });
      } catch (err: any) {
        console.error("Agora error:", err);
        alert(
          "Could not join audio. Make sure your browser allows microphone access."
        );
      }
    };

    initAgora();

    return () => {
      mounted = false;
      localTrack?.close();
      client?.leave();
    };
  }, [channelName]);

  const toggleMute = async () => {
    if (!localTrack) return;
    await localTrack.setEnabled(muted); // true = enable track, false = mute
    setMuted(!muted);
  };

  const leaveChannel = async () => {
    if (!client) return;
    await client.unpublish([localTrack]);
    await client.leave();
    localTrack?.close();
    setJoined(false);
    setRemoteUsers([]);
    setUid(null);
    setLocalTrack(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4">Campers (Agora Live)</h3>

      {/* Users Grid */}
      <div className="flex-1 overflow-auto mb-24">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
          {/* Local user */}
          {user && (
            <div className="flex flex-col items-center text-center gap-2">
              <ProfileMic avatar={user.photoURL || "/cnn.png"} />
              <span className="text-sm font-medium truncate w-16">
                {user.displayName || "You"}
              </span>
            </div>
          )}

          {/* Remote users */}
          {remoteUsers.map((remote: any) => (
            <div
              key={remote.uid}
              className="flex flex-col items-center text-center gap-2"
            >
              <ProfileMic
                avatar={`https://i.pravatar.cc/150?u=${remote.uid}`}
              />
              <span className="text-sm font-medium truncate w-16">
                Camper {remote.uid}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mute / Leave buttons */}
      {joined && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-4 bg-white py-2 shadow-inner">
          <button
            onClick={toggleMute}
            className={`px-4 py-2 rounded text-white ${
              muted ? "bg-green-500" : "bg-red-500"
            } hover:opacity-80 transition`}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            onClick={leaveChannel}
            className="px-4 py-2 rounded bg-gray-700 text-white hover:opacity-80 transition"
          >
            Leave
          </button>
        </div>
      )}
    </div>
  );
};

export default Campers;
