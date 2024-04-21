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

export function generateCompanyOverview(userPrompt: string) {
  const presentation = `${presentationPrompt()}  Topic: ${userPrompt}`;
  const slides = slideData.map((slide, index) => {
    if (index === 6) {
      return `${managementSlidePrompt()}\nTopic: ${userPrompt}`;
    }
    if (index === 7) {
      return `${contactSlidePrompt()}\nTopic: ${userPrompt}`;
    }
    return `${
      slide.graph ? slideGraphPrompt(slide) : slidePrompt(slide)
    }\nTopic: ${userPrompt}`;
  });
  return {
    tokens: 600,
    prompts: [presentation, ...slides],
  };
}

const presentationPrompt = () =>
  `Generate an coporate presentation title and subtitle, title should be in this format "Company name" plus "(Exchange: Ticker)" if public, subtitle should be only "Corporate Overview", nothing more, on the topic below\n${presentationSchemaString}`;

const slidePrompt = ({ title }: SlideProps) =>
  `Generate one slide for a coporate presentation on the topic below.\n${title}\n${slideSchemaString}`;

const managementSlidePrompt = () =>
  `Generate one slide for a coporate presentation on the topic below, each bullet point should be a managment team member provided below.\nSlide 7: Title: Management Team\n${slideSchemaString}`;

const contactSlidePrompt = () =>
  `Generate a contact slide for a corporate presentation on the topic below, all contact info should be in the summary.\nSlide 8: Title: Contact\n${slideSchemaString}`;

const slideGraphPrompt = ({ title, graph }: SlideGraphProps) =>
  `Generate one slide for a corporate presentation on the topic below.\n${title}\nInclude a graph about ${graph} with data from the topic below.\n${slideGraphSchemaString}`;

const slideData = [
  { title: "Slide 1: Title: Corporate Overview", graph: undefined },
  {
    title: "Slide 2: Title: Value Drivers",
    graph: undefined,
  },
  {
    title: "Slide 3: Title: Financial Summary",
    graph: "the financial summary",
  },
  {
    title: "Slide 4: Title: Balance Sheet Highlights",
    graph: undefined,
  },
  {
    title: "Slide 5: Title: Investment Highlights",
    graph: undefined,
  },
  {
    title: "Slide 6: Title: Product Pipeline",
    graph: undefined,
  },
  {
    title: "Slide 7: Title: Management Team",
    graph: undefined,
  },
  {
    title: "Slide 8: Title: Contact",
    graph: undefined,
  },
];
