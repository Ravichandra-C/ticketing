import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getCurrentUserInMiddleware } from "./app/lib/auth";

export function middleware(req: NextRequest) {
  console.log("Inside the middleware");
  // const session = req.cookies.get("session")?.value;
  // console.log({ session });
  // const result = getCurrentUserInMiddleware(session || "");

  return NextResponse.next();
}
