import { z } from "zod";

export const presentationKeys = [
  "company_overview",
  "pitch_deck",
  "market_research",
  "marketing_plan",
] as const;

export const presentationQuestions = {
  pitch_deck: {
    title: "Pitch Deck",
    url: "pitch-deck",
    description:
      "Business plan used to pitch and attract potential investors, clients, or partners.",
    questions: [
      "What is the name of the company and what products and services it provides?",
      "What is the company's business model in terms of monetization strategy, target customers and distribution channels?",
      "Who are the key members of the executive team, and why are they qualified to lead this opportunity?",
      "How much funding are you looking to raise and how do you plan to use the proceeds to achieve your business goals?",
    ],
    answers: [
      "Timetracker.io offers a mobile app that helps busy professionals manage their time more efficiently.",
      "We monetize through subscriptions. The app is distributed through app stores and online marketing.",
      "Our CEO, Michael, has a proven track record in the tech industry and has successfully led multiple startups to success. Our CFO, Rachel, brings extensive financial expertise and has a keen eye for strategic planning",
      "We are looking to raise $2 million in funding to expand our product development and marketing efforts.",
    ],
  },
  market_research: {
    title: "Market Research",
    url: "market-research",
    description:
      "Overview of a specific market or industry, including key trends, consumer behaviors, and competitive analysis.",
    questions: [
      "What is your target market or industry?",
      "Who are the target customers?",
      "Who are the main competitors in this market?",
    ],
    answers: [
      "The target market is the mobile gaming industry, including smartphone and tablet users interested in gaming.",
      "The target customers are gamers who play games on mobile devices.",
      "The main competitors in this market include EA, Activision Blizzard, Tencent, Supercell, King, and other game developers and app stores in the mobile gaming industry.",
    ],
  },
  marketing_plan: {
    title: "Marketing Plan",
    url: "marketing-plan",
    description: "Overview of a company's marketing strategies and goals.",
    questions: [
      "What product or service would you like to create a marketing plan for?",
      "What is the unique selling proposition and differentiation of this product or service?",
      "What are the specific marketing objectives, and how do they align with the broader business goals and strategies?",
    ],
    answers: [
      "We would like to create a marketing plan for our sustainable skin care DTC brand's new exfoliator.",
      "Our exfoliator offers effective skin renewal while prioritizing sustainability, using natural ingredients and eco-friendly packaging.",
      "Our marketing objectives include raising product awareness, generating buzz, and driving online sales. These objectives align with our broader goals of growing our customer base, establishing our brand as a trusted sustainable option, and achieving success as a small DTC business.",
    ],
  },
  company_overview: {
    title: "Corporate Presentation",
    url: "corporate-presentation",
    description:
      "Overview of a business, including key information on its background, offerings, and value proposition.",
    questions: [
      "Could you provide the company name, specify if it is a publicly traded company, and if so, what is its ticker symbol and on which stock exchange does it trade?",
      "What are the key value drivers for our company?",
      "Share a brief overview of our financial performance for the past three years or quarters, focusing on a key metric such as revenue.",
      "What are the significant highlights from your balance sheet?",
      "What notable investments has your company made?",
      "Could you outline the current status and future plans of our product pipeline?",
      "Provide an overview of our management team, emphasizing key leadership roles and their expertise.",
      "Where can interested parties reach out for more information or inquiries?",
    ],
    answers: [
      "CrowdStrike is a publicly traded company trading on the NASDAQ stock exchange under the ticker symbol 'CRWD.' In summary, CrowdStrike is a leading cybersecurity company renowned for its cloud-based endpoint protection platform, Falcon, utilizing AI and machine learning to detect and respond to cyber threats in real-time.",
      "Our key value drivers include the revolutionary Falcon platform, meeting the strong market demand for cybersecurity solutions, and our continuous innovation in AI and machine learning, positioning us as leaders in the industry.",
      "2021 Revenue - $874 million, 2022 Revenue - $1,451 million, 2023 Revenue - $2,241 million, showcasing our consistent growth and financial strength.",
      "Robust cash reserve of $2,7 billions, a low debt-to-equity ratio of 0.36, and a strong current asset position, showcasing the financial strength and stability of the company.",
      "We've made significant investments in key cybersecurity technologies and research, such as our Security Cloud, enhancing our market presence and staying at the forefront of technological advancements.",
      "Our product pipeline is dynamic, featuring our flagship product Falcon, with upcoming releases leveraging the latest advancements in AI and machine learning. We focus on staying ahead of emerging threats through continuous innovation.",
      "Our leadership team, including CEO George Kurtz, CFO Burt Podbere, and CTO Dmitri Alperovitch, collectively brings decades of industry expertise. They guide the company with a wealth of knowledge in the cybersecurity sector, ensuring our continued success.",
      "For further information or inquiries, please contact CrowdStrike's Investor Relations team via email at ir@crowdstrike.com or by phone at +1 (555) 123-4567.",
    ],
  },
};

export const presentationValidationSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
});

export const slidesValidationSchema = z.object({
  number: z.number(),
  title: z.string(),
  subtitle: z.string(),
  summary: z.string(),
  bulletPoints: z.string().array(),
  graph: z
    .object({
      title: z.string(),
      source: z.string(),
      valueIn: z.string(),
      type: z.enum(["bar", "table", "pie", "line"]),
      dataPoints: z.array(
        z.object({
          name: z.string(),
          value: z.number(),
        })
      ),
    })
    .optional(),
});

export const presentationSchemaString = `Only return a valid json with this typescript schema
interface Presentation {
  title: string;
  subtitle: string;
}
Make sure the return is only a valid json.
Don't include any extra text, only the json object.
Presentation title must be about 50 characters.
Subtitle must be 3x longer than title.`;

export const slideGraphSchemaString = `Only return a valid json format with this typescript schema:
interface Slide {
  number: number;
  title: string;
  subtitle: string;
  summary: string;
  bulletPoints: Array<string>;
  graph: {
    title: string;
    source: string;
    valueIn: string;
    type: "bar" | "pie" | "line" ;
    dataPoints: Array<DataPoints>;
  }
}
interface DataPoints {
  name: string;
  value: number;
}
Make sure the return is only a valid json.
Don't include any extra text, only the json object.
Subtitle must be about 40 characters.
Summary must must be about 250 characters.
Include 3 BulletPoints that must be about 80 characters each.
DataPoints values should be a javascript formated number without comma, example: don't use 2,341.86, use 2341.86
Slide graphValueIn should be currency if aplicable and format, example USD in billions, example percentage %`;

export const slideSchemaString = `Only return a valid json format with this typescript schema:
interface Slide {
  number: number;
  title: string;
  subtitle: string;
  summary: string
  bulletPoints: Array<string>;
Make sure the return is only a valid json.
Don't include any extra text, only the json object.
Subtitle must be about 40 characters.
Summary must must be about 250 characters.
Include 4 BulletPoints that must be about 80 characters each.`;
