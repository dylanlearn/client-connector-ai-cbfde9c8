
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendLinkRequest {
  linkId: string;
  deliveryType: 'email' | 'sms';
  recipient: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { linkId, deliveryType, recipient }: SendLinkRequest = await req.json();
    
    if (!linkId || !deliveryType || !recipient) {
      throw new Error("Missing required parameters");
    }
    
    // Get the link details
    const { data: linkData, error: linkError } = await supabase
      .from('client_access_links')
      .select('token, designer_id, client_name')
      .eq('id', linkId)
      .single();
    
    if (linkError || !linkData) {
      throw new Error(`Link not found: ${linkError?.message}`);
    }
    
    // Record the delivery attempt
    const { data: deliveryRecord, error: recordError } = await supabase.rpc(
      'record_client_link_delivery',
      {
        p_link_id: linkId,
        p_delivery_type: deliveryType,
        p_recipient: recipient,
        p_status: 'pending'
      }
    );
    
    if (recordError) {
      throw new Error(`Failed to record delivery: ${recordError.message}`);
    }
    
    // Generate the full client hub link
    const baseUrl = Deno.env.get("PUBLIC_APP_URL") || "https://dezignsync.app";
    const clientHubLink = `${baseUrl}/client-hub?clientToken=${linkData.token}&designerId=${linkData.designer_id}`;
    
    // Send the message based on delivery type
    let deliveryResult;
    
    if (deliveryType === 'email') {
      // Send email using a third-party service
      // For now, we'll simulate success
      console.log(`Would send email to ${recipient} with link: ${clientHubLink}`);
      deliveryResult = { success: true };
      
      // Update delivery status
      await supabase
        .from('client_link_deliveries')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', deliveryRecord);
    } 
    else if (deliveryType === 'sms') {
      // Send SMS using a third-party service
      // For now, we'll simulate success
      console.log(`Would send SMS to ${recipient} with link: ${clientHubLink}`);
      deliveryResult = { success: true };
      
      // Update delivery status
      await supabase
        .from('client_link_deliveries')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString() 
        })
        .eq('id', deliveryRecord);
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: `Client hub link sent via ${deliveryType}`,
      deliveryResult
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-client-link function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
