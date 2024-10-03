"use client";

import { ThemeProvider } from "styled-components";
import { appTheme } from "@/themes";

export default function ThemeClient({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={appTheme}>{children}</ThemeProvider>;
}
