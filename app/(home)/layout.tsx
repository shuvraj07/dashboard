import SideBar from "../ui/dashboard/sidebar";
import ClubhouseLanding from "./page";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex bg-white">
        {/* Sidebar */}
        <SideBar />

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Optional: You can add a top search bar here if you want globally */}
          <div className="p-4 bg-white shadow-sm">
            {/* You can create a SearchBar component here */}
          </div>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
