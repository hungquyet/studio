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
  text: z.string().describe('The text to change the tone of.'),
  tone: z.string().describe('The desired tone of the text.'),
});

export type ChangeTextToneInput = z.infer<typeof ChangeTextToneInputSchema>;

const ChangeTextToneOutputSchema = z.object({
  changedText: z.string().describe('The text with the changed tone.'),
});

export type ChangeTextToneOutput = z.infer<typeof ChangeTextToneOutputSchema>;

export async function changeTextTone(input: ChangeTextToneInput): Promise<ChangeTextToneOutput> {
  return changeTextToneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'changeTextTonePrompt',
  input: {schema: ChangeTextToneInputSchema},
  output: {schema: ChangeTextToneOutputSchema},
  prompt: `You are a writing assistant. Your task is to change the tone of the text provided by the user to the tone specified by the user.

Text: {{{text}}}
Tone: {{{tone}}}

Changed Text: `,
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
