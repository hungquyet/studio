'use server';
/**
 * @fileOverview AI agent that analyzes the sentiment of the input text.
 *
 * - analyzeTextSentiment - A function that analyzes the sentiment of the input text.
 * - AnalyzeTextSentimentInput - The input type for the analyzeTextSentiment function.
 * - AnalyzeTextSentimentOutput - The return type for the analyzeTextSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTextSentimentInputSchema = z.object({
  text: z.string().describe('Văn bản cần phân tích cảm xúc.'),
});
export type AnalyzeTextSentimentInput = z.infer<typeof AnalyzeTextSentimentInputSchema>;

const AnalyzeTextSentimentOutputSchema = z.object({
  sentiment: z.string().describe('Cảm xúc tổng thể của văn bản (ví dụ: Tích cực, Tiêu cực, Trung tính, Hỗn hợp) bằng tiếng Việt.'),
  explanation: z.string().describe('Giải thích ngắn gọn cho việc phân tích cảm xúc bằng tiếng Việt.'),
});
export type AnalyzeTextSentimentOutput = z.infer<typeof AnalyzeTextSentimentOutputSchema>;

export async function analyzeTextSentiment(input: AnalyzeTextSentimentInput): Promise<AnalyzeTextSentimentOutput> {
  return analyzeTextSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTextSentimentPrompt',
  input: {schema: AnalyzeTextSentimentInputSchema},
  output: {schema: AnalyzeTextSentimentOutputSchema},
  prompt: `Phân tích cảm xúc của văn bản sau đây. Xác định xem cảm xúc tổng thể là "Tích cực", "Tiêu cực", "Trung tính" hay "Hỗn hợp". Cung cấp một giải thích ngắn gọn cho phân tích của bạn bằng tiếng Việt.

Văn bản: {{{text}}}
`,
});

const analyzeTextSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeTextSentimentFlow',
    inputSchema: AnalyzeTextSentimentInputSchema,
    outputSchema: AnalyzeTextSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
