import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { generateText, streamText } from 'ai'

export async function POST(req: Request) {
  try {
    const { text, systemPrompt, modelId, stream } = (await req.json()) as {
      text: string
      systemPrompt: string
      modelId: string
      stream?: boolean
    }

    if (!text || !systemPrompt || !modelId) {
      return new Response(
        JSON.stringify({ error: 'Missing text, systemPrompt, or modelId' }),
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OPENROUTER_API_KEY not configured' }),
        { status: 500 }
      )
    }

    const openrouter = createOpenRouter({ apiKey })
    const model = openrouter(modelId)

    if (stream) {
      const result = streamText({ model, system: systemPrompt, prompt: text })
      return result.toTextStreamResponse()
    }

    const { text: resultText } = await generateText({
      model,
      system: systemPrompt,
      prompt: text,
    })
    return Response.json({ text: resultText })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Transform request failed unexpectedly'
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }
}
