// src/ai/flows/extract-contacts-from-chat.ts
'use server';
/**
 * @fileOverview Extracts unsaved phone numbers from WhatsApp chat messages using AI.
 *
 * - extractContacts - A function that handles the contact extraction process.
 * - ExtractContactsInput - The input type for the extractContacts function.
 * - ExtractContactsOutput - The return type for the extractContacts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractContactsInputSchema = z.object({
  chatMessages: z
    .string()
    .describe('The WhatsApp chat messages to extract phone numbers from.'),
});
export type ExtractContactsInput = z.infer<typeof ExtractContactsInputSchema>;

const ExtractContactsOutputSchema = z.object({
  phoneNumbers: z
    .array(z.string())
    .describe('An array of extracted, unsaved phone numbers.'),
});
export type ExtractContactsOutput = z.infer<typeof ExtractContactsOutputSchema>;

export async function extractContacts(input: ExtractContactsInput): Promise<ExtractContactsOutput> {
  return extractContactsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractContactsPrompt',
  input: {schema: ExtractContactsInputSchema},
  output: {schema: ExtractContactsOutputSchema},
  prompt: `You are a helpful assistant that extracts phone numbers from WhatsApp chat messages.

  Your goal is to identify and extract all phone numbers from the provided chat messages that are likely to be unsaved contacts (i.e., not already in the user's address book).

  Consider the context of the chat messages to determine which numbers are most likely to be unsaved contacts.

  Here are the chat messages:
  {{chatMessages}}

  Return ONLY a JSON array of strings. Each string must be a valid phone number. Do not include any other text or explanation.`,
});

const extractContactsFlow = ai.defineFlow(
  {
    name: 'extractContactsFlow',
    inputSchema: ExtractContactsInputSchema,
    outputSchema: ExtractContactsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
