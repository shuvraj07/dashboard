"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "@/app/firebase"; // your firebase config

// Product type
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

// Props for the product list
interface ProductsListProps {
  arenaId: string; // fetch products for this arena
  addToBag: (product: Product) => void; // function passed from parent
}

// Single product card
function ProductCard({
  product,
  addToBag,
}: {
  product: Product;
  addToBag: (p: Product) => void;
}) {
  return (
    <div className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white border hover:shadow-xl transition cursor-pointer flex flex-col">
      <Image
        src={product.imageUrl}
        alt={product.title}
        width={400}
        height={250}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-semibold">{product.title}</h2>
        <p className="text-gray-600 mt-1 text-sm flex-1">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <p className="font-bold text-blue-600">${product.price.toFixed(2)}</p>
          <button
            onClick={() => addToBag(product)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}

// Full products list component
export default function ProductsList({ arenaId, addToBag }: ProductsListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const db = getFirestore(app);

  useEffect(() => {
    if (!arenaId) return;

    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "arenas", arenaId, "products");
        const productsSnap = await getDocs(productsRef);
        const productsList: Product[] = productsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(productsList);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, [arenaId]);

  if (!products.length)
    return <p className="text-center mt-4">No products found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} addToBag={addToBag} />
      ))}
    </div>
  );
}
