"use client";

import ProductCard from "./product";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface ProductsPageProps {
  addToBag: (product: Product) => void; // function passed from parent
}

export default function ProductsPage({ addToBag }: ProductsPageProps) {
  const products: Product[] = [
    {
      id: 1,
      title: "Wireless Headphones",
      description: "High quality sound with noise cancellation.",
      price: 99.99,
      imageUrl: "https://picsum.photos/seed/headphones/400/300",
    },
    {
      id: 2,
      title: "Smart Watch",
      description: "Track your fitness and notifications.",
      price: 149.99,
      imageUrl: "https://picsum.photos/seed/smartwatch/400/300",
    },
    {
      id: 3,
      title: "Gaming Mouse",
      description: "RGB backlit with ergonomic design.",
      price: 59.99,
      imageUrl: "https://picsum.photos/seed/mouse/400/300",
    },
  ];

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} addToBag={addToBag} />
      ))}
    </div>
  );
}
