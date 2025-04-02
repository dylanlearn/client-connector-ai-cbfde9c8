
export interface SendLinkRequest {
  linkId: string;
  deliveryType: 'email' | 'sms';
  recipient: string;
  personalMessage?: string | null;
}

export interface LinkData {
  token: string;
  designer_id: string;
  client_name: string;
}

export interface EmailResponse {
  id: string;
  [key: string]: any;
}

export interface SMSResponse {
  messageId: string;
  [key: string]: any;
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
