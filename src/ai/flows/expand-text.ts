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
  text: z.string().describe('The text to expand.'),
});
export type ExpandTextInput = z.infer<typeof ExpandTextInputSchema>;

const ExpandTextOutputSchema = z.object({
  expandedText: z.string().describe('The expanded text.'),
});
export type ExpandTextOutput = z.infer<typeof ExpandTextOutputSchema>;

export async function expandText(input: ExpandTextInput): Promise<ExpandTextOutput> {
  return expandTextFlow(input);
}

const expandTextPrompt = ai.definePrompt({
  name: 'expandTextPrompt',
  input: {schema: ExpandTextInputSchema},
  output: {schema: ExpandTextOutputSchema},
  prompt: `Expand the following text to provide more detail and explanation:\n\n{{{text}}}`,
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
