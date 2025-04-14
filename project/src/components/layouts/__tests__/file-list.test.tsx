import { fireEvent, render, screen } from "@testing-library/react";
import FileList from "../files-list";

jest.mock("lucide-react", () => ({
  File: () => <div data-testid="file-icon">File Icon</div>,
  X: () => <div data-testid="x-icon">X Icon</div>,
}));

jest.mock("../../ui/button", () => ({
  Button: ({ children, onClick, disabled, className, variant, size }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-variant={variant}
      data-size={size}
      data-testid="remove-button"
    >
      {children}
    </button>
  ),
}));

describe("FileList Component", () => {
  const mockFiles = [
    new File(["content1"], "test1.txt", { type: "text/plain" }),
    new File(["content2"], "test2.txt", { type: "text/plain" }),
    new File(["content3"], "test3.txt", { type: "text/plain" }),
  ];

  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders nothing when files array is empty", () => {
    const { container } = render(
      <FileList files={[]} onRemove={mockOnRemove} uploading={false} />
    );

    expect(container.firstChild).toBeNull();
  });

  test("renders correct number of files", () => {
    render(
      <FileList files={mockFiles} onRemove={mockOnRemove} uploading={false} />
    );

    expect(
      screen.getByText(`Arquivo selecionado (${mockFiles.length})`)
    ).toBeInTheDocument();

    mockFiles.forEach((file) => {
      expect(screen.getByText(file.name)).toBeInTheDocument();
    });

    expect(screen.getAllByTestId("remove-button")).toHaveLength(
      mockFiles.length
    );
  });

  test("displays file icons for each file", () => {
    render(
      <FileList files={mockFiles} onRemove={mockOnRemove} uploading={false} />
    );

    expect(screen.getAllByTestId("file-icon")).toHaveLength(mockFiles.length);
  });

  test("calls onRemove with correct index when remove button is clicked", () => {
    render(
      <FileList files={mockFiles} onRemove={mockOnRemove} uploading={false} />
    );

    const removeButtons = screen.getAllByTestId("remove-button");

    fireEvent.click(removeButtons[1]);

    expect(mockOnRemove).toHaveBeenCalledWith(1);
  });

  test("disables remove buttons when uploading is true", () => {
    render(
      <FileList files={mockFiles} onRemove={mockOnRemove} uploading={true} />
    );

    const removeButtons = screen.getAllByTestId("remove-button");

    removeButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  test("enables remove buttons when uploading is false", () => {
    render(
      <FileList files={mockFiles} onRemove={mockOnRemove} uploading={false} />
    );

    const removeButtons = screen.getAllByTestId("remove-button");

    removeButtons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });

  test("applies correct styles to remove button", () => {
    render(
      <FileList files={mockFiles} onRemove={mockOnRemove} uploading={false} />
    );

    const removeButton = screen.getAllByTestId("remove-button")[0];

    expect(removeButton).toHaveAttribute("data-variant", "ghost");
    expect(removeButton).toHaveAttribute("data-size", "icon");
    expect(removeButton).toHaveClass("h-6 w-6 cursor-pointer");
  });

  test("includes screen reader text for accessibility", () => {
    render(
      <FileList files={mockFiles} onRemove={mockOnRemove} uploading={false} />
    );

    expect(screen.getAllByText("Remover arquivo")).toHaveLength(
      mockFiles.length
    );
  });

  test("matches snapshot", () => {
    const { container } = render(
      <FileList files={mockFiles} onRemove={mockOnRemove} uploading={false} />
    );

    expect(container).toMatchSnapshot();
  });

  test("matches snapshot when uploading", () => {
    const { container } = render(
      <FileList files={mockFiles} onRemove={mockOnRemove} uploading={true} />
    );

    expect(container).toMatchSnapshot();
  });
});
