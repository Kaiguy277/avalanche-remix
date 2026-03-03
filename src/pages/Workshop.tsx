import { Users, Clock, Wrench, Target, CheckCircle2, ArrowRight, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import glacierWorkImage from "@/assets/glacier-work.jpeg";
import ContactDialog from "@/components/ContactDialog";

const workshopFormats = [
  {
    title: "Half-Day Workshop",
    duration: "4 hours",
    price: "Starting at $1,500",
    description: "Focused deep-dive on a specific AI use case or tool implementation.",
    includes: [
      "Pre-workshop needs assessment",
      "Hands-on tool setup and training",
      "Custom workflow integration",
      "30-day follow-up support",
    ],
  },
  {
    title: "Full-Day Workshop",
    duration: "8 hours",
    price: "Starting at $2,800",
    description: "Comprehensive AI integration covering multiple tools and workflows.",
    includes: [
      "Extended needs assessment",
      "Multiple tool implementations",
      "Team training and documentation",
      "60-day follow-up support",
      "Custom prompts and templates",
    ],
  },
];

const sampleItinerary = [
  { time: "8:00 - 8:15", title: "Welcome & Coffee", desc: "Introductions, goals for the day, and workshop overview", audience: "Whole Team" },
  { time: "8:15 - 9:15", title: "AI Fundamentals", desc: "Types of models (fast vs. thinking), model selection, prompt engineering, context engineering, and understanding where AI excels vs. where it falls short", audience: "Whole Team" },
  { time: "9:15 - 9:45", title: "Needs Assessment Review", desc: "Review pre-workshop survey results and prioritize focus areas for your organization", audience: "Whole Team" },
  { time: "9:45 - 10:00", title: "Break", desc: "15 minutes" },
  { time: "10:00 - 10:20", title: "Hands-On: First Prompts", desc: "Breakout session—practice prompting in ChatGPT with real tasks from your work", audience: "Whole Team" },
  { time: "10:20 - 10:45", title: "The Power of Context", desc: "Load documentation into a ChatGPT Project together and see how context dramatically improves results", audience: "Whole Team" },
  { time: "10:45 - 11:00", title: "Break", desc: "15 minutes" },
  { time: "11:00 - 12:00", title: "Tool Tour: Kai's Favorites", desc: "Hands-on demos of Granola (meeting notes), Comet Browser (AI-powered search), and NanoBanana (image editing)—set up each tool and explore which ones resonate", audience: "Whole Team" },
  { time: "12:00 - 1:00", title: "Working Lunch", desc: "Continued exploration with informal Q&A", audience: "Whole Team" },
  { time: "1:00 - 2:30", title: "Technical Session 1: Field Data & Compliance Automation", desc: "Set up Claude Code in VS Code, connect to environmental data workflows. Build prompts for Phase I/II report drafting, ADEC regulatory lookups, and field sampling data QA/QC", audience: "Technical Team" },
  { time: "2:30 - 2:45", title: "Break", desc: "15 minutes" },
  { time: "2:45 - 4:00", title: "Technical Session 2: Construction & Project Documentation", desc: "Create Claude Code subagents for generating daily construction logs, drafting RFIs and change order responses, and automating equipment/materials tracking summaries", audience: "Technical Team" },
  { time: "4:00 - 4:30", title: "Wrap-Up & Next Steps", desc: "Documentation handoff, troubleshooting tips, and 60-day follow-up plan", audience: "Technical Team" },
];

const Workshop = () => {
  return (
    <Layout>
      <SEO
        title="Hands-On AI Workshop"
        description="Roll up your sleeves and build with AI. Half or full day workshops for teams to implement practical AI tools in real workflows. Starting at $1,500."
        url="https://kaiconsulting.ai/workshop"
        
      />
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary/50" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Wrench className="h-4 w-4" />
                <span className="text-sm font-medium">Service</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Hands-On AI{" "}
                <span className="text-primary">Workshop</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Roll up your sleeves and actually build something. We'll assess your needs, select the right tools, and get them working in your real workflows.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-medium">Half or full day</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">1-10 participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="font-medium">Starting at $1,500</span>
                </div>
              </div>

              <ContactDialog
                emailSubject="AI Workshop Inquiry"
                trigger={
                  <Button size="lg" className="gap-2">
                    <Calendar className="h-5 w-5" />
                    Schedule a Workshop
                  </Button>
                }
              />
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={glacierWorkImage}
                  alt="Kai working on glacier research"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-xl bg-accent/20 -z-10" />
              <div className="absolute -top-4 -left-4 h-16 w-16 rounded-full bg-primary/20 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Formats */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Workshop Options
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {workshopFormats.map((format) => (
              <Card key={format.title} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary">{format.duration}</span>
                    <span className="text-sm font-semibold text-foreground">{format.price}</span>
                  </div>
                  <CardTitle className="font-display text-2xl">{format.title}</CardTitle>
                  <p className="text-muted-foreground">{format.description}</p>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-sm text-foreground mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {format.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Itinerary */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
              Sample Full-Day Itinerary
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Every workshop is customized, but here's what a typical full-day session looks like:
            </p>
            <div className="space-y-3">
              {sampleItinerary.map((item, index) => (
                <div
                  key={index}
                  className={`flex gap-4 p-4 rounded-xl hover:shadow-sm transition-shadow ${
                    item.audience === "Technical Team" 
                      ? "bg-primary/5 border border-primary/20" 
                      : "bg-card"
                  }`}
                >
                  <div className="text-sm font-mono text-primary whitespace-nowrap min-w-[100px]">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      {item.audience && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.audience === "Technical Team"
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {item.audience}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Might Work On */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              What We Might Work On
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Setting up Claude or ChatGPT for your specific workflows",
                "Automating repetitive document tasks",
                "Creating custom prompts and templates",
                "Integrating AI into your existing tools",
                "Building a note-taking and research system",
                "Data analysis and visualization with AI assistance",
                "Writing and editing workflows",
                "Meeting summaries and action item tracking",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Let's Build Something Together
          </h2>
          <p className="text-background/70 text-lg max-w-2xl mx-auto mb-8">
            Tell me about your team and what you're trying to accomplish. We'll design a workshop that delivers real, lasting results.
          </p>
          <ContactDialog
            emailSubject="AI Workshop Inquiry"
            trigger={
              <Button size="lg" variant="secondary" className="gap-2">
                <Mail className="h-5 w-5" />
                Discuss Your Workshop
                <ArrowRight className="h-5 w-5" />
              </Button>
            }
          />
        </div>
      </section>
    </Layout>
  );
};

export default Workshop;
