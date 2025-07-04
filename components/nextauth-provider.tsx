"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
  return <SessionProvider refetchInterval={5 * 60}>{children}</SessionProvider>;
};
