// BystoreTable.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import BystoreTable from "../bystore-table";

describe("BystoreTable Component", () => {
  const mockTransactions = [
    {
      name: "Loja A",
      owner: "João Silva",
      document: "123.456.789-00",
      credits: 1000,
      debits: 500,
      value: 500,
      transactions: [
        {
          type: 1,
          value: 200,
          date: "2023-04-14",
          hour: "14:30",
          cardNumber: "**** **** **** 1234",
        },
        {
          type: 2,
          value: 300,
          date: "2023-04-14",
          hour: "15:45",
          cardNumber: "**** **** **** 5678",
        },
      ],
    },
    {
      name: "Loja B",
      owner: "Maria Souza",
      document: "987.654.321-00",
      credits: 2000,
      debits: 800,
      value: 1200,
      transactions: [
        {
          type: 3,
          value: 1200,
          date: "2023-04-13",
          hour: "10:15",
          cardNumber: "**** **** **** 9012",
        },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render component", () => {
    render(<BystoreTable transactions={mockTransactions as any} />);

    expect(
      screen.getByText("Lista de transações por loja")
    ).toBeInTheDocument();

    expect(screen.getByText("Nome da loja")).toBeInTheDocument();
    expect(screen.getByText("Dono")).toBeInTheDocument();
    expect(screen.getByText("CPF")).toBeInTheDocument();
    expect(screen.getByText("Entradas")).toBeInTheDocument();
    expect(screen.getByText("Saídas")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();

    expect(screen.getByText("Loja A")).toBeInTheDocument();
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("123.456.789-00")).toBeInTheDocument();

    expect(screen.getByText("Loja B")).toBeInTheDocument();
    expect(screen.getByText("Maria Souza")).toBeInTheDocument();
    expect(screen.getByText("987.654.321-00")).toBeInTheDocument();
  });

  test("shoudl shows each button inside each table row", () => {
    render(<BystoreTable transactions={mockTransactions as any} />);

    const detailButtons = screen.getAllByText("Detalhes");
    expect(detailButtons).toHaveLength(2);

    const eyeIcons = screen.getAllByTestId("eye-icon");
    expect(eyeIcons).toHaveLength(2);
  });

  test("should open modal when details button is clicked", () => {
    render(<BystoreTable transactions={mockTransactions as any} />);

    expect(screen.queryByText("Lista de transações")).not.toBeInTheDocument();

    const detailButtons = screen.getAllByText("Detalhes");
    fireEvent.click(detailButtons[0]);

    expect(screen.getByText("Lista de transações")).toBeInTheDocument();
    expect(screen.getAllByText("Loja A")[0]).toBeInTheDocument();
    expect(
      screen.getAllByText("João Silva - 123.456.789-00")[0]
    ).toBeInTheDocument();

    expect(screen.getAllByText("Operação")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Valor")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Data")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Cartão")[0]).toBeInTheDocument();

    expect(screen.getAllByText("Entradas")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Saídas")[0]).toBeInTheDocument();
    expect(screen.getAllByText("2023-04-14 14:30")[0]).toBeInTheDocument();
    expect(screen.getAllByText("2023-04-14 15:45")[0]).toBeInTheDocument();
    expect(screen.getAllByText("**** **** **** 1234")[0]).toBeInTheDocument();
    expect(screen.getAllByText("**** **** **** 5678")[0]).toBeInTheDocument();
  });

  test("should closes modal when close button are triggered", () => {
    render(<BystoreTable transactions={mockTransactions as any} />);

    const detailButtons = screen.getAllByText("Detalhes");
    fireEvent.click(detailButtons[0]);

    expect(screen.getByText("Lista de transações")).toBeInTheDocument();

    const closeButton = screen.getByText("Fechar");
    fireEvent.click(closeButton);

    expect(screen.queryByText("Lista de transações")).not.toBeInTheDocument();
  });

  test("exibe mensagem para tipo de operação desconhecido", () => {
    const transactionsWithUnknownType: any = [
      {
        ...mockTransactions[0],
        transactions: [
          {
            value: 200,
            date: "2023-04-14",
            hour: "14:30",
            cardNumber: "**** **** **** 1234",
          },
        ],
      },
    ];

    render(<BystoreTable transactions={transactionsWithUnknownType} />);

    const detailButton = screen.getByText("Detalhes");
    fireEvent.click(detailButton);

    expect(screen.getByText("Desconhecido")).toBeInTheDocument();
  });

  test("should renders transactions list", () => {
    render(<BystoreTable transactions={[]} />);

    expect(
      screen.getByText("Lista de transações por loja")
    ).toBeInTheDocument();
    expect(screen.queryByText("Detalhes")).not.toBeInTheDocument();
  });

  test("should render store info when data are not correct", () => {
    const transactionsWithoutDetails: any = [
      {
        ...mockTransactions[0],
        transactions: [],
      },
    ];

    render(<BystoreTable transactions={transactionsWithoutDetails} />);

    const detailButton = screen.getByText("Detalhes");
    fireEvent.click(detailButton);

    expect(screen.getByText("Lista de transações")).toBeInTheDocument();
    expect(screen.queryByText("Débito")).not.toBeInTheDocument();
    expect(screen.queryByText("Crédito")).not.toBeInTheDocument();
  });
});
