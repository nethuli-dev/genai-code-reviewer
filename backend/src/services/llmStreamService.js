import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a senior code reviewer. Given a code diff, identify bugs, style issues, and suggest a commit message. Respond as structured markdown with exactly three sections: ## Bugs, ## Style Notes, ## Suggested Commit Message.`;

/**
 * Streams a code review from Groq. Calls onChunk(text) for each token
 * as it arrives, and returns the full accumulated text once done.
 */
export async function streamCodeReview(diffText, onChunk) {
  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `DIFF:\n${diffText}` },
    ],
    stream: true,
  });

  let fullText = '';

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content || '';
    if (token) {
      fullText += token;
      onChunk(token);
    }
  }

  return fullText;
}