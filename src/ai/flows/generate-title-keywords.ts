
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
  text: z.string().describe('Văn bản cần tạo tiêu đề và từ khóa.'),
  targetLanguage: z.string().describe('Ngôn ngữ mong muốn cho tiêu đề và từ khóa (ví dụ: English, Vietnamese). Mặc định là Vietnamese nếu không được cung cấp.'),
});
export type GenerateTitleAndKeywordsInput = z.infer<typeof GenerateTitleAndKeywordsInputSchema>;

const GenerateTitleAndKeywordsOutputSchema = z.object({
  generatedTitle: z.string().describe('Một tiêu đề ngắn gọn và phù hợp được tạo từ văn bản, bằng ngôn ngữ mục tiêu.'),
  generatedKeywords: z.array(z.string()).describe('Danh sách 3-5 từ khóa liên quan được trích xuất từ văn bản, bằng ngôn ngữ mục tiêu.'),
});
export type GenerateTitleAndKeywordsOutput = z.infer<typeof GenerateTitleAndKeywordsOutputSchema>;

export async function generateTitleAndKeywords(input: GenerateTitleAndKeywordsInput): Promise<GenerateTitleAndKeywordsOutput> {
  return generateTitleAndKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTitleAndKeywordsPrompt',
  input: {schema: GenerateTitleAndKeywordsInputSchema},
  output: {schema: GenerateTitleAndKeywordsOutputSchema},
  prompt: `Từ văn bản sau, hãy tạo một tiêu đề ngắn gọn, phù hợp và trích xuất 3-5 từ khóa liên quan. Cung cấp tiêu đề và từ khóa bằng ngôn ngữ {{{targetLanguage}}}.

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
