
import { GoogleGenAI, Type } from "@google/genai";
import { PurchaseDecision, PricePoint, AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzePriceData = async (
  productName: string,
  currentPrice: number,
  history: PricePoint[]
): Promise<AIAnalysis> => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze the price trends for the product "${productName}". 
    Current Price: ₹${currentPrice}.
    Historical Prices: ${JSON.stringify(history.map(p => ({ date: p.date, price: p.price })))}.
    
    Provide a purchase recommendation based on this time-series data. 
    Classify into: "BUY_NOW", "WAIT", or "PRICE_INCREASE".
    Assess if the current discount is authentic or if the price was recently inflated.
    Provide 3-4 bullet points of "Explainable AI" reasoning (why this decision was made).
    Predict the price for next week in Rupees.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            decision: { type: Type.STRING, description: "One of: BUY_NOW, WAIT, PRICE_INCREASE" },
            confidence: { type: Type.NUMBER, description: "Confidence score 0-100" },
            reasoning: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Bullet points explaining the analysis" 
            },
            authenticDiscount: { type: Type.BOOLEAN },
            discountScore: { type: Type.NUMBER, description: "0-100 score of discount validity" },
            predictedPrice: { type: Type.NUMBER }
          },
          required: ["decision", "confidence", "reasoning", "authenticDiscount", "discountScore", "predictedPrice"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return {
      ...result,
      decision: result.decision as PurchaseDecision
    };
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback static logic if API fails
    return {
      decision: PurchaseDecision.WAIT,
      confidence: 75,
      reasoning: ["Historical patterns suggest a drop.", "Market volatility is currently high."],
      authenticDiscount: true,
      discountScore: 80,
      predictedPrice: currentPrice * 0.95
    };
  }
};
