import { WobbleCard } from "@/components/ui/wobble-card";
import { Image } from "lucide-react";

export function About() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-[#2b2538] min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Research Automation Engine
          </h2>
          <p className="mt-4 text-left  text-base/6 text-neutral-200">
            Streamline your research with automated data scraping and aggregation from platforms like Google, YouTube,
            Reddit, Quora, and app reviews. Gain instant insights into competitor ads and audience sentiments using
            real-time analysis powered by AI. Identify trending topics and pain points effortlessly, saving countless
            hours of manual work.
          </p>
        </div>
        <Image
          src="/test.png"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-[#33069b]">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Smart Insight Generator
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          Transform raw data into actionable insights with advanced pattern recognition and analysis. Discover
          high-performing hooks, CTAs, and content formats from competitor strategies. Dive deep into user motivations
          with detailed trigger maps, and receive tailored recommendations for crafting impactful ad messaging.
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-[#33069b] min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Visual Intelligence Dashboard
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
            Experience your insights visually with interactive graphs, word clouds, and sentiment analysis tools.
            Navigate research findings in an intuitive dashboard that includes a curated library of competitor ads and
            reference materials. Collaborate seamlessly with your team and access direct links to original sources for
            deeper exploration
          </p>
        </div>
        <Image
          src="/test.png"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
    </div>
  );
}
