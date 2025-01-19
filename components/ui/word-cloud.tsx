import { forwardRef, useCallback, useMemo } from "react";
import WordCloud from "react-d3-cloud";

type Word = { text: string; value: number };

type Props = {
  words: Word[];
};

const MAX_FONT_SIZE = 100;
const MIN_FONT_SIZE = 14;
const MAX_WORDS = 100;

export const WordCloudComponent = forwardRef<HTMLDivElement, Props>(({ words }, ref) => {
  const maxPriority = useMemo(() => Math.max(...words.map((w) => w.value)), [words]);

  const fontSizeMapper = useCallback(
    (word: Word) => {
      // Normalize the priority value to a scale of 0-1
      const normalizedValue = word.value / maxPriority;
      // Calculate font size based on priority
      return MIN_FONT_SIZE + (MAX_FONT_SIZE - MIN_FONT_SIZE) * normalizedValue;
    },
    [maxPriority]
  );

  const processedWords = useMemo(() => {
    return words
      .sort((a, b) => b.value - a.value)
      .slice(0, MAX_WORDS)
      .map((word) => ({
        ...word,
        value: Math.round(word.value), // Ensure values are integers
      }));
  }, [words]);

  return (
    <div ref={ref} className="w-full h-full min-h-[500px] z-10">
      <WordCloud data={processedWords} fontSize={fontSizeMapper} font="Inter" padding={3} rotate={0} />
    </div>
  );
});

WordCloudComponent.displayName = "WordCloud";
