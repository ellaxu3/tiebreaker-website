import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

// Lazily initialize the Gemini SDK Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing. Please configure it in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const app = express();
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Tiebreaker Decision Maker endpoint
app.post('/api/tiebreaker/analyze', async (req, res) => {
  try {
    const { title, description, optionA, optionB, category } = req.body;

    if (!title || !optionA || !optionB) {
      res.status(400).json({ error: 'Title, Option A, and Option B are required.' });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `
      You are "The Tiebreaker", an elite decision-making consultant. Your task is to act as a fair, objective, and extremely analytical tie-breaker for the following user decision.

      User Decision Title: "${title}"
      Description/Context: "${description || 'None provided'}"
      Category: "${category || 'General'}"
      
      Option A Name: "${optionA}"
      Option B Name: "${optionB}"

      Perform a comprehensive, detailed analysis.
      1. Provide a comprehensive list of exactly 3-5 high-quality Pros and 3-5 Cons for Option A ("${optionA}") and Option B ("${optionB}"). Give each pro/con a short text, a description, and an impact weight from 1 to 5 (1 = lowest/negligible, 5 = highest/critical).
      2. Provide a SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats) for this overall decision or for the options collectively. Provide exactly 2-3 items for each SWOT category, including a title and detailed context for each item.
      3. Create a Comparison Table by comparing specific factors (e.g. Cost, Flexibility, Stress Level, Speed, Long-term value). Provide exactly 3-5 distinct factors with a short description of how Option A and Option B perform in each.
      4. Formulate a Weighted Scorecard. Define 4-5 scoring criteria relevant to this specific decision. For each criterion, define a "weight" (importance from 1 to 5), then score Option A ("${optionA}") and Option B ("${optionB}") on a scale of 1 to 10 (1 = poor, 10 = exceptional).
      5. Deliver the ultimate Tiebreaker Verdict. Compare Option A and Option B objectively. Declare a clear winner: 'Option A' if Option A is superior, 'Option B' if Option B is superior, or 'Tie' if they are perfectly matched. Also provide the "winnerName" (which should be the literal option name of the winner, or 'It\'s a Tie'). Provide a highly thoughtful, persuasive analytical summary explaining exactly why this option won, how it breaks the tie, and how to handle the key trade-offs. Provide a single, actionable one-sentence key takeaway to help the user act immediately.

      Ensure the output strictly conforms to the JSON schema. Be highly descriptive and tailored to the specific context of the user's decision.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prosCons: {
              type: Type.OBJECT,
              properties: {
                optionA: {
                  type: Type.OBJECT,
                  properties: {
                    optionName: { type: Type.STRING },
                    pros: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          text: { type: Type.STRING },
                          impact: { type: Type.INTEGER },
                          description: { type: Type.STRING },
                        },
                        required: ['text', 'impact', 'description'],
                      },
                    },
                    cons: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          text: { type: Type.STRING },
                          impact: { type: Type.INTEGER },
                          description: { type: Type.STRING },
                        },
                        required: ['text', 'impact', 'description'],
                      },
                    },
                  },
                  required: ['optionName', 'pros', 'cons'],
                },
                optionB: {
                  type: Type.OBJECT,
                  properties: {
                    optionName: { type: Type.STRING },
                    pros: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          text: { type: Type.STRING },
                          impact: { type: Type.INTEGER },
                          description: { type: Type.STRING },
                        },
                        required: ['text', 'impact', 'description'],
                      },
                    },
                    cons: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          text: { type: Type.STRING },
                          impact: { type: Type.INTEGER },
                          description: { type: Type.STRING },
                        },
                        required: ['text', 'impact', 'description'],
                      },
                    },
                  },
                  required: ['optionName', 'pros', 'cons'],
                },
              },
              required: ['optionA', 'optionB'],
            },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      detail: { type: Type.STRING },
                    },
                    required: ['text', 'detail'],
                  },
                },
                weaknesses: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      detail: { type: Type.STRING },
                    },
                    required: ['text', 'detail'],
                  },
                },
                opportunities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      detail: { type: Type.STRING },
                    },
                    required: ['text', 'detail'],
                  },
                },
                threats: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      detail: { type: Type.STRING },
                    },
                    required: ['text', 'detail'],
                  },
                },
              },
              required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
            },
            comparison: {
              type: Type.OBJECT,
              properties: {
                optionA: { type: Type.STRING },
                optionB: { type: Type.STRING },
                rows: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      factor: { type: Type.STRING },
                      valA: { type: Type.STRING },
                      valB: { type: Type.STRING },
                    },
                    required: ['factor', 'valA', 'valB'],
                  },
                },
              },
              required: ['optionA', 'optionB', 'rows'],
            },
            scorecard: {
              type: Type.OBJECT,
              properties: {
                criteria: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      weight: { type: Type.INTEGER },
                      scoreA: { type: Type.INTEGER },
                      scoreB: { type: Type.INTEGER },
                    },
                    required: ['name', 'weight', 'scoreA', 'scoreB'],
                  },
                },
              },
              required: ['criteria'],
            },
            verdict: {
              type: Type.OBJECT,
              properties: {
                winner: { type: Type.STRING },
                winnerName: { type: Type.STRING },
                analysis: { type: Type.STRING },
                keyTakeaway: { type: Type.STRING },
              },
              required: ['winner', 'winnerName', 'analysis', 'keyTakeaway'],
            },
          },
          required: ['prosCons', 'swot', 'comparison', 'scorecard', 'verdict'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Received empty content from Gemini API.');
    }

    const result = JSON.parse(text.trim());
    res.json(result);
  } catch (error: any) {
    console.error('Error generating decision analysis:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze decision.' });
  }
});

// Configure Vite and static assets
async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
