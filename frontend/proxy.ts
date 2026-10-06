import { NextResponse, type NextRequest } from "next/server";
import { localeFromPath } from "./app/lib/i18n";

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-site-language", localeFromPath(request.nextUrl.pathname));
  headers.set("x-site-path", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!_next|assets|bakir-api|favicon).*)"] };
