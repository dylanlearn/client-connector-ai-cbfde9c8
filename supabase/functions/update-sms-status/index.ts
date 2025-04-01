
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get form data from Twilio callback
    const formData = await req.formData();
    const messageSid = formData.get("MessageSid") as string;
    const messageStatus = formData.get("MessageStatus") as string;
    const to = formData.get("To") as string;
    
    console.log(`Received SMS status update for ${messageSid}: ${messageStatus}`);
    
    if (!messageSid || !messageStatus) {
      throw new Error("Missing required parameters");
    }
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Find delivery record with matching recipient and recent creation date
    const { data: deliveries, error: queryError } = await supabase
      .from('client_link_deliveries')
      .select('id, status')
      .eq('delivery_type', 'sms')
      .eq('recipient', to.replace(/^\+/, '')) // Remove + prefix if present
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (queryError || !deliveries || deliveries.length === 0) {
      console.error(`No matching delivery found for SMS ${messageSid} to ${to}`);
      return new Response(
        JSON.stringify({ success: false, error: "No matching delivery found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const deliveryId = deliveries[0].id;
    
    // Map Twilio status to our status
    let newStatus = deliveries[0].status; // Keep existing status by default
    let updateFields: any = {};
    
    if (messageStatus === 'delivered') {
      newStatus = 'delivered';
      updateFields.delivered_at = new Date().toISOString();
    } else if (messageStatus === 'failed' || messageStatus === 'undelivered') {
      newStatus = 'error';
      updateFields.error_message = `Twilio status: ${messageStatus}`;
    }
    
    // Update the delivery record
    const { error: updateError } = await supabase
      .from('client_link_deliveries')
      .update({ 
        status: newStatus,
        ...updateFields
      })
      .eq('id', deliveryId);
    
    if (updateError) {
      throw new Error(`Failed to update delivery status: ${updateError.message}`);
    }
    
    console.log(`Updated delivery ${deliveryId} status to ${newStatus}`);
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in update-sms-status function:", error);
    
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
