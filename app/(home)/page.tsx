"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Users } from "lucide-react";
import Image from "next/image";
import SearchBar from "../ui/search";
import YTSearchBar from "../ui/dashboard/searchBar";

type Arena = {
  id: number;
  name: string;
  url: string;
  owner: {
    id: string;
    email: string;
  };
};

export default function ClubhouseLanding() {
  const [rooms, setRooms] = useState<Arena[]>([]);

  useEffect(() => {
    async function fetchArenas() {
      try {
        const res = await fetch("http://localhost:5000/arenas");
        const data: Arena[] = await res.json();
        setRooms(data);
      } catch (err) {
        console.error("❌ Failed to fetch arenas", err);
      }
    }
    fetchArenas();
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 w-full overflow-x-hidden">
      <YTSearchBar />
      {/* Rooms grid */}
      <section id="rooms" className="bg-white py-6 sm:py-10 w-full">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 grid gap-6 grid-cols-1 md:grid-cols-3">
          {rooms.map((room) => (
            <Link key={room.id} href={`/room/${room.id}`} className="w-full">
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full rounded-2xl bg-white p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-lg cursor-pointer flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 truncate">
                    <Image
                      src="/youtube.jpg"
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
                        Owned by: shuvraj bhandari
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-blue-700" />
                </div>

                {/* Room cover */}
                <div className="w-full h-full  overflow-hidden mb-2">
                  <Image
                    src={room.url}
                    alt="Room cover "
                    width={1500}
                    height={800}
                    className="w-full h-64 object-cover"
                  />
                </div>

                {/* Campers info */}
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
      {/* Footer */}
      <footer className="h-14 flex items-center justify-center text-xs text-gray-500 bg-gray-100">
        © {new Date().getFullYear()} Ekcamp technologies.
      </footer>
    </main>
  );
}
