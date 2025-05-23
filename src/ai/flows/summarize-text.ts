
// Summarize text flow.
'use server';

/**
 * @fileOverview Summarizes text provided by the user.
 *
 * - summarizeText - A function that handles the text summarization process.
 * - SummarizeTextInput - The input type for the summarizeText function.
 * - SummarizeTextOutput - The return type for the summarizeText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTextInputSchema = z.object({
  text: z.string().describe('Văn bản cần tóm tắt.'),
  targetLanguage: z.string().describe('Ngôn ngữ mong muốn cho văn bản đầu ra (ví dụ: English, Vietnamese, French). Mặc định là Vietnamese nếu không được cung cấp.'),
});
export type SummarizeTextInput = z.infer<typeof SummarizeTextInputSchema>;

const SummarizeTextOutputSchema = z.object({
  summary: z.string().describe('Bản tóm tắt của văn bản, bằng ngôn ngữ mục tiêu.'),
});
export type SummarizeTextOutput = z.infer<typeof SummarizeTextOutputSchema>;

export async function summarizeText(input: SummarizeTextInput): Promise<SummarizeTextOutput> {
  return summarizeTextFlow(input);
}

const summarizeTextPrompt = ai.definePrompt({
  name: 'summarizeTextPrompt',
  input: {schema: SummarizeTextInputSchema},
  output: {schema: SummarizeTextOutputSchema},
  prompt: `Tóm tắt văn bản sau đây. Trả lời bằng ngôn ngữ {{{targetLanguage}}}: {{{text}}}`,
});

const summarizeTextFlow = ai.defineFlow(
  {
    name: 'summarizeTextFlow',
    inputSchema: SummarizeTextInputSchema,
    outputSchema: SummarizeTextOutputSchema,
  },
  async input => {
    const {output} = await summarizeTextPrompt(input);
    return output!;
  }
);
