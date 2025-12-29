// middleware.js في root المشروع
import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("token"); // لو انت مخزن JWT في الكوكيز

    const url = req.nextUrl.clone();

    // لو المستخدم مسجل دخول وحاول يروح للـ login أو register
    if (token && (url.pathname === "/login" || url.pathname === "/register")) {
        url.pathname = "/movies";
        return NextResponse.redirect(url);
    }

    // لو المستخدم مش مسجل دخول وحاول يدخل صفحة محمية
    if (!token && url.pathname.startsWith("/movies")) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// تقدر تحدد الصفحات اللي يبغى تراقبها في config
export const config = {
    matcher: ["/login", "/register", "/movies/:path*"],
};
