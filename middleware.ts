import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["vn", "en"],
  defaultLocale: "vn",
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
