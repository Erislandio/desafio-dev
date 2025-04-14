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
import { Transation } from "./file-uploader";

export default function TransactionTable({
  transactions,
}: {
  transactions: Transation[];
}) {
  if (!transactions.length) return null;

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption className="pb-4">Lista de transações</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Nome da loja</TableHead>
            <TableHead>Dono</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Cartão</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.date}>
              <TableCell className="font-medium">{transaction.type}</TableCell>
              <TableCell>{transaction.name}</TableCell>
              <TableCell>{transaction.owner}</TableCell>
              <TableCell>{formatPrice(transaction.value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
