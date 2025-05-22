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
  text: z.string().describe('The text to be rewritten.'),
  style: z
    .string()
    .describe(
      'The desired style of the rewritten text. Examples: professional, friendly, academic, casual.'
    ),
});
export type RewriteTextInput = z.infer<typeof RewriteTextInputSchema>;

const RewriteTextOutputSchema = z.object({
  rewrittenText: z.string().describe('The rewritten text.'),
});
export type RewriteTextOutput = z.infer<typeof RewriteTextOutputSchema>;

export async function rewriteText(input: RewriteTextInput): Promise<RewriteTextOutput> {
  return rewriteTextFlow(input);
}

const rewriteTextPrompt = ai.definePrompt({
  name: 'rewriteTextPrompt',
  input: {schema: RewriteTextInputSchema},
  output: {schema: RewriteTextOutputSchema},
  prompt: `Rewrite the following text in a {{{style}}} style:\n\n{{{text}}}`,
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
