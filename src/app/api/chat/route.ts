import { NextRequest } from 'next/server';
import Groq from 'groq-sdk';
import { searchCards } from '@/lib/db';

const SYSTEM_PROMPT = `You are CardCompare AI, a friendly and knowledgeable financial card advisor for the Indian market. You help users find the best credit, debit, forex, and prepaid cards based on their needs.

GUIDELINES:
- Be concise but helpful. Use bullet points for clarity.
- When recommending cards, mention specific card names from what you know.
- Consider the user's lifestyle: travel, dining, shopping, fuel, etc.
- Mention annual fees, cashback rates, reward points, and key benefits.
- If asked about eligibility, mention income requirements and credit score needs.
- Always clarify that you provide informational guidance, not financial advice.
- Keep responses under 300 words unless the user asks for detailed comparisons.
- Use ₹ for Indian Rupees.`;

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: 'Messages array required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({
                error: 'GROQ_API_KEY not configured. Add it to your .env file to enable the AI chatbot.'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // RAG: extract keywords from the last user message to find relevant cards
        const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop();
        let cardContext = '';
        if (lastUserMessage) {
            const query = lastUserMessage.content as string;
            const relevantCards = searchCards(query, 5);
            if (relevantCards.length > 0) {
                cardContext = `\n\nRELEVANT CARDS FROM OUR DATABASE:\n${relevantCards.map(c =>
                    `- ${c.name} (${c.issuer}) — ${c.cardType}, ${c.network}, Fee: ₹${c.annualFee}, ${c.rewardsType ? `${c.rewardsType}: ${c.cashbackRate ? c.cashbackRate + '%' : c.rewardsRate ? c.rewardsRate + 'X' : 'N/A'}` : ''}, Highlight: ${c.highlight || 'N/A'}`
                ).join('\n')}`;
            }
        }

        const groq = new Groq({ apiKey });

        const stream = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT + cardContext },
                ...messages.map((m: { role: string; content: string }) => ({
                    role: m.role as 'user' | 'assistant',
                    content: m.content,
                })),
            ],
            stream: true,
            max_tokens: 1024,
            temperature: 0.7,
        });

        // Create a readable stream for the response
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        if (content) {
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                        }
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (err) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`));
                    controller.close();
                }
            },
        });

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Chat API error';
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
