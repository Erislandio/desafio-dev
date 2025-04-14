import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { fileToTransactions } from "../../../lib/utils";
import { FileUploader } from "../file-uploader";

jest.mock("../../../lib/utils", () => ({
  cn: jest.fn((...args) => args.filter(Boolean).join(" ")),
  fileToTransactions: jest.fn(),
}));

jest.mock("../file-drag-drop", () => ({
  __esModule: true,
  default: ({
    fileInputRef,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    isDragging,
    uploading,
    handleFileChange,
    disbabled,
  }) => (
    <div data-testid="drag-drop-component">
      <button
        data-testid="simulate-drop"
        onClick={(e) =>
          handleDrop(e as unknown as React.DragEvent<HTMLDivElement>)
        }
      >
        Simulate Drop
      </button>
      <button
        data-testid="simulate-drag-over"
        onClick={(e) =>
          handleDragOver(e as unknown as React.DragEvent<HTMLDivElement>)
        }
      >
        Simulate Drag Over
      </button>
      <button
        data-testid="simulate-drag-leave"
        onClick={(e) =>
          handleDragLeave(e as unknown as React.DragEvent<HTMLDivElement>)
        }
      >
        Simulate Drag Leave
      </button>
      <input
        type="file"
        data-testid="file-input"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div>isDragging: {isDragging.toString()}</div>
      <div>uploading: {uploading.toString()}</div>
      <div>disabled: {disbabled.toString()}</div>
    </div>
  ),
}));

jest.mock("../files-list", () => ({
  __esModule: true,
  default: ({ files, onRemove, uploading }) => (
    <div data-testid="files-list-component">
      {files.map((file, index) => (
        <div key={index} data-testid={`file-${index}`}>
          {file.name}
          <button
            data-testid={`remove-file-${index}`}
            onClick={() => onRemove(index)}
            disabled={uploading}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  ),
}));

jest.mock("../result-table", () => ({
  __esModule: true,
  default: ({ transactions }) => (
    <div data-testid="transaction-table-component">
      {transactions.map((transaction, index) => (
        <div key={index} data-testid={`transaction-${index}`}>
          {transaction.name}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("../upload-progress", () => ({
  __esModule: true,
  default: ({ progress, uploading }) => (
    <div data-testid="upload-progress-component">
      <div>Progress: {progress}</div>
      <div>Uploading: {uploading.toString()}</div>
    </div>
  ),
}));

jest.mock("../../ui/button", () => ({
  Button: ({ onClick, disabled, children }) => (
    <button data-testid="upload-button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe("FileUploader Component", () => {
  const mockOnUpload = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    global.FileReader = class {
      onload;
      onerror;
      readAsText(file) {
        setTimeout(() => {
          this.onload({ target: { result: "mock file content" } });
        }, 0);
      }
    } as unknown as typeof FileReader;

    (fileToTransactions as jest.Mock).mockReturnValue([
      {
        name: "Store A",
        cardNumber: "1234",
        document: "123.456.789-00",
        value: 100,
        date: "2023-01-01",
        hour: "12:00",
        type: "1",
        owner: "John Doe",
        debits: 0,
        credits: 100,
        transactions: [],
      },
    ]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("renders component with initial state", () => {
    act(() => render(<FileUploader />));

    expect(screen.getByTestId("drag-drop-component")).toBeInTheDocument();
    expect(screen.getByTestId("upload-button")).toBeInTheDocument();
    expect(screen.getByTestId("upload-button")).toBeDisabled();
    expect(screen.getByText("Enviar")).toBeInTheDocument();
  });

  test("handles drag over event", async () => {
    render(<FileUploader />);

    act(() => {
      fireEvent.click(screen.getByTestId("simulate-drag-over"));
    });

    await waitFor(() => {
      expect(screen.getByText("isDragging: true")).toBeInTheDocument();
    });
  });

  test("handles drag leave event", async () => {
    render(<FileUploader />);

    act(() => {
      fireEvent.click(screen.getByTestId("simulate-drag-over"));
    });

    await waitFor(() => {
      expect(screen.getByText("isDragging: true")).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId("simulate-drag-leave"));
    });

    await waitFor(() => {
      expect(screen.getByText("isDragging: false")).toBeInTheDocument();
    });
  });

  test("handles file input change with valid file", async () => {
    render(<FileUploader />);

    const file = new File(["file content"], "test.txt", { type: "text/plain" });

    const input = screen.getByTestId("file-input");
    act(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByTestId("file-0")).toBeInTheDocument();
      expect(screen.getByTestId("file-0")).toHaveTextContent("test.txt");
    });
  });

  test("validates file extension", async () => {
    render(<FileUploader />);

    const file = new File(["file content"], "test.pdf", {
      type: "application/pdf",
    });

    const input = screen.getByTestId("file-input");

    act(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByText(/não é válido/)).toBeInTheDocument();
    });
  });

  test("removes file when remove button is clicked", async () => {
    render(<FileUploader />);

    const file = new File(["file content"], "test.txt", { type: "text/plain" });
    const input = screen.getByTestId("file-input");

    act(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByTestId("file-0")).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId("remove-file-0"));
    });

    await waitFor(() => {
      expect(screen.queryByTestId("file-0")).not.toBeInTheDocument();
    });
  });

  test("processes file content and displays transactions", async () => {
    render(<FileUploader />);

    const file = new File(["file content"], "test.txt", { type: "text/plain" });
    const input = screen.getByTestId("file-input");

    act(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByTestId("transaction-0")).toBeInTheDocument();
      expect(screen.getByTestId("transaction-0")).toHaveTextContent("Store A");
      expect(fileToTransactions).toHaveBeenCalledWith("mock file content");
    });
  });

  test("disables drag and drop when files are present", async () => {
    render(<FileUploader />);

    const file = new File(["file content"], "test.txt", { type: "text/plain" });
    const input = screen.getByTestId("file-input");

    act(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByTestId("file-0")).toBeInTheDocument();
      expect(screen.getByText("disabled: true")).toBeInTheDocument();
    });
  });

  test("clears transactions when file is removed", async () => {
    render(<FileUploader />);

    const file = new File(["file content"], "test.txt", { type: "text/plain" });
    const input = screen.getByTestId("file-input");

    act(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByTestId("transaction-0")).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId("remove-file-0"));
    });

    await waitFor(() => {
      expect(screen.queryByTestId("transaction-0")).not.toBeInTheDocument();
    });
  });

  test("handles multiple files", async () => {
    render(<FileUploader />);

    const file1 = new File(["content 1"], "test1.txt", { type: "text/plain" });
    const input = screen.getByTestId("file-input");

    act(() => {
      fireEvent.change(input, { target: { files: [file1] } });
    });

    await waitFor(() => {
      expect(screen.getByTestId("file-0")).toBeInTheDocument();
    });

    const file2 = new File(["content 2"], "test2.txt", { type: "text/plain" });

    act(() => {
      fireEvent.change(input, { target: { files: [file2] } });
    });

    await waitFor(() => {
      expect(screen.getByTestId("file-1")).toBeInTheDocument();
      expect(screen.getByTestId("file-0")).toHaveTextContent("test1.txt");
      expect(screen.getByTestId("file-1")).toHaveTextContent("test2.txt");
    });
  });

  test("matches snapshot", () => {
    const { container } = render(<FileUploader />);
    expect(container).toMatchSnapshot();
  });
});
