'use server';
/**
 * @fileOverview AI agent that generates a title and keywords for the input text.
 *
 * - generateTitleAndKeywords - A function that generates a title and keywords.
 * - GenerateTitleAndKeywordsInput - The input type for the function.
 * - GenerateTitleAndKeywordsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTitleAndKeywordsInputSchema = z.object({
  text: z.string().describe('The text to generate a title and keywords for.'),
});
export type GenerateTitleAndKeywordsInput = z.infer<typeof GenerateTitleAndKeywordsInputSchema>;

const GenerateTitleAndKeywordsOutputSchema = z.object({
  generatedTitle: z.string().describe('A concise and relevant title generated from the text, in Vietnamese.'),
  generatedKeywords: z.array(z.string()).describe('A list of 3-5 relevant keywords extracted from the text, in Vietnamese.'),
});
export type GenerateTitleAndKeywordsOutput = z.infer<typeof GenerateTitleAndKeywordsOutputSchema>;

export async function generateTitleAndKeywords(input: GenerateTitleAndKeywordsInput): Promise<GenerateTitleAndKeywordsOutput> {
  return generateTitleAndKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTitleAndKeywordsPrompt',
  input: {schema: GenerateTitleAndKeywordsInputSchema},
  output: {schema: GenerateTitleAndKeywordsOutputSchema},
  prompt: `Từ văn bản sau, hãy tạo một tiêu đề ngắn gọn, phù hợp bằng tiếng Việt và trích xuất 3-5 từ khóa liên quan bằng tiếng Việt.

Văn bản: {{{text}}}
`,
});

const generateTitleAndKeywordsFlow = ai.defineFlow(
  {
    name: 'generateTitleAndKeywordsFlow',
    inputSchema: GenerateTitleAndKeywordsInputSchema,
    outputSchema: GenerateTitleAndKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
