/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { POST } from "../../../app/api/transactions/route";
import { prisma } from "../../../lib/prisma";

jest.mock("../../../lib/prisma", () => ({
  prisma: {
    transaction: {
      createMany: jest.fn(),
    },
  },
}));

describe("Transactions API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST with valid transactions returns success", async () => {
    (prisma.transaction.createMany as jest.Mock).mockResolvedValue({
      count: 2,
    });

    const mockTransactions = [
      {
        cardNumber: "6777****1313",
        date: "01/03/2019",
        document: "84515254073",
        hour: "17:27:12",
        name: "MERCADO DA AVENIDA",
        owner: "MARCOS PEREIRA",
        type: "3",
        value: 192,
      },
      {
        cardNumber: "5999****8282",
        date: "02/03/2019",
        document: "12345678901",
        hour: "14:15:00",
        name: "PADARIA BOA VISTA",
        owner: "JOANA SILVA",
        type: "2",
        value: 45.5,
      },
    ];

    const request = new NextRequest("http://localhost:3000/api/transactions", {
      method: "POST",
      body: JSON.stringify({ transactions: mockTransactions }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.processedCount).toBe(2);

    expect(prisma.transaction.createMany).toHaveBeenCalledTimes(1);
    expect(prisma.transaction.createMany).toHaveBeenCalledWith({
      data: mockTransactions,
      skipDuplicates: true,
    });
  });

  test("POST with invalid date format returns validation error", async () => {
    const invalidTransactions = [
      {
        cardNumber: "6777****1313",
        date: "2019-03-01",
        document: "84515254073",
        hour: "17:27:12",
        name: "MERCADO DA AVENIDA",
        owner: "MARCOS PEREIRA",
        type: "3",
        value: 192,
      },
    ];

    const request = new NextRequest("http://localhost:3000/api/transactions", {
      method: "POST",
      body: JSON.stringify({ transactions: invalidTransactions }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation failed");
    expect(data.details.transactions[0].date._errors).toContain(
      "Date must be in format DD/MM/YYYY"
    );

    expect(prisma.transaction.createMany).not.toHaveBeenCalled();
  });

  test("POST with invalid hour format returns validation error", async () => {
    const invalidTransactions = [
      {
        cardNumber: "6777****1313",
        date: "01/03/2019",
        document: "84515254073",
        hour: "17:27",
        name: "MERCADO DA AVENIDA",
        owner: "MARCOS PEREIRA",
        type: "3",
        value: 192,
      },
    ];

    const request = new NextRequest("http://localhost:3000/api/transactions", {
      method: "POST",
      body: JSON.stringify({ transactions: invalidTransactions }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation failed");
    expect(data.details.transactions[0].hour._errors).toContain(
      "Hour must be in format HH:MM:SS"
    );
  });

  test("POST with missing required fields returns validation error", async () => {
    const invalidTransactions = [
      {
        cardNumber: "6777****1313",
        date: "01/03/2019",
        document: "",
        hour: "17:27:12",
        name: "MERCADO DA AVENIDA",
        owner: "",
        type: "3",
        value: 192,
      },
    ];

    const request = new NextRequest("http://localhost:3000/api/transactions", {
      method: "POST",
      body: JSON.stringify({ transactions: invalidTransactions }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation failed");
    expect(data.details.transactions[0].document._errors).toContain(
      "Document is required"
    );
    expect(data.details.transactions[0].owner._errors).toContain(
      "Owner is required"
    );
  });

  test("POST with non-array transactions returns validation error", async () => {
    const request = new NextRequest("http://localhost:3000/api/transactions", {
      method: "POST",
      body: JSON.stringify({ transactions: "not an array" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation failed");
  });

  test("POST with empty transactions array is valid", async () => {
    (prisma.transaction.createMany as jest.Mock).mockResolvedValue({
      count: 0,
    });

    const request = new NextRequest("http://localhost:3000/api/transactions", {
      method: "POST",
      body: JSON.stringify({ transactions: [] }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.processedCount).toBe(0);

    expect(prisma.transaction.createMany).toHaveBeenCalledWith({
      data: [],
      skipDuplicates: true,
    });
  });

  test("POST handles database error", async () => {
    (prisma.transaction.createMany as jest.Mock).mockRejectedValue(
      new Error("Database connection failed")
    );

    const mockTransactions = [
      {
        cardNumber: "6777****1313",
        date: "01/03/2019",
        document: "84515254073",
        hour: "17:27:12",
        name: "MERCADO DA AVENIDA",
        owner: "MARCOS PEREIRA",
        type: "3",
        value: 192,
      },
    ];

    const request = new NextRequest("http://localhost:3000/api/transactions", {
      method: "POST",
      body: JSON.stringify({ transactions: mockTransactions }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal server error");
  });
});
