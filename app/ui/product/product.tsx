"use client";

import Image from "next/image";

export interface Product {
  id: string; // Firestore document ID
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
  addToBag: (product: Product) => void; // function passed from parent
}

export default function ProductCard({ product, addToBag }: ProductCardProps) {
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
          <p className="font-bold text-blue-600">
            ${Number(product.price).toFixed(2)}
          </p>
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
