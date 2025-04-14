// UploadProgress.test.tsx
import { render, screen } from "@testing-library/react";
import UploadProgress from "../upload-progress";

jest.mock("@radix-ui/react-progress", () => ({
  Progress: ({ value, className }) => (
    <div data-testid="progress-bar" data-value={value} className={className}>
      Progress Bar
    </div>
  ),
}));

describe("UploadProgress Component", () => {
  test("renders nothing when not uploading", () => {
    const { container } = render(
      <UploadProgress progress={50} uploading={false} />
    );

    expect(container.firstChild).toBeNull();
  });

  test("renders progress bar when uploading", () => {
    render(<UploadProgress progress={50} uploading={true} />);

    expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
    expect(screen.getByText("Em progresso...")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  test("handles 100% progress", () => {
    render(<UploadProgress progress={100} uploading={true} />);

    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByTestId("progress-bar")).toHaveAttribute(
      "data-value",
      "100"
    );
  });

  test("applies correct class to progress bar", () => {
    render(<UploadProgress progress={50} uploading={true} />);

    expect(screen.getByTestId("progress-bar")).toHaveClass("h-2");
  });

  test("matches snapshot when uploading", () => {
    const { container } = render(
      <UploadProgress progress={50} uploading={true} />
    );

    expect(container).toMatchSnapshot();
  });
});
