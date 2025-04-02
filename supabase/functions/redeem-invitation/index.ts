
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { verifyUser } from "./auth.ts";
import { handleRedeemInvitation } from "./handlers.ts";
import { corsHeaders } from "./utils.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    
    // Verify user authentication
    const user = await verifyUser(authHeader);

    // Get the invitation code from the request body
    const { code } = await req.json();
    
    // Process invitation redemption
    const result = await handleRedeemInvitation(user.id, code);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in redeem-invitation function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
