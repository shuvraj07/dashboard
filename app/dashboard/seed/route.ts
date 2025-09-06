import { NextResponse } from "next/server";
import { db, storage } from "@/app/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString();
    const ownerName = formData.get("ownerName")?.toString();
    const file = formData.get("file") as Blob | null; // Blob on server

    if (!name || !ownerName) {
      return NextResponse.json(
        { error: "Arena name or owner is missing" },
        { status: 400 }
      );
    }

    let imageUrl = "";

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer(); // convert to ArrayBuffer
      const storageRef = ref(
        storage,
        `arenas/${Date.now()}-${file instanceof File ? file.name : "arena"}`
      );
      await uploadBytes(storageRef, new Uint8Array(arrayBuffer)); // upload as Uint8Array
      imageUrl = await getDownloadURL(storageRef);
    }

    const docRef = await addDoc(collection(db, "arenas"), {
      name,
      ownerName,
      imageUrl,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id, name, ownerName, imageUrl });
  } catch (err) {
    console.error("Error creating arena:", err);
    return NextResponse.json(
      { error: "Failed to create arena" },
      { status: 500 }
    );
  }
};
