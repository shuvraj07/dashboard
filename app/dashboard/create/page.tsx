"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, googleProvider } from "@/app/firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import app from "@/app/firebase";

const IMGBB_API_KEY = "cc4d9aa0847da721090b05236ed4863e";

export default function CreateArenaPage() {
  const [arenaName, setArenaName] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [user, setUser] = useState<any>(null);
  const [hasArena, setHasArena] = useState(false);

  const router = useRouter();
  const db = getFirestore(app);

  // Persist user login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        // Check if user already has an arena
        const q = query(
          collection(db, "arenas"),
          where("ownerEmail", "==", u.email)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setHasArena(true);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arenaName || !user) {
      alert("Please login first!");
      return;
    }

    // Prevent duplicate arenas per user
    const q = query(
      collection(db, "arenas"),
      where("ownerEmail", "==", user.email)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      alert(
        "You already created an arena. Only one arena is allowed per user."
      );
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";
      let avatarUrl = "";

      // Upload arena cover image
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
        if (!res.ok || !data.data?.url) throw new Error("Arena upload failed");
        imageUrl = data.data.url;
      }

      // Upload owner avatar
      if (avatarFile) {
        const base64Avatar = await fileToBase64(avatarFile);
        const resAvatar = await fetch(
          `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ image: base64Avatar }),
          }
        );
        const dataAvatar = await resAvatar.json();
        if (!resAvatar.ok || !dataAvatar.data?.url)
          throw new Error("Avatar upload failed");
        avatarUrl = dataAvatar.data.url;
      }

      await addDoc(collection(db, "arenas"), {
        name: arenaName,
        ownerName: user.displayName,
        ownerEmail: user.email,
        ownerId: user.uid,
        ownerAvatar: avatarUrl || "/cnn.png",
        imageUrl,
        createdAt: serverTimestamp(),
      });

      alert("Arena created successfully ✅");
      router.push("/");
    } catch (err) {
      console.error("Failed to create arena:", err);
      alert("Failed to create arena ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-6">
      {!user && (
        <button
          onClick={handleLogin}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Login with Google
        </button>
      )}

      {user && (
        <>
          <h1 className="text-2xl font-bold mb-6">Create Arena</h1>

          {hasArena ? (
            <div className="p-6 bg-yellow-100 rounded-lg text-center">
              <p className="text-lg font-semibold text-yellow-700">
                You already own an arena! 🎉
              </p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              >
                Go Home
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md bg-white rounded-xl p-6 shadow-md space-y-4"
            >
              <input
                type="text"
                placeholder="Arena Name"
                value={arenaName}
                onChange={(e) => setArenaName(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                required
              />

              {/* Arena Cover Image */}
              <div className="flex flex-col">
                <label className="font-semibold mb-1">
                  Arena Cover (Thumbnail)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full"
                />
                {imageFile && (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Arena Cover Preview"
                    className="mt-2 w-full h-40 object-cover rounded-md"
                  />
                )}
              </div>

              {/* Owner Avatar */}
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Owner Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="w-full"
                />
                {avatarFile && (
                  <img
                    src={URL.createObjectURL(avatarFile)}
                    alt="Owner Avatar Preview"
                    className="mt-2 w-20 h-20 object-cover rounded-full"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {loading ? "Creating..." : "Create Arena"}
              </button>
            </form>
          )}

          <div className="mt-4 flex items-center gap-2">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="Owner Avatar"
                className="w-10 h-10 rounded-full"
              />
            )}
            <span>Hello, {user.displayName}</span>
          </div>
        </>
      )}
    </div>
  );
}
