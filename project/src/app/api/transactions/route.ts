import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "../../../lib/prisma";

export interface Transaction {
  id: string;
  type: string;
  date: string;
  hour: string;
  value: number;
  document: string;
  cardNumber: string;
  name: string;
  owner: string;
}

const TransactionSchema = z.object({
  cardNumber: z.string().optional(),
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: "Date must be in format DD/MM/YYYY",
  }),
  document: z.string().min(1, "Document is required"),
  hour: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, {
    message: "Hour must be in format HH:MM:SS",
  }),
  name: z.string().min(1, "Name is required"),
  owner: z.string().min(1, "Owner is required"),
  type: z.string().min(1, "Type is required"),
  value: z.number(),
});

export const TransactionsRequestSchema = z.object({
  transactions: z.array(TransactionSchema),
});

export type ValidatedTransaction = z.infer<typeof TransactionSchema>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = TransactionsRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const validatedTransactions: ValidatedTransaction[] =
      validationResult.data.transactions;

    await prisma.transaction.createMany({
      data: validatedTransactions.map((transaction) => ({
        cardNumber: transaction.cardNumber,
        date: transaction.date,
        document: transaction.document,
        hour: transaction.hour,
        name: transaction.name,
        owner: transaction.owner,
        type: transaction.type,
        value: transaction.value,
      })) as any,
      skipDuplicates: true,
    });

    return NextResponse.json(
      {
        success: true,
        processedCount: validatedTransactions.length,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.format() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
