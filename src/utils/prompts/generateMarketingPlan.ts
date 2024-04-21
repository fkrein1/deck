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

export function generateMarketingPlan(userPrompt: string) {
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
  `Generate marketing plan presentation title and subtitle on the topic below in a seo friendly way\n${presentationSchemaString}`;

const slidePrompt = ({ title }: SlideProps) =>
  `Generate one slide for a marketing plan presentation on the topic below in a seo friendly way.\n${title}\n${slideSchemaString}`;

const slideGraphPrompt = ({
  title,
  graph,
}: SlideGraphProps) => `Generate one slide for a marketing plan presentation on the topic below in a seo friendly way.\n${title}\nInclude a graph about ${graph} with real data from a trusted source.\nProjections should start from ${year}.
  ${slideGraphSchemaString}`;

const slideData = [
  { title: "Slide 1: Title: Executive Summary", graph: undefined },
  {
    title: "Slide 2: Title: Market Analysis",
    graph: "demographics in pie format",
  },
  {
    title: "Slide 3: Title: Competitive Analysis",
    graph: "market share in pie format",
  },
  {
    title: "Slide 4: Title: Unique Selling Proposition",
    graph: undefined,
  },
  {
    title: "Slide 5: Title: Marketing Objectives",
    graph: "expected growth in bar format",
  },
  {
    title: "Slide 6: Title: Marketing Mix",
    graph: "marketing mix in pie format",
  },
  {
    title: "Slide 7: Title: Implementation Plan ",
    graph: undefined,
  },
  {
    title: "Slide 8: Title: Budget",
    graph: "budget allocation per channel in bar format",
  },
  {
    title: "Slide 9: Title: Evaluation and Control",
    graph: "expected ROI per channel in bar format",
  },
  { title: "Slide 10: Title: Conclusion and Thank you", graph: undefined },
];
