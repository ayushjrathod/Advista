import { NextResponse } from "next/server";

const API_ENDPOINTS = {
  first:
    "https://api.langflow.astra.datastax.com/lf/dd11c369-217a-4aee-8f5e-bcf8ede29fb8/api/v1/run/d8bc1925-c5fe-4c60-af7d-d4d56891416b",
  second:
    "https://api.langflow.astra.datastax.com/lf/dd11c369-217a-4aee-8f5e-bcf8ede29fb8/api/v1/run/c4aee47f-398a-47a5-b4a6-2d1d0cc4e555",
};

const AUTH_TOKENS = {
  first: "AstraCS:oxKzlpXhHWxbZnPywEqutGbW:3d1f5daf1af99508063ffd0162b3e220613187b08e517c4fd8b3e96325d50748",
  second: "AstraCS:wOZINqgkAWCWQKrmAKokCacA:bfc46cabfb6008cee7de010192cbcd904e0f4ae215654fadc51cf6b5064c73da",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    console.log("Processing query:", query); // Debug log

    const payload = {
      input_value: query,
      output_type: "chat",
      input_type: "chat",
      tweaks: {
        "ChatInput-ll5ap": {},
        "Prompt-51Y3i": {},
        "ChatOutput-Bo7Pt": {},
        "GroqModel-gDP3S": {},
      },
    };

    const payload2 = {
      ...payload,
      tweaks: {
        "ChatInput-9EcZg": {},
        "Prompt-QfXwm": {},
        "ChatOutput-yzwVx": {},
        "GroqModel-fgiMd": {},
      },
    };

    // Make both API calls in parallel
    const [response1, response2] = await Promise.all([
      fetch(API_ENDPOINTS.first, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKENS.first}`,
        },
        body: JSON.stringify(payload),
      }),
      fetch(API_ENDPOINTS.second, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKENS.second}`,
        },
        body: JSON.stringify(payload2),
      }),
    ]);

    const [data1, data2] = await Promise.all([response1.json(), response2.json()]);

    // Debug logs
    console.log("API 1 response:", data1);
    console.log("API 2 response:", data2);

    // Validate responses
    if (!data1 || !data2) {
      throw new Error("Invalid API response");
    }

    return NextResponse.json({
      first: data1,
      second: data2,
      debug: { query, timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
