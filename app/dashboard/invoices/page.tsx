"use client";

import React from "react";

interface InvoiceProps {
  invoiceNumber: string;
  date: string;
  customer?: {
    name: string;
    email: string;
    address: string;
  };
  items?: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

const Invoice: React.FC<InvoiceProps> = ({
  invoiceNumber,
  date,
  customer = { name: "Unknown", email: "N/A", address: "N/A" }, // ✅ default
  items = [],
}) => {
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 border">
      <h1 className="text-2xl font-bold mb-2">Invoice</h1>
      <p className="text-gray-600">Invoice #: {invoiceNumber}</p>
      <p className="text-gray-600">Date: {date}</p>

      {/* Customer Info */}
      <div className="mt-6">
        <h2 className="font-semibold text-lg">Bill To:</h2>
        <p>{customer.name}</p>
        <p>{customer.email}</p>
        <p>{customer.address}</p>
      </div>

      {/* Items */}
      <table className="w-full mt-6 border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2 text-left">Item</th>
            <th className="border px-3 py-2 text-center">Qty</th>
            <th className="border px-3 py-2 text-right">Price</th>
            <th className="border px-3 py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, i) => (
              <tr key={i}>
                <td className="border px-3 py-2">{item.name}</td>
                <td className="border px-3 py-2 text-center">
                  {item.quantity}
                </td>
                <td className="border px-3 py-2 text-right">
                  ${item.price.toFixed(2)}
                </td>
                <td className="border px-3 py-2 text-right">
                  ${(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total */}
      <div className="flex justify-end mt-4">
        <div className="text-right">
          <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
