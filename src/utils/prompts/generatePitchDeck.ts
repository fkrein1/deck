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

export function generatePitchDeck(userPrompt: string) {
  const presentation = `${presentationPrompt()}\nTopic: ${userPrompt}`;
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
  `Generate investment pitch deck title and subtitle on the topic below in a seo friendly way\n${presentationSchemaString}`;

const slidePrompt = ({ title }: SlideProps) =>
  `Generate one slide for a pitch deck with a positive bias on the topic below in a seo friendly way.\n${title}\n${slideSchemaString}`;

const slideGraphPrompt = ({ title, graph }: SlideGraphProps) =>
  `Generate one slide for a pitch deck with a positive bias on the topic below in a seo friendly way.\n${title}\nInclude a graph about ${graph} with real data from a trusted source.\nProjections should start from ${year}.\n${slideGraphSchemaString}`;

const slideData = [
  { title: "Slide 1: Title: Executive Summary", graph: undefined },
  {
    title: "Slide 2: Title: Executive Team",
    graph: undefined,
  },
  {
    title: "Slide 3: Title: Problem Statement",
    graph: "the problem statement in bar format",
  },
  {
    title: "Slide 4: Title: Market summary",
    graph: "market project growth in line format",
  },
  {
    title: "Slide 5: Title: Product Description",
    graph: "market share per product in pie format",
  },
  {
    title: "Slide 6: Title: Competitive Analysis",
    graph: "market share per company in pie format",
  },
  {
    title: "Slide 7: Title: Differentiation",
    graph:
      "product features, brand perception, patent portfolio or price point in bar format",
  },
  {
    title: "Slide 8: Title: Business Model",
    graph: undefined,
  },
  {
    title: "Slide 9: Title: Financial Projections",
    graph: "finacial projections in bar format",
  },
  {
    title: "Slide 10: Title: Use of Proceeds summary",
    graph: "use of Proceeds by type in bar format",
  },
  { title: "Slide 11: Title: Conclusion and Thank you", graph: undefined },
];
