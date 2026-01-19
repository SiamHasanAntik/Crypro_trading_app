
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeMarket(coin: string, price: number, change: number) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a brief professional market analysis for ${coin}. Current price is $${price} and 24h change is ${change}%. Focus on potential support/resistance levels and sentiment. Keep it under 150 words.`,
        config: {
          temperature: 0.7,
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return "Unable to fetch AI insights at this moment. Please try again later.";
    }
  }

  async getTradingStrategy(portfolio: any[]) {
    try {
      const portfolioStr = portfolio.map(p => `${p.symbol}: ${p.balance}`).join(', ');
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `You are a pro crypto portfolio manager. My current portfolio is: ${portfolioStr}. Given current market volatility, suggest a 3-step rebalancing strategy. Format as a JSON list of steps.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.STRING },
                reasoning: { type: Type.STRING }
              },
              required: ["step", "reasoning"]
            }
          }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("Gemini Strategy Error:", error);
      return [];
    }
  }
}

export const geminiService = new GeminiService();
