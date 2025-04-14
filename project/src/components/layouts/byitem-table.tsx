import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { Transation } from "./result-table";

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

export default function ByItemTable({
  transactions,
}: {
  transactions: Transation[];
}) {
  return (
    <Table>
      <TableCaption className="pb-4">Lista de transações</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Operação</TableHead>
          <TableHead>Nome da loja</TableHead>
          <TableHead>Dono</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead>Cartão</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction, index) => (
          <TableRow key={`${transaction.date}-${transaction.hour}-${index}`}>
            <TableCell className="font-medium">
              {OPERATION_TYPES[transaction.type] || "Desconhecido"}
            </TableCell>
            <TableCell>{transaction.name}</TableCell>
            <TableCell>{transaction.owner}</TableCell>
            <TableCell>{formatPrice(transaction.value)}</TableCell>
            <TableCell>
              {transaction.date} {transaction.hour}
            </TableCell>
            <TableCell>{transaction.document}</TableCell>
            <TableCell>{transaction.cardNumber}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
