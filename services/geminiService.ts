import { GoogleGenAI, Type } from "@google/genai";
import { DatabaseState, ISORequest } from "../types";

// In a real production environment, this should be in process.env.API_KEY
// For this demo, we are using the provided key.
const API_KEY = "AIzaSyCm81IEmx-SN-LmUL41oiaXapAf0U3CK8s";

const SYSTEM_INSTRUCTION = `
You are the "Pocket Farmer" Ops generator.
Generate realistic agricultural graph data.
- Users: Roles (Farmer, Customer, Provider). Farmers have satisfaction scores (0-5) and insurance.
- Farms: Include lat/long coordinates, specialties.
- Listings: Types include Fruit, Veggie, Meat, Dairy, Textile, Raw Material, etc. Seasonality is required.
- Services: Veterinary, Pesticide, Herbicide. Regulated services (Pesticide/Herbicide) should have a 'verified' boolean.
- ISO Requests: Customers looking for specific items. Include category, urgency, and trade preferences if mentioned.
- Ensure IDs follow 'table:snake_case_name'.
`;

export const generateSeedData = async (prompt: string): Promise<Partial<DatabaseState>> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate a Pocket Farmer dataset for: ${prompt}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          users: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                role: { type: Type.STRING, enum: ['Farmer', 'Customer', 'Provider'] },
                email: { type: Type.STRING },
                dob: { type: Type.STRING },
                photo_url: { type: Type.STRING },
                name: {
                  type: Type.OBJECT,
                  properties: {
                    first: { type: Type.STRING },
                    last: { type: Type.STRING },
                  },
                },
                farmer_id: { type: Type.STRING },
                satisfaction_score: { type: Type.NUMBER },
                insurance: {
                  type: Type.OBJECT,
                  properties: {
                    provider: { type: Type.STRING },
                    policy: { type: Type.STRING },
                  },
                },
              },
            },
          },
          farms: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                owner_id: { type: Type.STRING },
                logo_url: { type: Type.STRING },
                location: {
                  type: Type.ARRAY,
                  items: { type: Type.NUMBER },
                },
                specialties: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
            },
          },
          listings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                farm_id: { type: Type.STRING },
                name: { type: Type.STRING },
                type: { type: Type.STRING },
                season: { type: Type.STRING },
                price: { type: Type.STRING },
                inventory: { type: Type.NUMBER },
                status: { type: Type.STRING },
              },
            },
          },
          jobPosts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                farm_id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['Full-Time', 'Part-Time', 'Gig', 'Odd Job'] },
                compensation: { type: Type.STRING },
              },
            },
          },
          isoRequests: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                customer_id: { type: Type.STRING },
                item_name: { type: Type.STRING },
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                quantity_needed: { type: Type.STRING },
                posted_at: { type: Type.STRING },
                expires_at: { type: Type.STRING },
                location: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                trade_preference: { type: Type.STRING },
                urgency: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
              },
            },
          },
          services: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                provider_id: { type: Type.STRING },
                service_type: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                contact_info: { type: Type.STRING },
                verified: { type: Type.BOOLEAN },
              },
            },
          },
        },
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as Partial<DatabaseState>;
  }
  
  throw new Error("Failed to generate data");
};

export const parseIsoRequest = async (userInput: string): Promise<Partial<ISORequest>> => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
  
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract ISO details from: "${userInput}"`,
      config: {
        systemInstruction: "Extract product name, quantity, category, trade preference, and urgency. Return JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            item_name: { type: Type.STRING },
            quantity_needed: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['Fruit', 'Veggie', 'Meat', 'Dairy', 'Egg', 'Grain', 'Sweetener', 'Textile', 'Raw Material', 'Other'] },
            description: { type: Type.STRING },
            trade_preference: { type: Type.STRING },
            urgency: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          },
        },
      },
    });
  
    if (response.text) {
      return JSON.parse(response.text) as Partial<ISORequest>;
    }
    
    throw new Error("Failed to parse ISO request");
};

export const chatWithAssistant = async (
  message: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Convert simple history to API compatible content
  const formattedHistory = history.map(h => ({
    role: h.role,
    parts: [{ text: h.text }]
  }));

  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: "You are 'Pocket', an expert agricultural assistant for the Pocket Farmer app. Your users are often farmers with low digital literacy. Provide simple, actionable advice on cultivation, pest control, weather interpretation, and market trends. Be concise, friendly, and practical. Avoid complex jargon.",
    },
    history: formattedHistory,
  });

  const response = await chat.sendMessage({ message });
  return response.text || "I didn't catch that. Could you say it again?";
};