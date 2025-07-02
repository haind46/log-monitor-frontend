"use client";

import { ConfigProvider as AntdThemeProvider, ThemeConfig, theme } from "antd";
import { useTheme } from "next-themes";
import { ReactNode } from "react";

function makeAntdThemeCfg(dark: boolean): ThemeConfig {
  if (dark) {
    return {
      algorithm: theme.darkAlgorithm,
    };
  }
  return {
    algorithm: theme.defaultAlgorithm,
  };
}

export function AntdConfigProvider({ children }: { children: ReactNode }) {
  const { theme: mode } = useTheme();

  return (
    <AntdThemeProvider theme={makeAntdThemeCfg(mode === "dark")}>
      {children}
    </AntdThemeProvider>
  );
}
