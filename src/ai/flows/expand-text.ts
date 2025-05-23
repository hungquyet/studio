'use server';

/**
 * @fileOverview This file contains the Genkit flow for expanding text.
 *
 * - expandText - A function that expands the given text.
 * - ExpandTextInput - The input type for the expandText function.
 * - ExpandTextOutput - The output type for the expandText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpandTextInputSchema = z.object({
  text: z.string().describe('Văn bản cần mở rộng.'),
});
export type ExpandTextInput = z.infer<typeof ExpandTextInputSchema>;

const ExpandTextOutputSchema = z.object({
  expandedText: z.string().describe('Văn bản đã được mở rộng, bằng tiếng Việt.'),
});
export type ExpandTextOutput = z.infer<typeof ExpandTextOutputSchema>;

export async function expandText(input: ExpandTextInput): Promise<ExpandTextOutput> {
  return expandTextFlow(input);
}

const expandTextPrompt = ai.definePrompt({
  name: 'expandTextPrompt',
  input: {schema: ExpandTextInputSchema},
  output: {schema: ExpandTextOutputSchema},
  prompt: `Mở rộng văn bản sau đây để cung cấp thêm chi tiết và giải thích. Trả lời bằng tiếng Việt:\n\n{{{text}}}`,
});

const expandTextFlow = ai.defineFlow(
  {
    name: 'expandTextFlow',
    inputSchema: ExpandTextInputSchema,
    outputSchema: ExpandTextOutputSchema,
  },
  async input => {
    const {output} = await expandTextPrompt(input);
    return output!;
  }
);
