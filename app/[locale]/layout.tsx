import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import vn from "~/messages/vn.json";
import en from "~/messages/en.json";
import ClientSession from '~/components/client-session'

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "vn" }];
}

interface PageProps {
  children?: ReactNode;
  params: {
    locale: "vn" | "en";
  };
}

const dict = { en, vn };

export default async function Layout({ children, params }: PageProps) {
  const messages = dict[params.locale];

  if (!messages) {
    return notFound();
  }

  return (
    <ClientSession>
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
    </ClientSession>
  );
}
