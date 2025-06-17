import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
if (!RESEND_API_KEY) {
  console.error("RESEND_API_KEY is not set");
}

const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  subject: string;
  email: string;
  message: string;
}

const SUPPORT_EMAIL_TO = "your@email.com"; // TODO: change this to your real support email address

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("Email service is not configured. Please contact support.");
    }

    const { subject, email, message }: ContactEmailRequest = await req.json();

    if (!subject || !email || !message) {
      throw new Error("Missing required fields: subject, email, or message");
    }

    const subjectMap: Record<string, string> = {
      technical: "Technical Issue",
      billing: "Billing Question",
      feature: "Feature Request",
      general: "General Question",
    };

    // Choose a friendlier subject line if the subject is a code
    const prettySubject =
      subjectMap[subject] || subject || "User Contact Request";

    const html = `
      <h2>Support Inquiry</h2>
      <p><strong>Subject:</strong> ${prettySubject}</p>
      <p><strong>From:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <pre style="font-size:16px;white-space:pre-wrap;">${message}</pre>
    `;

    const result = await resend.emails.send({
      from: "Octava Support <onboarding@resend.dev>",
      to: [SUPPORT_EMAIL_TO],
      reply_to: email,
      subject: `[Support] ${prettySubject}`,
      html,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return new Response(
        JSON.stringify({ error: result.error.message || "Failed to send email" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e: any) {
    console.error("Edge function error:", e);
    return new Response(
      JSON.stringify({ error: e.message || "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
