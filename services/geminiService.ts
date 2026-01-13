
import { GoogleGenAI } from "@google/genai";
import { MOCK_PROPERTIES } from "../constants";

// Fixed: Correctly initialize GoogleGenAI using a named parameter and the API key from environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartRecommendations = async (userQuery: string) => {
  const propertiesData = JSON.stringify(MOCK_PROPERTIES.map(p => ({
    name: p.name,
    city: p.city,
    gender: p.gender,
    price: p.price,
    amenities: p.amenities,
    id: p.id
  })));

  const systemInstruction = `
    You are a helpful student accommodation expert. 
    You have access to a list of properties in JSON format.
    Your goal is to suggest the best PGs or Hostels from the provided list based on the user's query.
    If the user asks for something outside the list, tell them you don't have that yet but suggest the closest match.
    Keep your responses friendly, concise, and helpful.
    Always mention the price and one key amenity.
    
    Data: ${propertiesData}
  `;

  try {
    // Fixed: Always use ai.models.generateContent to query with model and prompt simultaneously.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    // Fixed: Access response.text directly (it is a property, not a method).
    return response.text || "I'm sorry, I couldn't find a perfect match for that. Could you try specifying a city or budget?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a bit of trouble connecting to my brain right now. Please try again in a moment!";
  }
};
