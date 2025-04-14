import {
  fileToTransactions,
  formatDate,
  formatHour,
  parseRowToObj,
} from "./utils";

describe("formatDate function", () => {
  test("should format YYYYMMDD to DD/MM/YYYY", () => {
    expect(formatDate("20250414")).toBe("14/04/2025");
    expect(formatDate("19991231")).toBe("31/12/1999");
    expect(formatDate("20000101")).toBe("01/01/2000");
  });
});

describe("formatHour function", () => {
  test("should format HHMMSS to HH:MM:SS", () => {
    expect(formatHour("170304")).toBe("17:03:04");
    expect(formatHour("000000")).toBe("00:00:00");
    expect(formatHour("235959")).toBe("23:59:59");
  });
});

describe("parseRowToObj function", () => {
  test("should parse a valid row to object", () => {
    const row =
      "3201903010000014200096206760174753****3153153453JOÃO MACEDO   BAR DO JOÃO";
    const result = parseRowToObj(row);

    expect(result).toEqual({
      type: "3",
      date: "01/03/2019",
      value: 142,
      document: "09620676017",
      cardNumber: "4753****3153",
      hour: "15:34:53",
      owner: "JOÃO MACEDO",
      name: "BAR DO JOÃO",
      debits: 0,
      credits: 0,
      transactions: [],
    });
  });

  test("should return null for empty row", () => {
    expect(parseRowToObj("")).toBeNull();
  });

  test("should handle row with minimal data", () => {
    const row = "B";
    const result = parseRowToObj(row);

    expect(result).toEqual({
      type: "B",
      date: "//",
      value: NaN,
      document: "",
      cardNumber: "",
      hour: "::",
      owner: "",
      name: "",
      debits: 0,
      credits: 0,
      transactions: [],
    });
  });
});

describe("fileToTransactions function", () => {
  test("should parse multiple rows into transactions", () => {
    const fileContent =
      "A202504140001234500123456789012 3456 7890123456JOHN DOE       ACME STORE      \n" +
      "B202504150000987600987654321098 7654 3210987654JANE SMITH     LOCAL SHOP      ";

    const result = fileToTransactions(fileContent) as any[];

    expect(result).toHaveLength(2);
    expect(result[0].type).toBe("A");
    expect(result[0].date).toBe("14/04/2025");
    expect(result[0].value).toBe(12345.0);

    expect(result[1].type).toBe("B");
    expect(result[1].date).toBe("15/04/2025");
    expect(result[1].value).toBe(9876.0);
  });

  test("should filter out invalid rows", () => {
    const fileContent =
      "A202504140001234500123456789012 3456 7890123456JOHN DOE       ACME STORE      \n" +
      "\n" +
      "B202504150000987600987654321098 7654 3210987654JANE SMITH     LOCAL SHOP      ";

    const result = fileToTransactions(fileContent);

    expect(result).toHaveLength(2);
  });

  test("should return empty array for empty file", () => {
    expect(fileToTransactions("")).toEqual([]);
  });
});
