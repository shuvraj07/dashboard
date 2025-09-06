"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Users } from "lucide-react";
import YTSearchBar from "./ui/dashboard/searchBar";
import {
  db,
  collection,
  getDocs,
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
} from "./firebase";

type Arena = {
  id: string;
  name: string;
  imageUrl: string;
  ownerAvatar: string;
  ownerName: string;
};

export default function ClubhouseLanding() {
  const [rooms, setRooms] = useState<Arena[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingArenas, setLoadingArenas] = useState(true);
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // do whatever you need with the query
  };
  // Persist user state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch arenas
  useEffect(() => {
    async function fetchArenas() {
      setLoadingArenas(true);
      try {
        const arenasCol = collection(db, "arenas");
        const arenaSnapshot = await getDocs(arenasCol);
        const arenaList = arenaSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Arena[];
        setRooms(arenaList);
      } catch (err) {
        console.error("❌ Failed to fetch arenas", err);
      } finally {
        setLoadingArenas(false);
      }
    }
    fetchArenas();
  }, []);

  // Google login
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // Google logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 w-full overflow-x-hidden">
      {/* Top login/logout */}
      <div className="flex justify-end items-center p-4 bg-white shadow-sm">
        {loadingUser ? (
          <p className="text-gray-500">Checking session...</p>
        ) : user ? (
          <div className="flex items-center gap-2">
            <span>Hello, {user.displayName || user.email}</span>
            <Image
              src={user.photoURL || "/cnn.png"}
              width={36}
              height={36}
              className="rounded-full"
              alt="avatar"
            />
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Login with Google
          </button>
        )}
      </div>

      <YTSearchBar onSearch={handleSearch} />

      {/* Arenas */}
      <section id="rooms" className="bg-white py-6 sm:py-10 w-full">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 grid gap-6 grid-cols-1 md:grid-cols-3">
          {loadingArenas
            ? Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-full h-80 rounded-2xl bg-gray-200 animate-pulse"
                ></div>
              ))
            : rooms.map((room) => (
                <Link key={room.id} href={`/room/${room.id}`} prefetch>
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-full rounded-2xl bg-white p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-lg cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 truncate">
                        <Image
                          src={room.ownerAvatar || "/cnn.png"}
                          width={36}
                          height={36}
                          alt="Avatar"
                          className="rounded-full object-cover border"
                        />
                        <div className="truncate">
                          <h4 className="text-base font-semibold truncate">
                            {room.name}
                          </h4>
                          <p className="text-xs text-black truncate">
                            Owned by: {room.ownerName || "Unknown"}
                          </p>
                        </div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-blue-700" />
                    </div>

                    <div className="w-full h-full overflow-hidden mb-2">
                      <Image
                        src={room.imageUrl || "/cnn.png"}
                        alt={room.name}
                        width={1500}
                        height={800}
                        className="w-full h-64 object-cover rounded-xl"
                      />
                    </div>

                    <div className="flex justify-end">
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-500 text-white">
                        <Users className="w-3.5 h-3.5" />
                        100 campers
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))}
        </div>
      </section>

      <footer className="h-14 flex items-center justify-center text-xs text-gray-500 bg-gray-100">
        © {new Date().getFullYear()} Ekcamp technologies.
      </footer>
    </main>
  );
}
