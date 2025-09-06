"use client"; // Make this a client component

import { useState, useEffect } from "react";
import { auth, signOut } from "@/app/firebase";
import { Card } from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";
import {
  fetchRevenue,
  fetchLatestInvoices,
  fetchCardData,
  fetchUsers,
} from "@/app/lib/data";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  // Track user auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
      else setUser(null);
    });
    return () => unsubscribe();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully ✅");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const [revenue, setRevenue] = useState<any>(null);
  const [latestInvoices, setLatestInvoices] = useState<any>([]);
  const [cardData, setCardData] = useState<any>({});
  const [users, setUsers] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      setRevenue(await fetchRevenue());
      setLatestInvoices(await fetchLatestInvoices());
      setCardData(await fetchCardData());
      setUsers(await fetchUsers());
    }
    fetchData();
  }, []);

  return (
    <main className="p-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className={`${lusitana.className} text-xl md:text-2xl`}>
          Dashboard
        </h1>

        {user && (
          <div className="flex items-center gap-4">
            <span className="font-semibold">Hello, {user.displayName}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card
          title="Collected"
          value={cardData.totalPaidInvoices}
          type="collected"
        />
        <Card
          title="Pending"
          value={cardData.totalPendingInvoices}
          type="pending"
        />
        <Card
          title="Total Invoices"
          value={cardData.numberOfInvoices}
          type="invoices"
        />
        <Card
          title="Total Customers"
          value={cardData.numberOfCustomers}
          type="customers"
        />
      </div>

      {/* Revenue & Latest Invoices */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8 mb-6"></div>

      {/* Users List */}
      <h2 className={`${lusitana.className} mb-4 text-lg md:text-xl`}>Users</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user: any) => (
          <div
            key={user.id}
            className="p-4 border rounded shadow hover:shadow-lg transition"
          >
            <h3 className="font-bold">{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Password: {user.password}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
