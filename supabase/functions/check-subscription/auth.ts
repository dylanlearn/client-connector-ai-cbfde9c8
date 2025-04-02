
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { AuthResult } from "./types.ts";
import { log, LogLevel } from "./monitoring.ts";

export async function verifyUser(req: Request, supabase: ReturnType<typeof createClient>): Promise<AuthResult> {
  // Get the authorization header from the request
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    log(LogLevel.WARN, "No authorization header provided");
    return { user: null, error: new Error('No authorization header') };
  }

  // Get the user from the authorization header
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  
  if (userError) {
    log(LogLevel.ERROR, "User verification failed", { error: userError.message });
    return { user: null, error: userError };
  }
  
  log(LogLevel.INFO, "User verified successfully", { userId: user.id });
  return { user, error: null };
}
