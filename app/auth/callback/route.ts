import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import type { UserRole } from "../../../lib/supabase/types";

const roles = new Set<UserRole>(["college_admin", "student"]);

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";
  const collegeCode = (requestUrl.searchParams.get("collegeCode") || "").trim().toUpperCase();
  const requestedRole = requestUrl.searchParams.get("role") as UserRole | null;
  const supabase = await createClient();
  const redirectUrl = new URL(next, requestUrl.origin);

  if (code && supabase) {
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      const loginUrl = new URL("/login", requestUrl.origin);
      loginUrl.searchParams.set("error", sessionError.message);
      return NextResponse.redirect(loginUrl);
    }

    if (collegeCode && requestedRole && roles.has(requestedRole)) {
      const { error: joinError } = await (supabase as any).rpc("join_college_workspace", {
        join_code: collegeCode,
        requested_role: requestedRole,
      });

      if (joinError) {
        redirectUrl.searchParams.set("workspace_error", joinError.message);
      }
    }
  }

  return NextResponse.redirect(redirectUrl);
}
