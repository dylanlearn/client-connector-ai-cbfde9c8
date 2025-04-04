
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabase } from "../_shared/supabase-client.ts";

interface ClientNotificationRequest {
  notificationId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { notificationId } = await req.json() as ClientNotificationRequest;

    if (!notificationId) {
      throw new Error('Missing required parameter: notificationId');
    }

    // Fetch the notification
    const { data: notification, error: fetchError } = await supabase
      .from('client_notifications')
      .select('*, projects(title, client_name, client_email)')
      .eq('id', notificationId)
      .eq('status', 'pending')
      .single();

    if (fetchError) {
      throw new Error(`Error fetching notification: ${fetchError.message}`);
    }

    if (!notification) {
      throw new Error('Notification not found or already processed');
    }

    // In a real implementation, you would send an email here using a service like Resend, SendGrid, etc.
    // For this demo, we'll just log the notification and update its status to 'sent'

    console.log('Sending notification to client:', {
      recipient: notification.client_email,
      subject: `Update on your project: ${notification.projects.title}`,
      message: notification.message
    });

    // Update notification status
    const { error: updateError } = await supabase
      .from('client_notifications')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', notificationId);

    if (updateError) {
      throw new Error(`Error updating notification status: ${updateError.message}`);
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Notification sent to ${notification.client_email}`
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-client-notification function:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error occurred'
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
