import "~/styles/globals.css";

import { ReactNode } from "react";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/toaster";
import { NextAuthProvider } from "~/components/nextauth-provider";
import { AntdConfigProvider } from "~/components/antd-cfg-provider";
import { Confirmer } from "~/components/comfirm";
import { TrpcProvider } from "~/components/trpc-provider";
import { NextIntlProvider } from 'next-intl';
import { useLocale } from 'next-intl';
import { notFound } from 'next/navigation';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body cz-shortcut-listen="true">
        <ThemeProvider attribute="class" defaultTheme="light">
          <AntdConfigProvider>
            <TrpcProvider>
              <NextAuthProvider>{children}</NextAuthProvider>
              <Toaster />
              <Confirmer />
            </TrpcProvider>
          </AntdConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// export default async function Layout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
//   const locale = params.locale;

//   let messages;
//   try {
//     messages = (await import(`../../messages/${locale}.json`)).default;
//   } catch (error) {
//     notFound(); // 404 nếu không có file ngôn ngữ
//   }

//   return (
//     <html lang={locale}>
//       <body>
//         <NextIntlProvider locale={locale} messages={messages}>
//           {children}
//         </NextIntlProvider>
//       </body>
//     </html>
//   );
// }
