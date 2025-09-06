"use client";

import { useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ClockIcon,
  VideoCameraIcon,
  BookmarkIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import AcmeLogo from "@/app/ui/acme-logo";

export default function SideBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Home", icon: <HomeIcon className="w-5 h-5" />, href: "/" },

    {
      name: "Subscriptions",
      icon: <BookmarkIcon className="w-5 h-5" />,
      href: "/subscriptions",
    },
    {
      name: "Dashboard",
      icon: <ClockIcon className="w-5 h-5" />,
      href: "/dashboard",
    }, // Added dashboard link
  ];

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white shadow-md"
        onClick={() => setMobileOpen(true)}
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity md:hidden ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 min-h-screen bg-gradient-to-b from-blue-700 to-blue-900 text-white shadow-xl z-50 transform transition-transform md:relative md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          collapsed ? "w-20" : "w-64"
        } transition-all duration-300 flex flex-col overflow-y-auto`}
      >
        {/* Close button mobile */}
        <div className="flex justify-end md:hidden p-2">
          <button
            onClick={() => setMobileOpen(false)}
            className="text-white hover:text-blue-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Logo */}
        <Link
          className="mb-2 flex h-20 items-center justify-center bg-blue-800"
          href="/"
        >
          <div className="w-32 text-white md:w-30">
            <AcmeLogo />
          </div>
        </Link>

        {/* Collapse toggle desktop */}
        <div className="flex justify-end p-2 md:mb-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block p-2 rounded-full hover:bg-blue-600 text-white"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-2 p-4 grow">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                collapsed ? "justify-center" : "justify-start"
              } hover:bg-blue-600`}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}

          <hr className="my-3 border-blue-400/40" />
        </nav>
      </aside>
    </>
  );
}
