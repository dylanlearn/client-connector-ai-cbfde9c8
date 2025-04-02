
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { verifyAdminUser } from "./auth.ts";
import { corsHeaders } from "./utils.ts";
import { 
  handleCreateInvitation, 
  handleListInvitations, 
  handleRevokeInvitation, 
  handleGrantProAccess 
} from "./handlers.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    
    try {
      // Verify admin user permissions
      await verifyAdminUser(authHeader);
    } catch (error) {
      console.error('Authentication error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Get the action from the request body
    const { action, ...data } = await req.json();

    // Route to the appropriate handler based on the action
    try {
      switch (action) {
        case 'create_invitation':
          return await handleCreateInvitation(data);
        case 'list_invitations':
          return await handleListInvitations();
        case 'revoke_invitation':
          return await handleRevokeInvitation(data);
        case 'grant_pro_access':
          return await handleGrantProAccess(data);
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (handlerError) {
      console.error(`Error in handler for action ${action}:`, handlerError);
      return new Response(JSON.stringify({ error: handlerError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  } catch (error) {
    console.error('Error in admin-invitations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
