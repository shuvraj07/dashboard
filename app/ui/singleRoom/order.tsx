"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/firebase"; // 🔥 adjust path
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

interface Order {
  id: string;
  items: { title: string; price: number }[];
  total: number;
  createdAt?: any;
}

interface OrdersProps {
  arenaId: string;
}

export default function Orders({ arenaId }: OrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "arenas", arenaId, "orders"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: Order[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      setOrders(list);
    });

    return () => unsub();
  }, [arenaId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border rounded-lg p-4 bg-white shadow"
            >
              <p className="font-bold mb-2">Order #{order.id}</p>
              <ul className="text-sm text-gray-600">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.title} - ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-semibold">
                Total: ${order.total.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
