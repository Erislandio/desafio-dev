import { fireEvent, render, screen } from "@testing-library/react";
import TransactionTable, { Transation } from "../result-table";

jest.mock("../byitem-table", () => ({
  __esModule: true,
  default: ({ transactions }: { transactions: Transation[] }) => (
    <div data-testid="byitem-table">
      <span>ByItem Table</span>
      <span data-testid="byitem-count">{transactions.length}</span>
    </div>
  ),
}));

jest.mock("../bystore-table", () => ({
  __esModule: true,
  default: ({ transactions }: { transactions: Transation[] }) => (
    <div data-testid="bystore-table">
      <span>ByStore Table</span>
      <span data-testid="bystore-count">{transactions.length}</span>
    </div>
  ),
}));

jest.mock("../../ui/switch", () => ({
  Switch: ({ checked, onCheckedChange, id, className, title }) => (
    <input
      type="checkbox"
      data-testid="view-switch"
      id={id}
      checked={checked}
      className={className}
      title={title}
      onChange={() => onCheckedChange(!checked)}
    />
  ),
}));

describe("TransactionTable Component", () => {
  const mockTransactions: Transation[] = [
    {
      date: "2023-01-01",
      hour: "10:00",
      value: 100,
      document: "123456789",
      cardNumber: "**** 1234",
      name: "Store A",
      owner: "John Doe",
      type: "",
    },
    {
      date: "2023-01-02",
      hour: "11:00",
      value: 200,
      document: "123456789",
      cardNumber: "**** 5678",
      name: "Store A",
      owner: "John Doe",
      type: "",
    },
    {
      date: "2023-01-03",
      hour: "12:00",
      value: 300,
      document: "987654321",
      cardNumber: "**** 9012",
      name: "Store B",
      owner: "Jane Smith",
      type: "",
    },
  ];

  test("renders nothing when transactions array is empty", () => {
    const { container } = render(<TransactionTable transactions={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders ByItemTable by default", () => {
    render(<TransactionTable transactions={mockTransactions} />);

    expect(screen.getByTestId("byitem-table")).toBeInTheDocument();
    expect(screen.queryByTestId("bystore-table")).not.toBeInTheDocument();

    expect(screen.getByTestId("byitem-count").textContent).toBe(
      mockTransactions.length.toString()
    );
  });

  test("toggles between ByItemTable and BystoreTable when switch is clicked", () => {
    render(<TransactionTable transactions={mockTransactions} />);

    expect(screen.getByTestId("byitem-table")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("view-switch"));

    expect(screen.queryByTestId("byitem-table")).not.toBeInTheDocument();
    expect(screen.getByTestId("bystore-table")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("view-switch"));

    expect(screen.getByTestId("byitem-table")).toBeInTheDocument();
    expect(screen.queryByTestId("bystore-table")).not.toBeInTheDocument();
  });

  test("generates store-grouped transactions correctly", () => {
    render(<TransactionTable transactions={mockTransactions} />);

    fireEvent.click(screen.getByTestId("view-switch"));

    expect(screen.getByTestId("bystore-count").textContent).toBe("2");
  });

  test("renders switch with correct label and description", () => {
    render(<TransactionTable transactions={mockTransactions} />);

    expect(screen.getByText("Visualizar por loja?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Você pode ativar essa função para ver todas as transações por loja."
      )
    ).toBeInTheDocument();
  });

  test("switch has correct attributes", () => {
    render(<TransactionTable transactions={mockTransactions} />);

    const switchElement = screen.getByTestId("view-switch");
    expect(switchElement).toHaveAttribute("id", "view-by-store");
    expect(switchElement).toHaveAttribute("title", "Visualizar por loja?");
    expect(switchElement).toHaveAttribute("class", "cursor-pointer");
    expect(switchElement).not.toBeChecked();
  });

  test("handles unknown transaction types gracefully", () => {
    const unknownTypeTransactions: Transation[] = [
      {
        type: "999",
        document: "123",
        value: 100,
        date: "",
        hour: "",
        cardNumber: "",
        name: "",
        owner: "",
      },
    ];

    render(<TransactionTable transactions={unknownTypeTransactions} />);

    fireEvent.click(screen.getByTestId("view-switch"));

    expect(screen.getByTestId("bystore-table")).toBeInTheDocument();
  });

  test("matches snapshot in item view", () => {
    const { container } = render(
      <TransactionTable transactions={mockTransactions} />
    );
    expect(container).toMatchSnapshot();
  });

  test("matches snapshot in store view", () => {
    const { container } = render(
      <TransactionTable transactions={mockTransactions} />
    );
    fireEvent.click(screen.getByTestId("view-switch"));
    expect(container).toMatchSnapshot();
  });
});
