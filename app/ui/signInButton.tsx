"use client";

import { useState } from "react";
import { auth, googleProvider, signInWithPopup, signOut } from "../firebase";

export default function GoogleAuth() {
  const [user, setUser] = useState<any>(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User info:", user);
      setUser(user);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("Logged out");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}</p>
          <img
            src={user.photoURL || ""}
            alt="avatar"
            width={40}
            className="rounded-full"
          />
          <button
            onClick={handleLogout}
            className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
