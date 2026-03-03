import {
  ExternalLink,
  Star,
  Sparkles,
  FileText,
  Code,
  Globe,
  Image,
  Wand2,
  Search,
  ArrowRight,
  Database,
  BarChart3,
  AlertTriangle,
  Mountain,
  Droplets,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import { analytics } from "@/lib/analytics";
import SEO from "@/components/SEO";

const myTools = [
  {
    name: "Avalanche Conditions Summary",
    description:
      "Real-time avalanche forecasts from CNFAIC and Hatcher Pass, synthesized for quick situational awareness across Southcentral Alaska.",
    icon: Mountain,
    link: "/tools/avalanche",
    badge: "Built by Kai",
  },
  {
    name: "ERPIMS Data Formatter",
    description:
      "Transform lab Excel spreadsheets into ERPToolsX-ready fixed-width import files with AI-powered column mapping.",
    icon: Database,
    link: "/tools/erpims-formatter",
    badge: "Built by Kai",
  },
  {
    name: "Graph Maker",
    description:
      "Upload data and let AI create graph characteristics based on data type. Edit directly or via chat. Upload screenshot for style matching.",
    icon: BarChart3,
    link: "/tools/graph-maker",
    badge: "Built by Kai",
  },
  {
    name: "Groundwater Monitoring",
    description:
      "Upload workplans to automatically load site, well, and sample information. Get alerted when stability criteria has been met.",
    icon: Droplets,
    link: "/tools/groundwater-monitoring",
    badge: "Built by Kai",
  },
  {
    name: "Regulation Finder",
    description:
      "Find applicable Alaska DEC regulations for your project with specific numerical standards and compliance requirements.",
    icon: Search,
    link: "/tools/reg-simplifier?mode=finder",
    badge: "Built by Kai",
  },
  {
    name: "Regulatory Language Simplifier",
    description: "Transform complex regulatory text into plain English that's easy to understand and apply.",
    icon: Wand2,
    link: "/tools/reg-simplifier",
    badge: "Built by Kai",
  },
  {
    name: "Terms & Conditions Analyzer",
    description:
      "Find hidden gotchas in Terms & Conditions. Get severity ratings, WTF detection, and plain English explanations.",
    icon: AlertTriangle,
    link: "/tools/tc-analyzer",
    badge: "Built by Kai",
  },
];

const recommendedTools = [
  {
    name: "ChatGPT",
    category: "AI Assistant",
    icon: Sparkles,
    description: "OpenAI's versatile AI assistant with strong memory across conversations and custom GPT capabilities.",
    whyILoveIt:
      "ChatGPT Projects are great for situations where you need context maintained across multiple chats. You can upload documents and save parts of chats to Project Memory. Claude has a similar tool.",
    bestFor: ["Researchers", "Project managers", "Anyone working on multi-session projects"],
    link: "https://chat.openai.com",
    featured: true,
  },
  {
    name: "Claude Code",
    category: "Coding Assistant",
    icon: Code,
    description: "Claude's coding-focused mode that helps me write, debug, and explain code across multiple languages.",
    whyILoveIt:
      "The Claude Code agent is integrated into your terminal or command line and can access entire codebases and run Bash commands to iterate and check its own work. It also has subagents with their own context for large context-heavy projects.",
    bestFor: ["Data scientists", "Researchers who code", "Anyone learning to automate tasks"],
    link: "https://claude.ai",
    featured: true,
  },
  {
    name: "Lovable",
    category: "No-Code Development",
    icon: Globe,
    description:
      "AI-powered web development that lets you build professional websites and applications by describing what you want.",
    whyILoveIt: "Built this entire website with it. Seriously. No traditional coding required.",
    bestFor: ["Entrepreneurs", "Small businesses", "Anyone who needs a website fast"],
    link: "https://lovable.dev",
    featured: true,
  },
  {
    name: "Granola",
    category: "Note-Taking",
    icon: FileText,
    description: "AI-enhanced meeting notes that automatically capture, organize, and summarize your conversations.",
    whyILoveIt:
      "Finally, meeting notes I actually use. It captures everything and surfaces the important parts. Free plan gives you good summaries. Paid plan can be used as a repository for project management notes. You can also chat with meeting transcripts.",
    bestFor: ["Anyone in lots of meetings", "Project managers", "Consultants"],
    link: "https://granola.ai",
    featured: true,
  },
  {
    name: "NanoBanana",
    category: "Image Generation",
    icon: Image,
    description: "AI image generation tool for creating custom visuals, graphics, and illustrations.",
    whyILoveIt:
      "Excels at editing pre-existing images and keeping all aspects of the image except the part being edited the same. It also excels at correct text and can make infographics and slides well.",
    bestFor: ["Content creators", "Presenters", "Anyone needing custom visuals"],
    link: "https://gemini.google/overview/image-generation/",
    featured: false,
  },
  {
    name: "Comet Browser",
    category: "Research",
    icon: Sparkles,
    description: "Perplexity's native browser with built-in Comet agent for seamless AI-powered browsing.",
    whyILoveIt:
      "Having an integrated agent in the browser is great for context switching. The agent understands that the current open web page is the context, and you can refer to the context in other tabs by name.",
    bestFor: ["Researchers", "Students", "Anyone who needs sourced information quickly"],
    link: "https://perplexity.ai",
    featured: false,
  },
];

const Tools = () => {
  return (
    <Layout>
      <SEO
        title="AI Toolkit"
        description="Purpose-built AI tools for Alaska environmental professionals plus Kai's recommended AI tools for researchers, scientists, and small businesses."
        url="https://kaiconsulting.ai/tools"
        
      />
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-secondary via-background to-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Kai's <span className="text-primary">AI Toolkit</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tools I've built for students and professionals, plus the AI tools that I use every day.
          </p>
        </div>
      </section>

      {/* My Tools Section */}
      <section className="py-16 md:py-20 bg-primary/5 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">My Tools</h2>
            <p className="text-muted-foreground">Purpose-built tools for Alaska environmental professionals</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {myTools.map((tool) => (
              <Card
                key={tool.name}
                className="group hover:shadow-xl transition-all duration-300 border-primary/30 bg-gradient-to-br from-background to-primary/5"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <tool.icon className="h-7 w-7 text-primary" />
                    </div>
                    <Badge variant="default" className="bg-primary/90">
                      {tool.badge}
                    </Badge>
                  </div>
                  <CardTitle className="font-display text-xl mt-4">{tool.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{tool.description}</p>
                  <Button 
                    asChild 
                    className="w-full gap-2 group-hover:gap-3 transition-all"
                    onClick={() => analytics.toolUsed(tool.name, 'clicked', { source: 'tools_page' })}
                  >
                    <Link to={tool.link}>
                      Try It Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Tools Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">Recommended Tools</h2>
            <p className="text-muted-foreground">
              AI tools I actually use every day—not sponsored, just honest recommendations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedTools.map((tool) => (
              <Card
                key={tool.name}
                className={`group hover:shadow-lg transition-all duration-300 ${
                  tool.featured ? "border-primary/30" : "border-border/50"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <tool.icon className="h-6 w-6 text-primary" />
                    </div>
                    {tool.featured && (
                      <Badge variant="secondary" className="gap-1">
                        <Star className="h-3 w-3" />
                        Top Pick
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="font-display text-xl mt-4">{tool.name}</CardTitle>
                  <CardDescription className="text-sm text-primary font-medium">{tool.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">{tool.description}</p>

                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-sm font-medium text-foreground mb-1">Why I love it:</p>
                    <p className="text-sm text-muted-foreground">{tool.whyILoveIt}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Best for:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tool.bestFor.map((audience) => (
                        <Badge key={audience} variant="outline" className="text-xs">
                          {audience}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => analytics.externalLinkClicked(tool.link, tool.name)}
                  >
                    <a href={tool.link} target="_blank" rel="noopener noreferrer">
                      Check it out
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
            <strong>Note:</strong> The recommended tools are based purely on my personal experience. I'm not sponsored
            by or affiliated with any of these companies. Tools and preferences change—I'll update this page as I
            discover new favorites.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Tools;
