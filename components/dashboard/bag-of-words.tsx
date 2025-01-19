"use client";
import { WordCloudComponent } from "@/components/ui/word-cloud";
import { useEffect, useState } from "react";

export function BagOfWords() {
  const [words, setWords] = useState<{ text: string; value: number }[]>([]);

  useEffect(() => {
    // Hardcoded data instead of API call
    const mockData = {
      different: 10,
      perspective: 1,
      "well-groomed": 1,
      lot: 8,
      hair: 133,
      stuff: 12,
      "cologne/fragrances": 1,
      smell: 6,
      long: 16,
      way: 12,
      girls: 1,
      own: 4,
      "self-image": 1,
      "hand-in-hand": 1,
      samples: 3,
      fancier: 1,
      colognes: 2,
      fragrances: 1,
      standard: 3,
      deodorant: 23,
      stick: 4,
      important: 2,
      nice: 13,
      fragrance: 10,
      "self-confidence": 1,
      attention: 1,
      sensitive: 10,
      skin: 37,
      body: 44,
      wash: 45,
      tea: 5,
      tree: 6,
      special: 2,
      shampoo: 38,
      cetaphil: 10,
      cleanser: 11,
      cerva: 1,
    };

    const wordObjects = Object.entries(mockData)
      .map(([text, priority]) => ({
        text: text.replace(/['"]+/g, ""),
        value: Number(priority),
      }))
      .filter((word) => word.value > 0);

    setWords(wordObjects);
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-[600px]">
      {words.length > 0 && <WordCloudComponent words={words} />}
    </div>
  );
}
