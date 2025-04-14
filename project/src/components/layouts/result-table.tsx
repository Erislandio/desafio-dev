"use client";

import { useState } from "react";
import { Switch } from "../ui/switch";
import ByItemTable from "./byitem-table";
import BystoreTable from "./bystore-table";

export interface Transation {
  type: string;
  date: string;
  hour: string;
  value: number;
  document: string;
  cardNumber: string;
  name: string;
  owner: string;
  debits?: number;
  credits?: number;
  transactions?: Transation[];
}

const OPERATION_TYPES_CATEGORY: Record<string, "credit" | "debit"> = {
  "1": "debit",
  "2": "credit",
  "3": "credit",
  "4": "debit",
  "5": "debit",
  "6": "debit",
  "7": "debit",
  "8": "debit",
  "9": "credit",
};

const isDebit = (type: string): boolean =>
  OPERATION_TYPES_CATEGORY[type] === "debit";
const isCredit = (type: string): boolean =>
  OPERATION_TYPES_CATEGORY[type] === "credit";

const generateByStore = (transactions: Transation[]): Transation[] => {
  const storeMap: Record<string, Transation> = {};

  transactions.forEach((transaction) => {
    const { document, type, value } = transaction;

    if (storeMap[document]) {
      const store = storeMap[document];

      store.value += value;

      if (isDebit(type)) {
        store.debits = (store.debits || 0) + value;
      } else if (isCredit(type)) {
        store.credits = (store.credits || 0) + value;
      }

      if (!store.transactions) {
        store.transactions = [];
      }
      store.transactions.push(transaction);
    } else {
      storeMap[document] = {
        ...transaction,
        debits: isDebit(type) ? value : 0,
        credits: isCredit(type) ? value : 0,
        transactions: [transaction],
      };
    }
  });

  return Object.values(storeMap);
};

export default function TransactionTable({
  transactions,
}: {
  transactions: Transation[];
}) {
  const [byStore, setByStore] = useState(false);

  if (!transactions.length) return null;

  const displayTransactions = byStore
    ? generateByStore(transactions)
    : transactions;

  return (
    <div className="rounded-md border">
      <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-4 m-4">
        <div className="space-y-0.5">
          <label
            className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
            htmlFor="view-by-store"
          >
            Visualizar por loja?
          </label>
          <p className="text-sm text-muted-foreground">
            Você pode ativar essa função para ver todas as transações por loja.
          </p>
          <Switch
            id="view-by-store"
            checked={byStore}
            className="cursor-pointer"
            title="Visualizar por loja?"
            onCheckedChange={() => setByStore(!byStore)}
          />
        </div>
      </div>

      {byStore ? (
        <BystoreTable transactions={displayTransactions} />
      ) : (
        <ByItemTable transactions={displayTransactions} />
      )}
    </div>
  );
}
