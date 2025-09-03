"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle, ShoppingBag, X } from "lucide-react";
import Presentation from "../presentConsole";
import ProductsPage from "../product/productCard";
import SubscribeButton from "../subscribe/subscribe";

type Product = {
  id: number;
  arenaId: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
};

type Arena = {
  id: number;
  name: string;
  url: string;
};

type Camper = {
  id: number;
  name: string;
  avatar?: string;
};

const dummyCampers: Camper[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `Camper ${i + 1}`,
  avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
}));

export default function SingleRoom() {
  const params = useParams();
  const numericId = parseInt(params.id as string, 10);

  const [rooms, setRooms] = useState<Arena[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [bag, setBag] = useState<Product[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const total = bag.reduce((sum, p) => sum + p.price, 0);
  const addToBag = (p: Product) => setBag((b) => [...b, p]);

  useEffect(() => {
    if (!numericId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/arenas`);
        const data: Arena[] = await res.json();
        setRooms(data);

        const productRes = await fetch(`http://localhost:5000/products`);
        const productsData: Product[] = await productRes.json();
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to fetch arena or products", err);
      }
    };

    fetchData();
  }, [numericId]);

  const handlePay = () => {
    setBag([]);
    setBagOpen(false);
    setPaymentSuccess(true);
    setTimeout(() => setPaymentSuccess(false), 3000);
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 relative">
      {/* Main Grid */}
      <section className="flex-1 grid gap-4 p-4 w-full max-w-[1400px] mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Center Column */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {/* Arena Info Card */}
          <div className="bg-white rounded-2xl shadow p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Image
                  src="/avatar-placeholder.png"
                  alt="Arena"
                  width={40}
                  height={40}
                  className="rounded-full object-cover bg-gray-200"
                />
                <span className="font-medium text-sm sm:text-base">
                  {rooms.find((room) => room.id === numericId)?.name ||
                    "Loading Arena..."}
                </span>
              </div>
              <CheckCircle className="h-5 w-5 text-blue-500" />
            </div>

            <div className="h-52 sm:h-64 rounded-lg bg-gray-100 relative overflow-hidden">
              <Presentation />
              <span className="absolute inset-0 flex items-center justify-center text-gray-700 font-medium z-10 text-sm sm:text-base">
                Presentation Console
              </span>
            </div>
          </div>

          <SubscribeButton />

          {/* Campers */}
          <div className="bg-white rounded-2xl shadow p-4 space-y-3">
            <h3 className="text-lg font-medium">Campers</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {dummyCampers.map((camper) => (
                <div
                  key={`camper-${camper.id}`}
                  className="flex flex-col items-center min-w-[72px]"
                >
                  <Image
                    src={camper.avatar || "/avatar-placeholder.png"}
                    alt={camper.name}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-gray-200 object-cover"
                  />
                  <span className="text-xs text-center truncate w-16">
                    {camper.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-2xl shadow p-4 space-y-3">
            <h3 className="text-lg font-medium">EkStore</h3>
            <ProductsPage addToBag={addToBag} />
          </div>
        </div>

        {/* Optional Right Sidebar */}
        <aside className="bg-white rounded-2xl shadow p-4 space-y-2 hidden lg:block">
          <h3 className="text-lg font-medium">Rules And Regulations</h3>
          <p className="text-sm text-gray-600">
            Reserve this area for chat or host bios.
          </p>
        </aside>
      </section>

      {/* Footer Controls */}
      <footer className="h-16 sm:h-20 bg-white shadow-inner flex flex-wrap items-center justify-center gap-2 sm:gap-4 p-4 sticky bottom-0">
        <button
          onClick={() => setMuted(!muted)}
          className="px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300 text-xs sm:text-sm"
        >
          {muted ? "Unmute" : "Mute"}
        </button>

        <button
          onClick={() => setHandRaised(!handRaised)}
          className={`px-3 py-1 rounded-xl text-xs sm:text-sm ${
            handRaised
              ? "bg-yellow-400 hover:bg-yellow-500"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {handRaised ? "Lower Hand" : "Raise Hand"}
        </button>

        <button
          onClick={() => alert("Leaving the room…")}
          className="px-3 py-1 rounded-xl bg-red-500 text-white hover:bg-red-600 text-xs sm:text-sm"
        >
          Leave
        </button>

        {/* Bag Icon */}
        <div className="relative">
          <button
            onClick={() => setBagOpen(true)}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <ShoppingBag className="h-5 w-5" />
            {bag.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 text-[11px] rounded-full bg-red-500 text-white flex items-center justify-center">
                {bag.length}
              </span>
            )}
          </button>
        </div>
      </footer>

      {/* Bag Sidebar Modal */}
      {bagOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setBagOpen(false)}
          ></div>

          <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 flex flex-col p-4 transition-transform">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Your Bag</h3>
              <button
                onClick={() => setBagOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {bag.length === 0 ? (
              <p className="text-sm text-gray-500">Bag is empty</p>
            ) : (
              <div className="flex-1 overflow-auto space-y-2">
                {bag.map((p, idx) => (
                  <div
                    key={`${p.id}-${idx}`}
                    className="flex justify-between text-sm border-b pb-1"
                  >
                    <span>{p.title}</span>
                    <span>${p.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {bag.length > 0 && (
              <button
                onClick={handlePay}
                className="mt-4 w-full bg-green-500 text-white rounded px-2 py-2 hover:bg-green-600"
              >
                Checkout (${total.toFixed(2)})
              </button>
            )}
          </div>
        </>
      )}

      {/* Payment Success Toast */}
      {paymentSuccess && (
        <div className="fixed bottom-16 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Payment Successful!
        </div>
      )}
    </main>
  );
}
