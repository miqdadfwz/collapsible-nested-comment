import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { Comments } from "./comments";
import {
  useGetComments,
  useAddComment,
  useRemoveComment,
} from "../model/comments.model";

vi.mock("dayjs", () => {
  return {
    default: () => ({
      isValid: true,
      fromNow: () => "a day ago",
      format: () => "2025-04-12",
    }),
  };
});

vi.mock("../model/comments.model", () => ({
  useGetComments: vi.fn(),
  useAddComment: vi.fn(),
  useRemoveComment: vi.fn(),
}));

vi.mock("./comments-editor", () => ({
  CommentsEditor: vi.fn(({ onSubmit }) => (
    <div data-testid="comments-editor">
      <button
        data-testid="submit-comment"
        onClick={() => onSubmit("New reply content")}
      >
        Submit Reply
      </button>
    </div>
  )),
}));

vi.mock("~/shared", () => ({
  HtmlToMantine: vi.fn(({ html }) => (
    <div data-testid="html-content">{html}</div>
  )),
}));

const renderWithMantine = (ui: React.ReactNode) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("Comments", () => {
  const mockComments = [
    {
      id: "1",
      post: { content: "<p>This is a test comment</p>" },
      user: { name: "Test User" },
      createdAt: "2025-04-12T12:00:00Z",
      comments: [
        {
          id: "2",
          post: { content: "<p>This is a reply</p>" },
          user: { name: "Reply User" },
          createdAt: "2025-04-12T13:00:00Z",
          comments: [],
        },
      ],
    },
  ];

  const mockAddComment = vi.fn();
  const mockRemoveComment = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useGetComments as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockComments
    );
    (useAddComment as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockAddComment
    );
    (useRemoveComment as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockRemoveComment
    );
  });

  it("renders comments correctly", () => {
    renderWithMantine(<Comments />);

    expect(screen.getByText(/This is a test comment/)).toBeInTheDocument();
    expect(screen.getByText(/Test User/)).toBeInTheDocument();
  });

  it("expands replies when clicking see replies", () => {
    renderWithMantine(<Comments />);

    fireEvent.click(screen.getByText("See reply (1)"));

    expect(screen.getByText(/This is a reply/)).toBeInTheDocument();
    expect(screen.getByText(/Reply User/)).toBeInTheDocument();
  });

  it("shows reply editor when reply button is clicked", () => {
    renderWithMantine(<Comments />);

    const replyButton = screen.getByText(/See reply/);
    fireEvent.click(replyButton);

    const editors = screen.getAllByTestId("comments-editor");

    editors.forEach((editor) => {
      expect(editor).toBeInTheDocument();
    });
  });
});
