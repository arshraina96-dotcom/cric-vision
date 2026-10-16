import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST /api/identify - Intelligent verification and face identification
app.post('/api/identify', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', playerHint } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    // Clean base64 string if it contains data URI prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const promptText = `
You are an expert sports computer vision and facial biometrics AI specialized in Indian Cricket Team player face identification.
Analyze this input image of an Indian cricketer carefully.
Selected 12 canonical Indian cricketers in the model dataset are:
- Virat Kohli
- Rohit Sharma
- MS Dhoni
- Sachin Tendulkar
- Jasprit Bumrah
- Hardik Pandya
- Ravindra Jadeja
- Shubman Gill
- Rishabh Pant
- KL Rahul
- Mohammed Shami
- Suryakumar Yadav

${playerHint ? `Note: User or system suggested candidate hint: ${playerHint}` : ''}

Provide a structured biometric and facial analysis:
1. Identify the cricketer with highest accuracy. If it's one of the 12 Indian players above, specify their name. If not one of them, specify the closest match or identify them accurately.
2. Provide a confidence score (0 to 100).
3. Detect facial bounding box in normalized percentages (x, y, width, height from 0 to 100).
4. List key visible facial features (jawline, facial hair, eye spacing, cheekbone structure, nose bridge).
5. Give the top 3 class probability rankings among Indian cricket stars.
6. Provide cricketer details: role, jersey number, and career milestone.
7. Explain the convolutional neural feature activation (which facial regions contributed most strongly to this classification).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identifiedPlayer: {
              type: Type.STRING,
              description: 'Full name of the identified Indian cricketer',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence percentage between 0 and 100',
            },
            role: {
              type: Type.STRING,
              description: 'Cricket role, e.g. Right-handed Top-Order Batsman, Fast Bowler',
            },
            jerseyNumber: {
              type: Type.INTEGER,
              description: 'Official national team jersey number',
            },
            facialFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Specific facial landmarks and distinct visual features observed',
            },
            boundingBox: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER, description: 'Left position percentage 0-100' },
                y: { type: Type.NUMBER, description: 'Top position percentage 0-100' },
                width: { type: Type.NUMBER, description: 'Width percentage 0-100' },
                height: { type: Type.NUMBER, description: 'Height percentage 0-100' },
              },
              required: ['x', 'y', 'width', 'height'],
            },
            alternativeMatches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  player: { type: Type.STRING },
                  probability: { type: Type.NUMBER, description: 'Percentage 0-100' },
                },
                required: ['player', 'probability'],
              },
            },
            matchContextEra: {
              type: Type.STRING,
              description: 'Era or context of uniform/photo, e.g. 2023 World Cup, Test match whites',
            },
            careerMilestone: {
              type: Type.STRING,
              description: 'Notable career highlight of the identified cricketer',
            },
            cnnExplainability: {
              type: Type.STRING,
              description: 'Grad-CAM and feature map explanation of why this cricketer was identified',
            },
          },
          required: [
            'identifiedPlayer',
            'confidence',
            'role',
            'facialFeatures',
            'boundingBox',
            'alternativeMatches',
            'cnnExplainability',
          ],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Identification API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Face identification inference failed',
    });
  }
});

// POST /api/verify - 1:1 Face Verification
app.post('/api/verify', async (req: Request, res: Response) => {
  try {
    const { imageA, imageB, mimeType = 'image/jpeg' } = req.body;
    if (!imageA || !imageB) {
      return res.status(400).json({ error: 'imageA and imageB base64 inputs are required' });
    }

    const cleanA = imageA.replace(/^data:image\/\w+;base64,/, '');
    const cleanB = imageB.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanA,
              mimeType: mimeType,
            },
          },
          {
            inlineData: {
              data: cleanB,
              mimeType: mimeType,
            },
          },
          {
            text: `Compare these two facial images of cricket players. Are they the same individual cricketer? 
Provide verification result with similarity score (0 to 100), key biometric alignment details, and concise summary.`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            samePerson: { type: Type.BOOLEAN },
            similarityScore: { type: Type.NUMBER },
            euclideanDistance: { type: Type.NUMBER },
            personAName: { type: Type.STRING },
            personBName: { type: Type.STRING },
            facialComparisonPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            verdictSummary: { type: Type.STRING },
          },
          required: [
            'samePerson',
            'similarityScore',
            'facialComparisonPoints',
            'verdictSummary',
          ],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Face verification API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Verification failed',
    });
  }
});

// Mount Vite or static file serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CricVision Server running on port ${PORT}`);
  });
}

startServer();
