"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle, X } from "lucide-react";

import Presentation from "../presentConsole";
import ProductsList, { Product } from "../product/productCard";
import SubscribeButton from "../subscribe/subscribe";
import ProfileMic from "../profile";
import Campers from "../campers/campers";

import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import app from "@/app/firebase";

type Arena = {
  id: string;
  name: string;
  ownerAvatar?: string;
  imageUrl?: string;
};

export default function SingleRoom() {
  const params = useParams<{ id: string }>();
  const arenaId = params?.id;

  const [arena, setArena] = useState<Arena | null>(null);
  const [loadingArena, setLoadingArena] = useState(true);
  const [bag, setBag] = useState<Product[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const db = getFirestore(app);

  const total = bag.reduce((sum, p) => sum + p.price, 0);

  const addToBag = (p: Product) => setBag((b) => [...b, p]);
  const removeFromBag = (index: number) =>
    setBag((b) => b.filter((_, i) => i !== index));

  // Fetch Arena info
  useEffect(() => {
    if (!arenaId) return;

    const fetchArenaData = async () => {
      setLoadingArena(true);
      try {
        const arenaRef = doc(db, "arenas", arenaId);
        const arenaSnap = await getDoc(arenaRef);

        if (arenaSnap.exists()) {
          setArena({ id: arenaSnap.id, ...arenaSnap.data() } as Arena);
        }
      } catch (err) {
        console.error("Failed to fetch arena data", err);
      } finally {
        setLoadingArena(false);
      }
    };

    fetchArenaData();
  }, [arenaId, db]);

  // Checkout / Save order
  const handleCheckout = async () => {
    if (bag.length === 0) return;

    try {
      const ordersRef = collection(db, "arenas", arenaId, "orders");
      await addDoc(ordersRef, {
        items: bag,
        total,
        createdAt: serverTimestamp(),
        status: "success",
      });

      setBag([]);
      setBagOpen(false);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving order:", err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 relative">
      <section className="flex-1 grid gap-4 p-4 w-full max-w-[1400px] mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {/* Arena Info */}
          <div className="bg-white rounded-2xl shadow p-4 space-y-3">
            {loadingArena ? (
              <div className="animate-pulse space-y-2">
                <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
                <div className="h-6 w-20 bg-gray-300 rounded"></div>
                <div className="h-52 sm:h-64 bg-gray-200 rounded-lg"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Image
                      src={arena?.ownerAvatar || "/cnn.png"}
                      alt="Arena"
                      width={40}
                      height={40}
                      className="rounded-full object-cover bg-gray-200"
                    />
                    <span className="font-medium text-sm sm:text-base">
                      {arena?.name}
                    </span>
                  </div>
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                </div>

                <div className="flex justify-end items-center gap-2">
                  <ProfileMic avatar={arena?.ownerAvatar || "/cnn.png"} />
                </div>

                <div className="h-52 sm:h-64 rounded-lg bg-gray-100 relative overflow-hidden">
                  <Presentation />
                  <span className="absolute inset-0 flex items-center justify-center text-gray-700 font-medium z-10 text-sm sm:text-base">
                    Presentation Console
                  </span>
                </div>
              </>
            )}
          </div>

          <SubscribeButton />

          {/* Campers (Agora Audio Room) */}
          {arenaId && <Campers channelName={arenaId} />}

          {/* Products */}
          <div className="bg-white rounded-2xl shadow p-4 space-y-3">
            <h3 className="text-lg font-medium">EkStore</h3>
            {loadingArena ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <ProductsList arenaId={arenaId} addToBag={addToBag} />
            )}
          </div>
        </div>

        <aside className="bg-white rounded-2xl shadow p-4 space-y-2 hidden lg:block">
          <h3 className="text-lg font-medium">Rules And Regulations</h3>
          <p className="text-sm text-gray-600">
            Reserve this area for chat or host bios.
          </p>
        </aside>
      </section>

      {/* Bag Modal */}
      {bagOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex justify-end">
          <div className="bg-white w-80 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Bag</h2>
              <button
                onClick={() => setBagOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {bag.length === 0 ? (
                <p className="text-gray-500">Bag is empty</p>
              ) : (
                bag.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b py-2"
                  >
                    <span>{item.title}</span>
                    <span>${item.price.toFixed(2)}</span>
                    <button
                      onClick={() => removeFromBag(i)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {bag.length > 0 && (
              <div className="mt-4">
                <p className="font-bold">Total: ${total.toFixed(2)}</p>
                <button
                  onClick={handleCheckout}
                  className="w-full mt-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  ✅ Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {orderSuccess && (
        <div className="fixed bottom-16 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          ✅ Order Placed Successfully!
        </div>
      )}

      {/* Bag Toggle */}
      <button
        onClick={() => setBagOpen(!bagOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
      >
        🛍️ {bag.length}
      </button>
    </main>
  );
}
