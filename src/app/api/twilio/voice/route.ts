import { NextResponse } from "next/server";

const FORWARD_TO = process.env.TWILIO_FORWARD_TO ?? "+447595366094";
const TIMEOUT_SECONDS = 30;

function twimlResponse(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="${TIMEOUT_SECONDS}" answerOnBridge="true">
    <Number>${FORWARD_TO}</Number>
  </Dial>
</Response>`;
}

export async function GET() {
  return new NextResponse(twimlResponse(), {
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

export async function POST() {
  return new NextResponse(twimlResponse(), {
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}
