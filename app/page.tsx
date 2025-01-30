import Hero from "@/components/hero";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Zap, Bot } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Hero Section */}
      <div className="w-full max-w-6xl px-4 pt-20 pb-16 mx-auto text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Transform Your Documents into
          <span className="text-primary"> Smart FAQs</span>
        </h1>
        <p className="max-w-2xl mx-auto mt-6 text-xl text-muted-foreground">
          Convert any document into a comprehensive FAQ in seconds using AI. Save hours of manual work and create better documentation.
        </p>
        <div className="flex flex-col items-center gap-4 mx-auto mt-10 sm:flex-row sm:justify-center">
          <Link href="/faq-collections">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full px-4 py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center">How It Works</h2>
          <div className="grid gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col items-center p-6 bg-background rounded-lg shadow-sm">
              <FileText className="w-12 h-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Upload Your Document</h3>
              <p className="mt-2 text-center text-muted-foreground">
                Simply upload any text document, manual, or guide you want to convert
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center p-6 bg-background rounded-lg shadow-sm">
              <Bot className="w-12 h-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">AI Processing</h3>
              <p className="mt-2 text-center text-muted-foreground">
                Our AI analyzes your content and generates relevant Q&A pairs
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center p-6 bg-background rounded-lg shadow-sm">
              <Zap className="w-12 h-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Instant FAQs</h3>
              <p className="mt-2 text-center text-muted-foreground">
                Get organized, searchable FAQs ready to use in seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
