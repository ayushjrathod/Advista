"use client";
import { useState } from "react";

const CallToActionPage = () => {
  const [content, setContent] = useState("");
  const [inputValue, setInputValue] = useState("");

  interface ApiResponse {
    [key: string]: any;
  }

  interface ApiRequest {
    input_value: string;
    output_type: string;
    input_type: string;
    tweaks: {
      [key: string]: Record<string, never>;
    };
  }

  const fetchData = async (input: string): Promise<void> => {
    const response = await fetch(
      "https://api.langflow.astra.datastax.com/lf/dd11c369-217a-4aee-8f5e-bcf8ede29fb8/api/v1/run/c4aee47f-398a-47a5-b4a6-2d1d0cc4e555?stream=false",
      {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer AstraCS:wOZINqgkAWCWQKrmAKokCacA:bfc46cabfb6008cee7de010192cbcd904e0f4ae215654fadc51cf6b5064c73da",
        },
        body: JSON.stringify({
          input_value: input,
          output_type: "chat",
          input_type: "chat",
          tweaks: {
            "ChatInput-9EcZg": {},
            "Prompt-QfXwm": {},
            "ChatOutput-yzwVx": {},
            "GroqModel-fgiMd": {},
          },
        } as ApiRequest),
      }
    );
    const data: ApiResponse = await response.json();
    setContent(JSON.stringify(data));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetchData(inputValue);
  };

  return (
    <div>
      <h1>Call to Action</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      <div>{content}</div>
    </div>
  );
};

export default CallToActionPage;
