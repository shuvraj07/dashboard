import db from "../../db.json"; // TypeScript may need "resolveJsonModule": true in tsconfig
import { formatCurrency } from "./utils";

// Fetch revenue
export async function fetchRevenue() {
  return db.revenue;
}

// Fetch latest invoices (just slice from JSON)
export async function fetchLatestInvoices() {
  const data = db.invoices
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
      customer: db.customers.find((c) => c.id === invoice.customer_id),
    }));

  return data;
}

// Fetch card data
export async function fetchCardData() {
  const invoices = db.invoices;
  const customers = db.customers;

  const numberOfInvoices = invoices.length;
  const numberOfCustomers = customers.length;

  const paid = invoices
    .filter((i) => i.status === "paid")
    .reduce((acc, i) => acc + i.amount, 0);

  const pending = invoices
    .filter((i) => i.status === "pending")
    .reduce((acc, i) => acc + i.amount, 0);

  return {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices: formatCurrency(paid),
    totalPendingInvoices: formatCurrency(pending),
  };
}

// Fetch all users (customers)
export async function fetchUsers() {
  return db.customers;
}
