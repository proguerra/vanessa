
import SeoAssistantForm from '@/components/shared/SeoAssistantForm';
import { Metadata } from 'next';
import { SearchCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI SEO Assistant - Viva La Beauty',
  description: 'Use our AI-powered SEO tool to enhance your website content for better search engine rankings in Sugar Land, TX. Get keyword suggestions and optimization tips.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function SeoToolPage() {
  return (
    <div className="bg-gradient-to-br from-pink-50 via-background to-purple-50 py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
           <h1 className="text-5xl font-headline font-semibold text-primary mb-4 flex items-center justify-center">
             <SearchCheck className="mr-3 h-10 w-10 text-accent" />
            AI SEO Assistant
          </h1>
          <p className="text-xl text-foreground max-w-3xl mx-auto font-body">
            Optimize your website's content for search engines with our intelligent AI tool. Enhance your visibility for beauty and waxing services in Sugar Land.
          </p>
        </div>
        
        <SeoAssistantForm />

        <div className="mt-16 text-center bg-card p-8 rounded-lg shadow-md max-w-3xl mx-auto">
            <h3 className="text-2xl font-headline text-primary mb-4">How it Works</h3>
            <ol className="list-decimal list-inside text-left space-y-2 text-muted-foreground font-body">
                <li><strong>Enter Content:</strong> Paste the text from any page of your website into the form above.</li>
                <li><strong>Analyze:</strong> Our AI will review your content, focusing on SEO best practices for the Sugar Land beauty market.</li>
                <li><strong>Get Suggestions:</strong> Receive actionable recommendations, including trending keywords and optimized phrasing to improve your search rankings.</li>
            </ol>
            <p className="mt-6 text-sm text-foreground font-body">
                This tool is designed to help you attract more local clients by making your website more discoverable on search engines like Google.
            </p>
        </div>

      </div>
    </div>
  );
}
