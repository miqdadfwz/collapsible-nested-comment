import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Collapsible } from "./collapsible";
import { MantineProvider } from "@mantine/core";

// Helper function to render with Mantine provider
const renderWithMantine = (ui: React.ReactNode) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("Collapsible", () => {
  // Mock requestAnimationFrame and cancelAnimationFrame
  beforeAll(() => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 0;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("renders children when open", () => {
    renderWithMantine(
      <Collapsible open={true}>
        <div data-testid="content">Test Content</div>
      </Collapsible>
    );

    expect(screen.getByTestId("collapsible-container")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeVisible();
  });

  it("renders children when closed", () => {
    renderWithMantine(
      <Collapsible open={false}>
        <div data-testid="content">Test Content</div>
      </Collapsible>
    );

    expect(screen.getByTestId("content")).toBeInTheDocument();

    const containerBox = screen.getByTestId("collapsible-container");

    expect(containerBox).toHaveStyle("height: 0px");
    expect(containerBox).toHaveStyle("opacity: 0");
  });
});
