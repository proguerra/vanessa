'use server';
/**
 * @fileOverview An AI tool that analyzes website content and suggests SEO-friendly improvements.
 *
 * - seoContentEnhancement - A function that analyzes website content and suggests SEO improvements.
 * - SeoContentEnhancementInput - The input type for the seoContentEnhancement function.
 * - SeoContentEnhancementOutput - The return type for the seoContentEnhancement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SeoContentEnhancementInputSchema = z.object({
  websiteContent: z
    .string()
    .describe('The existing content of the website to be analyzed.'),
});
export type SeoContentEnhancementInput = z.infer<typeof SeoContentEnhancementInputSchema>;

const SeoContentEnhancementOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of SEO-friendly improvements for the website content, including trending keywords in Sugar Land for beauty and waxing services, and optimized descriptions for better search engine rankings.'
    ),
});
export type SeoContentEnhancementOutput = z.infer<typeof SeoContentEnhancementOutputSchema>;

export async function seoContentEnhancement(
  input: SeoContentEnhancementInput
): Promise<SeoContentEnhancementOutput> {
  return seoContentEnhancementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'seoContentEnhancementPrompt',
  input: {schema: SeoContentEnhancementInputSchema},
  output: {schema: SeoContentEnhancementOutputSchema},
  prompt: `You are an SEO expert specializing in beauty and waxing services in Sugar Land, Texas. Analyze the following website content and suggest SEO-friendly improvements, including trending keywords and optimized descriptions for better search engine rankings.\n\nWebsite Content: {{{websiteContent}}}`,
});

const seoContentEnhancementFlow = ai.defineFlow(
  {
    name: 'seoContentEnhancementFlow',
    inputSchema: SeoContentEnhancementInputSchema,
    outputSchema: SeoContentEnhancementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
