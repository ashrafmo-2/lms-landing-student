import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./shared/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const nonArabicLocaleMatch = pathname.match(/^\/(en|it)(?=\/|$)/);

  if (nonArabicLocaleMatch) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/(en|it)(?=\/|$)/, "/ar");

    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", routing.defaultLocale, {
      path: "/",
      sameSite: "lax",
    });

    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ar|en|it)/:path*"],
};
