"use client";
// app/layout.tsx

import "./globals.css";
import SideBar from "./ui/dashboard/sidebar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Condition: show sidebar only on root ("/")

  // Show sidebar on "/" and all /room/[id] routes
  const showSidebar = pathname === "/" || pathname.startsWith("/room");

  return (
    <html lang="en">
      <body className="min-h-screen flex bg-white">
        {showSidebar && <SideBar />}

        <div className={`flex-1 flex flex-col ${showSidebar ? "" : "ml-0"}`}>
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
