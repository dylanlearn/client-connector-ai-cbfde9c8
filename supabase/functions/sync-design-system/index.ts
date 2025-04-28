
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for the response
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to handle OPTIONS request for CORS preflight
function handleCors() {
  return new Response(null, { headers: corsHeaders });
}

// Function to handle design system synchronization with GitHub
async function syncWithGithub(connectionConfig: any, designData: any) {
  try {
    const { owner, repo, path, branch = 'main' } = connectionConfig;
    const { token } = connectionConfig.auth;
    
    if (!token) {
      throw new Error('GitHub token not provided');
    }

    // Convert the design data to a format suitable for GitHub
    const content = btoa(JSON.stringify(designData, null, 2));

    // Check if file exists to get the sha
    let sha;
    try {
      const checkResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      if (checkResponse.ok) {
        const fileData = await checkResponse.json();
        sha = fileData.sha;
      }
    } catch (error) {
      console.error("File doesn't exist yet, will create it:", error);
    }

    // Create or update the file in GitHub
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update design system tokens',
        content,
        branch,
        sha, // Include sha if updating an existing file
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error syncing with GitHub:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Function to handle design system synchronization with Figma
async function syncWithFigma(connectionConfig: any, designData: any) {
  try {
    const { fileKey, nodeId } = connectionConfig;
    const { token } = connectionConfig.auth;
    
    if (!token) {
      throw new Error('Figma token not provided');
    }

    // This is a simplified version - in a real implementation,
    // you would use the Figma Variables API to update design tokens
    // https://www.figma.com/developers/api#variables
    
    // For now, just log the request and return a mock success response
    console.log(`Would sync with Figma file ${fileKey}, node ${nodeId}`);
    console.log("Design data:", designData);
    
    return {
      success: true,
      data: {
        message: "Figma synchronization simulation successful",
      },
    };
  } catch (error) {
    console.error("Error syncing with Figma:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Function to handle design system synchronization with Slack
async function syncWithSlack(connectionConfig: any, designData: any) {
  try {
    const { webhookUrl, channel } = connectionConfig;
    
    if (!webhookUrl) {
      throw new Error('Slack webhook URL not provided');
    }

    // Create a summary message for Slack
    const message = {
      text: "🎨 Design System Update",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🎨 Design System Update",
            emoji: true
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "The design system has been updated with the following changes:"
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Update Time:*\n${new Date().toLocaleString()}`
            },
            {
              type: "mrkdwn",
              text: `*Changes:*\n${Object.keys(designData).length} items updated`
            }
          ]
        }
      ]
    };

    if (channel) {
      message.channel = channel;
    }

    // Send notification to Slack
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Slack API error: ${response.status} - ${errorText}`);
    }

    return {
      success: true,
      data: {
        message: "Slack notification sent successfully",
      },
    };
  } catch (error) {
    console.error("Error syncing with Slack:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Main serve function
serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return handleCors();
  }

  // Get the environment variables
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  // Create a Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Parse request body
    const { connectionId } = await req.json();

    if (!connectionId) {
      return new Response(
        JSON.stringify({ error: "Connection ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the connection details
    const { data: connection, error: connectionError } = await supabase
      .from('external_service_connections')
      .select('*')
      .eq('id', connectionId)
      .single();

    if (connectionError || !connection) {
      return new Response(
        JSON.stringify({ error: "Connection not found", details: connectionError }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get design tokens for the project
    const { data: designTokens, error: tokensError } = await supabase
      .from('design_tokens')
      .select('*')
      .eq('project_id', connection.project_id);

    if (tokensError) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch design tokens", details: tokensError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a design data object to sync
    const designData = {
      tokens: designTokens,
      projectId: connection.project_id,
      lastUpdated: new Date().toISOString(),
    };

    // Create sync log entry
    const { data: syncLog, error: syncLogError } = await supabase
      .from('external_service_sync_logs')
      .insert({
        connection_id: connectionId,
        sync_direction: 'outbound',
        status: 'in_progress',
      })
      .select()
      .single();

    if (syncLogError) {
      console.error("Error creating sync log:", syncLogError);
    }

    // Perform the sync based on the service type
    let syncResult;
    switch (connection.service_type) {
      case 'github':
        syncResult = await syncWithGithub(connection.connection_config, designData);
        break;
      case 'figma':
        syncResult = await syncWithFigma(connection.connection_config, designData);
        break;
      case 'slack':
        syncResult = await syncWithSlack(connection.connection_config, designData);
        break;
      default:
        syncResult = {
          success: false,
          error: `Unsupported service type: ${connection.service_type}`,
        };
    }

    // Update the sync log with the results
    if (syncLog) {
      const updateData: any = {
        status: syncResult.success ? 'completed' : 'failed',
        sync_completed_at: new Date().toISOString(),
        records_processed: designTokens.length,
      };

      if (syncResult.success) {
        updateData.records_succeeded = designTokens.length;
        updateData.records_failed = 0;
      } else {
        updateData.records_succeeded = 0;
        updateData.records_failed = designTokens.length;
        updateData.error_details = { error: syncResult.error };
      }

      await supabase
        .from('external_service_sync_logs')
        .update(updateData)
        .eq('id', syncLog.id);

      // Update last_sync_at on the connection
      await supabase
        .from('external_service_connections')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', connectionId);
    }

    // Return the sync result
    return new Response(
      JSON.stringify(syncResult),
      { 
        status: syncResult.success ? 200 : 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in sync-design-system function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
