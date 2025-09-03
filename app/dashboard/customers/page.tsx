"use client";

import { useEffect, useState } from "react";
import CustomersTable from "@/app/ui/customers/table";
import { FormattedCustomersTable } from "@/app/lib/definitions"; // make sure this is imported

interface Customer {
  id: string;
  name: string;
  email: string;
  image_url: string;
}

interface Invoice {
  id: string;
  customer_id: string;
  amount: number;
  status: string;
}

export default function CustomerPage() {
  const [customers, setCustomers] = useState<FormattedCustomersTable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [custRes, invRes] = await Promise.all([
          fetch("http://localhost:5000/customers"),
          fetch("http://localhost:5000/invoices"),
        ]);

        const customersData: Customer[] = await custRes.json();
        const invoicesData: Invoice[] = await invRes.json();

        const formatted: FormattedCustomersTable[] = customersData.map(
          (customer) => {
            const customerInvoices = invoicesData.filter(
              (inv) => inv.customer_id === customer.id
            );

            const total_invoices = customerInvoices.length;
            const total_paid = customerInvoices
              .filter((inv) => inv.status === "paid")
              .reduce((sum, inv) => sum + inv.amount, 0);
            const total_pending = customerInvoices
              .filter((inv) => inv.status === "pending")
              .reduce((sum, inv) => sum + inv.amount, 0);

            return {
              id: customer.id,
              name: customer.name,
              email: customer.email,
              image_url: customer.image_url,
              total_invoices, // ✅ number
              total_paid, // ✅ number
              total_pending, // ✅ number
            };
          }
        );

        setCustomers(formatted);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <p className="mb-4 text-xl font-bold">Customers Page</p>
      <CustomersTable customers={customers} />
    </div>
  );
}
