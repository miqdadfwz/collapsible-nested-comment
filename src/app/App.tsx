import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { MantineProvider } from "@mantine/core";

import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";

dayjs.extend(relativeTime);

export default function App() {
  return (
    <MantineProvider>
      <Outlet />
      <TanStackRouterDevtools />
    </MantineProvider>
  );
}
