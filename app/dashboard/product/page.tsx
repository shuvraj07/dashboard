"use client";

import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import app from "@/app/firebase";

const IMGBB_API_KEY = "cc4d9aa0847da721090b05236ed4863e";

export default function CreateProductPage() {
  const [user, setUser] = useState<any>(null);
  const [arenas, setArenas] = useState<any[]>([]); // list of arenas owned by user
  const [selectedArena, setSelectedArena] = useState<string>("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const db = getFirestore(app);

  // Get current user and arenas they own
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const arenasQuery = query(
          collection(db, "arenas"),
          where("ownerId", "==", u.uid)
        );
        const snapshot = await getDocs(arenasQuery);
        const arenaList: any[] = [];
        snapshot.forEach((doc) => {
          arenaList.push({ id: doc.id, ...doc.data() });
        });
        setArenas(arenaList);
      }
    });

    return () => unsubscribe();
  }, []);

  // Convert file to base64 for imgbb
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return alert("Please login first");
    if (!selectedArena) return alert("Select an arena to add product");

    try {
      setLoading(true);

      let imageUrl = "";
      if (imageFile) {
        const base64 = await fileToBase64(imageFile);
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ image: base64 }),
          }
        );
        const data = await res.json();
        if (!res.ok || !data.data?.url) throw new Error("Image upload failed");
        imageUrl = data.data.url;
      }

      // Save product in arena subcollection
      const productsRef = collection(db, "arenas", selectedArena, "products");
      await addDoc(productsRef, {
        name,
        description,
        price,
        imageUrl,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });

      alert("Product created ✅");
      setName("");
      setDescription("");
      setPrice(null);
      setImageFile(null);
      setSelectedArena("");
    } catch (err) {
      console.error(err);
      alert("Failed to create product ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Please login to create products</p>;

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Create Product</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow space-y-4"
      >
        {/* Arena Selection */}
        <select
          value={selectedArena}
          onChange={(e) => setSelectedArena(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select Arena</option>
          {arenas.map((arena) => (
            <option key={arena.id} value={arena.id}>
              {arena.name}
            </option>
          ))}
        </select>

        {/* Product Name */}
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Price */}
        <input
          type="number"
          placeholder="Price"
          value={price ?? ""}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Product Image */}
        <div>
          <label className="font-semibold">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full"
          />
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="mt-2 w-full h-40 object-cover rounded-md"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
