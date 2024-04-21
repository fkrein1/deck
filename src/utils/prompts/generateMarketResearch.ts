import {
  presentationSchemaString,
  slideGraphSchemaString,
  slideSchemaString,
} from "../presentationSchema";

interface SlideProps {
  title: string;
}

interface SlideGraphProps {
  title: string;
  graph: string;
}

const year = new Date().getFullYear();

export function generateMarketResearch(userPrompt: string) {
  const presentation = `${presentationPrompt()}  Topic: ${userPrompt}`;
  const slides = slideData.map(
    (slide) =>
      `${
        slide.graph ? slideGraphPrompt(slide) : slidePrompt(slide)
      }\nTopic: ${userPrompt}`
  );
  return {
    tokens: 600,
    prompts: [presentation, ...slides],
  };
}

const presentationPrompt = () =>
  `Generate market research presentation title and subtitle on the topic below in a seo friendly way\n${presentationSchemaString}`;

const slidePrompt = ({ title }: SlideProps) =>
  `Generate one slide for a market research presentation on the topic below in a seo friendly way.\n${title}\n${slideSchemaString}`;

const slideGraphPrompt = ({ title, graph }: SlideGraphProps) =>
  `Generate one slide for a market research presentation on the topic below in a seo friendly way.\n${title}\nInclude a graph about ${graph} with real data from a trusted source.\nProjections should start from ${year}.\n${slideGraphSchemaString}`;

const slideData = [
  { title: "Slide 1: Title: Executive Summary", graph: undefined },
  {
    title: "Slide 2: Title: Market Size and Growth",
    graph: "market growth in line format",
  },
  {
    title: "Slide 3: Title: Market Segmentation",
    graph: "market segmentation in pie format",
  },
  {
    title: "Slide 4: Title: Consumer Behavior",
    graph: "demographic or psychographic segmentation in bar format",
  },
  {
    title: "Slide 5: Title: Competitor analysis",
    graph: "market share data in pie format",
  },
  {
    title: "Slide 6: Title: Product or Service Analysis:",
    graph: "market share data in pie format",
  },
  {
    title: "Slide 7: Title: Emerging Technologies",
    graph: "new technologies data in bar format",
  },
  {
    title: "Slide 8: Title = Market challenges",
    graph: "industry revenue in bar format",
  },

  { title: "Slide 9: Title = Conclusion and Thank you", graph: undefined },
];
