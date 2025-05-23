
'use server';

/**
 * @fileOverview AI agent that changes the tone of the input text.
 *
 * - changeTextTone - A function that changes the tone of the input text.
 * - ChangeTextToneInput - The input type for the changeTextTone function.
 * - ChangeTextToneOutput - The return type for the changeTextTone function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChangeTextToneInputSchema = z.object({
  text: z.string().describe('Văn bản cần thay đổi giọng điệu.'),
  tone: z.string().describe('Giọng điệu mong muốn của văn bản (ví dụ: Trang trọng, Thân thiện, Thông thường, Chuyên nghiệp, Học thuật).'),
  targetLanguage: z.string().describe('Ngôn ngữ mong muốn cho văn bản đầu ra (ví dụ: English, Vietnamese, French). Mặc định là Vietnamese nếu không được cung cấp.'),
});

export type ChangeTextToneInput = z.infer<typeof ChangeTextToneInputSchema>;

const ChangeTextToneOutputSchema = z.object({
  changedText: z.string().describe('Văn bản đã được thay đổi giọng điệu, bằng ngôn ngữ mục tiêu.'),
});

export type ChangeTextToneOutput = z.infer<typeof ChangeTextToneOutputSchema>;

export async function changeTextTone(input: ChangeTextToneInput): Promise<ChangeTextToneOutput> {
  return changeTextToneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'changeTextTonePrompt',
  input: {schema: ChangeTextToneInputSchema},
  output: {schema: ChangeTextToneOutputSchema},
  prompt: `Bạn là một trợ lý viết. Nhiệm vụ của bạn là thay đổi giọng điệu của văn bản do người dùng cung cấp sang giọng điệu do người dùng chỉ định. Trả lời bằng ngôn ngữ {{{targetLanguage}}}.

Văn bản: {{{text}}}
Giọng điệu: {{{tone}}}

Văn bản đã thay đổi: `,
});

const changeTextToneFlow = ai.defineFlow(
  {
    name: 'changeTextToneFlow',
    inputSchema: ChangeTextToneInputSchema,
    outputSchema: ChangeTextToneOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
