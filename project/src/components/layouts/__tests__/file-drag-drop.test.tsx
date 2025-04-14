import { fireEvent, render, screen } from "@testing-library/react";
import DragAndDropFile from "../file-drag-drop";

describe("DragAndDropFile Component", () => {
  const defaultProps = {
    fileInputRef: { current: null },
    handleDragLeave: jest.fn(),
    handleDragOver: jest.fn(),
    isDragging: false,
    uploading: false,
    handleDrop: jest.fn(),
    disbabled: false,
    handleFileChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with default props", () => {
    render(<DragAndDropFile {...defaultProps} />);

    expect(
      screen.getByText("Puxe e solte seu arquivo .txt aqui")
    ).toBeInTheDocument();
    expect(screen.getByText("ou")).toBeInTheDocument();
    expect(screen.getByText("faça o upload aqui")).toBeInTheDocument();
    expect(screen.getByTestId("upload-icon")).toBeInTheDocument();
  });

  test("applies disabled styles when uploading", () => {
    render(<DragAndDropFile {...defaultProps} uploading={true} />);

    const container = screen.getByTestId("drag-drop-container");

    expect(container).toHaveClass("pointer-events-none");
  });

  test("calls handleDragOver when dragging over", () => {
    render(<DragAndDropFile {...defaultProps} />);

    const container = screen.getByTestId("drag-drop-container");

    if (container) {
      fireEvent.dragOver(container);
    }

    expect(defaultProps.handleDragOver).toHaveBeenCalledTimes(1);
  });

  test("calls handleDragLeave when dragging leaves", () => {
    render(<DragAndDropFile {...defaultProps} />);

    const container = screen.getByTestId("drag-drop-container");
    fireEvent.dragLeave(container as any);

    expect(defaultProps.handleDragLeave).toHaveBeenCalledTimes(1);
  });

  test("calls handleDrop when files are dropped", () => {
    render(<DragAndDropFile {...defaultProps} />);

    const container = screen.getByTestId("drag-drop-container");
    fireEvent.drop(container as any);

    expect(defaultProps.handleDrop).toHaveBeenCalledTimes(1);
  });

  test("calls handleFileChange when file is selected", () => {
    const mockRef = { current: null };

    render(<DragAndDropFile {...defaultProps} fileInputRef={mockRef} />);

    const fileInput = document.querySelector('input[type="file"]');

    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const changeEvent = { target: { files: [file] } };

    fireEvent.change(fileInput as any, changeEvent);

    expect(defaultProps.handleFileChange).toHaveBeenCalledTimes(1);
  });

  test("file input has correct attributes", () => {
    render(<DragAndDropFile {...defaultProps} />);

    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toHaveAttribute("type", "file");
    expect(fileInput).toHaveAttribute("accept", ".txt");
    expect(fileInput).toHaveClass("hidden");
  });

  test("file input is disabled when uploading", () => {
    render(<DragAndDropFile {...defaultProps} uploading={true} />);

    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeDisabled();
  });

  test("file input is disabled when component is disabled", () => {
    render(<DragAndDropFile {...defaultProps} disbabled={true} />);

    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeDisabled();
  });
});
