import OpenAI from "openai";

export class ChatGPTProvider {
  private client: OpenAI;

  constructor() {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_KEY,
    });

    this.client = openai;
  }
  async generateGPT4(prompt: string, max_tokens: number) {
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        const completion = await this.client.chat.completions.create({
          model: "gpt-4-turbo-preview",
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: prompt }],
          max_tokens,
        });

        const data = completion.choices[0]?.message.content;
        return data || "";
      } catch (error) {
        console.log(error);
        console.error("ChatGPT error occurred");
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, retryCount * 50));
      }
    }
    return "";
  }

  async generateGPT3(prompt: string, max_tokens: number) {
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        const completion = await this.client.chat.completions.create({
          model: "gpt-3.5-turbo",
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: prompt }],
          max_tokens,
        });

        const data = completion.choices[0]?.message.content;
        return data || "";
      } catch (error) {
        console.log(error);
        console.error("ChatGPT error occurred");
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, retryCount * 50));
      }
    }
    return "";
  }
}
