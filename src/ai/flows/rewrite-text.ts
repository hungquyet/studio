'use server';

/**
 * @fileOverview A text rewriting AI agent.
 *
 * - rewriteText - A function that handles the text rewriting process.
 * - RewriteTextInput - The input type for the rewriteText function.
 * - RewriteTextOutput - The return type for the rewriteText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteTextInputSchema = z.object({
  text: z.string().describe('Văn bản cần được viết lại.'),
  style: z
    .string()
    .describe(
      'Phong cách mong muốn của văn bản được viết lại. Ví dụ: chuyên nghiệp, thân thiện, học thuật, thông thường.'
    ),
});
export type RewriteTextInput = z.infer<typeof RewriteTextInputSchema>;

const RewriteTextOutputSchema = z.object({
  rewrittenText: z.string().describe('Văn bản đã được viết lại, bằng tiếng Việt.'),
});
export type RewriteTextOutput = z.infer<typeof RewriteTextOutputSchema>;

export async function rewriteText(input: RewriteTextInput): Promise<RewriteTextOutput> {
  return rewriteTextFlow(input);
}

const rewriteTextPrompt = ai.definePrompt({
  name: 'rewriteTextPrompt',
  input: {schema: RewriteTextInputSchema},
  output: {schema: RewriteTextOutputSchema},
  prompt: `Viết lại văn bản sau theo phong cách {{{style}}}. Trả lời bằng tiếng Việt:\n\n{{{text}}}`,
});

const rewriteTextFlow = ai.defineFlow(
  {
    name: 'rewriteTextFlow',
    inputSchema: RewriteTextInputSchema,
    outputSchema: RewriteTextOutputSchema,
  },
  async input => {
    const {output} = await rewriteTextPrompt(input);
    return output!;
  }
);
