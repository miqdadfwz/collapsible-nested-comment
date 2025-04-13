import { Box, BoxProps } from "@mantine/core";
import { useLayoutEffect, useRef, useState } from "react";

type CollapsibleProps = {
  children: React.ReactNode;
  open: boolean;
};

export function Collapsible(props: CollapsibleProps) {
  const { children, open } = props;
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(0);

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const contentHeight = contentRef.current.scrollHeight;

    if (open) {
      setHeight(contentHeight);
    } else {
      // For closing state, we need to set the height to the current content height first
      // to animate it to 0 with a small delay, otherwise it will jump to 0 immediately
      setHeight(contentHeight);

      const raf = requestAnimationFrame(() => {
        setHeight(0);
      });

      return () => {
        if (raf) {
          cancelAnimationFrame(raf);
        }
      };
    }
  }, [open]);

  /**
   * Allows for dynamic content height adjustment after the transition ends.
   * Essentially it will overwrite the fixed height set in useLayoutEffect to "auto" after the transition ends
   */
  const handleTransitionEnd = () => {
    if (open) {
      setHeight("auto");
    }
  };

  const styles: BoxProps["style"] = {
    height: typeof height === "number" ? `${height}px` : height,
    transition: "height 0.3s ease-in-out, opacity 0.3s ease-in-out",
    overflow: "hidden",
    opacity: open ? 1 : 0,
  };

  return (
    <Box
      style={styles}
      onTransitionEnd={handleTransitionEnd}
      data-testid="collapsible-container"
    >
      <div ref={contentRef}>{children}</div>
    </Box>
  );
}
