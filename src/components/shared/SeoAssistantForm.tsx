"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { seoContentEnhancement, type SeoContentEnhancementInput } from '@/ai/flows/seo-content-enhancement';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  websiteContent: z.string().min(50, { message: "Please enter at least 50 characters of content to analyze." }),
});

type FormData = z.infer<typeof formSchema>;

export default function SeoAssistantForm() {
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      websiteContent: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await seoContentEnhancement(data);
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Error fetching SEO suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch SEO suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary flex items-center">
          <Wand2 className="mr-2 h-7 w-7 text-accent" />
          AI SEO Content Enhancer
        </CardTitle>
        <CardDescription className="font-body">
          Paste your website content below. Our AI assistant will analyze it and provide SEO-friendly suggestions, including trending keywords for beauty and waxing services in Sugar Land, TX.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="websiteContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold font-headline">Your Website Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your current website text here..."
                      rows={10}
                      className="resize-y"
                      {...field}
                      aria-label="Website content input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Get SEO Suggestions
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>

      {suggestions && (
        <div className="p-6 border-t border-border mt-6">
          <h3 className="text-2xl font-headline font-semibold text-primary mb-3">AI Suggestions:</h3>
          <div className="prose prose-sm max-w-none bg-secondary/50 p-4 rounded-md font-body whitespace-pre-wrap">
            {suggestions}
          </div>
        </div>
      )}
    </Card>
  );
}
