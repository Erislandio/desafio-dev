"use client";

import { Eye } from "lucide-react";
import { useState } from "react";
import { formatPrice, OPERATION_TYPES } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Transation } from "./result-table";

export default function BystoreTable({
  transactions,
}: {
  transactions: Transation[];
}) {
  const [selectedItem, setSelectedItem] = useState<Transation | undefined>();

  const handleOpenModal = (item: Transation) => {
    setSelectedItem(item);
  };

  return (
    <section>
      <Table>
        <TableCaption className="pb-4">
          Lista de transações por loja
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome da loja</TableHead>
            <TableHead>Dono</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Entradas</TableHead>
            <TableHead>Saídas</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={`${transaction.document}-${index}`}>
              <TableCell>{transaction.name}</TableCell>
              <TableCell>{transaction.owner}</TableCell>
              <TableCell>{transaction.document}</TableCell>
              <TableCell>{formatPrice(transaction.credits || 0)}</TableCell>
              <TableCell>{formatPrice(transaction.debits || 0)}</TableCell>
              <TableCell>{formatPrice(transaction.value)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenModal(transaction)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={!!selectedItem}
        onOpenChange={() => setSelectedItem(undefined)}
      >
        {selectedItem && (
          <DialogContent
            className="max-w-7xl"
            style={{
              maxWidth: "90%",
            }}
          >
            <DialogHeader>
              <DialogTitle>{selectedItem?.name}</DialogTitle>
              <DialogDescription>
                {selectedItem?.owner} - {selectedItem.document}
              </DialogDescription>
            </DialogHeader>
            <Table>
              <TableCaption className="pb-4">Lista de transações</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Operação</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Cartão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItem?.transactions?.map((transaction, index) => (
                  <TableRow
                    key={`${transaction.date}-${transaction.hour}-${index}`}
                  >
                    <TableCell className="font-medium">
                      {OPERATION_TYPES[transaction.type] || "Desconhecido"}
                    </TableCell>
                    <TableCell>{formatPrice(transaction.value)}</TableCell>
                    <TableCell>
                      {transaction.date} {transaction.hour}
                    </TableCell>
                    <TableCell>{transaction.cardNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DialogFooter>
              <Button onClick={() => setSelectedItem(undefined)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
