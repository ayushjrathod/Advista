import { DataAPIClient } from "@datastax/astra-db-ts";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const client = new DataAPIClient(
    "AstraCS:eeerxuCwdOYnyQLWzLKheuRU:fae990643a325349a352c0637b416e64a525bafb040eaa09694568b645528f5f"
  );
  const db = client.db("https://f1709d77-1fe2-47f5-b976-1261a15c3375-us-east1.apps.astra.datastax.com", {
    keyspace: "default_keyspace",
  });

  try {
    const body = await request.json();
    const session_id = body.session_id || "20250119_041143";
    console.log("Polling for session:", session_id);

    const collection = await db.collection("searches");
    const result = await collection.findOne({ _id: session_id });

    if (!result) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Check if processing is complete
    const processed = !!(result.youtube_groq_analysis && result.reddit_groq_insight);

    return NextResponse.json({
      ...result,
      processed,
      _polling: !processed, // Add flag for frontend to know if it should continue polling
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
