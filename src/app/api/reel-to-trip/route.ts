import { NextRequest } from 'next/server';
import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `You are a travel expert specialising in Indian travel. Given a description of a travel Instagram reel or post, extract the destination and vibe, then create an inspiring, detailed 5-day itinerary for Indian travelers with estimated costs in INR.

RESPOND ONLY with a valid JSON object — no markdown, no code fences, nothing before or after. Use exactly this structure:

{
  "destination": "City, State/Country",
  "matchedFrom": "One sentence explaining how you matched the reel description to this destination",
  "vibe": "e.g. Romantic & Luxurious / Adventure & Offbeat / Cultural & Heritage / Beach & Chill",
  "activitiesSpotted": ["activity or scene from the reel", "another one", "another one"],
  "estimatedBudget": {
    "budget": "₹X,XXX – ₹X,XXX per person",
    "midRange": "₹X,XXX – ₹XX,XXX per person",
    "luxury": "₹XX,XXX+ per person"
  },
  "bestTime": "Month range",
  "days": [
    {
      "day": 1,
      "title": "Evocative day title",
      "mood": "one-word mood e.g. Arrival / Wonder / Adventure / Culture / Farewell",
      "activities": [
        {
          "time": "Morning",
          "activity": "Activity name",
          "details": "2–3 sentences. Specific place names, local context, what makes it special.",
          "cost": "₹XXX – ₹X,XXX",
          "tip": "Practical insider tip."
        }
      ]
    }
  ],
  "packingEssentials": ["item 1", "item 2", "item 3"],
  "instagramSpots": ["Most photogenic spot 1", "Most photogenic spot 2", "Most photogenic spot 3"],
  "localPhrases": [{ "phrase": "local word", "meaning": "what it means" }],
  "bookingNote": "One sentence on why YlooTrips is the best way to book this trip."
}

Rules:
- 3–4 activities per day across Morning / Afternoon / Evening
- Cost estimates must be realistic for Indian travelers in INR
- Include specific restaurant names, viewpoints, hidden gems
- instagramSpots should match the reel's aesthetic
- If description is vague, make a creative but logical destination match`;

export async function POST(req: NextRequest) {
  const { description } = await req.json();

  if (!description || typeof description !== 'string') {
    return new Response(JSON.stringify({ error: 'Description is required' }), { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    // Proxy to the configured deployment that has the API key
    try {
      const proxy = await fetch('https://trip-frontend-ecru.vercel.app/api/reel-to-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      if (proxy.ok && proxy.body) {
        return new Response(proxy.body, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Cache-Control': 'no-cache',
          },
        });
      }
    } catch { /* fall through */ }
    return new Response(JSON.stringify({ error: 'API not configured' }), { status: 500 });
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user',   content: `Instagram reel/post description: ${description}` },
          ],
          temperature: 0.8,
          max_tokens: 3000,
          stream: true,
          response_format: { type: 'json_object' },
        });

        for await (const chunk of completion) {
          const token = chunk.choices[0]?.delta?.content ?? '';
          if (token) controller.enqueue(encoder.encode(token));
        }

        controller.close();
      } catch (err) {
        console.error('[reel-to-trip]', err);
        controller.enqueue(encoder.encode(JSON.stringify({ error: 'Failed to generate itinerary' })));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}
