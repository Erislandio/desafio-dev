import { render, screen } from "@testing-library/react";
import ByItemTable from "../byitem-table";

describe("ByItemTable Component", () => {
  const mockTransactions = [
    {
      type: "1",
      name: "Loja A",
      owner: "Dono A",
      value: 1000,
      date: "2023-01-01",
      hour: "12:00",
      document: "12345678901",
      cardNumber: "1234",
    },
    {
      type: "2",
      name: "Loja B",
      owner: "Dono B",
      value: 2000,
      date: "2023-01-02",
      hour: "13:00",
      document: "98765432100",
      cardNumber: "5678",
    },
  ];

  it("should render the table with transactions", () => {
    render(<ByItemTable transactions={mockTransactions} />);

    expect(screen.getByText("Operação")).toBeInTheDocument();
    expect(screen.getByText("Nome da loja")).toBeInTheDocument();
    expect(screen.getByText("Dono")).toBeInTheDocument();
    expect(screen.getByText("Valor")).toBeInTheDocument();
    expect(screen.getByText("Data")).toBeInTheDocument();
    expect(screen.getByText("CPF")).toBeInTheDocument();
    expect(screen.getByText("Cartão")).toBeInTheDocument();

    // Check table rows
    expect(screen.getByText("Débito")).toBeInTheDocument();
    expect(screen.getByText("Loja A")).toBeInTheDocument();
    expect(screen.getByText("Dono A")).toBeInTheDocument();
    expect(screen.getByText("2023-01-01 12:00")).toBeInTheDocument();
    expect(screen.getByText("12345678901")).toBeInTheDocument();
    expect(screen.getByText("1234")).toBeInTheDocument();

    expect(screen.getByText("Boleto")).toBeInTheDocument();
    expect(screen.getByText("Loja B")).toBeInTheDocument();
    expect(screen.getByText("Dono B")).toBeInTheDocument();
    expect(screen.getByText("2023-01-02 13:00")).toBeInTheDocument();
    expect(screen.getByText("98765432100")).toBeInTheDocument();
    expect(screen.getByText("5678")).toBeInTheDocument();
  });

  it("should render the table with transactions", () => {
    render(
      <ByItemTable
        transactions={[
          {
            type: "",
            name: "Loja A",
            owner: "Dono A",
            value: 1000,
            date: "2023-01-01",
            hour: "12:00",
            document: "12345678901",
            cardNumber: "1234",
          },
        ]}
      />
    );

    expect(screen.getByText("Desconhecido")).toBeInTheDocument();
  });
});
