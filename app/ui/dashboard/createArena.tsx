"use client";

import Link from "next/link";
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "@/app/firebase";

const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: DocumentDuplicateIcon,
  },
  { name: "Customers", href: "/dashboard/customers", icon: UserGroupIcon },
  // { name: "Create Arena", href: "/dashboard/areana", icon: UserGroupIcon }, ❌ remove old navigation
  { name: "Arena", href: "/dashboard/createArena", icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [arenaName, setArenaName] = useState("");
  const [loading, setLoading] = useState(false);

  const db = getFirestore(app);

  const handleCreateArena = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "arenas"), {
        name: arenaName,
        createdAt: new Date(),
      });
      setArenaName("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding arena:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;

        // For "Create Arena" open modal instead of navigation
        if (link.name === "Create Arena") {
          return (
            <button
              key={link.name}
              onClick={() => setIsOpen(true)}
              className={clsx(
                "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
              )}
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </button>
          );
        }

        // Default navigation link
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              { "bg-sky-100 text-blue-600": pathname === link.href }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6">
            <Dialog.Title className="text-lg font-semibold">
              Create Arena
            </Dialog.Title>
            <form onSubmit={handleCreateArena} className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="Arena Name"
                value={arenaName}
                onChange={(e) => setArenaName(e.target.value)}
                required
                className="w-full rounded-md border px-3 py-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md bg-gray-200 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
