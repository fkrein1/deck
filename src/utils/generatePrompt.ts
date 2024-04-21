import { type presentationKeys } from "./presentationSchema";
import { generateCompanyOverview } from "./prompts/generateCompanyOverview";
import { generateMarketingPlan } from "./prompts/generateMarketingPlan";
import { generateMarketResearch } from "./prompts/generateMarketResearch";
import { generatePitchDeck } from "./prompts/generatePitchDeck";

export function generatePrompt(
  option: (typeof presentationKeys)[number],
  userPrompt: string
) {
  switch (option) {
    case "pitch_deck":
      return generatePitchDeck(userPrompt);

    case "company_overview":
      return generateCompanyOverview(userPrompt);

    case "market_research":
      return generateMarketResearch(userPrompt);

    case "marketing_plan":
      return generateMarketingPlan(userPrompt);

    default:
      return {
        tokens: 100,
        prompts: [""],
      };
  }
}
