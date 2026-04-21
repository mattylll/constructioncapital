/**
 * Configure the Construction Capital Twilio number to forward calls
 * to Matt's mobile via our Next.js /api/twilio/voice endpoint.
 *
 * Usage:
 *   npx tsx scripts/configure-twilio-forwarding.ts
 *
 * Required env vars (in .env.local):
 *   TWILIO_ACCOUNT_SID   - Account SID (AC...)
 *   TWILIO_AUTH_TOKEN    - Auth token
 *   TWILIO_PHONE_SID     - Phone number SID (PN...)
 *   TWILIO_VOICE_URL     - Full public URL of the voice webhook
 *                          (e.g. https://constructioncapital.co.uk/api/twilio/voice)
 */

import "dotenv/config";

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_SID,
  TWILIO_VOICE_URL,
} = process.env;

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

async function main() {
  const accountSid = requireEnv("TWILIO_ACCOUNT_SID", TWILIO_ACCOUNT_SID);
  const authToken = requireEnv("TWILIO_AUTH_TOKEN", TWILIO_AUTH_TOKEN);
  const phoneSid = requireEnv("TWILIO_PHONE_SID", TWILIO_PHONE_SID);
  const voiceUrl = requireEnv("TWILIO_VOICE_URL", TWILIO_VOICE_URL);

  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers/${phoneSid}.json`;

  const body = new URLSearchParams({
    VoiceUrl: voiceUrl,
    VoiceMethod: "POST",
    VoiceFallbackUrl: voiceUrl,
    VoiceFallbackMethod: "POST",
  });

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  console.log(`Updating Twilio number ${phoneSid}`);
  console.log(`  VoiceUrl → ${voiceUrl}`);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const json = (await res.json()) as Record<string, unknown>;

  if (!res.ok) {
    console.error(`Twilio API error (${res.status}):`, json);
    process.exit(1);
  }

  console.log("Success.");
  console.log({
    sid: json.sid,
    phone_number: json.phone_number,
    friendly_name: json.friendly_name,
    voice_url: json.voice_url,
    voice_method: json.voice_method,
    voice_fallback_url: json.voice_fallback_url,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
