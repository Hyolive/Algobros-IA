
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ChartImage, AlgoAnalysisResult, KnowledgeResource, TradeSetup } from "../types";

const stripBase64 = (data: string) => data.split(',')[1] || data;

const DEEP_THINKING_BUDGET = 32768; 

export const analyzeCharts = async (
  images: ChartImage[], 
  knowledgeBase: KnowledgeResource[],
  tradeHistory: TradeSetup[]
): Promise<AlgoAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const sortedImages = images.sort((a, b) => {
    const order = ['1M', '1W', '1D', '4H', '1H', '15min', '5min', '1min'];
    return order.indexOf(a.timeframe) - order.indexOf(b.timeframe);
  });

  const imageParts = sortedImages.map(img => ({
    inlineData: { mimeType: 'image/png', data: stripBase64(img.data) }
  }));

  const deepKnowledge = knowledgeBase
    .filter(r => r.content && r.status === 'LEARNED')
    .map(r => `[USER_STRATEGY: ${r.name}]\n${r.content}`)
    .join('\n\n');

  // Inject performance history into the AI's "Experience"
  const experienceSummary = tradeHistory
    .slice(0, 10)
    .map(t => `[PAST_TRADE: ${t.status}] Direction: ${t.direction}, Pair: ${t.pair}, Logic: ${t.notes.substring(0, 150)}...`)
    .join('\n');

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      bias: { type: Type.STRING, description: 'BULLISH, BEARISH, or NEUTRAL' },
      narrative: { type: Type.STRING, description: 'Deep institutional technical reasoning' },
      conceptsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
      setup: {
        type: Type.OBJECT,
        properties: {
          valid: { type: Type.BOOLEAN },
          entry: { type: Type.NUMBER },
          sl: { type: Type.NUMBER },
          tp: { type: Type.NUMBER },
          reasoning: { type: Type.STRING }
        },
        required: ['valid']
      }
    },
    required: ['bias', 'narrative', 'conceptsFound', 'setup']
  };

  const systemInstruction = `
    You are ALGOBROS AI PRO with Reinforcement Learning. 
    Your primary goal is to find high-probability algorithmic trade setups (ICT/SMC).

    EXPERIENCE (Your recent results):
    ${experienceSummary || "No trading history yet. Start with a clean slate."}

    LEARNING PROTOCOL:
    1. Check if the current chart setup looks like a [PAST_TRADE: LOSS]. If so, identify what went wrong and avoid it.
    2. If the current chart looks like a [PAST_TRADE: WIN], prioritize the same entry logic.
    3. Use the USER STRATEGY DATABASE for technical rules:
    ${deepKnowledge}

    ANALYSIS PROTOCOL:
    - Multi-Timeframe Narrative (Narrative should be 3-4 paragraphs of deep reasoning).
    - Liquidity Mapping (BSL/SSL).
    - Structural Verification (BOS/CHoCH).
    - Outcome: Deliver precise JSON with entry, SL, TP.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { 
        parts: [
          ...imageParts, 
          { text: "Examine these charts with maximum depth. Learn from your past performance and provide a setup." }
        ] 
      },
      config: { 
        systemInstruction,
        responseMimeType: 'application/json', 
        responseSchema,
        temperature: 0.1, 
        thinkingConfig: { thinkingBudget: DEEP_THINKING_BUDGET }
      }
    });
    
    return JSON.parse(response.text || "{}") as AlgoAnalysisResult;
  } catch (error: any) {
    throw new Error(`AI Analysis Error: ${error.message}`);
  }
};

export const processVideoForKnowledge = async (file: File): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const reader = new FileReader();
  
  const base64Data = await new Promise<string>((resolve) => {
    reader.onload = () => resolve(stripBase64(reader.result as string));
    reader.readAsDataURL(file);
  });

  const prompt = "Watch this trading mentorship video. Extract ALL technical rules, setup criteria, and logic. Be extremely detailed.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { 
        parts: [{ inlineData: { data: base64Data, mimeType: 'video/mp4' } }, { text: prompt }] 
      },
      config: { 
        thinkingConfig: { thinkingBudget: DEEP_THINKING_BUDGET }
      }
    });
    return response.text || "No intelligence extracted.";
  } catch (error: any) {
    throw new Error(`Video Extraction Error: ${error.message}`);
  }
};
