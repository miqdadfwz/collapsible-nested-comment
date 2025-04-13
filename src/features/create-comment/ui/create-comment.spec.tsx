import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { CreateComment } from "./create-comment";
import { useAddComment } from "../model/create-comment.model";

vi.mock("../model/create-comment.model", () => ({
  useAddComment: vi.fn(),
}));

vi.mock("./create-comment-editor", () => ({
  CreateCommentEditor: vi.fn((props) => (
    <div data-testid="create-comment-editor">
      <textarea data-testid="fake-editor" />
      <button
        data-testid="submit-button"
        onClick={() => props.onSubmit("Test comment content")}
      >
        Comment
      </button>
    </div>
  )),
}));

// Create a wrapper component with MantineProvider
const renderWithMantine = (ui: React.ReactNode) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("CreateComment", () => {
  const mockAddComment = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAddComment as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockAddComment
    );
  });

  it("renders the CreateCommentEditor component", () => {
    renderWithMantine(<CreateComment />);
    expect(screen.getByTestId("create-comment-editor")).toBeInTheDocument();
  });

  it("calls addComment with correct parameters when submitted", () => {
    renderWithMantine(<CreateComment />);

    fireEvent.click(screen.getByTestId("submit-button"));

    expect(mockAddComment).toHaveBeenCalledWith(
      "Test comment content",
      "Jane Smith",
      ""
    );
    expect(mockAddComment).toHaveBeenCalledTimes(1);
  });
});
