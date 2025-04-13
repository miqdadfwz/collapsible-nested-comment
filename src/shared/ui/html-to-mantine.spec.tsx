import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { HtmlToMantine } from "./html-to-mantine";

const renderWithMantine = (html: string) => {
  return render(
    <MantineProvider>
      <HtmlToMantine html={html} />
    </MantineProvider>
  );
};

describe("HtmlToMantine", () => {
  it("renders plain text correctly", () => {
    renderWithMantine("Hello, world!");
    expect(screen.getByText("Hello, world!")).toBeInTheDocument();
  });

  it("renders paragraph text correctly", () => {
    renderWithMantine("<p>Paragraph text</p>");
    expect(screen.getByText("Paragraph text")).toBeInTheDocument();
  });

  it("renders links correctly", () => {
    renderWithMantine('<a href="https://example.com">Example Link</a>');
    const link = screen.getByText("Example Link");
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders bold text correctly", () => {
    renderWithMantine("<b>Bold text</b>");
    const boldText = screen.getByText("Bold text");
    expect(boldText).toBeInTheDocument();
    expect(boldText.tagName).toBe("B");
  });

  it("renders strong text correctly", () => {
    renderWithMantine("<strong>Strong text</strong>");
    const strongText = screen.getByText("Strong text");
    expect(strongText).toBeInTheDocument();
    expect(strongText.tagName).toBe("B");
  });

  it("renders italic text correctly", () => {
    renderWithMantine("<i>Italic text</i>");
    const italicText = screen.getByText("Italic text");
    expect(italicText).toBeInTheDocument();
    expect(italicText.tagName).toBe("I");
  });

  it("renders underlined text correctly", () => {
    renderWithMantine("<u>Underlined text</u>");
    const underlinedText = screen.getByText("Underlined text");
    expect(underlinedText).toBeInTheDocument();
    expect(underlinedText.tagName).toBe("U");
  });

  it("renders strikethrough text correctly", () => {
    renderWithMantine("<s>Strikethrough text</s>");
    const strikethroughText = screen.getByText("Strikethrough text");
    expect(strikethroughText).toBeInTheDocument();
    expect(strikethroughText.tagName).toBe("S");
  });

  it("renders blockquote correctly", () => {
    renderWithMantine("<blockquote>Quote text</blockquote>");
    expect(screen.getByText("Quote text")).toBeInTheDocument();
  });

  it("renders code correctly", () => {
    renderWithMantine("<code>const x = 10;</code>");
    expect(screen.getByText("const x = 10;")).toBeInTheDocument();
  });

  it("renders code blocks correctly", () => {
    renderWithMantine(
      "<pre><code>function example() { return true; }</code></pre>"
    );
    expect(
      screen.getByText("function example() { return true; }")
    ).toBeInTheDocument();
  });

  it("renders unordered lists correctly", () => {
    renderWithMantine("<ul><li>Item 1</li><li>Item 2</li></ul>");
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("renders ordered lists correctly", () => {
    renderWithMantine("<ol><li>First item</li><li>Second item</li></ol>");
    expect(screen.getByText("First item")).toBeInTheDocument();
    expect(screen.getByText("Second item")).toBeInTheDocument();
  });

  it("renders headings correctly", () => {
    renderWithMantine("<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3>");
    expect(screen.getByText("Heading 1")).toBeInTheDocument();
    expect(screen.getByText("Heading 2")).toBeInTheDocument();
    expect(screen.getByText("Heading 3")).toBeInTheDocument();
  });
});
