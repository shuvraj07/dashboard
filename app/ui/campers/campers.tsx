// components/Campers.tsx
import React from "react";

interface Camper {
  id: number;
  name: string;
  avatar?: string;
}

// Generate dummy campers
const dummyCampers: Camper[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `Shuvraj ${i + 1}`,
  avatar: `https://i.pravatar.cc/150?img=${i + 1}`, // random avatar
}));

const Campers = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Campers</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
        {dummyCampers.map((camper) => (
          <div
            key={`camper-${camper.id}`} // unique key with prefix
            className="flex flex-col items-center text-center gap-2"
          >
            <img
              src={camper.avatar}
              alt={camper.name}
              className="h-14 w-14 rounded-full object-cover border-2 border-gray-200"
            />
            <span className="text-sm font-medium truncate w-16">
              {camper.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campers;
