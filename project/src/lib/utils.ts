import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const OPERATION_TYPES: Record<string, string> = {
  "1": "Débito",
  "2": "Boleto",
  "3": "Financiamento",
  "4": "Crédito",
  "5": "Recebimento Empréstimo",
  "6": "Vendas",
  "7": "Recebimento TED",
  "8": "Recebimento DOC",
  "9": "Aluguel",
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dataStr: string) {
  const year = dataStr.slice(0, 4);
  const month = dataStr.slice(4, 6);
  const day = dataStr.slice(6, 8);
  return `${day}/${month}/${year}`;
}

export function formatHour(hour: string) {
  const time = hour.slice(0, 2);
  const min = hour.slice(2, 4);
  const seg = hour.slice(4, 6);
  return `${time}:${min}:${seg}`;
}

export function parseRowToObj(row: string) {
  const type = row.slice(0, 1);

  if (!type) return null;

  return {
    type,
    date: formatDate(row.slice(1, 9)),
    value: parseInt(row.slice(9, 19)) / 100,
    document: row.slice(19, 30),
    cardNumber: row.slice(30, 42).trim(),
    hour: formatHour(row.slice(42, 48)),
    owner: row.slice(48, 62).trim(),
    name: row.slice(62, 81).trim(),
    debits: 0,
    credits: 0,
    transactions: [],
  };
}

export const fileToTransactions = (file: string) => {
  const rows = file.split("\n");

  const transactions = rows.map(parseRowToObj).filter(Boolean);

  return transactions;
};

export function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
