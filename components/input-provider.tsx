"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

export default function PlaceholdersAndVanishInputWrapper({ input }) {
  return (
    <PlaceholdersAndVanishInput
      placeholders={["Enter your email", "Enter your password"]}
      onChange={(e) => console.log(e)}
      onSubmit={(e) => console.log(e)}
    />
  );
}
