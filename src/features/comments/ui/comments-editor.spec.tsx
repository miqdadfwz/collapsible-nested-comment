import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { CommentsEditor } from "./comments-editor";
import { useEditor } from "@tiptap/react";

vi.mock("@tiptap/react", () => ({
  useEditor: vi.fn(),
}));

vi.mock("@mantine/tiptap", () => {
  const RichTextEditor = (props: { children: React.ReactNode }) => (
    <div data-testid="comments-editor" {...props}>
      {props.children}
    </div>
  );

  RichTextEditor.Content = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="editor-content">{children}</div>
  );
  RichTextEditor.Toolbar = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="editor-toolbar">{children}</div>
  );
  RichTextEditor.ControlsGroup = ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="editor-controls-group">{children}</div>;

  RichTextEditor.Bold = () => <button data-testid="editor-bold">B</button>;
  RichTextEditor.Italic = () => <button data-testid="editor-italic">I</button>;
  RichTextEditor.Underline = () => (
    <button data-testid="editor-underline">U</button>
  );
  RichTextEditor.Strikethrough = () => (
    <button data-testid="editor-strikethrough">S</button>
  );
  RichTextEditor.Code = () => <button data-testid="editor-code">{"<>"}</button>;
  RichTextEditor.Blockquote = () => (
    <button data-testid="editor-blockquote">Quote</button>
  );
  RichTextEditor.Link = () => <button data-testid="editor-link">Link</button>;
  RichTextEditor.Unlink = () => (
    <button data-testid="editor-unlink">Unlink</button>
  );

  return {
    RichTextEditor,
    Link: {},
  };
});

const renderWithMantine = (ui: React.ReactNode) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("CommentsEditor", () => {
  const mockEditor = {
    isEmpty: false,
    getHTML: vi.fn().mockReturnValue("<p>Test content</p>"),
    commands: {
      clearContent: vi.fn(),
    },
  };

  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useEditor as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockEditor
    );
  });

  it("renders editor with toolbar", () => {
    renderWithMantine(<CommentsEditor />);

    expect(screen.getByTestId("comments-editor")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onSubmit with editor content when submit button is clicked", () => {
    renderWithMantine(<CommentsEditor onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByText("Submit"));

    expect(mockEditor.getHTML).toHaveBeenCalled();
    expect(mockOnSubmit).toHaveBeenCalledWith("<p>Test content</p>");
    expect(mockEditor.commands.clearContent).toHaveBeenCalled();
  });

  it("calls onCancel when cancel button is clicked", () => {
    renderWithMantine(<CommentsEditor onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("disables submit button when editor is empty", () => {
    (useEditor as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockEditor,
      isEmpty: true,
    });

    renderWithMantine(<CommentsEditor />);

    expect(screen.getByTestId("submit-comment")).toHaveAttribute("disabled");
  });

  it("applies custom style when provided", () => {
    const customStyle = { backgroundColor: "red" };

    renderWithMantine(<CommentsEditor style={customStyle} />);

    const editor = screen.getByTestId("comments-editor");
    expect(editor).toBeInTheDocument();
  });
});
