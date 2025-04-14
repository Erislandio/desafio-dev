import { formatPrice, OPERATION_TYPES } from "../../lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { type Transation } from "./result-table";

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
