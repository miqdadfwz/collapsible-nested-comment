import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { CreateCommentEditor } from "./create-comment-editor";
import { useEditor } from "@tiptap/react";
import { useMediaQuery } from "@mantine/hooks";

vi.mock("@tiptap/react", () => ({
  useEditor: vi.fn(),
}));

vi.mock("@mantine/hooks", () => ({
  useMediaQuery: vi.fn(),
}));

vi.mock("@mantine/tiptap", () => {
  const RichTextEditor = (props: { children: React.ReactNode }) => (
    <div data-testid="rich-text-editor">{props.children}</div>
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

describe("CreateCommentEditor", () => {
  const mockEditor = {
    isEmpty: false,
    isFocused: false,
    getHTML: vi.fn().mockReturnValue("<p>Test content</p>"),
    commands: {
      clearContent: vi.fn(),
    },
  };

  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useEditor as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockEditor
    );

    (useMediaQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      false
    );

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("renders the editor with toolbar and submit button", () => {
    renderWithMantine(<CreateCommentEditor />);

    expect(screen.getByTestId("rich-text-editor")).toBeInTheDocument();
    expect(screen.getByTestId("editor-toolbar")).toBeInTheDocument();
    expect(screen.getByText("Comment")).toBeInTheDocument();
  });

  it("calls onSubmit with editor content when submit button is clicked", () => {
    renderWithMantine(<CreateCommentEditor onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByText("Comment"));

    expect(mockEditor.getHTML).toHaveBeenCalled();
    expect(mockOnSubmit).toHaveBeenCalledWith("<p>Test content</p>");
    expect(mockEditor.commands.clearContent).toHaveBeenCalled();
  });

  it("renders Stack wrapper on mobile view", () => {
    (useMediaQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      true
    );

    renderWithMantine(<CreateCommentEditor />);
    expect(screen.getByTestId("rich-text-editor")).toBeInTheDocument();
  });

  it("renders with custom style when provided", () => {
    const customStyle = { backgroundColor: "red" };
    renderWithMantine(<CreateCommentEditor style={customStyle} />);
    expect(screen.getByTestId("rich-text-editor")).toBeInTheDocument();
  });
});
