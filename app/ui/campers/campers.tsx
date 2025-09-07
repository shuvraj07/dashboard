"use client";

import React, { useEffect, useState } from "react";
import { auth, onAuthStateChanged, db } from "@/app/firebase";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

// Replace with your Agora App ID
const APP_ID = "b48c972faec9438c88c4dfff718dc4f0";

type UserInfo = {
  uid: string;
  displayName: string;
  photoURL?: string;
  muted: boolean;
};

type Toast = { id: number; message: string };

const Campers = ({ channelName }: { channelName: string }) => {
  const [client, setClient] = useState<any>(null);
  const [localTrack, setLocalTrack] = useState<any>(null);
  const [remoteUsers, setRemoteUsers] = useState<UserInfo[]>([]);
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast notification
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

  // Firestore reference for the room
  const roomRef = collection(db, "rooms", channelName, "users");

  // Sync users from Firestore in real-time
  useEffect(() => {
    const unsub = onSnapshot(roomRef, (snapshot) => {
      const users: UserInfo[] = [];
      snapshot.forEach((doc) => users.push(doc.data() as UserInfo));
      setRemoteUsers(users);
    });
    return () => unsub();
  }, []);

  // Initialize Agora
  useEffect(() => {
    if (!user) return;

    const initAgora = async () => {
      const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
      const rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setClient(rtcClient);

      const uid = user.uid; // Firebase UID as Agora UID
      setMuted(true);

      // Join channel
      await rtcClient.join(APP_ID, channelName, null, uid);

      // Create microphone track (start muted)
      const micTrack = await AgoraRTC.createMicrophoneAudioTrack({
        AEC: true,
        AGC: true,
        ANS: true,
      });
      micTrack.setEnabled(false);
      setLocalTrack(micTrack);
      await rtcClient.publish([micTrack]);
      setJoined(true);

      // Add self to Firestore
      await setDoc(doc(roomRef, uid), {
        uid,
        displayName: user.displayName || "Anonymous",
        photoURL: user.photoURL,
        muted: true,
      });

      // Handle new users publishing audio
      rtcClient.on("user-published", async (remoteUser: any, mediaType) => {
        await rtcClient.subscribe(remoteUser, mediaType);
        if (mediaType === "audio") remoteUser.audioTrack?.play();

        // Add/update remote user in Firestore for display
        const remoteUID = remoteUser.uid;
        setRemoteUsers((prev) => {
          if (prev.find((u) => u.uid === remoteUID)) return prev;
          return [
            ...prev,
            {
              uid: remoteUID,
              displayName: `User ${remoteUID}`,
              photoURL: `https://i.pravatar.cc/150?u=${remoteUID}`,
              muted: false,
            },
          ];
        });
        showToast(`User ${remoteUID} joined the room`);
      });

      // Clean up on leave/unmount
      const handleBeforeUnload = async () => {
        await leaveChannel(rtcClient, micTrack);
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    };

    initAgora();
  }, [user]);

  // Toggle mic
  const toggleMute = async () => {
    if (!localTrack || !user) return;
    const newMuted = !muted;
    await localTrack.setEnabled(!newMuted);
    setMuted(newMuted);

    // Update Firestore
    await updateDoc(doc(roomRef, user.uid), { muted: newMuted });
  };

  // Leave channel
  const leaveChannel = async (rtcClient?: any, track?: any) => {
    const clientToLeave = rtcClient || client;
    const localTrackToStop = track || localTrack;

    if (localTrackToStop) {
      await clientToLeave.unpublish([localTrackToStop]);
      localTrackToStop.stop();
      localTrackToStop.close();
      setLocalTrack(null);
    }
    if (clientToLeave) await clientToLeave.leave();

    setJoined(false);
    setRemoteUsers([]);
    setMuted(true);

    if (user) await deleteDoc(doc(roomRef, user.uid));
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
            className={`flex flex-col items-center p-3 rounded-lg ${
              u.uid === user?.uid ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            <img
              src={u.photoURL || `https://i.pravatar.cc/150?u=${u.uid}`}
              alt={u.displayName}
              className="w-16 h-16 rounded-full"
            />
            <span className="mt-2 text-sm font-medium">{u.displayName}</span>
            <span className="text-xs text-gray-500">
              {u.uid === user?.uid ? "(You)" : "In Room"}
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
            onClick={() => leaveChannel()}
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
